import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import Metadata_images from "./images_rename";
import { ImagesTable } from "../utils/tables";

const images = new Hono<{ Bindings: CloudflareBindings }>();

images.get("/", ({ json, env, res }) => {
  return json({
    messgae: "je suis dans la place",
  });
});

images.post("/:userid", async ({ req, res, json, env, text, status }) => {
  const bucket = env.STORAGE;
  const { images } = await req.parseBody();
  const { userid } = req.param();
  const Image = ImagesTable(env);
  const hostname = new URL(req.url).host;

  try {
    const metadata = Metadata_images(images as File);

    const object = {
      ...metadata,
      path: "/" + metadata?.name,
      createdAt: Date.now(),
      key: uuidv4(),
    };

    const key = `images/${object.name}`;

    await bucket.put(key, images, {
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

    const save = await Image.create({
      id: uuidv4(),
      name: object.name,
      userid: userid,
      size: object.size,
      mineType: object.minetype,
      url: `${hostname}/image/g/${object.name}`,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    });

    return json(save);
  } catch (error) {
    console.log(error);
    status(500);
    return text("il y a une erreur " + error);
  }
});

images.get("/g/:name", async ({ json, env, res, req }) => {
  const { name } = req.param();
  const bucket = env.STORAGE;

  const key = `images/${name}`;

  const files = await bucket.get(key);

  if (files === null) {
    return json("il y n'a pas ce fichier");
  }

  const headers = new Headers();
  files.writeHttpMetadata(headers);
  headers.set("etag", files.httpEtag);

  return new Response(files.body, { headers });
});

export default images;
