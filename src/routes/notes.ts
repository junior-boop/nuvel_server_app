import { Hono } from "hono";
import { Notes as NotesUser, SyncEventsTable as SyncTable } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";
import { Notes as NotesType } from "../../utils/db";
import { IncludeOptions } from "../../utils/simpleorm";

const notes = new Hono<{ Bindings: CloudflareBindings }>();

notes.get("/", async ({ json, env, res }) => {
  const Notes = NotesUser(env);
  const Synced = SyncTable(env);

  console.log("je suis dans la joie");
  return json({
    notes: await Notes.findAll({
      select: ["creator", "id", "modified", "body", "pinned"],
      include: {
        model: "Users",
        as: "user",
        foreignKey: "creator",
        localKey: "id",
        type: "belongsTo",
      } as IncludeOptions<NotesType>,
    }),
    sync_event: await Synced.findAll(),
  });
});

notes.get("/sync/:userid", async ({ json, req, res, env }) => {
  const { userid } = req.param();
  const query = req.queries();
  const Synced = SyncTable(env);

  const result = await Synced.findAll({
    where: {
      userId: userid,
    },
  });

  return json({
    message: "userid " + userid,
    data: result,
    query,
  });
});

notes.get("/:creator", async ({ json, req, env }) => {
  const Notes = NotesUser(env);
  const { creator } = req.param();
  const result = await Notes.findAll({
    where: {
      creator: creator,
    },
  });
  return json({
    data: result,
  });
});

notes.post("/:id", async ({ json, req, env }) => {
  const Notes = NotesUser(env);
  const Synced = SyncTable(env);
  const { id } = req.param();
  const data = (await req.json()) as NotesType;

  const check = await Notes.findOne({
    where: {
      id: id,
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
      userId: data.creator,
      entityId: data.id,
      entityType: "note",
      action: "updated",
      timestamp: new Date().toISOString(),
      synced: 0,
    });
    return json({
      message: "note updated",
      check,
      sucess: true,
      result
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
    userId: data.creator,
    entityId: result.id,
    entityType: "note",
    action: "created",
    timestamp: new Date().toISOString(),
    synced: 0,
  });

  return json({
    message: "note created",
    sucess: true,
    result
  });
});

export default notes;
