import { Hono } from "hono";
import users from "./routes/users";
import article from "./routes/articles";
import notes from "./routes/notes";
import images from "./images";
import groups from "./routes/groups";
import bible from "./routes/bible";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", ({ json }) => {
  const teste = {
    name: "yaounde",
    pays: "Cameroun",
  };
  return json(teste);
});

app.get("/health", ({ json, env }) => {
  return json({
    status: true,
  });
});

app.route("/users", users);
app.route("/articles", article);
app.route("/notes", notes);
app.route("/groups", groups);
app.route("/image", images);
app.route("/bible", bible);
export default app;
