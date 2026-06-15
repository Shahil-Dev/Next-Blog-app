import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth.js";

export enum UserRole {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        role: string;
      };
    }
  }
}

const authMiddleware = (...role: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
   
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session || !session.user) {
      return res.status(401).json({ message: "You are not authorized" });
    }
    if (!session.user.emailVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email to access this resource" });
    }
    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
      role: session.user.role as string,
    };

    if (role.length > 0 && !role.includes(req.user.role as UserRole)) {
      return res.status(403).json({ message: "You do not have permission" });
    }
    next();
  };
};


export { authMiddleware };