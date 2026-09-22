import { Hono } from "hono";
import { HistoryTable, Publish, ArticleStatsTable, Comments, Appreciations } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";
import { ArticlesType, User as UsersType } from "../../utils/db";
import { IncludeOptions } from "../../utils/simpleorm";
import { authMiddleware, optionalAuth } from "../middleware/authMiddleware";
import { bumpVersion, arbitrateLWW, markDeleted } from "../../utils/syncState";

const article = new Hono<{ Bindings: CloudflareBindings }>();

article.get("/", async ({ json, env, res }) => {
  const Articles = Publish(env);

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
  const ArticleStats = ArticleStatsTable(env);
  const Articles = Publish(env);
  const CommentsModel = Comments(env);
  const AppreciationsModel = Appreciations(env);

  const stats = await ArticleStats.findAll({
    orderBy: { column: "viewCount", direction: "DESC" },
    limit: 7,
  });

  const topArticles = await Promise.all(stats.map(async (stat) => {
    const [commentCount, likeCount] = await Promise.all([
      CommentsModel.where({ articleId: stat.articleId }).count(),
      AppreciationsModel.where({ articleId: stat.articleId }).count(),
    ]);

    try {
      const article = await Articles.findById(stat.articleId, {
        include: {
          model: "users",
          as: "user",
          foreignKey: "userid",
          localKey: "id",
          type: "belongsTo",
          select: ["id", "name", "email", "church_status", "first_name", "photo"],
        } as IncludeOptions<UsersType>,
      })
      // body et appreciation retirés de la réponse liste — récupérés via GET /articles/:id
      const lightArticle = article
        ? (() => { const { body, appreciation, ...rest } = article as any; return rest; })()
        : null;
      return {
        ...stat,
        signals: JSON.parse(stat.signals || "[]"),
        commentCount,
        likeCount,
        article: lightArticle,
      }
    } catch (error) {
      console.log('[Articles] Error:', error);
      return {
        ...stat,
        signals: JSON.parse(stat.signals || "[]"),
        commentCount,
        likeCount,
        article: null,
      }
    }
  }))

  return json({
    stats: topArticles
  })
})

// Crée (si besoin) la ligne de stats D1 pour un article — idempotent
article.post("/:articleid/stats", async ({ json, env, req }) => {
  const { articleid } = req.param();
  const ArticleStats = ArticleStatsTable(env);

  const { record } = await ArticleStats.findOrCreate(
    { articleId: articleid },
    {
      id: uuidv4(),
      articleId: articleid,
      viewCount: 0,
      shareCount: 0,
      signals: "[]",
      updatedAt: new Date().toISOString(),
    }
  );

  return json({ ...record, signals: JSON.parse(record.signals || "[]") });
});

article.post("/:articleid/view", async ({ json, env, req }) => {
  const { articleid } = req.param();
  const ArticleStats = ArticleStatsTable(env);

  const { record } = await ArticleStats.findOrCreate(
    { articleId: articleid },
    {
      id: uuidv4(),
      articleId: articleid,
      viewCount: 0,
      shareCount: 0,
      signals: "[]",
      updatedAt: new Date().toISOString(),
    }
  );

  const updated = await ArticleStats.increment(record.id, "viewCount", 1);

  return json({ viewCount: updated?.viewCount ?? record.viewCount + 1 });
});

article.post("/:articleid/share", async ({ json, env, req }) => {
  const { articleid } = req.param();
  const ArticleStats = ArticleStatsTable(env);

  const { record } = await ArticleStats.findOrCreate(
    { articleId: articleid },
    {
      id: uuidv4(),
      articleId: articleid,
      viewCount: 0,
      shareCount: 0,
      signals: "[]",
      updatedAt: new Date().toISOString(),
    }
  );

  const updated = await ArticleStats.increment(record.id, "shareCount", 1);

  return json({ shareCount: updated?.shareCount ?? record.shareCount + 1 });
});

