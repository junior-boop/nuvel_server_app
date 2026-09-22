import { DurableObject } from "cloudflare:workers";

/**
 * HistoryDurableObject - Un Durable Object par utilisateur.
 * Diffuse en temps réel (WebSocket) les changements de l'historique de lecture
 * vers toutes les sessions ouvertes de l'utilisateur (page Settings, autres appareils).
 */
export class HistoryDurableObject extends DurableObject {
  private userId: string;
  protected env: CloudflareBindings;

  constructor(state: DurableObjectState, env: CloudflareBindings) {
    super(state, env);
    this.userId = '';
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Seul le handshake WebSocket porte le userId : "/notify" ne le passe pas,
    // donc écraser le champ à chaque fetch le remettrait à vide.
    const userIdParam = url.searchParams.get('userId');
    if (userIdParam) {
      this.userId = userIdParam;
    }

    if (url.pathname === '/notify') {
      return this.handleNotification(request);
    }

    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected websocket', { status: 400 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.ctx.acceptWebSocket(server);

    // L'instance peut être évincée pendant que la socket reste ouverte : le userId
    // est rattaché à la socket pour être récupérable au réveil.
    server.serializeAttachment({ userId: this.userId });

    await this.sendInitialState(server);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  /**
   * Envoyer l'historique complet au client qui se connecte
   */
  async sendInitialState(ws: WebSocket) {
    try {
      const history = await this.getHistory();

      ws.send(JSON.stringify({
        type: 'connected',
        userId: this.userId,
        history,
        count: history.length,
        timestamp: Date.now(),
      }));

      console.log(`[HistoryDO] Client connected for user ${this.userId}. Active sessions: ${this.ctx.getWebSockets().length}`);
    } catch (err) {
      console.error('[HistoryDO] Error sending initial state:', err);
    }
  }

  /**
   * Gérer les notifications internes (depuis les routes HTTP)
   */
  async handleNotification(request: Request): Promise<Response> {
    try {
      const data = await request.json() as any;

      switch (data.type) {
        case 'history_added':
        case 'history_updated':
          await this.broadcastEntry(data.type, data.entry);
          break;
        default:
          console.log('[HistoryDO] Unknown notification type:', data.type);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('[HistoryDO] Error handling notification:', err);
      return new Response(JSON.stringify({ success: false, error: String(err) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  /**
   * Broadcaster l'ajout ou la mise à jour d'une entrée d'historique
   */
  async broadcastEntry(type: 'history_added' | 'history_updated', entry: any) {
    const count = await this.getHistoryCount();

    this.broadcast(JSON.stringify({
      type,
      entry,
      count,
      userId: this.resolveUserId(),
      timestamp: Date.now(),
    }));

    console.log(`[HistoryDO] Broadcasted ${type} to ${this.ctx.getWebSockets().length} sessions`);
  }

  // ctx.getWebSockets() est la seule liste fiable : les sockets acceptées via
  // ctx.acceptWebSocket() survivent à l'hibernation du Durable Object, alors qu'un Set
  // en mémoire est vidé à chaque réveil — le broadcast n'atteignait alors plus personne.
  broadcast(message: string) {
    for (const session of this.ctx.getWebSockets()) {
      try {
        session.send(message);
      } catch (err) {
        console.error('[HistoryDO] Error broadcasting to session:', err);
      }
    }
  }

  /**
   * Récupérer le userId, y compris après un réveil où le champ d'instance est vide
   * (un /notify ne porte pas le query param) : les sockets encore ouvertes le conservent.
   */
  private resolveUserId(): string {
    if (!this.userId) {
      for (const session of this.ctx.getWebSockets()) {
        const attachment = session.deserializeAttachment() as { userId?: string } | null;
        if (attachment?.userId) {
          this.userId = attachment.userId;
          break;
        }
      }
    }
    return this.userId;
  }

  /**
   * Récupérer l'historique de l'utilisateur depuis D1, le plus récent en premier
   */
  async getHistory(): Promise<any[]> {
    try {
      const userId = this.resolveUserId();
      if (!userId || !this.env.DB) {
        return [];
      }

      const result = await this.env.DB.prepare(
        'SELECT * FROM history WHERE userid = ? ORDER BY lastReading DESC'
      ).bind(userId).all();

      return result?.results || [];
    } catch (err) {
      console.error('[HistoryDO] Error getting history:', err);
      return [];
    }
  }

  async getHistoryCount(): Promise<number> {
    try {
      const userId = this.resolveUserId();
      if (!userId || !this.env.DB) {
        return 0;
      }

      const result = await this.env.DB.prepare(
        'SELECT COUNT(*) as count FROM history WHERE userid = ?'
      ).bind(userId).first<{ count: number }>();

      return result?.count || 0;
    } catch (err) {
      console.error('[HistoryDO] Error getting history count:', err);
      return 0;
    }
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    try {
      if (typeof message !== 'string') return;

      const data = JSON.parse(message);

      // Les clients peuvent redemander l'historique complet (pull-to-refresh)
      if (data.type === 'request_history') {
        const history = await this.getHistory();
        ws.send(JSON.stringify({
          type: 'history_snapshot',
          history,
          count: history.length,
          userId: this.resolveUserId(),
          timestamp: Date.now(),
        }));
      }
    } catch (err) {
      console.error('[HistoryDO] Error handling WebSocket message:', err);
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
    console.error('[HistoryDO] WebSocket error:', error);
  }
}
