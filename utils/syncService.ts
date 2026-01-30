import { v4 as uuidv4 } from 'uuid';
import { Notes as NotesTable, GroupsTable, SyncEventsTable } from './tables';
import { SyncChange, SyncConflict } from './db';
export class SyncService {
  private env: any;
  constructor(env: any) {
    this.env = env;
  }
  /**
   * Traiter les changements du client
   */
  async processClientChanges(
    userId: string,
    deviceId: string,
    changes: SyncChange[]
  ): Promise<{ applied: SyncChange[]; conflicts: SyncConflict[] }> {
    const applied: SyncChange[] = [];
    const conflicts: SyncConflict[] = [];
    for (const change of changes) {
      try {
        if (change.entityType === 'note') {
          const result = await this.processNoteChange(userId, deviceId, change);
          if (result.conflict) {
            conflicts.push(result.conflict);
          } else {
            applied.push(change);
          }
        } else if (change.entityType === 'group') {
          const result = await this.processGroupChange(userId, deviceId, change);
          if (result.conflict) {
            conflicts.push(result.conflict);
          } else {
            applied.push(change);
          }
        }
      } catch (error) {
        console.error(`[Sync] Erreur traitement ${change.entityType}:`, error);
      }
    }
    return { applied, conflicts };
  }
  /**
   * Traiter un changement de note
   */
  private async processNoteChange(
    userId: string,
    deviceId: string,
    change: SyncChange
  ): Promise<{ conflict?: SyncConflict }> {
    const Notes = NotesTable(this.env);
    const SyncEvents = SyncEventsTable(this.env);
    const existingNote = await Notes.findById(change.entityId);
    const clientTimestamp = new Date(change.timestamp).getTime();
    switch (change.action) {
      case 'created':
        if (existingNote) {
          // Conflit : note existe déjà
          const serverTimestamp = new Date(existingNote.modified).getTime();
          
          if (clientTimestamp > serverTimestamp) {
            // Client wins - écraser
            await Notes.update(change.entityId, {
              ...change.data,
              lastSyncedAt: change.timestamp,
              deviceId,
              version: (existingNote.version || 1) + 1,
              modified: change.timestamp,
            });
          }
          return {
            conflict: {
              entityType: 'note',
              entityId: change.entityId,
              localVersion: change.data,
              serverVersion: existingNote,
              resolution: clientTimestamp > serverTimestamp ? 'client_wins' : 'server_wins',
            },
          };
        } else {
          // Créer nouvelle note
          await Notes.create({
            id: change.entityId,
            ...change.data,
            creator: userId,
            lastSyncedAt: change.timestamp,
            deviceId,
            version: 1,
            created: change.timestamp,
            modified: change.timestamp,
          });
        }
        break;
      case 'updated':
        if (!existingNote) {
          // Note n'existe pas - la créer
          await Notes.create({
            id: change.entityId,
            ...change.data,
            creator: userId,
            lastSyncedAt: change.timestamp,
            deviceId,
            version: 1,
            created: change.timestamp,
            modified: change.timestamp,
          });
        } else {
          const serverTimestamp = new Date(existingNote.modified).getTime();
          if (clientTimestamp > serverTimestamp) {
            // Client plus récent - appliquer
            await Notes.update(change.entityId, {
              ...change.data,
              lastSyncedAt: change.timestamp,
              deviceId,
              version: (existingNote.version || 1) + 1,
              modified: change.timestamp,
            });
          } else {
            // Serveur plus récent - conflit
            return {
              conflict: {
                entityType: 'note',
                entityId: change.entityId,
                localVersion: change.data,
                serverVersion: existingNote,
                resolution: 'server_wins',
              },
            };
          }
        }
        break;
      case 'deleted':
        if (existingNote) {
          await Notes.delete(change.entityId);
        }
        break;
    }
    // Enregistrer l'événement
    await SyncEvents.create({
      id: uuidv4(),
      userId,
      deviceId,
      entityType: 'note',
      entityId: change.entityId,
      action: change.action,
      data: JSON.stringify(change.data || {}),
      timestamp: change.timestamp,
      synced: 1,
      created: new Date().toISOString(),
    });
    return {};
  }
  /**
   * Traiter un changement de groupe
   */
  private async processGroupChange(
    userId: string,
    deviceId: string,
    change: SyncChange
  ): Promise<{ conflict?: SyncConflict }> {
    const Groups = GroupsTable(this.env);
    const SyncEvents = SyncEventsTable(this.env);
    // Logique similaire à processNoteChange
    // ... (même pattern)
    return {};
  }
  /**
   * Récupérer les changements depuis un timestamp
   */
  async getChangesSince(
    userId: string,
    since: string,
    excludeDeviceId?: string
  ): Promise<SyncChange[]> {
    const SyncEvents = SyncEventsTable(this.env);
    let events = await SyncEvents.findAll({
      where: { userId },
    });
    // Filtrer par timestamp et device
    events = events.filter((e) => {
      const isAfter = e.timestamp > since;
      const isDifferentDevice = !excludeDeviceId || e.deviceId !== excludeDeviceId;
      return isAfter && isDifferentDevice;
    });
    return events.map((e) => ({
      entityType: e.entityType as 'note' | 'group',
      entityId: e.entityId,
      action: e.action as 'created' | 'updated' | 'deleted',
      data: e.data ? JSON.parse(e.data) : undefined,
      timestamp: e.timestamp,
      deviceId: e.deviceId,
    }));
  }
}