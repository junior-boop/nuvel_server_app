import { Hono } from "hono";
import { GroupsTable, SyncEventsTable as SyncTable } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";
import { Notes as NotesType, Groups as GroupesType } from "../../utils/db";
import { bumpVersion, arbitrateLWW, markDeleted } from "../../utils/syncState";

const groups = new Hono<{ Bindings: CloudflareBindings }>();

groups.get("/", async ({ json, env, res }) => {
  const Groups = GroupsTable(env);
  const Synced = SyncTable(env);

  console.log("je suis dans la joie");
  return json({
    groupes: await Groups.findAll(),
    sync_event: await Synced.findAll(),
  });
});

groups.get("/sync/:userid", async ({ json, req, res, env }) => {
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
    sync: result,
    query,
  });
});

groups.get("/:userid", async ({ json, req, env }) => {
  const Groups = GroupsTable(env);
  const { userid } = req.param();
  const result = await Groups.findAll({
    where: {
      userid: userid,
    },
  });
  return json({
    data: result,
  });
});

groups.post("/:id", async ({ json, req, env }) => {
  const Groups = GroupsTable(env);
  const Synced = SyncTable(env);
  const { _updatedAt, ...data } = (await req.json()) as GroupesType & { _updatedAt?: string };


  const check = await Groups.findOne({
    where: {
      id: data.id,
    },
  });

  if (check) {
    const clientUpdatedAt = _updatedAt ?? new Date().toISOString();
    const decision = await arbitrateLWW(
      env,
      "groupes",
      data.id,
      clientUpdatedAt,
      data.userid
    );

    if (decision.applied === "server") {
      return json({
        applied: "server",
        sucess: false,
        currentVersion: decision.currentVersion,
        canonical: check,
      });
    }

    const result = await Groups.updateWhere(
      {
        id: data.id,
      },
      {
        ...data,
        lastSyncUpdate: new Date().toISOString(),
        version: check.version + 1,
      }
    );
    Synced.create({
      id: uuidv4(),
      userId: data.userid,
      entityId: data.id,
      entityType: "group",
      action: "updated",
      timestamp: new Date().toISOString(),
      synced: 0,
    });
    const newVersion = await bumpVersion(env, "groupes", data.id, data.userid);
    return json({
      sucess: true,
      syncVersion: newVersion,
    });
  }

  const object: GroupesType = {
    ...data,
    userid: data.userid,
    lastSyncUpdate: new Date().toISOString(),
    version: 1,
  };

  const result = await Groups.create(object);
  Synced.create({
    id: uuidv4(),
    userId: data.userid,
    entityId: result.id,
    entityType: "group",
    action: "created",
    timestamp: new Date().toISOString(),
    synced: 0,
  });
  const newVersion = await bumpVersion(env, "groupes", result.id, data.userid);

  return json({
    sucess: true,
    syncVersion: newVersion,
  });
});

groups.delete("/:id", async ({ json, req, env }) => {
  const Groups = GroupsTable(env);
  const { id } = req.param();

  const existing = await Groups.findOne({ where: { id } });
  if (!existing) {
    // Deja absent cote serveur : suppression idempotente.
    return json({ success: true, alreadyDeleted: true });
  }

  await Groups.delete(id);
  const syncVersion = await markDeleted(env, "groupes", id, existing.userid);

  return json({ success: true, syncVersion });
});

export default groups;
