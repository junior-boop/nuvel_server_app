import { DurableObject } from "cloudflare:workers";

/**
 * CommentsDurableObject - Gère les commentaires en temps réel via WebSocket
 * Un Durable Object par article
 */
export class CommentsDurableObject extends DurableObject {
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
      console.log(`[CommentsDO] Client disconnected. Active sessions: ${this.sessions.size}`);
    });

    server.addEventListener('error', (err) => {
      console.error('[CommentsDO] WebSocket error:', err);
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
      const count = await this.getCommentsCount();
      
      const message = {
        type: 'connected',
        articleId: this.articleId,
        count: count,
        message: 'Connected to comments stream',
        timestamp: Date.now()
      };

      ws.send(JSON.stringify(message));
      console.log(`[CommentsDO] Client connected to article ${this.articleId}. Active sessions: ${this.sessions.size}`);
    } catch (err) {
      console.error('[CommentsDO] Error sending initial state:', err);
    }
  }

  /**
   * Gérer les notifications internes (depuis les routes HTTP)
   */
  async handleNotification(request: Request): Promise<Response> {
    try {
      const data = await request.json() as any;
      
      switch (data.type) {
        case 'comment_added':
          await this.broadcastCommentAdded(data.comment);
          break;
        case 'comment_deleted':
          await this.broadcastCommentDeleted(data.commentId);
          break;
        default:
          console.log('[CommentsDO] Unknown notification type:', data.type);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('[CommentsDO] Error handling notification:', err);
      return new Response(JSON.stringify({ success: false, error: String(err) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  /**
   * Broadcaster qu'un commentaire a été ajouté
   */
  async broadcastCommentAdded(comment: any) {
    const count = await this.getCommentsCount();
    
    const message = {
      type: 'comment_added',
      comment: comment,
      count: count,
      articleId: this.articleId,
      timestamp: Date.now()
    };

    this.broadcast(JSON.stringify(message));
    console.log(`[CommentsDO] Broadcasted comment_added to ${this.sessions.size} sessions`);
  }

  /**
   * Broadcaster qu'un commentaire a été supprimé
   */
  async broadcastCommentDeleted(commentId: string) {
    const count = await this.getCommentsCount();
    
    const message = {
      type: 'comment_deleted',
      commentId: commentId,
      count: count,
      articleId: this.articleId,
      timestamp: Date.now()
    };

    this.broadcast(JSON.stringify(message));
    console.log(`[CommentsDO] Broadcasted comment_deleted to ${this.sessions.size} sessions`);
  }

  /**
   * Broadcaster un message à toutes les sessions connectées
   */
  broadcast(message: string) {
    this.sessions.forEach((session) => {
      try {
        session.send(message);
      } catch (err) {
        console.error('[CommentsDO] Error broadcasting to session:', err);
        // Supprimer la session si l'envoi échoue
        this.sessions.delete(session);
      }
    });
  }

  /**
   * Récupérer le nombre de commentaires depuis D1
   */
  async getCommentsCount(): Promise<number> {
    try {
      if (!this.articleId || !this.env.DB) {
        return 0;
      }

      const result = await this.env.DB.prepare(
        'SELECT COUNT(*) as count FROM comments WHERE articleId = ?'
      ).bind(this.articleId).first<{ count: number }>();

      return result?.count || 0;
    } catch (err) {
      console.error('[CommentsDO] Error getting comments count:', err);
      return 0;
    }
  }

  /**
   * Méthode appelée par Cloudflare pour gérer les messages WebSocket
   */
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    try {
      if (typeof message !== 'string') return;
      
      const data = JSON.parse(message);
      
      // Les clients peuvent demander un refresh du count
      if (data.type === 'request_count') {
        await this.sendCount(ws);
      }
    } catch (err) {
      console.error('[CommentsDO] Error handling WebSocket message:', err);
    }
  }

  /**
   * Envoyer le count actuel à un client spécifique
   */
  async sendCount(ws: WebSocket) {
    const count = await this.getCommentsCount();
    
    const message = {
      type: 'count_update',
      count: count,
      articleId: this.articleId,
      timestamp: Date.now()
    };

    try {
      ws.send(JSON.stringify(message));
    } catch (err) {
      console.error('[CommentsDO] Error sending count:', err);
    }
  }
}
