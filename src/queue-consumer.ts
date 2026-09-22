import { sendExpoPush } from "../utils/expoPush";
import { NotificationsTable, PushTokensTable } from "../utils/tables";

export interface NotificationQueueMessage {
  // Clé d'idempotence générée une seule fois côté route (avant l'envoi dans la Queue).
  // La Queue livre "au moins une fois" et un message peut être retraité (message.retry()) :
  // sans id stable, chaque retraitement recréait une nouvelle notification en D1.
  id: string;
  recipientUserId: string;
  type: "comment_reply" | "announcement" | "prayer_topic";
  title: string;
  body: string;
  actorUserId?: string;
  articleId?: string | null;
  commentId?: string;
  createdAt?: string;
  // false = la ligne D1 existe déjà (annonce diffusée, écrite une seule fois par /broadcast).
  // Le consumer se limite alors à la livraison : persister ici recréerait une ligne par destinataire.
  persist?: boolean;
}

export async function queueHandler(batch: MessageBatch<NotificationQueueMessage>, env: CloudflareBindings) {
  const Notifications = NotificationsTable(env);

  for (const message of batch.messages) {
    const payload = message.body;

    let record: any;

    if (payload.persist === false) {
      record = {
        id: payload.id,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        articleId: payload.articleId ?? null,
        commentId: payload.commentId ?? null,
        createdAt: payload.createdAt ?? new Date().toISOString(),
      };
      message.ack();
    } else {
      try {
        const createdAt = new Date();

        // findOrCreate sur l'id fourni par la route : un message retraité (retry ou
        // redelivery "au moins une fois") réutilise la même ligne au lieu d'en créer une nouvelle.
        const result = await Notifications.findOrCreate(
          { id: payload.id },
          {
            id: payload.id,
            recipientUserId: payload.recipientUserId,
            type: payload.type,
            title: payload.title,
            body: payload.body,
            data: JSON.stringify({
              articleId: payload.articleId ?? null,
              commentId: payload.commentId ?? null,
            }),
            read: 0,
            actorUserId: payload.actorUserId ?? null,
            articleId: payload.articleId ?? null,
            commentId: payload.commentId ?? null,
            createdAt: createdAt.toISOString(),
          }
        );
        record = result.record;

        message.ack();
      } catch (err: any) {
        console.error(
          "[Queue] Error processing notification message:",
          err?.message,
          JSON.stringify(err?.body ?? err, Object.getOwnPropertyNames(err ?? {}))
        );
        message.retry();
        continue;
      }
    }

    // La ligne D1 est désormais la source unique de vérité : on la diffuse telle quelle
    // (push + WebSocket) sans retraiter le message en cas d'échec ici, pour éviter les doublons.
    try {
      const PushTokens = PushTokensTable(env);
      const tokens = await PushTokens.findAll({ where: { userid: payload.recipientUserId } });
      const tokenValues = (tokens || []).map((t: any) => t.token).filter(Boolean);

      await sendExpoPush(tokenValues, record.title, record.body, {
        type: record.type,
        articleId: record.articleId,
        commentId: record.commentId,
        notificationId: record.id,
      });
    } catch (err) {
      console.error("[Queue] Error sending push notifications:", err);
    }

    try {
      const doId = env.NOTIFICATIONS_DO.idFromName(payload.recipientUserId);
      const stub = env.NOTIFICATIONS_DO.get(doId);
      await stub.fetch(`http://dummy/notify?userId=${payload.recipientUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notification: {
            id: record.id,
            type: record.type,
            title: record.title,
            body: record.body,
            articleId: record.articleId,
            commentId: record.commentId,
            createdAt: record.createdAt,
          },
        }),
      });
    } catch (err) {
      console.error("[Queue] Error notifying Durable Object:", err);
    }
  }
}
