import { Context, Next } from 'hono';

/**
 * Middleware pour vérifier les rôles autorisés
 */
export const requireRole = (...allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ error: 'Non authentifié' }, 401);
    }

    if (!user.role || !allowedRoles.includes(user.role)) {
      return c.json(
        {
          error: 'Accès refusé',
          message: `Rôle requis: ${allowedRoles.join(' ou ')}`,
          yourRole: user.role || 'aucun',
        },
        403
      );
    }

    await next();
  };
};

/**
 * Middleware admin uniquement
 */
export const requireAdmin = requireRole('admin');

/**
 * Middleware modérateur ou admin
 */
export const requireModerator = requireRole('admin', 'moderator');
