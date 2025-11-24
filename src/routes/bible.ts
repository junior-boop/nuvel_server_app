import { Hono } from "hono";
import { Articles as ArticlesTable, ENV } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";

const bible = new Hono<{ Bindings: CloudflareBindings }>();

interface BibleMetadata {
  name: string;
  shortname: string;
  module: string;
  year: string;
  publisher: string | null;
  owner: string | null;
  description: string;
  lang: string;
  lang_short: string;
  copyright: number;
  copyright_statement: string;
  url: string | null;
  citation_limit: number;
  restrict: number;
  italics: number;
  strongs: number;
  red_letter: number;
  paragraph: number;
  official: number;
  research: number;
  module_version: string;
}

// Type pour un verset
interface BibleVerse {
  book_name: string;
  book: number;
  chapter: number;
  verse: number;
  text: string;
}

// Type pour l'objet Bible complet
interface BibleData {
  metadata: BibleMetadata;
  verses: BibleVerse[];
}

// Export des types
export type { BibleMetadata, BibleVerse, BibleData };

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

bible.get("/", async ({ json, env, res }) => {
  const listed = await env.STORAGE.list({
    prefix: "bibles/",
  });

  const jsonFiles = listed.objects.filter((obj) =>
    obj.key.toLowerCase().endsWith(".json")
  );

  // Compte le nombre de fichiers JSON
  const count = jsonFiles.length;

  // Prépare les informations détaillées
  const filesInfo = jsonFiles.map((file) => ({
    nom: file.key,
    taille: file.size,
    tailleFormatee: formatBytes(file.size),
    derniereModification: file.uploaded,
  }));

  // Calcule la taille totale
  const tailleTotal = jsonFiles.reduce((sum, file) => sum + file.size, 0);

  // Prépare la réponse
  const response = {
    nombreFichiersJSON: count,
    tailleTotale: formatBytes(tailleTotal),
    fichiers: filesInfo,
  };

  return new Response(JSON.stringify(response, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});

bible.get("/version", async ({ json, req, res, env, status }) => {
  const query = req.query("name");

  //   console.log(query);

  try {
    const obj = await env.STORAGE.get(query as string);
    const content = await obj?.text();
    const bibleData = JSON.parse(content as string) as BibleData;

    return json({
      name: bibleData.metadata.name,
      shortname: bibleData.metadata.shortname,
      module: bibleData.metadata.module,
      year: bibleData.metadata.year,
      metadata: bibleData.metadata,
      verset: bibleData.verses.length,
      lien: "/download?name=bibles/" + bibleData.metadata.module + ".json",
    });
  } catch (error) {
    console.log(error);
    status(500);
    return json({
      error: error,
    });
  }
});
bible.get("/download", async ({ json, req, res, env, status }) => {
  const query = req.query("name");

  //   console.log(query);

  try {
    const obj = await env.STORAGE.get(query as string);
    const content = await obj?.text();
    const bibleData = JSON.parse(content as string) as BibleData;

    return json({
      shortname: bibleData.metadata.shortname,
      year: bibleData.metadata.year,
      verset: bibleData.verses.length,
      content: bibleData.verses,
    });
  } catch (error) {
    console.log(error);
    status(500);
    return json({
      error: error,
    });
  }
});

export default bible;
