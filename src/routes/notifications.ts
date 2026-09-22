import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import {
  BROADCAST_RECIPIENT,
  Comments as CommentsTable,
  ensureNotificationReadsTable,
  NotificationsTable,
  PushTokensTable,
  UsersAccount,
} from "../../utils/tables";
import { authMiddleware } from "../middleware/authMiddleware";
import type { NotificationQueueMessage } from "../queue-consumer";

const notifications = new Hono<{ Bindings: CloudflareBindings }>();

// Enregistrer / mettre à jour un push token Expo pour l'utilisateur connecté
notifications.post("/register-token", authMiddleware, async ({ req, env, json, status, get }) => {
  const user = get("user");
  const { token, platform, deviceId } = await req.json();

  if (!token || !platform || !deviceId) {
    status(400);
    return json({ success: false, message: "token, platform et deviceId sont requis" });
  }

  const PushTokens = PushTokensTable(env);

  try {
    const existing = await PushTokens.findOne({ where: { token } });

    if (existing) {
      const updated = await PushTokens.update(existing.id, {
        userid: user.userId,
        platform,
        deviceId,
        modified: new Date().toISOString(),
      });
      return json({ success: true, data: updated });
    }

    const created = await PushTokens.create({
      id: uuidv4(),
      userid: user.userId,
      token,
      platform,
      deviceId,
    });

    return json({ success: true, data: created });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// Retirer un push token (ex: à la déconnexion)
notifications.delete("/register-token", authMiddleware, async ({ req, env, json, status, get }) => {
  const user = get("user");
  const { token } = await req.json();

  const PushTokens = PushTokensTable(env);

  try {
    const existing = await PushTokens.findOne({ where: { token, userid: user.userId } });
    if (!existing) {
      return json({ success: true, message: "Aucun token à supprimer" });
    }
    await PushTokens.delete(existing.id);
    return json({ success: true });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// Déclenché par le client après l'écriture d'un commentaire dans InstantDB.
// Notifie tous les précédents commentateurs de l'article (sauf l'auteur du nouveau commentaire).
notifications.post("/comment-reply", authMiddleware, async ({ req, env, json, status, get }) => {
  const user = get("user");
  const { articleId, commentId, articleTitle, content } = await req.json();

  if (!articleId || !commentId) {
    status(400);
    return json({ success: false, message: "articleId et commentId sont requis" });
  }

  try {
    const comments = await CommentsTable(env).findAll({ where: { articleId } });

    const recipientIds = Array.from(
      new Set(
        (comments || [])
          .map((comment: any) => comment.creator)
          .filter((creatorId: string) => creatorId && creatorId !== user.userId)
      )
    ) as string[];

    if (recipientIds.length === 0) {
      return json({ success: true, notified: 0 });
    }

    const actor = await UsersAccount(env).findOne({ where: { id: user.userId } });
    const actorName = actor ? `${actor.name} ${actor.first_name}`.trim() : "Quelqu'un";
    const preview = (content || "").toString().slice(0, 120);

    const messages: NotificationQueueMessage[] = recipientIds.map((recipientUserId) => ({
      id: uuidv4(),
      recipientUserId,
      type: "comment_reply",
      title: `${actorName} a commenté ${articleTitle ? `« ${articleTitle} »` : "un article que vous suivez"}`,
      body: preview,
      actorUserId: user.userId,
      articleId,
      commentId,
    }));

    for (let i = 0; i < messages.length; i += 100) {
      await env.NOTIFICATIONS_QUEUE.sendBatch(
        messages.slice(i, i + 100).map((body) => ({ body }))
      );
    }

    return json({ success: true, notified: messages.length });
  } catch (error) {
    console.error("[Notifications] Error queuing comment-reply notifications:", error);
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// Diffuser une annonce / un sujet de prière à tous les utilisateurs
notifications.post("/broadcast", authMiddleware, async ({ req, env, json, status, get }) => {
  const user = get("user");

  if (user.role !== "admin") {
    status(403);
    return json({ success: false, message: "Accès réservé aux administrateurs" });
  }

  const { title, body, type } = await req.json();

  if (!title || !body) {
    status(400);
    return json({ success: false, message: "title et body sont requis" });
  }

  const notificationType = type === "prayer_topic" ? "prayer_topic" : "announcement";

  try {
    // L'annonce est écrite UNE SEULE FOIS, avec recipientUserId = "*".
    // Les destinataires la lisent via GET /:userId, qui inclut les lignes "*".
    const notificationId = uuidv4();
    const createdAt = new Date().toISOString();

    await NotificationsTable(env).create({
      id: notificationId,
      recipientUserId: BROADCAST_RECIPIENT,
      type: notificationType,
      title,
      body,
      data: JSON.stringify({ articleId: null, commentId: null }),
      read: 0,
      actorUserId: user.userId,
      articleId: null,
      commentId: null,
      createdAt,
    });

    // La Queue ne sert plus qu'à la livraison (push OS + WebSocket), pas à la persistance.
    const users = await UsersAccount(env).findAll({ select: ["id"] });
    const messages: NotificationQueueMessage[] = users.map((u: any) => ({
      id: notificationId,
      recipientUserId: u.id,
      type: notificationType,
      title,
      body,
      actorUserId: user.userId,
      createdAt,
      persist: false,
    }));

    for (let i = 0; i < messages.length; i += 100) {
      await env.NOTIFICATIONS_QUEUE.sendBatch(
        messages.slice(i, i + 100).map((msg) => ({ body: msg }))
      );
    }

    return json({ success: true, notificationId, notified: messages.length });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// Lister les notifications d'un utilisateur (plus récentes en premier).
// Réunit les notifications personnelles et les annonces diffusées ("*"), et calcule
// l'état "lu" par jointure sur notification_reads (la colonne read reste lue pour
// les lignes antérieures à cette table).
notifications.get("/:userId", async ({ req, env, json, status }) => {
  const { userId } = req.param();

  try {
    await ensureNotificationReadsTable(env);
    const Notifications = NotificationsTable(env);

    const rows = await Notifications.orm.query<any>(
      `SELECT n.id, n.recipientUserId, n.type, n.title, n.body, n.data,
              n.actorUserId, n.articleId, n.commentId, n.createdAt,
              CASE WHEN r.id IS NOT NULL OR n."read" = 1 THEN 1 ELSE 0 END AS "read"
         FROM notifications n
         LEFT JOIN notification_reads r
           ON r.notificationId = n.id AND r.userId = ?
        WHERE n.recipientUserId = ? OR n.recipientUserId = ?
        ORDER BY n.createdAt DESC`,
      [userId, userId, BROADCAST_RECIPIENT]
    );

    const list = (rows || []).map((n: any) => ({
      ...n,
      read: !!n.read,
      data: n.data ? JSON.parse(n.data) : null,
    }));

    return json({ success: true, notifications: list });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// Marquer une notification comme lue pour un utilisateur donné.
// L'état de lecture est par utilisateur : une annonce partagée ne peut pas porter
// un seul drapeau read global.
notifications.post("/:notificationId/read", async ({ req, env, json, status }) => {
  const { notificationId } = req.param();
  // Les builds de l'app antérieurs à ce changement appellent cette route sans corps :
  // on répond 400 plutôt que de laisser le parse JSON remonter en 500.
  const payload = await req
    .json<{ userId?: string }>()
    .catch((): { userId?: string } => ({}));
  const userId = payload.userId;

  if (!userId) {
    status(400);
    return json({ success: false, message: "userId est requis" });
  }

  try {
    const NotificationReads = await ensureNotificationReadsTable(env);
    await NotificationReads.findOrCreate(
      { id: `${notificationId}:${userId}` },
      {
        id: `${notificationId}:${userId}`,
        notificationId,
        userId,
        readAt: new Date().toISOString(),
      }
    );
    return json({ success: true });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// Marquer toutes les notifications visibles d'un utilisateur comme lues
notifications.post("/:userId/read-all", async ({ req, env, json, status }) => {
  const { userId } = req.param();

  try {
    await ensureNotificationReadsTable(env);
    const Notifications = NotificationsTable(env);

    await Notifications.orm.query(
      `INSERT OR IGNORE INTO notification_reads (id, notificationId, userId, readAt)
       SELECT n.id || ':' || ?, n.id, ?, ?
         FROM notifications n
        WHERE n.recipientUserId = ? OR n.recipientUserId = ?`,
      [userId, userId, new Date().toISOString(), userId, BROADCAST_RECIPIENT]
    );

    return json({ success: true });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// WebSocket temps réel pour les notifications en direct (badge in-app)
notifications.get("/:userId/ws", async (c) => {
  const { userId } = c.req.param();

  try {
    const id = c.env.NOTIFICATIONS_DO.idFromName(userId);
    const stub = c.env.NOTIFICATIONS_DO.get(id);

    const url = new URL(c.req.url);
    url.searchParams.set("userId", userId);

    return stub.fetch(url.toString(), c.req.raw);
  } catch (err) {
    console.error("[Notifications] Error connecting to Durable Object:", err);
    return new Response("Error connecting to WebSocket", { status: 500 });
  }
});

export default notifications;
