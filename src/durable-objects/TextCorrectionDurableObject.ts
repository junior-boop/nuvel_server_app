import { DurableObject } from "cloudflare:workers";

/**
 * TextCorrectionDurableObject - Un Durable Object par utilisateur.
 * Reçoit un texte, le corrige (orthographe/grammaire/ponctuation) via
 * Workers AI (@cf/google/gemma-4-26b-a4b-it) et renvoie le résultat.
 */
export class TextCorrectionDurableObject extends DurableObject {
  protected env: CloudflareBindings;

  constructor(state: DurableObjectState, env: CloudflareBindings) {
    super(state, env);
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method !== "POST" || url.pathname !== "/correct") {
      return new Response("Not found", { status: 404 });
    }

    try {
      const { text } = await request.json<{ text?: string }>();

      if (!text || typeof text !== "string") {
        return new Response(
          JSON.stringify({ success: false, message: "Le champ 'text' est requis" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const result = await this.env.AI.run("@cf/meta/llama-3.2-1b-instruct" as keyof AiModels, {
        messages: [
          {
            role: "system",
            content:
              "Tu es un correcteur linguistique professionnel, expert en orthographe, grammaire, conjugaison, accords et ponctuation, dans toutes les langues du monde (français, anglais, et toute autre langue). Détecte automatiquement la langue du texte fourni et corrige exclusivement dans cette même langue : ne traduis jamais. Corrige avec précision et profondeur : fautes d'orthographe et de frappe, erreurs de grammaire et de conjugaison, accords en genre et en nombre, accords sujet-verbe, homophones mal employés, ponctuation et majuscules, ainsi que les mots mal choisis ou impropres au contexte (barbarismes, faux-sens, anglicismes fautifs, répétitions maladroites) en les remplaçant par le mot juste et le plus précis. Ne change jamais le sens, le ton, le style, le registre ni la structure des phrases voulus par l'auteur, et ne reformule pas ce qui est déjà correct. Préserve la mise en forme d'origine (sauts de ligne, emojis, ponctuation expressive). Réponds uniquement avec le texte corrigé, sans aucun commentaire, explication, préambule ni traduction.",
          },
          { role: "user", content: text },
        ],
      });

      const output = result as { response?: string; choices?: { message?: { content?: string } }[] };
      const corrected = (output.response ?? output.choices?.[0]?.message?.content ?? "").trim();

      return new Response(
        JSON.stringify({ success: true, original: text, corrected }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      console.error("[TextCorrectionDO] Erreur:", err);
      return new Response(
        JSON.stringify({ success: false, error: String(err) }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
