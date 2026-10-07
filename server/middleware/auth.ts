import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'scsco-college-secret-key-omerga-2025';

export interface AuthenticatedUser {
  id: number;
  loginId: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'PRINCIPAL' | 'FACULTY' | 'STUDENT' | 'PARENT' | 'ALUMNI';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const signToken = (user: AuthenticatedUser): string => {
  return jwt.sign(
    {
      id: user.id,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authentication token' });
  }

  const token = authHeader.split('Bearer ')[1].trim();
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid token' });
  }
};

export const requireRoles = (roles: Array<'SUPER_ADMIN' | 'PRINCIPAL' | 'FACULTY' | 'STUDENT' | 'PARENT' | 'ALUMNI'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }
    // SUPER_ADMIN always has full access
    if (req.user.role === 'SUPER_ADMIN' || roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ error: `Forbidden: Access restricted to roles [${roles.join(', ')}]` });
  };
};
