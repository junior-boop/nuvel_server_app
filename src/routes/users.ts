import { Hono } from "hono";
import { UsersAccount } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";

const users = new Hono<{ Bindings: CloudflareBindings }>();

users.get("/", async ({ json, env, res }) => {
  await UsersAccount(env).createTable();
  const Users = UsersAccount(env);

  console.log("je suis dans la joie");

  return json(await Users.findAll());
});

users.post("/signin", async ({ req, res, json, env }) => {
  await UsersAccount(env).createTable();
  const Users = UsersAccount(env);
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
      return json({
        message: "cet utilisateur existe deja",
        data: modifiedUser,
      });
    }

    const data = await Users.create({
      id: uuidv4(),
      ...user,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    });

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

users.put("/:userId/update-infos", async ({ req, res, env, json }) => {
  const Users = UsersAccount(env);
  const formData = await req.parseBody();
  const userinfo = await req.json();
  const { userId } = req.param();

  console.log(formData);

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
