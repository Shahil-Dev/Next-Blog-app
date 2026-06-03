import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./post.controller";
import { auth } from "../../lib/auth";

const router = express.Router();

const authMiddleware = (...role: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession(
        { headers: req.headers as any }
    );
    console.log(session)
  };
};

router.post("/", authMiddleware("Admin"), PostController.createPost);

export const PostRoutes = router;
