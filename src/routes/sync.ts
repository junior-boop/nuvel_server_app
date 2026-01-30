import { Hono } from 'hono';
import { SyncService } from '../../utils/syncService';
import { authMiddleware } from '../middleware/authMiddleware';
import { SyncEventsTable } from '../../utils/tables';
const sync = new Hono<{ Bindings: CloudflareBindings }>();
/**
 * POST /sync/push - Push des changements locaux
 */
sync.post('/push', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const { deviceId, changes, lastSyncTimestamp } = await c.req.json();
    if (!deviceId || !changes) {
      return c.json({ error: 'deviceId et changes requis' }, 400);
    }
    const syncService = new SyncService(c.env);
    // 1. Appliquer les changements du client
    const { applied, conflicts } = await syncService.processClientChanges(
      user.userId,
      deviceId,
      changes
    );
    // 2. Récupérer les changements du serveur
    const serverChanges = await syncService.getChangesSince(
      user.userId,
      lastSyncTimestamp || '1970-01-01T00:00:00.000Z',
      deviceId
    );
    return c.json({
      success: true,
      timestamp: new Date().toISOString(),
      applied: applied.length,
      conflicts: conflicts,
      serverChanges: serverChanges,
    });
  } catch (error) {
    console.error('[Sync] Erreur push:', error);
    return c.json({ error: 'Erreur synchronisation' }, 500);
  }
});
/**
 * GET /sync/pull - Pull des changements serveur
 */
sync.get('/pull', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const deviceId = c.req.query('deviceId');
    const since = c.req.query('since') || '1970-01-01T00:00:00.000Z';
    if (!deviceId) {
      return c.json({ error: 'deviceId requis' }, 400);
    }
    const syncService = new SyncService(c.env);
    const changes = await syncService.getChangesSince(user.userId, since, deviceId);
    return c.json({
      success: true,
      timestamp: new Date().toISOString(),
      changes,
    });
  } catch (error) {
    console.error('[Sync] Erreur pull:', error);
    return c.json({ error: 'Erreur synchronisation' }, 500);
  }
});
/**
 * GET /sync/status - Statut de synchronisation
 */
sync.get('/status', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const deviceId = c.req.query('deviceId');
    const SyncEvents = SyncEventsTable(c.env);
    const events = await SyncEvents.findAll({
      where: { userId: user.userId },
    });
    const deviceEvents = deviceId
      ? events.filter((e) => e.deviceId === deviceId)
      : events;
    const lastSync = deviceEvents.length > 0
      ? deviceEvents.reduce((latest, e) =>
          e.timestamp > latest.timestamp ? e : latest
        )
      : null;
    return c.json({
      success: true,
      lastSync: lastSync?.timestamp,
      totalEvents: deviceEvents.length,
      pending: deviceEvents.filter((e) => e.synced === 0).length,
    });
  } catch (error) {
    return c.json({ error: 'Erreur récupération statut' }, 500);
  }
});
export default sync;