import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

interface TokenPayload extends JwtPayload {
  userId: string;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as TokenPayload;

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.'
      });
    }

    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};
