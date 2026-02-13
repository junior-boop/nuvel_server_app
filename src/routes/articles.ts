import { Hono } from "hono";
import { Articles as ArticlesTable, ENV, HistoryTable, Publish } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";
import { ArticlesType, User as UsersType } from "../../utils/db";
import { IncludeOptions } from "../../utils/simpleorm";
import { Comments as CommentsTable } from "../../utils/tables";
import { authMiddleware, optionalAuth } from "../middleware/authMiddleware";
import { getDB } from "../../utils/instant";

const article = new Hono<{ Bindings: CloudflareBindings }>();

const Article = (env: ENV) => {
  (async () => await ArticlesTable(env).createTable())();
  return ArticlesTable(env);
};

article.get("/", async ({ json, env, res }) => {
  const Articles = Publish(env);

  const db = getDB(env)

  const articlesStats = await db.query({ articlesStats: {} })

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

article.get("/stats", async ({ json, env, res }) => {
  const db = getDB(env)

  const articlesStats = await db.query({ articlesStats: {} })

  return json({
    stats: articlesStats
  })
})


// Route accessible même sans authentification
// L'authentification est optionnelle - utilisée uniquement pour l'historique
article.get('/:articleid', optionalAuth, async ({ json, env, text, req, status, get }) => {
  const { articleid } = req.param();
  const Articles = Publish(env);
  const history = HistoryTable(env);
  const user = get('user') as { userId: string; email: string; role: string } | undefined; // Type proper

  try {
    // 1. Charger l'article avec les informations de l'utilisateur
    const articleData = await Articles.findById(articleid, {
      include: {
        model: "users",
        as: "user",
        foreignKey: "userid",
        localKey: "id",
        type: "belongsTo",
        select: ["id", "name", "email", "church_status", "first_name", "photo"],
      } as IncludeOptions<UsersType>,
    });

    if (!articleData) {
      status(404);
      return json({ error: "Article non trouvé" });
    }

    // 2. Si l'utilisateur est authentifié, gérer l'historique
    if (user?.userId) {
      const existingHistory = await history.findAll({
        where: {
          articleid: articleid,
          userid: user.userId,
        },
      });

      if (existingHistory && existingHistory.length > 0) {
        // Mettre à jour la dernière lecture
        await history.update(existingHistory[0].id, {
          lastReading: new Date().toISOString(),
        });
      } else {
        // Créer une nouvelle entrée d'historique
        await history.create({
          id: uuidv4(),
          articleid: articleid,
          articleImage: articleData?.imageurl ?? '',
          articleTitle: articleData?.title ?? '',
          articleCreatedAt: articleData?.createdAt ?? new Date().toISOString(),
          userid: user.userId,
          lastReading: new Date().toISOString()
        });
      }
    }

    return json({
      success: true,
      article: articleData,
      historyTracked: !!user?.userId // Indique si l'historique a été suivi
    });
  } catch (error) {
    console.log('[Articles] Error:', error);
    status(500);
    return json({
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
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
