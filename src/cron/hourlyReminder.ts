import { sendExpoPushMessages, type ExpoPushMessage } from "../../utils/expoPush";
import type { SimpleORM } from "../../utils/simpleorm";
import { buildReminder, resolveLanguage } from "../../utils/reminderMessages";
import {
  Articles,
  BROADCAST_RECIPIENT,
  ensureNotificationReadsTable,
  NotificationsTable,
  PushTokensTable,
  UsersAccount,
} from "../../utils/tables";

// Pool dans lequel chaque utilisateur sans notification tire un titre au hasard,
// pour éviter que tout le monde reçoive le même article à la même heure.
const ARTICLE_POOL_SIZE = 20;

interface ReminderTarget {
  userId: string;
  language: string | null;
  unreadCount: number;
}

const fetchArticleTitles = async (orm: SimpleORM): Promise<string[]> => {
  const rows = await orm.query<{ title: string | null }>(
    `SELECT title FROM articles ORDER BY createdAt DESC LIMIT ?`,
    [ARTICLE_POOL_SIZE]
  );
  return rows.map((row) => row.title).filter((title): title is string => !!title);
};

export async function hourlyReminderCron(env: CloudflareBindings) {
  // Le cron est un point d'entrée distinct du fetch handler : rien ne garantit
  // qu'une route ait déjà instancié ces modèles sur cet isolate, et les requêtes
  // SQL brutes ci-dessous échoueraient sur une table absente.
  UsersAccount(env);
  PushTokensTable(env);
  Articles(env);
  await ensureNotificationReadsTable(env);
  const orm = NotificationsTable(env).orm;

  // Seuls les utilisateurs ayant au moins un push token peuvent recevoir un rappel.
  // Le non-lu suit la même règle que GET /notifications/:userId : la colonne read
  // (lignes antérieures à notification_reads) ou l'absence de ligne de lecture.
  const targets = await orm.query<ReminderTarget>(
    `SELECT u.id AS userId,
            u.language AS language,
            (SELECT COUNT(*)
               FROM notifications n
              WHERE (n.recipientUserId = u.id OR n.recipientUserId = ?)
                AND n."read" = 0
                AND NOT EXISTS (SELECT 1
                                  FROM notification_reads r
                                 WHERE r.notificationId = n.id AND r.userId = u.id)
            ) AS unreadCount
       FROM users u
      WHERE EXISTS (SELECT 1 FROM push_tokens p WHERE p.userid = u.id)`,
    [BROADCAST_RECIPIENT]
  );

  if (targets.length === 0) return;

  const tokenRows = await orm.query<{ userid: string; token: string | null }>(
    `SELECT userid, token FROM push_tokens`
  );

  const tokensByUser = new Map<string, string[]>();
  for (const row of tokenRows) {
    if (!row.token) continue;
    const existing = tokensByUser.get(row.userid);
    if (existing) existing.push(row.token);
    else tokensByUser.set(row.userid, [row.token]);
  }

  const articleTitles = targets.some((target) => target.unreadCount === 0)
    ? await fetchArticleTitles(orm)
    : [];

  const messages: ExpoPushMessage[] = [];

  for (const target of targets) {
    const tokens = tokensByUser.get(target.userId);
    if (!tokens?.length) continue;

    const articleTitle =
      target.unreadCount === 0 && articleTitles.length > 0
        ? articleTitles[Math.floor(Math.random() * articleTitles.length)]
        : null;

    const { title, body, data } = buildReminder(
      resolveLanguage(target.language),
      target.unreadCount,
      articleTitle
    );

    for (const to of tokens) {
      messages.push({ to, sound: "default", title, body, data });
    }
  }

  // Volontairement aucune écriture dans `notifications` : un rappel persisté
  // compterait lui-même comme non lu, et le compteur ne redescendrait jamais à zéro.
  await sendExpoPushMessages(messages);

  console.log(`[Cron] Rappel horaire — ${messages.length} push pour ${targets.length} utilisateurs`);
}
