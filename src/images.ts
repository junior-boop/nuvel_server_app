import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import Metadata_images from "./images_rename";

const images = new Hono<{ Bindings: CloudflareBindings }>();

images.post("/", async ({ req, res, json, env, text }) => {
  const bucket = env.STORAGE;
  const { images } = await req.parseBody();

  try {
    const metadata = Metadata_images(images as File);

    const object = {
      ...metadata,
      path: "/" + metadata?.name,
      createdAt: Date.now(),
      key: uuidv4(),
    };

    await bucket.put(object.name as string, images, {
      customMetadata: {
        name: object.name,
        size: object.size,
        type: object.minetype,
        lastModified: object.lastmodified,
      },
      httpMetadata: {
        contentType: object.minetype,
      },
    });

    return json(object);
  } catch (error) {
    console.log(error);
    return text("il y a une erreur " + error);
  }
});

images.get("/:images", async ({ json, env, res, req }) => {
  const { images } = req.param();
  const bucket = env.STORAGE;

  const files = await bucket.get(images);

  if (files === null) {
    return json("il y n'a pas ce fichier");
  }

  const headers = new Headers();
  files.writeHttpMetadata(headers);
  headers.set("etag", files.httpEtag);

  return new Response(files.body, { headers });
});

export default images;
