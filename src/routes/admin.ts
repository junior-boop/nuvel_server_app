import { Hono } from "hono";
import { JWTService } from "../utils/jwt";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/roleMiddleware";
import {
  UsersAccount,
  Articles,
  Comments,
  ErrorLogsTable,
  PushTokensTable,
  Notes,
} from "../../utils/tables";

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
      Articles(env).count(),
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

export default admin;
