import { Hono } from "hono";
import { Articles as ArticlesTable, ENV, HistoryTable, HistoryTable, Publish } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";
import { ArticlesType, User as UsersType } from "../../utils/db";
import { IncludeOptions } from "../../utils/simpleorm";
import { Comments as CommentsTable } from "../../utils/tables";

const article = new Hono<{ Bindings: CloudflareBindings }>();

const Article = (env: ENV) => {
  (async () => await ArticlesTable(env).createTable())();
  return ArticlesTable(env);
};

article.get("/", async ({ json, env, res }) => {
  const Articles = Publish(env);
  const CommentsModel = CommentsTable(env);
  return json(
    await Articles.findAll({
      orderBy: { column: "createdAt", direction: "DESC" },
      select: ["id", "userid", "title", "description", "imageurl", "noteid", "topic", "createdAt", "updatedAt"],
      include: {
        model: "users",
        as: "user",
        foreignKey: "userid",
        localKey: "id",
        type: "belongsTo",
        select: ["id", "name", "email", "church_status", "first_name", "photo"],
      } as IncludeOptions<UsersType>,
    })
  );
});


article.get('/:articleid', async ({ json, env, text, req, status }) => {
  const { articleid } = req.param();
  const Articles = Publish(env);
  const history = HistoryTable(env)
  const { userid } = req.queries()

  try {
    const check = await history.findOne({
      where: {
        articleid: articleid,
        userid: userid,
      },
    })

    if (check) {
      await history.update(articleid,
        {
          lastReading: new Date().toISOString(),
        }
      )
      return json({
        message: "article deja dans l'Historique"
      })
    }

    const results = await Articles.findById(articleid, {
      include: {
        model: "users",
        as: "user",
        foreignKey: "userid",
        localKey: "id",
        type: "belongsTo",
        select: ["id", "name", "email", "church_status", "first_name", "photo"],
      } as IncludeOptions<UsersType>,
    });

    await history.create({
      id: uuidv4(),
      articleid: articleid,
      articleImage: results?.imageurl,
      articleTitle: results?.title,
      articleCreatedAt: results?.createdAt,
      userid: userid,
      lastReading: new Date().toISOString()
    })
    return json(results);
  } catch (error) {
    console.log(error)
    status(500)
    return text("il y a une erreur serveur")
  }
})

article.get("/userid/:userid", async ({ json, env, text, req }) => {
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
  const article = (await req.json()) as ArticlesType;
  const Articles = Publish(env);

  try {
    const result = await Articles.create({
      id: articleid,
      userid: userid,
      title: article.title,
      description: article.description,
      appreciation: "[]",
      imageurl: article.imageurl,
      noteid: article.noteid,
      body: article.body,
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
      error: JSON.stringify(err),
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
