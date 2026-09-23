// Client de l'API Expo Push, partagé par le consumer de Queue et le cron horaire.

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

// Expo refuse les requêtes de plus de 100 messages.
const MAX_MESSAGES_PER_REQUEST = 100;

export interface ExpoPushMessage {
  to: string;
  sound: "default";
  title: string;
  body: string;
  data: Record<string, unknown>;
  // Image affichée dans la notification (Android nativement, iOS nécessite une
  // Notification Service Extension côté app). Voir docs.expo.dev/push-notifications.
  richContent?: { image: string };
}

// Chaque message porte son propre titre/corps : le cron envoie un texte différent
// par destinataire (compteur personnel, langue), contrairement aux notifications
// de la Queue qui diffusent un même contenu.
export async function sendExpoPushMessages(messages: ExpoPushMessage[]) {
  for (let i = 0; i < messages.length; i += MAX_MESSAGES_PER_REQUEST) {
    const chunk = messages.slice(i, i + MAX_MESSAGES_PER_REQUEST);

    try {
      const response = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
        },
        body: JSON.stringify(chunk),
      });

      const result = await response.json<{
        data?: { status: string; message?: string; details?: { error?: string } }[];
        errors?: unknown[];
      }>();

      if (!response.ok) {
        console.error("[ExpoPush] Requête échouée:", response.status, result);
        continue;
      }

      result.data?.forEach((ticket, index) => {
        if (ticket.status === "error") {
          console.error("[ExpoPush] Ticket en erreur:", chunk[index].to, ticket.message, ticket.details);
        }
      });
    } catch (err) {
      console.error("[ExpoPush] Erreur d'envoi:", err);
    }
  }
}

export async function sendExpoPush(
  tokens: string[],
  title: string,
  body: string,
  data: Record<string, unknown>
) {
  if (tokens.length === 0) return;

  await sendExpoPushMessages(
    tokens.map((to) => ({ to, sound: "default" as const, title, body, data }))
  );
}
