import { Hono } from "hono";
import { Notes as NotesUser } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";

const syncEvent = new Hono<{ Bindings: CloudflareBindings }>();

/*

Dans cette partie, plusieurs choses sont a prendre en compte: 
- id de l'utilisateur 
- id de son appareil

*/

syncEvent.get("/", async ({ json, env, res }) => {
  const Notes = NotesUser(env);

  console.log("je suis dans la joie");
  return json(await Notes.findAll());
});

export default syncEvent;
