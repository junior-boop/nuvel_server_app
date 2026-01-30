import { Hono } from "hono";
import { GroupsTable, Notes as NotesTable, UsersAccount } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";
import { IncludeOptions } from "../../utils/simpleorm";
import { Notes } from "../../utils/db";

const users = new Hono<{ Bindings: CloudflareBindings }>();

users.get("/", async ({ json, env, res }) => {
  await UsersAccount(env).createTable();
  const Users = UsersAccount(env);

  console.log("je suis dans la joie");

  return json(await Users.findAll({
    select: ["id", "email", "name", "first_name", "photo", "biography"]
  }));
});

users.get("/:userid", async ({ json, env, res, req }) => {
  const { userid } = req.param();
  await UsersAccount(env).createTable();

  const Users = UsersAccount(env)

  return json(
    await Users.findOne({
      where: {
        id: userid,
      },
    })
  );
});
users.get("/:userid/notes", async ({ json, env, res, req }) => {
  const { userid } = req.param();
  await UsersAccount(env).createTable();

  const Users = UsersAccount(env);
  const Notes = NotesTable(env);
  const Groups = GroupsTable(env);
  const user = await Users.findOne({
    where: {
      id: userid,
    },
  })

  const notes = await Notes.findAll({
    where: {
      creator: userid,
    },
    count: true
  })

  const groups = await Groups.findAll({
    where: {
      userid: userid,
    },
    count: true
  })
  return json({
    ...user,
    notes,
    groups
  })
});

users.post("/signin", async ({ req, res, json, env }) => {
  await UsersAccount(env).createTable();
  const Users = UsersAccount(env);
  const Notes = NotesTable(env);
  const user = await req.json();



  try {
    const check_user_exist = await Users.findOne({
      where: {
        email: user.email,
      },
    });

    if (check_user_exist) {
      const modifiedUser = await Users.update(check_user_exist.id, {
        ...check_user_exist,
        modified: new Date().toISOString(),
      });

      if (modifiedUser) {
        const notes = await Notes.findAll({
          where: {
            creator: modifiedUser?.id,
          },
          count: true
        })
        return json({
          message: "cet utilisateur existe deja",
          data: {
            ...modifiedUser,
            notes: {
              count: notes.count
            }
          },
        });
      }
    }

    const data = await Users.create({
      id: uuidv4(),
      ...user,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    });

    return json({
      message: "un utilisateur a ete cree",
      data: {
        ...data,
        notes: {
          count: 0
        }
      },
    });
  } catch (error) {
    console.log(error);
    return json({
      message: "il y a une erreur " + error,
      data: null,
    });
  }
});

users.put("/:userId/update-infos", async ({ req, res, env, json }) => {
  const Users = UsersAccount(env);
  const userinfo = await req.json();
  const { userId } = req.param();

  console.log(userinfo);

  try {
    const data = await Users.updateWhere(
      { id: userId },
      {
        ...userinfo,
        modified: new Date().toISOString(),
      }
    );

    return json({
      message: "un utilisateur a ete cree",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return json({
      message: "il y a une erreur " + error,
      data: null,
    });
  }

});
export default users;
