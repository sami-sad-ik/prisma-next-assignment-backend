import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "STUDENT" | "TUTOR" | "ADMIN";
      };
    }
  }
}

const authMiddleware = (...roles: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session)
        return res.status(401).json({
          success: false,
          message: "Unauthorized access!",
        });

      req.user = {
        id: session?.user.id,
        email: session.user.email,
        role: session.user.role as any,
      };
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Internal server error during authentication.",
      });
    }
  };
};

export default authMiddleware;
