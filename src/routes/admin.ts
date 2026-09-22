import { Hono } from "hono";
import { JWTService } from "../utils/jwt";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/roleMiddleware";
import {
  UsersAccount,
  Publish,
  Comments,
  ErrorLogsTable,
  PushTokensTable,
  Notes,
  BibleVersionsTable,
} from "../../utils/tables";
import type { BibleData, BibleMetadata } from "./bible";
import type { BibleVersionRow } from "../../utils/db";

const admin = new Hono<{ Bindings: CloudflareBindings }>();

const ADMIN_USER_ID = "admin";

// POST /admin/login - authentification dédiée au dashboard (compte créateurs, distinct des comptes mobiles)
admin.post("/login", async ({ req, env, json, status }) => {
  const { email, password } = await req.json();

  if (!email || !password) {
    status(400);
    return json({ success: false, message: "email et password sont requis" });
  }

  if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
    status(401);
    return json({ success: false, message: "Identifiants invalides" });
  }

  JWTService.initialize(env.JWT_SECRET);
  const tokens = await JWTService.generateTokenPair(ADMIN_USER_ID, env.ADMIN_EMAIL, "admin");

  return json({ success: true, ...tokens });
});

// GET /admin/stats - vue d'ensemble de l'activité serveur
admin.get("/stats", authMiddleware, requireAdmin, async ({ env, json, status }) => {
  try {
    const [users, articles, comments, notes, unresolvedErrors, totalErrors, pushTokens] = await Promise.all([
      UsersAccount(env).count(),
      Publish(env).count(),
      Comments(env).count(),
      Notes(env).count(),
      ErrorLogsTable(env).count({ resolved: 0 }),
      ErrorLogsTable(env).count(),
      PushTokensTable(env).count(),
    ]);

    return json({
      success: true,
      stats: { users, articles, comments, notes, unresolvedErrors, totalErrors, pushTokens },
    });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// GET /admin/stats-history?days=14 - historique quotidien des nouvelles entrées, par catégorie
admin.get("/stats-history", authMiddleware, requireAdmin, async ({ req, env, json, status }) => {
  try {
    const days = Math.min(Math.max(Number(req.query("days")) || 14, 1), 90);
    const D1 = env.DB as D1Database;

    const tables: { key: string; table: string; column: string }[] = [
      { key: "users", table: "users", column: "created" },
      { key: "articles", table: "publish", column: "createdAt" },
      { key: "comments", table: "comments", column: "created" },
      { key: "notes", table: "notes", column: "created" },
      { key: "unresolvedErrors", table: "error_logs", column: "created" },
      { key: "pushTokens", table: "push_tokens", column: "created" },
    ];

    const dayKeys = Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - (days - 1 - i));
      return d.toISOString().slice(0, 10);
    });

    const results = await Promise.all(
      tables.map(async ({ table, column }) => {
        const { results: rows } = await D1.prepare(
          `SELECT DATE(${column}) as date, COUNT(*) as count FROM ${table} WHERE ${column} >= datetime('now', ?) GROUP BY DATE(${column})`
        )
          .bind(`-${days} days`)
          .all<{ date: string; count: number }>();
        return rows;
      })
    );

    const history = tables.reduce((acc, { key }, i) => {
      const counts = new Map(results[i].map((row) => [row.date, row.count]));
      acc[key] = dayKeys.map((date) => ({ date, count: counts.get(date) ?? 0 }));
      return acc;
    }, {} as Record<string, { date: string; count: number }[]>);

    return json({ success: true, days, history });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

function rowToVersion(row: BibleVersionRow) {
  return {
    key: row.key,
    size: row.size,
    uploaded: row.uploaded,
    verset: row.verset,
    metadata: {
      name: row.name,
      shortname: row.shortname,
      module: row.module,
      year: row.year,
      publisher: row.publisher,
      owner: row.owner,
      description: row.description,
      lang: row.lang,
      lang_short: row.lang_short,
      copyright: row.copyright,
      copyright_statement: row.copyright_statement,
      url: row.url,
      citation_limit: row.citation_limit,
      restrict: row.restrict,
      italics: row.italics,
      strongs: row.strongs,
      red_letter: row.red_letter,
      paragraph: row.paragraph,
      official: row.official,
      research: row.research,
      module_version: row.module_version,
    },
  };
}

// GET /admin/bible-versions - liste toutes les versions de bible depuis la table bible_versions
admin.get("/bible-versions", authMiddleware, requireAdmin, async ({ env, json, status }) => {
  try {
    const bibleVersions = BibleVersionsTable(env);
    let rows = await bibleVersions.findAll();

    if (rows.length === 0) {
      // Synchronisation ponctuelle : peuple la table à partir des fichiers R2 existants
      const listed = await env.STORAGE.list({ prefix: "bibles/" });
      const jsonFiles = listed.objects.filter((obj) => obj.key.toLowerCase().endsWith(".json"));

      for (const file of jsonFiles) {
        try {
          const obj = await env.STORAGE.get(file.key);
          const content = await obj?.text();
          const data = JSON.parse(content as string) as BibleData;
          await bibleVersions.upsert({
            key: file.key,
            ...data.metadata,
            size: file.size,
            verset: data.verses?.length ?? 0,
            uploaded: String(file.uploaded),
          });
        } catch (error) {
          // fichier illisible, ignoré lors de la synchronisation
        }
      }

      rows = await bibleVersions.findAll();
    }

    const versions = rows.map(rowToVersion);
    return json({ success: true, count: versions.length, versions });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// POST /admin/bible-versions - crée une nouvelle version de bible (métadonnées + fichier R2 vide)
admin.post("/bible-versions", authMiddleware, requireAdmin, async ({ req, env, json, status }) => {
  const body = await req.json();
  const { name, shortname } = body;

  if (!name || !shortname) {
    status(400);
    return json({ success: false, message: "Les champs 'name' et 'shortname' sont requis" });
  }

  const slug = String(shortname)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const key = `bibles/${slug}.json`;

  try {
    const existing = await env.STORAGE.head(key);
    if (existing) {
      status(409);
      return json({ success: false, message: "Une version avec cette abréviation existe déjà" });
    }

    const metadata: BibleMetadata = {
      name,
      shortname,
      module: body.module ?? "",
      year: body.year ?? "",
      publisher: body.publisher ?? null,
      owner: body.owner ?? null,
      description: body.description ?? "",
      lang: body.lang ?? "",
      lang_short: body.lang_short ?? "",
      copyright: Number(body.copyright) || 0,
      copyright_statement: body.copyright_statement ?? "",
      url: body.url ?? null,
      citation_limit: Number(body.citation_limit) || 0,
      restrict: Number(body.restrict) || 0,
      italics: Number(body.italics) || 0,
      strongs: Number(body.strongs) || 0,
      red_letter: Number(body.red_letter) || 0,
      paragraph: Number(body.paragraph) || 0,
      official: Number(body.official) || 0,
      research: Number(body.research) || 0,
      module_version: body.module_version ?? "",
    };

    const verses = Array.isArray(body.verses) ? body.verses : [];
    const data: BibleData = { metadata, verses };
    const serialized = JSON.stringify(data);
    await env.STORAGE.put(key, serialized);

    const uploaded = new Date().toISOString();
    const row = await BibleVersionsTable(env).upsert({
      key,
      ...metadata,
      size: serialized.length,
      verset: verses.length,
      uploaded,
    });

    return json({ success: true, version: rowToVersion(row as BibleVersionRow) });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// PATCH /admin/bible-versions?key=bibles/xxx.json - modifie les métadonnées d'une version
admin.patch("/bible-versions", authMiddleware, requireAdmin, async ({ req, env, json, status }) => {
  const key = req.query("key");

  if (!key || !key.startsWith("bibles/")) {
    status(400);
    return json({ success: false, message: "Paramètre 'key' invalide" });
  }

  const body = await req.json();

  try {
    const obj = await env.STORAGE.get(key);
    if (!obj) {
      status(404);
      return json({ success: false, message: "Version introuvable" });
    }
    const content = await obj.text();
    const data = JSON.parse(content) as BibleData;

    const metadata: BibleMetadata = {
      name: body.name ?? data.metadata.name,
      shortname: body.shortname ?? data.metadata.shortname,
      module: body.module ?? data.metadata.module,
      year: body.year ?? data.metadata.year,
      publisher: body.publisher ?? data.metadata.publisher,
      owner: body.owner ?? data.metadata.owner,
      description: body.description ?? data.metadata.description,
      lang: body.lang ?? data.metadata.lang,
      lang_short: body.lang_short ?? data.metadata.lang_short,
      copyright: body.copyright !== undefined ? Number(body.copyright) : data.metadata.copyright,
      copyright_statement: body.copyright_statement ?? data.metadata.copyright_statement,
      url: body.url ?? data.metadata.url,
      citation_limit: body.citation_limit !== undefined ? Number(body.citation_limit) : data.metadata.citation_limit,
      restrict: body.restrict !== undefined ? Number(body.restrict) : data.metadata.restrict,
      italics: body.italics !== undefined ? Number(body.italics) : data.metadata.italics,
      strongs: body.strongs !== undefined ? Number(body.strongs) : data.metadata.strongs,
      red_letter: body.red_letter !== undefined ? Number(body.red_letter) : data.metadata.red_letter,
      paragraph: body.paragraph !== undefined ? Number(body.paragraph) : data.metadata.paragraph,
      official: body.official !== undefined ? Number(body.official) : data.metadata.official,
      research: body.research !== undefined ? Number(body.research) : data.metadata.research,
      module_version: body.module_version ?? data.metadata.module_version,
    };

    const verses = Array.isArray(body.verses) ? body.verses : data.verses;
    const updatedData: BibleData = { metadata, verses };
    const serialized = JSON.stringify(updatedData);
    await env.STORAGE.put(key, serialized);

    await BibleVersionsTable(env).updateWhere(
      { key },
      { ...metadata, size: serialized.length, verset: verses.length }
    );

    return json({ success: true });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// DELETE /admin/bible-versions?key=bibles/xxx.json - supprime une version de bible
admin.delete("/bible-versions", authMiddleware, requireAdmin, async ({ req, env, json, status }) => {
  const key = req.query("key");

  if (!key || !key.startsWith("bibles/")) {
    status(400);
    return json({ success: false, message: "Paramètre 'key' invalide" });
  }

  try {
    await env.STORAGE.delete(key);
    await BibleVersionsTable(env).deleteWhere({ key });
    return json({ success: true });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

export default admin;
