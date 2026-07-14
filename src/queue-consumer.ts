import { getDB, id } from "../utils/instant";
import { PushTokensTable } from "../utils/tables";

export interface NotificationQueueMessage {
  recipientUserId: string;
  type: "comment_reply" | "announcement" | "prayer_topic";
  title: string;
  body: string;
  actorUserId?: string;
  articleId?: string;
  commentId?: string;
}

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

async function sendExpoPush(tokens: string[], title: string, body: string, data: Record<string, unknown>) {
  if (tokens.length === 0) return;

  const messages = tokens.map((to) => ({
    to,
    sound: "default",
    title,
    body,
    data,
  }));

  try {
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json<{
      data?: { status: string; message?: string; details?: { error?: string } }[];
      errors?: unknown[];
    }>();

    if (!response.ok) {
      console.error("[Queue] Expo push request failed:", response.status, result);
      return;
    }

    result.data?.forEach((ticket, i) => {
      if (ticket.status === "error") {
        console.error("[Queue] Expo push ticket error:", tokens[i], ticket.message, ticket.details);
      }
    });
  } catch (err) {
    console.error("[Queue] Error sending Expo push:", err);
  }
}

export async function queueHandler(batch: MessageBatch<NotificationQueueMessage>, env: CloudflareBindings) {
  const db = getDB(env);

  for (const message of batch.messages) {
    const payload = message.body;

    try {
      const notificationId = id();
      const createdAt = new Date();

      await db.transact(
        db.tx.notifications[notificationId].create({
          id: notificationId,
          recipientUserId: payload.recipientUserId,
          type: payload.type,
          title: payload.title,
          body: payload.body,
          data: {
            articleId: payload.articleId ?? null,
            commentId: payload.commentId ?? null,
          },
          read: false,
          actorUserId: payload.actorUserId,
          articleId: payload.articleId,
          commentId: payload.commentId,
          createdAt,
        })
      );

      const PushTokens = PushTokensTable(env);
      const tokens = await PushTokens.findAll({ where: { userid: payload.recipientUserId } });
      const tokenValues = (tokens || []).map((t: any) => t.token).filter(Boolean);

      await sendExpoPush(tokenValues, payload.title, payload.body, {
        type: payload.type,
        articleId: payload.articleId,
        commentId: payload.commentId,
        notificationId,
      });

      try {
        const doId = env.NOTIFICATIONS_DO.idFromName(payload.recipientUserId);
        const stub = env.NOTIFICATIONS_DO.get(doId);
        await stub.fetch(`http://dummy/notify?userId=${payload.recipientUserId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notification: {
              id: notificationId,
              type: payload.type,
              title: payload.title,
              body: payload.body,
              articleId: payload.articleId,
              commentId: payload.commentId,
              createdAt: createdAt.toISOString(),
            },
          }),
        });
      } catch (err) {
        console.error("[Queue] Error notifying Durable Object:", err);
      }

      message.ack();
    } catch (err) {
      console.error("[Queue] Error processing notification message:", err);
      message.retry();
    }
  }
}
