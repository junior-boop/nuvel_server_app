import { DurableObject } from "cloudflare:workers";

const CORRECTION_SYSTEM_PROMPT =
  "Tu es un correcteur linguistique professionnel, expert en orthographe, grammaire, conjugaison, accords et ponctuation, dans toutes les langues du monde (français, anglais, et toute autre langue). Détecte automatiquement la langue du texte fourni et corrige exclusivement dans cette même langue : ne traduis jamais. Corrige avec précision et profondeur : fautes d'orthographe et de frappe, erreurs de grammaire et de conjugaison, accords en genre et en nombre, accords sujet-verbe, homophones mal employés, ponctuation et majuscules, ainsi que les mots mal choisis ou impropres au contexte (barbarismes, faux-sens, anglicismes fautifs, répétitions maladroites) en les remplaçant par le mot juste et le plus précis. Ne change jamais le sens, le ton, le style, le registre ni la structure des phrases voulus par l'auteur, et ne reformule pas ce qui est déjà correct. Préserve la mise en forme d'origine (sauts de ligne, emojis, ponctuation expressive). Réponds uniquement avec le texte corrigé, sans aucun commentaire, explication, préambule ni traduction.";

/**
 * TextCorrectionDurableObject - Un Durable Object par utilisateur.
 * Reçoit un texte, le corrige (orthographe/grammaire/ponctuation) via
 * Gemini 2.5 Flash Lite (même modèle que /ai/agent) et renvoie le résultat.
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

      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": this.env.GEMINI_CORRECTION_API_KEY,
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: CORRECTION_SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text }] }],
          }),
        }
      );

      if (!geminiResponse.ok) {
        throw new Error(`Gemini API a répondu ${geminiResponse.status}: ${await geminiResponse.text()}`);
      }

      const result = await geminiResponse.json<{
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      }>();
      const corrected = (result.candidates?.[0]?.content?.parts?.[0]?.text ?? "").trim();

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
