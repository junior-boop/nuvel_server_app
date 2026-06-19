import { Hono } from "hono";
import type { SyncableTable } from "../../utils/syncState";

/**
 * Endpoints Phase 2 — index de version `sync_state` (pull delta).
 *
 *  GET /sync-state?since=<v>&table=<name?>&limit=<n?>
 *    Renvoie les lignes sync_state dont version > since.
 *    Le client utilise ça pour savoir QUOI tirer.
 *
 *  GET /sync-state/full?table=<name>&since=<v>&limit=<n?>
 *    Renvoie sync_state JOIN table metier => objets canoniques + version.
 *    Le client utilise ça pour tirer directement les payloads.
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
  const limit = Math.min(Number(c.req.query("limit") ?? 500), 1000);

  if (table && !ALLOWED_TABLES.includes(table)) {
    return c.json({ error: `table inconnue: ${table}` }, 400);
  }

  try {
    const stmt = table
      ? D1.prepare(
          `SELECT table_name, element_id, version, updatedAt, updatedBy, deleted
           FROM sync_state
           WHERE version > ? AND table_name = ?
           ORDER BY version ASC
           LIMIT ?`
        ).bind(since, table, limit)
      : D1.prepare(
          `SELECT table_name, element_id, version, updatedAt, updatedBy, deleted
           FROM sync_state
           WHERE version > ?
           ORDER BY version ASC
           LIMIT ?`
        ).bind(since, limit);

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
  const limit = Math.min(Number(c.req.query("limit") ?? 200), 500);

  if (!table || !ALLOWED_TABLES.includes(table)) {
    return c.json({ error: `table requise parmi ${ALLOWED_TABLES.join(",")}` }, 400);
  }

  try {
    const { results } = await D1.prepare(
      `SELECT s.table_name, s.element_id, s.version, s.updatedAt as syncUpdatedAt,
              s.updatedBy, s.deleted, t.*
       FROM sync_state s
       LEFT JOIN ${table} t ON t.id = s.element_id
       WHERE s.version > ? AND s.table_name = ?
       ORDER BY s.version ASC
       LIMIT ?`
    )
      .bind(since, table, limit)
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
