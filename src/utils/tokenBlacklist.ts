import { v4 as uuidv4 } from 'uuid';
import { TokenBlacklistTable } from '../../utils/tables';

export class TokenBlacklist {
  private env: any;

  constructor(env: any) {
    this.env = env;
  }

  /**
   * Ajouter un token à la blacklist
   */
  async add(token: string, userId: string, expiresAt: number): Promise<void> {
    try {
      const Blacklist = TokenBlacklistTable(this.env);

      await Blacklist.create({
        id: uuidv4(),
        token,
        userId,
        revokedAt: new Date().toISOString(),
        expiresAt: new Date(expiresAt * 1000).toISOString(),
      });

      console.log('[Blacklist] Token révoqué');
    } catch (error) {
      console.error('[Blacklist] Erreur ajout:', error);
    }
  }

  /**
   * Vérifier si un token est blacklisté
   */
  async isBlacklisted(token: string): Promise<boolean> {
    try {
      const Blacklist = TokenBlacklistTable(this.env);

      const result = await Blacklist.findOne({
        where: { token },
      });

      return !!result;
    } catch (error) {
      console.error('[Blacklist] Erreur vérification:', error);
      return false;
    }
  }

  /**
   * Nettoyer les tokens expirés (cron job quotidien)
   */
  async cleanup(): Promise<number> {
    try {
      const Blacklist = TokenBlacklistTable(this.env);
      const now = new Date().toISOString();
      const allTokens = await Blacklist.findAll();

      let deleted = 0;
      for (const token of allTokens) {
        if (token.expiresAt < now) {
          await Blacklist.delete(token.id);
          deleted++;
        }
      }

      console.log(`[Blacklist] ${deleted} tokens expirés supprimés`);
      return deleted;
    } catch (error) {
      console.error('[Blacklist] Erreur cleanup:', error);
      return 0;
    }
  }
}
