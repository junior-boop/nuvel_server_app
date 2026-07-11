import { DurableObject } from "cloudflare:workers";

/**
 * NotificationsDurableObject - Un Durable Object par utilisateur.
 * Diffuse en temps réel (WebSocket) les nouvelles notifications vers les
 * sessions de l'app actuellement ouvertes, en complément du push OS envoyé
 * par le consumer de la Queue.
 */
export class NotificationsDurableObject extends DurableObject {
  private sessions: Set<WebSocket>;
  private userId: string;
  protected env: CloudflareBindings;

  constructor(state: DurableObjectState, env: CloudflareBindings) {
    super(state, env);
    this.sessions = new Set();
    this.userId = '';
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    this.userId = url.searchParams.get('userId') || '';

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
    this.sessions.add(server);

    server.send(JSON.stringify({
      type: 'connected',
      userId: this.userId,
      timestamp: Date.now(),
    }));

    server.addEventListener('close', () => {
      this.sessions.delete(server);
    });

    server.addEventListener('error', () => {
      this.sessions.delete(server);
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  /**
   * Appelé par le consumer de la Queue une fois la notification écrite dans InstantDB.
   */
  async handleNotification(request: Request): Promise<Response> {
    try {
      const data = await request.json() as any;

      this.broadcast(JSON.stringify({
        type: 'notification',
        notification: data.notification,
        timestamp: Date.now(),
      }));

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('[NotificationsDO] Error handling notification:', err);
      return new Response(JSON.stringify({ success: false, error: String(err) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  broadcast(message: string) {
    this.sessions.forEach((session) => {
      try {
        session.send(message);
      } catch (err) {
        this.sessions.delete(session);
      }
    });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    // Les clients n'ont pas besoin d'envoyer de messages pour l'instant.
  }
}
