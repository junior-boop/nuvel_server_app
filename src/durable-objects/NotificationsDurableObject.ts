import { DurableObject } from "cloudflare:workers";

/**
 * NotificationsDurableObject - Un Durable Object par utilisateur.
 * Diffuse en temps réel (WebSocket) les nouvelles notifications vers les
 * sessions de l'app actuellement ouvertes, en complément du push OS envoyé
 * par le consumer de la Queue.
 */
export class NotificationsDurableObject extends DurableObject {
  private userId: string;
  protected env: CloudflareBindings;

  constructor(state: DurableObjectState, env: CloudflareBindings) {
    super(state, env);
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

    server.send(JSON.stringify({
      type: 'connected',
      userId: this.userId,
      timestamp: Date.now(),
    }));

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

  // ctx.getWebSockets() est la seule liste fiable : les sockets acceptées via
  // ctx.acceptWebSocket() survivent à l'hibernation du Durable Object, alors qu'un Set
  // en mémoire est vidé à chaque réveil — le broadcast n'atteignait alors plus personne.
  broadcast(message: string) {
    for (const session of this.ctx.getWebSockets()) {
      try {
        session.send(message);
      } catch (err) {
        console.error('[NotificationsDO] Error sending to session:', err);
      }
    }
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    // Les clients n'ont pas besoin d'envoyer de messages pour l'instant.
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
    console.error('[NotificationsDO] WebSocket error:', error);
  }
}
