import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware";

const links = new Hono<{ Bindings: CloudflareBindings }>();

// Hotes a bloquer en plus des IP privees : cible classique de SSRF sur les
// providers cloud (endpoint de metadata qui expose des credentials internes).
const BLOCKED_HOSTS = new Set(["localhost", "169.254.169.254", "metadata.google.internal"]);

const isPrivateHostname = (hostname: string) => {
  const h = hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(h)) return true;
  if (h === "0.0.0.0" || h.endsWith(".local")) return true;
  // IPv4 privees/loopback (10/8, 172.16/12, 192.168/16, 127/8)
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 10 || a === 127) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
  }
  if (h === "::1" || h.startsWith("fc") || h.startsWith("fd")) return true;
  return false;
};

const isFetchableUrl = (value: string) => {
  try {
    const u = new URL(value);
    return (u.protocol === "http:" || u.protocol === "https:") && !isPrivateHostname(u.hostname);
  } catch {
    return false;
  }
};

const stripWww = (hostname: string) => hostname.replace(/^www\./, "");

// POST /links/preview - recupere titre/image/domaine (og:*) d'une URL pour
// l'apercu de lien dans l'editeur de notes.
links.post("/preview", authMiddleware, async ({ req, json, status }) => {
  const body = await req.json<{ url?: string }>();
  const rawUrl = body?.url?.trim();

  if (!rawUrl || !isFetchableUrl(rawUrl)) {
    status(400);
    return json({ success: false, message: "URL invalide" });
  }

  try {
    const response = await fetch(rawUrl, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NuvelLinkPreview/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(8000),
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !contentType.includes("text/html")) {
      status(422);
      return json({ success: false, message: "Contenu non exploitable" });
    }

    const finalUrl = response.url || rawUrl;
    if (!isFetchableUrl(finalUrl)) {
      status(400);
      return json({ success: false, message: "URL invalide" });
    }

    const meta: Record<string, string> = {};
    let titleTag = "";

    const rewriter = new HTMLRewriter()
      .on("meta", {
        element(el) {
          const property = el.getAttribute("property") || el.getAttribute("name");
          const content = el.getAttribute("content");
          if (property && content) meta[property.toLowerCase()] = content;
        },
      })
      .on("title", {
        text(t) {
          titleTag += t.text;
        },
      });

    await rewriter.transform(response).text();

    const domain = stripWww(new URL(finalUrl).hostname);
    const title = meta["og:title"] || titleTag.trim() || domain;
    const description = meta["og:description"] || meta["description"] || null;
    const rawImage = meta["og:image"] || meta["twitter:image"] || null;
    const image = rawImage ? new URL(rawImage, finalUrl).toString() : null;

    return json({
      success: true,
      preview: { url: finalUrl, title, description, image, domain },
    });
  } catch (err) {
    console.error("[Links Preview] Erreur:", err);
    status(500);
    return json({ success: false, message: "Impossible de recuperer l'apercu" });
  }
});

export default links;
