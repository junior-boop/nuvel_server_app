import { DurableObject } from "cloudflare:workers";

/**
 * CommentsDurableObject - Gère les commentaires en temps réel via WebSocket
 * Un Durable Object par article
 */
export class CommentsDurableObject extends DurableObject {
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
      const count = await this.getCommentsCount();
      
      const message = {
        type: 'connected',
        articleId: this.articleId,
        count: count,
        message: 'Connected to comments stream',
        timestamp: Date.now()
      };

      ws.send(JSON.stringify(message));
      console.log(`[CommentsDO] Client connected to article ${this.articleId}. Active sessions: ${this.ctx.getWebSockets().length}`);
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
        case 'comment_updated':
          await this.broadcastCommentUpdated(data.comment);
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
      articleId: this.resolveArticleId(),
      timestamp: Date.now()
    };

    this.broadcast(JSON.stringify(message));
    console.log(`[CommentsDO] Broadcasted comment_added to ${this.ctx.getWebSockets().length} sessions`);
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
      articleId: this.resolveArticleId(),
      timestamp: Date.now()
    };

    this.broadcast(JSON.stringify(message));
    console.log(`[CommentsDO] Broadcasted comment_deleted to ${this.ctx.getWebSockets().length} sessions`);
  }

  /**
   * Broadcaster qu'un commentaire a été mis à jour (upvotes/signals)
   */
  async broadcastCommentUpdated(comment: any) {
    const count = await this.getCommentsCount();
    
    const message = {
      type: 'comment_updated',
      comment: comment,
      count: count,
      articleId: this.resolveArticleId(),
      timestamp: Date.now()
    };

    this.broadcast(JSON.stringify(message));
    console.log(`[CommentsDO] Broadcasted comment_updated to ${this.ctx.getWebSockets().length} sessions`);
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
        console.error('[CommentsDO] Error broadcasting to session:', err);
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
   * Récupérer le nombre de commentaires depuis D1
   */
  async getCommentsCount(): Promise<number> {
    try {
      const articleId = this.resolveArticleId();
      if (!articleId || !this.env.DB) {
        return 0;
      }

      const result = await this.env.DB.prepare(
        'SELECT COUNT(*) as count FROM comments WHERE articleId = ?'
      ).bind(articleId).first<{ count: number }>();

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
      articleId: this.resolveArticleId(),
      timestamp: Date.now()
    };

    try {
      ws.send(JSON.stringify(message));
    } catch (err) {
      console.error('[CommentsDO] Error sending count:', err);
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
    console.error('[CommentsDO] WebSocket error:', error);
  }
}
