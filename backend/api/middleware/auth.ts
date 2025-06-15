import { Request, Response, NextFunction } from 'express';
import env from '../config/env'; // Adjust path as needed
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define your custom payload interface
interface UserPayload extends JwtPayload {
  id: string;
  displayName: string;
  email?: string;
  picture?: string;
}

interface AuthRequest extends Request {
  user?: any; // Or create a proper User interface
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    // Add type assertion to tell TypeScript about the payload structure
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload;

    // Now TypeScript knows decoded has displayName property
    req.user = decoded;

    next();
  } catch (err) {
    console.error('JWT verification failed:');
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }
};

export const authenticate = authenticateToken;
