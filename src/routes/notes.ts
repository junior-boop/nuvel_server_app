import { Hono } from "hono";
import { Notes as NotesUser, SyncTable } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";
import { Notes as NotesType } from "../../utils/db";

const notes = new Hono<{ Bindings: CloudflareBindings }>();

notes.get("/", async ({ json, env, res }) => {
  const Notes = NotesUser(env);
  const Synced = SyncTable(env);

  console.log("je suis dans la joie");
  return json({
    notes: await Notes.findAll(),
    sync_event: await Synced.findAll(),
  });
});

notes.get("/sync/:userid", async ({ json, req, res, env }) => {
  const { userid } = req.param();
  const query = req.queries();
  const Synced = SyncTable(env);
  const Notes = NotesUser(env);

  const result = await Notes.findAll({
    where: {
      creator: userid,
    },
  });

  return json({
    message: "userid " + userid,
    sync: result,
    query,
  });
});

notes.post("/:id", async ({ json, req, env }) => {
  const Notes = NotesUser(env);
  const Synced = SyncTable(env);
  const { id } = req.param();
  const data = (await req.json()) as NotesType;

  const check = await Notes.findOne({
    where: {
      id: data.id,
    },
  });

  if (check) {
    const result = await Notes.updateWhere(
      {
        id: data.id,
      },
      {
        ...data,
        clientversion: data.version || 1,
        lastSyncUpdate: new Date().toISOString(),
        version: check.version + 1,
      }
    );
    Synced.create({
      id: uuidv4(),
      userid: data.creator,
      noteid: data.id,
      action: "UPDATE",
      timestamp: new Date().toISOString(),
      synced: false,
    });
    return json({
      sucess: true,
    });
  }

  const object: NotesType = {
    ...data,
    clientversion: data.version || 1,
    lastSyncUpdate: new Date().toISOString(),
    version: 1,
  };

  const result = await Notes.create(object);
  Synced.create({
    id: uuidv4(),
    userid: data.creator,
    noteid: result.id,
    action: "CREATE",
    timestamp: new Date().toISOString(),
    synced: false,
  });

  return json({
    sucess: true,
  });
});

export default notes;
