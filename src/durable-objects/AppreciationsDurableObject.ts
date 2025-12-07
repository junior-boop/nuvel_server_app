import { DurableObject } from "cloudflare:workers";

/**
 * AppreciationsDurableObject - Gère les likes en temps réel via WebSocket
 * Un Durable Object par article
 */
export class AppreciationsDurableObject extends DurableObject {
  private sessions: Set<WebSocket>;
  private articleId: string;
  protected env: CloudflareBindings;

  constructor(state: DurableObjectState, env: CloudflareBindings) {
    super(state, env);
    this.sessions = new Set();
    this.articleId = '';
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    // Récupérer l'articleId depuis l'URL
    this.articleId = url.searchParams.get('articleId') || '';

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
    this.sessions.add(server);

    // Envoyer l'état initial
    await this.sendInitialState(server);

    // Cleanup à la déconnexion
    server.addEventListener('close', () => {
      this.sessions.delete(server);
      console.log(`[AppreciationsDO] Client disconnected. Active sessions: ${this.sessions.size}`);
    });

    server.addEventListener('error', (err) => {
      console.error('[AppreciationsDO] WebSocket error:', err);
      this.sessions.delete(server);
    });

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
      console.log(`[AppreciationsDO] Client connected to article ${this.articleId}. Active sessions: ${this.sessions.size}`);
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
      articleId: this.articleId,
      timestamp: Date.now()
    };

    this.broadcast(JSON.stringify(message));
    console.log(`[AppreciationsDO] Broadcasted like_added to ${this.sessions.size} sessions`);
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
      articleId: this.articleId,
      timestamp: Date.now()
    };

    this.broadcast(JSON.stringify(message));
    console.log(`[AppreciationsDO] Broadcasted like_removed to ${this.sessions.size} sessions`);
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
  broadcast(message: string) {
    this.sessions.forEach((session) => {
      try {
        session.send(message);
      } catch (err) {
        console.error('[AppreciationsDO] Error broadcasting to session:', err);
        // Supprimer la session si l'envoi échoue
        this.sessions.delete(session);
      }
    });
  }

  /**
   * Récupérer le nombre d'appreciations depuis D1
   */
  async getAppreciationsCount(): Promise<number> {
    try {
      if (!this.articleId || !this.env.DB) {
        return 0;
      }

      const result = await this.env.DB.prepare(
        'SELECT COUNT(*) as count FROM appreciations WHERE articleId = ?'
      ).bind(this.articleId).first<{ count: number }>();

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
      if (!this.articleId || !this.env.DB) {
        return [];
      }

      const result = await this.env.DB.prepare(
        'SELECT * FROM appreciations WHERE articleId = ?'
      ).bind(this.articleId).all();

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
      articleId: this.articleId,
      timestamp: Date.now()
    };

    try {
      ws.send(JSON.stringify(message));
    } catch (err) {
      console.error('[AppreciationsDO] Error sending update:', err);
    }
  }
}
