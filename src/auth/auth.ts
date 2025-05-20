// Tipos de roles
export type UserRole = 'ADMIN' | 'PROMOTOR' | 'CLIENTE';

// Estructura del payload JWT
export interface JwtPayload {
  sub: string; // user_id
  role: UserRole;
  agency_id: string | null;
  iat: number;
  exp: number;
}

// Configuración de autenticación
const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: 24 * 60 * 60, // 24 horas en segundos
  passwordSaltRounds: 10,
  maxFailedAttempts: 5,
  lockoutDuration: 30 * 60 // 30 minutos en segundos
};

// Funciones de autenticación
import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
export class AuthService {
  // Hashing de contraseña
  static async hashPassword(password: string): Promise<string> {
    return await hash(password, authConfig.passwordSaltRounds);
    }

  // Verificación de contraseña
  static async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  // Generación de JWT
  static generateToken(
    userId: string,
    role: UserRole,
    agencyId: string | null
  ): string {
    const payload: JwtPayload = {
      sub: userId,
      role,
      agency_id: agencyId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + authConfig.jwtExpiration
    };

    return jwt.sign(payload, authConfig.jwtSecret);
  }

  // Verificación de JWT
  static verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Generación de token de restablecimiento
  static generateResetToken(): string {
    return jwt.sign(
      { type: 'reset' },
      authConfig.jwtSecret,
      { expiresIn: '1h' }
    );
  }

  // Verificación de token de restablecimiento
  static verifyResetToken(token: string): boolean {
    try {
      jwt.verify(token, authConfig.jwtSecret);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Incrementar intentos fallidos
  static async increaseFailedAttempts(userId: string) {
    // Implementar lógica para incrementar intentos fallidos en la base de datos
    // y bloquear usuario si supera el límite
  }

  // Resetear intentos fallidos
  static async resetFailedAttempts(userId: string) {
    // Implementar lógica para resetear intentos fallidos en la base de datos
  }

  // Verificar bloqueo de usuario
  static async isUserLocked(userId: string): Promise<boolean> {
    // Implementar lógica para verificar si el usuario está bloqueado
    return false;
  }
}

// Middleware de autenticación
import { Request, Response, NextFunction } from 'express';
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = AuthService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Verificar bloqueo de usuario
    const isLocked = await AuthService.isUserLocked(decoded.sub);
    if (isLocked) {
      return res.status(403).json({ error: 'User is locked' });
    }

    // Agregar información del usuario al request
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      agency_id: decoded.agency_id
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication error' });
  }
};

// Funciones de auditoría
export const auditLog = async (
  userId: string,
  actionType: string,
  actionDetails: Record<string, any>,
  ipAddress: string,
  userAgent: string
) => {
  // Implementar lógica de auditoría con Prisma
  // Esto se moverá a un archivo separado cuando se configure Prisma
  console.log('Audit log:', {
    user_id: userId,
    action_type: actionType,
    action_details: actionDetails,
    ip_address: ipAddress,
    user_agent: userAgent
  });
};
