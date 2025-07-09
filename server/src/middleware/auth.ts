import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User, IUser } from '../models/User';

interface JwtUserPayload extends JwtPayload {
  id: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  console.log("protect middleware: Checking token...");
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.log("protect middleware: No token provided.");
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtUserPayload;
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("protect middleware: User not found for token.");
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    console.log("protect middleware: Token authenticated. User:", user);
    next();
    return;
  } catch (error) {
    console.log("protect middleware: Token verification failed.", error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("authorize middleware: Checking user role...");
    if (req.user && roles.includes(req.user.role)) {
      console.log("authorize middleware: User has required role.");
      next();
      return;
    } else {
      console.log("authorize middleware: User does not have required role or no user info.", req.user);
      res.status(403).json({ message: 'Access denied. Insufficient role.' });
    }
  };
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Bạn không có quyền truy cập.' });
}; 