import { DurableObject } from "cloudflare:workers";

/**
 * AppreciationsDurableObject - Gère les likes en temps réel via WebSocket
 * Un Durable Object par article
 */
export class AppreciationsDurableObject extends DurableObject {
  private articleId: string;
  protected env: CloudflareBindings;

  constructor(state: DurableObjectState, env: CloudflareBindings) {
    super(state, env);
    this.articleId = '';
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Seul le handshake WebSocket porte l'articleId : "/notify" ne le passe pas,
    // donc écraser le champ à chaque fetch le remettrait à vide.
    const articleIdParam = url.searchParams.get('articleId');
    if (articleIdParam) {
      this.articleId = articleIdParam;
    }

    // Vérifier si c'est une requête de notification interne
    if (url.pathname === '/notify') {
      return this.handleNotification(request);
    }

    // Upgrade vers WebSocket
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected websocket', { status: 400 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    // Accepter la connexion
    this.ctx.acceptWebSocket(server);

    // L'instance peut être évincée pendant que la socket reste ouverte : l'articleId
    // est rattaché à la socket pour être récupérable au réveil.
    server.serializeAttachment({ articleId: this.articleId });

    // Envoyer l'état initial
    await this.sendInitialState(server);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  /**
   * Envoyer l'état initial au client qui se connecte
   */
  async sendInitialState(ws: WebSocket) {
    try {
      const count = await this.getAppreciationsCount();
      const appreciations = await this.getAppreciations();
      
      const message = {
        type: 'connected',
        articleId: this.articleId,
        count: count,
        appreciations: appreciations,
        message: 'Connected to appreciations stream',
        timestamp: Date.now()
      };

      ws.send(JSON.stringify(message));
      console.log(`[AppreciationsDO] Client connected to article ${this.articleId}. Active sessions: ${this.ctx.getWebSockets().length}`);
    } catch (err) {
      console.error('[AppreciationsDO] Error sending initial state:', err);
    }
  }

  /**
   * Gérer les notifications internes (depuis les routes HTTP)
   */
  async handleNotification(request: Request): Promise<Response> {
    try {
      const data = await request.json() as any;
      
      switch (data.type) {
        case 'like_added':
          await this.broadcastLikeAdded(data.userid);
          break;
        case 'like_removed':
          await this.broadcastLikeRemoved(data.userid);
          break;
        case 'like_toggled':
          await this.broadcastLikeToggled(data.userid, data.action);
          break;
        default:
          console.log('[AppreciationsDO] Unknown notification type:', data.type);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('[AppreciationsDO] Error handling notification:', err);
      return new Response(JSON.stringify({ success: false, error: String(err) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  /**
   * Broadcaster qu'un like a été ajouté
   */
  async broadcastLikeAdded(userid: string) {
    const count = await this.getAppreciationsCount();
    const appreciations = await this.getAppreciations();
    
    const message = {
      type: 'like_added',
      userid: userid,
      count: count,
      appreciations: appreciations,
      articleId: this.resolveArticleId(),
      timestamp: Date.now()
    };

    this.broadcast(JSON.stringify(message));
    console.log(`[AppreciationsDO] Broadcasted like_added to ${this.ctx.getWebSockets().length} sessions`);
  }

  /**
   * Broadcaster qu'un like a été supprimé
   */
  async broadcastLikeRemoved(userid: string) {
    const count = await this.getAppreciationsCount();
    const appreciations = await this.getAppreciations();
    
    const message = {
      type: 'like_removed',
      userid: userid,
      count: count,
      appreciations: appreciations,
      articleId: this.resolveArticleId(),
      timestamp: Date.now()
    };

    this.broadcast(JSON.stringify(message));
    console.log(`[AppreciationsDO] Broadcasted like_removed to ${this.ctx.getWebSockets().length} sessions`);
  }

  /**
   * Broadcaster qu'un like a été toggleé
   */
  async broadcastLikeToggled(userid: string, action: 'added' | 'removed') {
    if (action === 'added') {
      await this.broadcastLikeAdded(userid);
    } else {
      await this.broadcastLikeRemoved(userid);
    }
  }

  /**
   * Broadcaster un message à toutes les sessions connectées
   */
  // ctx.getWebSockets() est la seule liste fiable : les sockets acceptées via
  // ctx.acceptWebSocket() survivent à l'hibernation du Durable Object, alors qu'un Set
  // en mémoire est vidé à chaque réveil — le broadcast n'atteignait alors plus personne.
  broadcast(message: string) {
    for (const session of this.ctx.getWebSockets()) {
      try {
        session.send(message);
      } catch (err) {
        console.error('[AppreciationsDO] Error broadcasting to session:', err);
      }
    }
  }

  /**
   * Récupérer l'articleId, y compris après un réveil où le champ d'instance est vide
   * (un /notify ne porte pas le query param) : les sockets encore ouvertes le conservent.
   */
  private resolveArticleId(): string {
    if (!this.articleId) {
      for (const session of this.ctx.getWebSockets()) {
        const attachment = session.deserializeAttachment() as { articleId?: string } | null;
        if (attachment?.articleId) {
          this.articleId = attachment.articleId;
          break;
        }
      }
    }
    return this.articleId;
  }

  /**
   * Récupérer le nombre d'appreciations depuis D1
   */
  async getAppreciationsCount(): Promise<number> {
    try {
      const articleId = this.resolveArticleId();
      if (!articleId || !this.env.DB) {
        return 0;
      }

      const result = await this.env.DB.prepare(
        'SELECT COUNT(*) as count FROM appreciations WHERE articleId = ?'
      ).bind(articleId).first<{ count: number }>();

      return result?.count || 0;
    } catch (err) {
      console.error('[AppreciationsDO] Error getting appreciations count:', err);
      return 0;
    }
  }

  /**
   * Récupérer toutes les appreciations depuis D1
   */
  async getAppreciations(): Promise<any[]> {
    try {
      const articleId = this.resolveArticleId();
      if (!articleId || !this.env.DB) {
        return [];
      }

      const result = await this.env.DB.prepare(
        'SELECT * FROM appreciations WHERE articleId = ?'
      ).bind(articleId).all();

      return result.results || [];
    } catch (err) {
      console.error('[AppreciationsDO] Error getting appreciations:', err);
      return [];
    }
  }

  /**
   * Méthode appelée par Cloudflare pour gérer les messages WebSocket
   */
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    try {
      if (typeof message !== 'string') return;
      
      const data = JSON.parse(message);
      
      // Les clients peuvent demander un refresh
      if (data.type === 'request_update') {
        await this.sendUpdate(ws);
      }
    } catch (err) {
      console.error('[AppreciationsDO] Error handling WebSocket message:', err);
    }
  }

  /**
   * Envoyer l'état actuel à un client spécifique
   */
  async sendUpdate(ws: WebSocket) {
    const count = await this.getAppreciationsCount();
    const appreciations = await this.getAppreciations();
    
    const message = {
      type: 'update',
      count: count,
      appreciations: appreciations,
      articleId: this.resolveArticleId(),
      timestamp: Date.now()
    };

    try {
      ws.send(JSON.stringify(message));
    } catch (err) {
      console.error('[AppreciationsDO] Error sending update:', err);
    }
  }

  // Avec l'API Hibernation, addEventListener('close'/'error') ne se déclenche jamais :
  // ce sont ces handlers que le runtime appelle.
  async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
    try {
      ws.close(code, reason);
    } catch (err) {
      // socket déjà fermée
    }
  }

  async webSocketError(ws: WebSocket, error: unknown) {
    console.error('[AppreciationsDO] WebSocket error:', error);
  }
}
