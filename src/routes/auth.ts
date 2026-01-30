import { Hono } from 'hono';
import { JWTService } from '../utils/jwt';
import { TokenBlacklist } from '../utils/tokenBlacklist';
import { UsersAccount, Notes as NotesTable, } from '../../utils/tables';
import { authMiddleware } from '../middleware/authMiddleware';

import { v4 as uuidv4 } from "uuid";

const auth = new Hono<{ Bindings: CloudflareBindings }>();

/**
 * POST /auth/login - Connexion utilisateur
 */
auth.post('/login', async ({ req, res, json, env }) => {
  await UsersAccount(env).createTable();
  const Users = UsersAccount(env);
  const Notes = NotesTable(env);
  const user = await req.json();

  const JWT_SECRET = env.JWT_SECRET;

  JWTService.initialize(JWT_SECRET);

  try {
    const check_user_exist = await Users.findOne({
      where: {
        email: user.email,
      },
    });

    if (check_user_exist) {
      const modifiedUser = await Users.update(check_user_exist.id, {
        ...check_user_exist,
        lastlogin: new Date().toISOString(),
        modified: new Date().toISOString(),
      });

      if (modifiedUser) {
        const notes = await Notes.findAll({
          where: {
            creator: modifiedUser?.id,
          },
          count: true
        })

        const tokens = await JWTService.generateTokenPair(
          modifiedUser.id,
          modifiedUser.email,
          modifiedUser.church_status
        );

        return json({
          success: true,
          user: {
            ...modifiedUser,
            notes: {
              count: notes.count
            }
          },
          ...tokens,
        });
      }
    }

    const tokens = await JWTService.generateTokenPair(
      user.id,
      user.email,
      user.church_status
    );

    const data = await Users.create({
      id: uuidv4(),
      ...user,
      lastlogin: new Date().toISOString(),
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    });

    return json({
      success: true,
      user: {
        ...data,
        notes: {
          count: 0
        }
      },
      ...tokens,
    });
  } catch (error) {
    console.log(error);
    return json({
      message: "il y a une erreur " + error,
      data: null,
    });
  }
});

/**
 * POST /auth/refresh - Renouveler l'access token
 */
auth.post('/refresh', async (c) => {
  const JWT_SECRET = c.env.JWT_SECRET;

  JWTService.initialize(JWT_SECRET);
  try {
    const { refreshToken } = await c.req.json();

    if (!refreshToken) {
      return c.json({ error: 'Refresh token manquant' }, 400);
    }

    const payload = await JWTService.verifyToken(refreshToken);
    if (!payload || payload.type !== 'refresh') {
      return c.json({ error: 'Refresh token invalide' }, 401);
    }

    const blacklist = new TokenBlacklist(c.env);
    if (await blacklist.isBlacklisted(refreshToken)) {
      return c.json({ error: 'Token révoqué' }, 401);
    }

    const Users = UsersAccount(c.env);
    const user = await Users.findById(payload.userId);

    if (!user) {
      return c.json({ error: 'Utilisateur non trouvé' }, 404);
    }

    const newTokens = await JWTService.generateTokenPair(
      user.id,
      user.email,
      user.church_status
    );

    await blacklist.add(refreshToken, user.id, payload.exp);

    return c.json({
      success: true,
      ...newTokens,
    });
  } catch (error) {
    console.error('[Refresh] Erreur:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

/**
 * POST /auth/logout - Déconnexion
 */
auth.post('/logout', authMiddleware, async (c) => {
  const Users = UsersAccount(c.env);
  const JWT_SECRET = c.env.JWT_SECRET;

  JWTService.initialize(JWT_SECRET);
  try {
    const token = JWTService.extractToken(c.req.header('Authorization'));

    if (!token) {
      return c.json({ error: 'Token manquant' }, 400);
    }

    const payload = await JWTService.verifyToken(token);
    if (!payload) {
      return c.json({ error: 'Token invalide' }, 401);
    }

    const check_user_exist = await Users.findOne({
      where: {
        email: payload.email,
      },
    });
    if (check_user_exist) {
      await Users.update(check_user_exist.id, {
        lastlogout: new Date().toISOString(),
        modified: new Date().toISOString(),
      });
    }
    const blacklist = new TokenBlacklist(c.env);
    await blacklist.add(token, payload.userId, payload.exp);

    return c.json({
      success: true,
      message: 'Déconnexion réussie',
    });
  } catch (error) {
    console.error('[Logout] Erreur:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

/**
 * GET /auth/me - Profil utilisateur
 */
auth.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');
  const Users = UsersAccount(c.env);
  const fullUser = await Users.findById(user.userId);

  if (!fullUser) {
    return c.json({ error: 'Utilisateur non trouvé', user }, 404);
  }

  return c.json({
    success: true,
    user: {
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name,
      first_name: fullUser.first_name,
      photo: fullUser.photo,
      biography: fullUser.biography,
      role: fullUser.church_status,
      lastlogin: fullUser.lastlogin,
      lastlogout: fullUser.lastlogout,
    },
  });
});

export default auth;
