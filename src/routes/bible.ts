import { Hono } from "hono";
import { Articles as ArticlesTable, ENV } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";

const bible = new Hono<{ Bindings: CloudflareBindings }>();

bible.get("/", async ({ json, env, res }) => {
  const listed = await env.STORAGE.list();

  return json({
    listed,
  });
});

export default bible;
