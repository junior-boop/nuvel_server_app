import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { ErrorLogsTable } from "../../utils/tables";
import { authMiddleware, optionalAuth } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/roleMiddleware";

const errors = new Hono<{ Bindings: CloudflareBindings }>();

interface ErrorReportPayload {
  message: string;
  stack?: string;
  level?: "fatal" | "error" | "warning";
  platform?: "ios" | "android" | "web";
  appVersion?: string;
  environment?: "development" | "production";
  screen?: string;
  extra?: unknown;
}

const insertReport = async (env: CloudflareBindings, payload: ErrorReportPayload, userId: string | null) => {
  const ErrorLogs = ErrorLogsTable(env);
  return ErrorLogs.create({
    id: uuidv4(),
    message: (payload.message || "Erreur inconnue").toString().slice(0, 2000),
    stack: payload.stack ? payload.stack.toString().slice(0, 8000) : null,
    level: payload.level || "error",
    source: "client",
    platform: payload.platform || "unknown",
    appVersion: payload.appVersion || null,
    environment: payload.environment === "production" ? "production" : "development",
    userId,
    screen: payload.screen || null,
    extra: payload.extra ? JSON.stringify(payload.extra).slice(0, 4000) : null,
    resolved: 0,
  });
};

// POST /errors/report - reçoit un ou plusieurs rapports d'erreur depuis le client
errors.post("/report", optionalAuth, async ({ req, env, json, status, get }) => {
  try {
    const body = await req.json();
    const user = get("user");
    const userId = user?.userId ?? null;

    const reports: ErrorReportPayload[] = Array.isArray(body?.errors)
      ? body.errors
      : [body];

    const validReports = reports.filter((r) => r && r.message);
    if (validReports.length === 0) {
      status(400);
      return json({ success: false, message: "Aucune erreur valide fournie" });
    }

    for (const report of validReports) {
      await insertReport(env, report, userId);
    }

    return json({ success: true, saved: validReports.length });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// GET /errors - liste des erreurs pour triage (admin uniquement)
errors.get("/", authMiddleware, requireAdmin, async ({ req, env, json, status }) => {
  try {
    const { resolved, level, platform, environment, limit, offset } = req.query();
    const ErrorLogs = ErrorLogsTable(env);

    const where: Record<string, any> = {};
    if (resolved !== undefined) where.resolved = resolved === "true" ? 1 : 0;
    if (level) where.level = level;
    if (platform) where.platform = platform;
    if (environment) where.environment = environment;

    const results = await ErrorLogs.findAll({
      where,
      orderBy: { column: "created", direction: "DESC" },
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0,
    });

    return json({ success: true, errors: results });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// PATCH /errors/:id/resolve - marquer une erreur comme résolue (admin uniquement)
errors.patch("/:id/resolve", authMiddleware, requireAdmin, async ({ req, env, json, status }) => {
  try {
    const { id } = req.param();
    const ErrorLogs = ErrorLogsTable(env);
    const updated = await ErrorLogs.update(id, { resolved: 1 });

    if (!updated) {
      status(404);
      return json({ success: false, message: "Erreur non trouvée" });
    }

    return json({ success: true, error: updated });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// DELETE /errors/:id - supprimer une entrée (admin uniquement)
errors.delete("/:id", authMiddleware, requireAdmin, async ({ req, env, json, status }) => {
  try {
    const { id } = req.param();
    const ErrorLogs = ErrorLogsTable(env);
    const deleted = await ErrorLogs.delete(id);

    if (!deleted) {
      status(404);
      return json({ success: false, message: "Erreur non trouvée" });
    }

    return json({ success: true });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

export default errors;
