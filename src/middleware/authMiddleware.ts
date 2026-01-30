import { Context, Next } from 'hono';
import { JWTService } from '../utils/jwt';
import { TokenBlacklist } from '../utils/tokenBlacklist';

/**
 * Middleware pour protéger les routes
 * Vérifie le token JWT et ajoute les infos user au contexte
 */
export const authMiddleware = async (c: Context, next: Next) => {
  const JWT_SECRET = c.env.JWT_SECRET;

  JWTService.initialize(JWT_SECRET);
  try {
    const authHeader = c.req.header('Authorization');
    const token = JWTService.extractToken(authHeader);

    if (!token) {
      return c.json({ error: 'Token manquant' }, 401);
    }

    const blacklist = new TokenBlacklist(c.env);
    if (await blacklist.isBlacklisted(token)) {
      return c.json({ error: 'Token révoqué' }, 401);
    }

    const payload = await JWTService.verifyToken(token);
    if (!payload || payload.type !== 'access') {
      return c.json({ error: 'Token invalide ou expiré' }, 401);
    }

    c.set('user', {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    await next();
  } catch (error) {
    console.error('[Auth Middleware] Erreur:', error);
    return c.json({ error: 'Erreur authentification' }, 500);
  }
};

/**
 * Middleware optionnel - Enrichit le contexte si token présent
 * Ne bloque pas si le token est absent ou invalide
 */
export const optionalAuth = async (c: Context, next: Next) => {
  const JWT_SECRET = c.env.JWT_SECRET;

  JWTService.initialize(JWT_SECRET);
  try {
    const token = JWTService.extractToken(c.req.header('Authorization'));
    if (token) {
      const payload = await JWTService.verifyToken(token);
      if (payload?.type === 'access') {
        c.set('user', {
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
        });
      }
    }
  } catch {
    // Silencieux - pas d'erreur
  }

  await next();
};
