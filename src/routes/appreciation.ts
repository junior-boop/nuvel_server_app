import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { Appreciations } from "../../utils/tables";
import { v4 as uuidv4 } from "uuid";
import { Appreciations as AppreciationsType } from "../../utils/db";

const appreciation = new Hono<{ Bindings: CloudflareBindings }>();

// Helper pour créer un délai
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Route WebSocket pour temps réel via Durable Objects (RECOMMANDÉ)
appreciation.get("/:articleId/ws", async (c) => {
  const { articleId } = c.req.param();
  
  try {
    // Créer un ID unique pour ce Durable Object (un par article)
    const id = c.env.APPRECIATIONS_DO.idFromName(articleId);
    const stub = c.env.APPRECIATIONS_DO.get(id);
    
    // Forward la requête vers le Durable Object avec articleId en query param
    const url = new URL(c.req.url);
    url.searchParams.set('articleId', articleId);
    
    return stub.fetch(url.toString(), c.req.raw);
  } catch (err) {
    console.error('[Appreciations] Error connecting to Durable Object:', err);
    return new Response('Error connecting to WebSocket', { status: 500 });
  }
});

// Route SSE pour compatibilité (LEGACY - sera déprécié)
appreciation.get("/:articleId/stream", async (c) => {
  const { articleId } = c.req.param();
  
  return streamSSE(c, async (stream) => {
    const AppreciationsModel = Appreciations(c.env);
    let id = 0;
    let lastCheck = Date.now();
    
    try {
      // Envoyer un message de connexion initial avec le count actuel
      const initialAppreciations = await AppreciationsModel.findAll({
        where: { articleId }
      });

      await stream.writeSSE({
        data: JSON.stringify({ 
          type: 'connected', 
          message: 'Connected to appreciations stream',
          articleId,
          count: initialAppreciations.length,
          appreciations: initialAppreciations
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
          // Récupérer toutes les appreciations
          const allAppreciations = await AppreciationsModel.findAll({
            where: { articleId }
          });

          // On ne peut pas filtrer par date car la table n'a pas de champ 'created'
          // On envoie toujours toutes les appreciations

          // Envoyer une mise à jour avec le count total
          await stream.writeSSE({
            data: JSON.stringify({
              type: 'update',
              count: allAppreciations.length,
              appreciations: allAppreciations
            }),
            event: 'update',
            id: String(id++),
          });

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
        await sleep(5000);
      }
    } catch (error) {
      console.error('Fatal error in SSE stream:', error);
    }
  });
});

// Route GET pour récupérer toutes les appreciations
appreciation.get("/:articleId", async ({ json, env, req }) => {
  const AppreciationsModel = Appreciations(env);
  const { articleId } = req.param();

  try {
    const allAppreciations = await AppreciationsModel.findAll({
      where: { articleId }
    });

    return json({
      articleId,
      appreciations: allAppreciations,
      count: allAppreciations.length
    });
  } catch (error) {
    return json({
      error: 'Failed to fetch appreciations',
      details: String(error)
    }, 500);
  }
});

// Route POST pour ajouter un like (appreciation)
appreciation.post("/:articleId", async ({ json, env, req, status }) => {
  const AppreciationsModel = Appreciations(env);
  const { articleId } = req.param();
  
  try {
    const body = await req.json() as Partial<AppreciationsType>;

    // Vérifier si l'utilisateur a déjà liké
    const existing = await AppreciationsModel.findOne({
      where: {
        articleId,
        userid: body.userid || ''
      }
    });

    if (existing) {
      return json({
        success: false,
        message: 'User has already liked this article',
        appreciation: existing
      }, 400);
    }

    // Créer le like
    const newAppreciation = await AppreciationsModel.create({
      id: uuidv4(),
      articleId,
      userid: body.userid || '',
    });

    return json({
      success: true,
      appreciation: newAppreciation,
      message: 'Like added successfully'
    });
  } catch (error) {
    status(500);
    return json({
      success: false,
      error: String(error)
    });
  }
});

// Route DELETE pour supprimer un like
appreciation.delete("/:articleId/:userid", async ({ json, env, req, status }) => {
  const AppreciationsModel = Appreciations(env);
  const { articleId, userid } = req.param();

  try {
    // Trouver l'appreciation à supprimer
    const appreciation = await AppreciationsModel.findOne({
      where: {
        articleId,
        userid
      }
    });

    if (!appreciation) {
      status(404);
      return json({ 
        success: false, 
        message: 'Appreciation not found' 
      });
    }

    // Supprimer l'appreciation
    const deleted = await AppreciationsModel.delete(appreciation.id);
    
    if (deleted) {
      return json({ 
        success: true, 
        message: 'Like removed successfully' 
      });
    } else {
      status(500);
      return json({ 
        success: false, 
        message: 'Failed to delete appreciation' 
      });
    }
  } catch (error) {
    status(500);
    return json({ success: false, error: String(error) });
  }
});

// Route pour toggle un like (ajouter si n'existe pas, supprimer si existe)
appreciation.post("/:articleId/toggle", async ({ json, env, req, status }) => {
  const AppreciationsModel = Appreciations(env);
  const { articleId } = req.param();
  
  try {
    const body = await req.json() as Partial<AppreciationsType>;
    const userid = body.userid || '';

    // Vérifier si le like existe déjà
    const existing = await AppreciationsModel.findOne({
      where: {
        articleId,
        userid
      }
    });

    if (existing) {
      // Supprimer le like
      await AppreciationsModel.delete(existing.id);
      
      // Notifier le Durable Object
      try {
        const id = env.APPRECIATIONS_DO.idFromName(articleId);
        const stub = env.APPRECIATIONS_DO.get(id);
        
        await stub.fetch(new Request('http://internal/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'like_toggled',
            userid: userid,
            action: 'removed'
          })
        }));
      } catch (err) {
        console.error('[Appreciations] Error notifying Durable Object:', err);
      }
      
      return json({
        success: true,
        action: 'removed',
        message: 'Like removed successfully'
      });
    } else {
      // Ajouter le like
      const newAppreciation = await AppreciationsModel.create({
        id: uuidv4(),
        articleId,
        userid,
      });

      // Notifier le Durable Object
      try {
        const id = env.APPRECIATIONS_DO.idFromName(articleId);
        const stub = env.APPRECIATIONS_DO.get(id);
        
        await stub.fetch(new Request('http://internal/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'like_toggled',
            userid: userid,
            action: 'added'
          })
        }));
      } catch (err) {
        console.error('[Appreciations] Error notifying Durable Object:', err);
      }

      return json({
        success: true,
        action: 'added',
        appreciation: newAppreciation,
        message: 'Like added successfully'
      });
    }
  } catch (error) {
    status(500);
    return json({
      success: false,
      error: String(error)
    });
  }
});

export default appreciation;
