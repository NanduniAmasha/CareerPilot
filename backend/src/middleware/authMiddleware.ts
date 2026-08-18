import {
  Request,
  Response,
  NextFunction
} from "express";

import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization token required"
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format"
      });
    }

    const token = authHeader.substring(7);

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is missing");
      return res.status(500).json({
        message: "JWT configuration error"
      });
    }

    const decoded = jwt.verify(
      token,
      secret
    ) as {
      userId: number;
      email: string;
    };

    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    next();

  } catch (error) {
    console.error("JWT ERROR:", error);

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};