article.post("/:articleid/signal", async ({ json, env, req, status }) => {
  const { articleid } = req.param();
  const { userId } = await req.json() as { userId: string };

  if (!userId) {
    status(400);
    return json({ error: "userId requis" });
  }

  const ArticleStats = ArticleStatsTable(env);

  const { record } = await ArticleStats.findOrCreate(
    { articleId: articleid },
    {
      id: uuidv4(),
      articleId: articleid,
      viewCount: 0,
      shareCount: 0,
      signals: "[]",
      updatedAt: new Date().toISOString(),
    }
  );

  const currentSignals: string[] = JSON.parse(record.signals || "[]");
  const signaled = currentSignals.includes(userId);
  const nextSignals = signaled
    ? currentSignals.filter((uid) => uid !== userId)
    : [...currentSignals, userId];

  const updated = await ArticleStats.update(record.id, {
    signals: JSON.stringify(nextSignals),
    updatedAt: new Date().toISOString(),
  });

  return json({ signals: JSON.parse(updated?.signals || "[]") });
});


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
  const Articles = Publish(env);
  const results = await Articles.findAll({
    where: {
      userid: userid,
    },
  });
  return json(results);
});

article.post("/:userid/doc/:articleid", authMiddleware, async ({ json, env, req, status, get }) => {
  const { userid, articleid } = req.param();
  const user = get('user') as { userId: string; email: string; role: string } | undefined;

  if (!user || user.userId !== userid) {
    status(403);
    return json({ status: `/articles 403 Forbidden`, error: "userid ne correspond pas à l'utilisateur authentifié" });
  }

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

    const syncVersion = await bumpVersion(env, "publish", articleid, userid);

    return json({
      status: `/articles 200 OK succes`,
      data: result,
      syncVersion,
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

article.put("/:userid/doc/:articleid", authMiddleware, async ({ json, env, req, status, get }) => {
  const { articleid, userid } = req.param();
  const user = get('user') as { userId: string; email: string; role: string } | undefined;

  if (!user || user.userId !== userid) {
    status(403);
    return json({ status: `/articles 403 Forbidden`, error: "userid ne correspond pas à l'utilisateur authentifié" });
  }

  const article = await req.json() as any;
  const Articles = Publish(env);

  try {
    const clientUpdatedAt = (article._updatedAt as string) ?? new Date().toISOString();
    const decision = await arbitrateLWW(env, "publish", articleid, clientUpdatedAt, userid);
    if (decision.applied === "server") {
      const canonical = await Articles.findById(articleid);
      return json({
        status: `/articles 200 OK conflict`,
        applied: "server",
        currentVersion: decision.currentVersion,
        canonical,
      });
    }

    const result = await Articles.update(
      articleid,
      {
        title: article.title,
        description: article.description,
        imageurl: article.imageurl,
        topic: article.topic,
        updatedAt: new Date().toISOString(),
      }
    );

    const syncVersion = await bumpVersion(env, "publish", articleid, userid);

    return json({
      status: `/articles 200 OK succes`,
      data: result,
      syncVersion,
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

article.delete("/:userid/doc/:articleid", authMiddleware, async ({ json, env, req, status, get }) => {
  const { userid, articleid } = req.param();
  const user = get('user') as { userId: string; email: string; role: string } | undefined;

  if (!user || user.userId !== userid) {
    status(403);
    return json({ status: `/articles 403 Forbidden`, error: "userid ne correspond pas à l'utilisateur authentifié" });
  }

  const Articles = Publish(env);

  try {
    const existing = await Articles.findById(articleid);
    if (!existing) {
      status(404);
      return json({ status: `/articles 404 Not Found` });
    }

    await Articles.delete(articleid);
    const syncVersion = await markDeleted(env, "publish", articleid, userid);

    return json({
      status: `/articles 200 OK succes`,
      syncVersion,
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
