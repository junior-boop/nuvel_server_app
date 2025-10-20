import { Hono } from "hono";
import { Articles as ArticlesTable, ENV } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";

const article = new Hono<{ Bindings: CloudflareBindings }>();

const Article = (env: ENV) => {
  (async () => await ArticlesTable(env).createTable())();
  return ArticlesTable(env);
};

article.get("/", async ({ json, env, res }) => {
  const Articles = Article(env);
  return json(await Articles.findAll());
});

article.get("/:userid", async ({ json, env, text, req }) => {
  const { userid } = req.param();
  const Articles = Article(env);
  const results = await Articles.findAll({
    where: {
      userid: userid,
    },
  });
  return json(results);
});

article.post("/:userid/doc/:articleid", async ({ json, env, req, status }) => {
  const { userid, articleid } = req.param();
  const article = await req.json();
  const Articles = Article(env);

  try {
    const result = await Articles.create({
      id: articleid,
      userid: userid,
      title: article.title,
      description: article.description,
      appreciation: "[]",
      imageurl: article.imageurl,
      noteid: article.noteid,
      topic: article.topic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return json({
      status: `/articles 200 OK succes`,
      data: result,
    });
  } catch (err) {
    console.log("il a y une erreur : ", err);
    status(500);
    return json({
      status: `/articles 500 Error`,
      error: err,
    });
  }
});

article.put("/:userid/doc/:articleid", async ({ json, env, req, status }) => {
  const { articleid, userid } = req.param();
  const article = await req.json();
  const Articles = Article(env);

  try {
    const result = await Articles.updateWhere(
      { userid: userid },
      {
        id: articleid,
        userid: userid,
        title: article.title,
        description: article.description,
        appreciation: "[]",
        imageurl: article.imageurl,
        noteid: article.noteid,
        topic: article.topic,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    return json({
      status: `/articles 200 OK succes`,
      data: result,
    });
  } catch (err) {
    console.log("il a y une erreur : ", err);
    status(500);
    return json({
      status: `/articles 500 Error`,
      error: err,
    });
  }
});

export default article;
