import { Hono } from "hono";
import type { SyncableTable } from "../../utils/syncState";

/**
 * Endpoints Phase 2 — index de version `sync_state` (pull delta).
 *
 *  GET /sync-state?since=<v>&table=<name?>&userid=<id>&limit=<n?>
 *    Renvoie les lignes sync_state dont version > since, appartenant a userid.
 *    Le client utilise ça pour savoir QUOI tirer.
 *
 *  GET /sync-state/full?table=<name>&since=<v>&userid=<id>&limit=<n?>
 *    Renvoie sync_state JOIN table metier => objets canoniques + version, filtre par userid.
 *    Le client utilise ça pour tirer directement les payloads.
 *
 * `userid` est obligatoire : sans lui, ces endpoints renvoyaient les lignes de
 * TOUS les utilisateurs melangees (bug), ce qui faisait que le pull client
 * recreait localement des groupes/notes d'autres comptes et faisait avancer
 * le curseur de version au-dela des propres elements de l'utilisateur.
 * On filtre sur `updatedBy`, qui est toujours l'auteur/proprietaire pour les
 * tables notes/groupes (voir routes/notes.ts et routes/groups.ts).
 */

const syncState = new Hono<{ Bindings: CloudflareBindings }>();

const ALLOWED_TABLES: SyncableTable[] = [
  "notes",
  "groupes",
  "articles",
  "publish",
  "comments",
  "appreciations",
];

const getD1 = (env: any): D1Database | null => (env?.DB as D1Database) ?? null;

syncState.get("/", async (c) => {
  const D1 = getD1(c.env);
  if (!D1) return c.json({ error: "D1 indisponible" }, 500);

  const since = Number(c.req.query("since") ?? 0);
  const table = c.req.query("table") as SyncableTable | undefined;
  const userid = c.req.query("userid");
  const limit = Math.min(Number(c.req.query("limit") ?? 500), 1000);

  if (table && !ALLOWED_TABLES.includes(table)) {
    return c.json({ error: `table inconnue: ${table}` }, 400);
  }
  if (!userid) {
    return c.json({ error: "userid requis" }, 400);
  }

  try {
    const stmt = table
      ? D1.prepare(
          `SELECT table_name, element_id, version, updatedAt, updatedBy, deleted
           FROM sync_state
           WHERE version > ? AND table_name = ? AND updatedBy = ?
           ORDER BY version ASC
           LIMIT ?`
        ).bind(since, table, userid, limit)
      : D1.prepare(
          `SELECT table_name, element_id, version, updatedAt, updatedBy, deleted
           FROM sync_state
           WHERE version > ? AND updatedBy = ?
           ORDER BY version ASC
           LIMIT ?`
        ).bind(since, userid, limit);

    const { results } = await stmt.all();
    const maxVersion = results.reduce(
      (m: number, r: any) => (r.version > m ? r.version : m),
      since
    );
    return c.json({
      success: true,
      since,
      count: results.length,
      maxVersion,
      rows: results,
    });
  } catch (e) {
    console.log("[sync-state] error:", e);
    return c.json({ error: "Erreur lecture sync_state" }, 500);
  }
});

syncState.get("/full", async (c) => {
  const D1 = getD1(c.env);
  if (!D1) return c.json({ error: "D1 indisponible" }, 500);

  const table = c.req.query("table") as SyncableTable | undefined;
  const since = Number(c.req.query("since") ?? 0);
  const userid = c.req.query("userid");
  const limit = Math.min(Number(c.req.query("limit") ?? 200), 500);

  if (!table || !ALLOWED_TABLES.includes(table)) {
    return c.json({ error: `table requise parmi ${ALLOWED_TABLES.join(",")}` }, 400);
  }
  if (!userid) {
    return c.json({ error: "userid requis" }, 400);
  }

  try {
    const { results } = await D1.prepare(
      `SELECT s.table_name, s.element_id, s.version, s.updatedAt as syncUpdatedAt,
              s.updatedBy, s.deleted, t.*
       FROM sync_state s
       LEFT JOIN ${table} t ON t.id = s.element_id
       WHERE s.version > ? AND s.table_name = ? AND s.updatedBy = ?
       ORDER BY s.version ASC
       LIMIT ?`
    )
      .bind(since, table, userid, limit)
      .all();

    const maxVersion = results.reduce(
      (m: number, r: any) => (r.version > m ? r.version : m),
      since
    );

    return c.json({
      success: true,
      table,
      since,
      count: results.length,
      maxVersion,
      rows: results,
    });
  } catch (e) {
    console.log("[sync-state/full] error:", e);
    return c.json({ error: "Erreur lecture sync_state/full" }, 500);
  }
});

export default syncState;
