import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { Comments as CommentsTable } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";
import { Comments as CommentsType } from "../../utils/db";

const comments = new Hono<{ Bindings: CloudflareBindings }>();

// Helper pour créer un délai
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Route WebSocket pour temps réel via Durable Objects (RECOMMANDÉ)
comments.get("/:articleId/ws", async (c) => {
  const { articleId } = c.req.param();
  
  try {
    // Créer un ID unique pour ce Durable Object (un par article)
    const id = c.env.COMMENTS_DO.idFromName(articleId);
    const stub = c.env.COMMENTS_DO.get(id);
    
    // Forward la requête vers le Durable Object avec articleId en query param
    const url = new URL(c.req.url);
    url.searchParams.set('articleId', articleId);
    
    return stub.fetch(url.toString(), c.req.raw);
  } catch (err) {
    console.error('[Comments] Error connecting to Durable Object:', err);
    return new Response('Error connecting to WebSocket', { status: 500 });
  }
});

// Route SSE pour compatibilité (LEGACY - sera déprécié)
comments.get("/:articleId/stream", async (c) => {
  const { articleId } = c.req.param();
  
  return streamSSE(c, async (stream) => {
    const CommentsModel = CommentsTable(c.env);
    let id = 0;
    let lastCheck = Date.now();
    
    try {
      // Envoyer un message de connexion initial
      await stream.writeSSE({
        data: JSON.stringify({ 
          type: 'connected', 
          message: 'Connected to comments stream',
          articleId 
        }),
        event: 'connected',
        id: String(id++),
      });

      // Boucle principale pour le streaming
      while (true) {
        // Vérifier si le client est toujours connecté
        if (c.req.raw.signal.aborted) {
          console.log(`Client disconnected from article ${articleId}`);
          break;
        }

        try {
          // Récupérer les nouveaux commentaires
          const newComments = await CommentsModel.findAll({
            where: { articleId },
            orderBy: { column: 'created', direction: 'DESC' }
          });

          // Filtrer les commentaires récents
          const recentComments = newComments.filter(comment => {
            const commentTime = new Date(comment.created || Date.now()).getTime();
            return commentTime > lastCheck;
          });

          if (recentComments.length > 0) {
            await stream.writeSSE({
              data: JSON.stringify({
                type: 'new_comments',
                comments: recentComments,
                count: recentComments.length
              }),
              event: 'update',
              id: String(id++),
            });
          }

          lastCheck = Date.now();

          // Keep-alive ping
          await stream.writeSSE({
            data: JSON.stringify({ type: 'ping', timestamp: Date.now() }),
            event: 'ping',
            id: String(id++),
          });

        } catch (error) {
          console.error('Error in SSE stream:', error);
          // Ne pas casser la boucle pour une erreur de requête
        }

        // Attendre 5 secondes avant le prochain check
        await sleep(3000);
      }
    } catch (error) {
      console.error('Fatal error in SSE stream:', error);
    }
  });
});

// Route de Long Polling (Alternative recommandée au SSE pour Cloudflare Workers)
comments.get("/:articleId/poll", async ({ json, env, req }) => {
  const CommentsModel = CommentsTable(env);
  const { articleId } = req.param();
  const since = req.query("since") || Date.now() - 60000; // Dernière minute par défaut
  
  try {
    // Récupérer tous les commentaires
    const allComments = await CommentsModel.findAll({
      where: { articleId },
      orderBy: { column: 'created', direction: 'DESC' }
    });

    // Filtrer les commentaires créés après 'since'
    const newComments = allComments.filter(comment => {
      const commentTime = new Date(comment.created || 0).getTime();
      return commentTime > parseInt(String(since));
    });

    return json({
      articleId,
      comments: newComments,
      allComments: allComments,
      count: newComments.length,
      totalCount: allComments.length,
      timestamp: Date.now()
    });
  } catch (error) {
    return json({
      error: 'Failed to poll comments',
      details: String(error)
    }, 500);
  }
});

// Route GET classique pour récupérer tous les commentaires
comments.get("/:articleId", async ({ json, env, req }) => {
  const CommentsModel = CommentsTable(env);
  const { articleId } = req.param();

  try {
    const allComments = await CommentsModel.findAll({
      where: { articleId },
      orderBy: { column: 'created', direction: 'DESC' }
    });

    return json({
      articleId,
      comments: allComments,
      count: allComments.length
    });
  } catch (error) {
    return json({
      error: 'Failed to fetch comments',
      details: String(error)
    }, 500);
  }
});

// Route POST pour créer un nouveau commentaire
comments.post("/:articleId", async ({ json, env, req, status }) => {
  const CommentsModel = CommentsTable(env);
  const { articleId } = req.param();
  
  try {
    const body = await req.json() as Partial<CommentsType>;

    const newComment = await CommentsModel.create({
      id: uuidv4(),
      articleId,
      content: body.content || '',
      creator: body.creator || '',
      notes: 0,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    });

    // Notifier le Durable Object pour broadcaster aux clients connectés
    try {
      const id = env.COMMENTS_DO.idFromName(articleId);
      const stub = env.COMMENTS_DO.get(id);
      
      await stub.fetch(new Request('http://internal/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'comment_added',
          comment: newComment
        })
      }));
    } catch (err) {
      console.error('[Comments] Error notifying Durable Object:', err);
      // Ne pas faire échouer la requête si la notification échoue
    }

    return json({
      success: true,
      comment: newComment
    });
  } catch (error) {
    status(500);
    return json({
      success: false,
      error: String(error)
    });
  }
});

// Route DELETE pour supprimer un commentaire
comments.delete("/:articleId/:commentId", async ({ json, env, req, status }) => {
  const CommentsModel = CommentsTable(env);
  const { commentId } = req.param();

  try {
    const deleted = await CommentsModel.delete(commentId);
    
    if (deleted) {
      return json({ success: true, message: 'Comment deleted' });
    } else {
      status(404);
      return json({ success: false, message: 'Comment not found' });
    }
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

export default comments;

