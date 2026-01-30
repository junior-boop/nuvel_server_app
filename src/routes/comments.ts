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
      where: { articleId }
    });

    // Filtrer les commentaires avec 5+ signalements
    const visibleComments = allComments.filter(comment => {
      let signalsCount = 0;
      try {
        signalsCount = JSON.parse(comment.signals || '[]').length;
      } catch {
        signalsCount = 0;
      }
      // Garder seulement si moins de 5 signalements
      return signalsCount < 5;
    });

    // Trier les commentaires visibles :
    // 1. Par nombre d'upvotes (décroissant)
    // 2. Par date de modification (récent en premier)
    const sortedComments = visibleComments.sort((a, b) => {
      // Parser les upvotes (JSON arrays)
      let upvotesA = 0;
      let upvotesB = 0;
      
      try {
        upvotesA = JSON.parse(a.upvotes || '[]').length;
      } catch { upvotesA = 0; }
      
      try {
        upvotesB = JSON.parse(b.upvotes || '[]').length;
      } catch { upvotesB = 0; }

      // D'abord trier par upvotes (décroissant)
      if (upvotesB !== upvotesA) {
        return upvotesB - upvotesA;
      }

      // Si même nombre d'upvotes, trier par date de modification (récent en premier)
      const dateA = new Date(a.modified || a.created).getTime();
      const dateB = new Date(b.modified || b.created).getTime();
      return dateB - dateA;
    });

    return json({
      articleId,
      comments: sortedComments,
      count: sortedComments.length,
      totalComments: allComments.length, // Inclut les commentaires masqués
      hiddenComments: allComments.length - sortedComments.length // Nombre de masqués
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
  const url = new URL(req.url);
  
  try {
    const body = await req.json() as Partial<CommentsType>;

    const newComment = await CommentsModel.create({
      id: uuidv4(),
      articleId,
      content: body.content || '',
      creator: body.creator || '',
      notes: 0,
      upvotes: '[]', // Init avec tableau vide
      signals: '[]', // Init avec tableau vide
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    });

    // Notifier le Durable Object pour broadcaster aux clients connectés
    try {
      const id = env.COMMENTS_DO.idFromName(articleId);
      const stub = env.COMMENTS_DO.get(id);
      
      // L'URL est interne au DO - le chemin "/notify" sera intercepté par la méthode fetch() du DO
      await stub.fetch('http://dummy/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'comment_added',
          comment: newComment
        })
      });
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

// Route pour upvote un commentaire (toggle)
comments.post("/:articleId/:commentId/upvote", async ({ json, env, req, status }) => {
  const CommentsModel = CommentsTable(env);
  const { commentId } = req.param();
  const { userid } = await req.json() as { userid: string };

  try {
    const comment = await CommentsModel.findById(commentId);
    
    if (!comment) {
      status(404);
      return json({ success: false, message: 'Comment not found' });
    }

    // Parser le tableau JSON des upvotes
    let upvotes: string[] = [];
    try {
      upvotes = JSON.parse(comment.upvotes || '[]');
    } catch {
      upvotes = [];
    }

    // Toggle upvote
    const index = upvotes.indexOf(userid);
    if (index > -1) {
      // Remove upvote
      upvotes.splice(index, 1);
    } else {
      // Add upvote
      upvotes.push(userid);
    }

    // Mettre à jour le commentaire
    const updated = await CommentsModel.update(commentId, {
      upvotes: JSON.stringify(upvotes),
      modified: new Date().toISOString()
    });

    // Notifier le Durable Object pour broadcaster la mise à jour
    try {
      const { articleId } = req.param();
      const id = env.COMMENTS_DO.idFromName(articleId);
      const stub = env.COMMENTS_DO.get(id);
      
      const updatedComment = await CommentsModel.findById(commentId);
      
      await stub.fetch('http://dummy/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'comment_updated',
          comment: updatedComment
        })
      });
    } catch (err) {
      console.error('[Comments] Error notifying Durable Object:', err);
    }

    return json({
      success: true,
      action: index > -1 ? 'removed' : 'added',
      upvotesCount: upvotes.length,
      upvotes: upvotes
    });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// Route pour signaler un commentaire (toggle)
comments.post("/:articleId/:commentId/signal", async ({ json, env, req, status }) => {
  const CommentsModel = CommentsTable(env);
  const { commentId } = req.param();
  const { userid } = await req.json() as { userid: string };

  try {
    const comment = await CommentsModel.findById(commentId);
    
    if (!comment) {
      status(404);
      return json({ success: false, message: 'Comment not found' });
    }

    // Parser le tableau JSON des signals
    let signals: string[] = [];
    try {
      signals = JSON.parse(comment.signals || '[]');
    } catch {
      signals = [];
    }

    // Toggle signal
    const index = signals.indexOf(userid);
    if (index > -1) {
      // Remove signal
      signals.splice(index, 1);
    } else {
      // Add signal
      signals.push(userid);
    }

    // Mettre à jour le commentaire
    const updated = await CommentsModel.update(commentId, {
      signals: JSON.stringify(signals),
      modified: new Date().toISOString()
    });

    // Notifier le Durable Object pour broadcaster la mise à jour
    try {
      const { articleId } = req.param();
      const id = env.COMMENTS_DO.idFromName(articleId);
      const stub = env.COMMENTS_DO.get(id);
      
      const updatedComment = await CommentsModel.findById(commentId);
      
      await stub.fetch('http://dummy/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'comment_updated',
          comment: updatedComment
        })
      });
    } catch (err) {
      console.error('[Comments] Error notifying Durable Object:', err);
    }

    return json({
      success: true,
      action: index > -1 ? 'removed' : 'added',
      signalsCount: signals.length,
      signals: signals
    });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// Route pour récupérer les stats d'un commentaire (upvotes + signals)
comments.get("/:articleId/:commentId/stats", async ({ json, env, req, status }) => {
  const CommentsModel = CommentsTable(env);
  const { commentId } = req.param();

  try {
    const comment = await CommentsModel.findById(commentId);
    
    if (!comment) {
      status(404);
      return json({ success: false, message: 'Comment not found' });
    }

    // Parser les tableaux JSON
    let upvotes: string[] = [];
    let signals: string[] = [];
    try {
      upvotes = JSON.parse(comment.upvotes || '[]');
      signals = JSON.parse(comment.signals || '[]');
    } catch {
      upvotes = [];
      signals = [];
    }

    return json({
      success: true,
      commentId: comment.id,
      upvotesCount: upvotes.length,
      signalsCount: signals.length,
      upvotes: upvotes,
      signals: signals
    });
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// Route ADMIN pour voir les commentaires signalés (5+ signalements)
comments.get("/:articleId/reported", async ({ json, env, req, status }) => {
  const CommentsModel = CommentsTable(env);
  const { articleId } = req.param();

  try {
    const allComments = await CommentsModel.findAll({
      where: { articleId }
    });

    // Filtrer pour garder SEULEMENT ceux avec 5+ signalements
    const reportedComments = allComments.filter(comment => {
      let signalsCount = 0;
      try {
        signalsCount = JSON.parse(comment.signals || '[]').length;
      } catch {
        signalsCount = 0;
      }
      return signalsCount >= 5;
    }).map(comment => {
      // Ajouter le count de signals pour info
      let signalsCount = 0;
      try {
        signalsCount = JSON.parse(comment.signals || '[]').length;
      } catch {
        signalsCount = 0;
      }

      return {
        ...comment,
        signalsCount // Ajouter pour faciliter l'affichage
      };
    });

    // Trier par nombre de signalements (descendant)
    reportedComments.sort((a, b) => b.signalsCount - a.signalsCount);

    return json({
      articleId,
      reportedComments: reportedComments,
      count: reportedComments.length
    });
  } catch (error) {
    status(500);
    return json({
      error: 'Failed to fetch reported comments',
      details: String(error)
    });
  }
});

export default comments;

