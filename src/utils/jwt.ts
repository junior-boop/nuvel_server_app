import { sign, verify } from 'hono/jwt';

const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 jours

export class JWTService {
  private static JWT_SECRET: string;

  // Méthode statique pour initialiser le secret
  static initialize(secret: string): void {
    if (!secret) {
      throw new Error('JWT_SECRET is required');
    }
    this.JWT_SECRET = secret;
  }


  static async generateAccessToken(
    userId: string,
    email: string,
    role?: string
  ): Promise<string> {
    if (!this.JWT_SECRET) {
      throw new Error('JWTService not initialized. Call JWTService.initialize() first.');
    }
    const payload = {
      userId,
      email,
      role,
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRY,
    };

    return await sign(payload, this.JWT_SECRET);
  }

  /**
   * Générer un refresh token (longue durée - 7 jours)
   */
  static async generateRefreshToken(
    userId: string,
    email: string
  ): Promise<string> {
    if (!this.JWT_SECRET) {
      throw new Error('JWTService not initialized. Call JWTService.initialize() first.');
    }
    const payload = {
      userId,
      email,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRY,
    };

    return await sign(payload, this.JWT_SECRET);
  }

  /**
   * Générer une paire complète (access + refresh)
   */
  static async generateTokenPair(
    userId: string,
    email: string,
    role?: string
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userId, email, role),
      this.generateRefreshToken(userId, email),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRY,
    };
  }

  /**
   * Vérifier et décoder un token
   */
  static async verifyToken(token: string): Promise<any> {
    if (!this.JWT_SECRET) {
      throw new Error('JWTService not initialized. Call JWTService.initialize() first.');
    }
    try {
      const payload = await verify(token, this.JWT_SECRET);
      return payload;
    } catch (error) {
      console.error('[JWT] Token invalide:', error);
      return null;
    }
  }

  /**
   * Extraire le token du header Authorization
   * Format attendu: "Bearer <token>"
   */
  static extractToken(authHeader: string | undefined): string | null {
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }

    return null;
  }
}
