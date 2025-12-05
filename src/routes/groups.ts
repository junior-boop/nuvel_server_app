import { Hono } from "hono";
import { GroupsTable, SyncTable } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";
import { Notes as NotesType, Groups as GroupesType } from "../../utils/db";

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
      userid: userid,
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
  const { id } = req.param();
  const data = (await req.json()) as GroupesType;

  const check = await Groups.findOne({
    where: {
      id: data.id,
    },
  });

  if (check) {
    const result = await Groups.updateWhere(
      {
        id: data.id,
      },
      {
        ...data,
        userid: id,
        lastSyncUpdate: new Date().toISOString(),
        version: check.version + 1,
      }
    );
    Synced.create({
      id: uuidv4(),
      userid: id,
      noteid: data.id,
      action: "UPDATE",
      timestamp: new Date().toISOString(),
      synced: false,
    });
    return json({
      sucess: true,
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
    userid: data.userid,
    noteid: result.id,
    action: "CREATE",
    timestamp: new Date().toISOString(),
    synced: false,
  });

  return json({
    sucess: true,
  });
});

export default groups;
