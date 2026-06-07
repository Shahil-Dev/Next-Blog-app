import express from "express";
import { CommentController } from "./comment.controller";
import { authMiddleware, UserRole } from "../../Middleware/authMiddleware";

const router = express.Router();

router.get(
  "/:commentId",
  authMiddleware(
    UserRole.ADMIN,
    UserRole.MODERATOR,
    UserRole.SUPER_ADMIN,
    UserRole.USER,
  ),
  CommentController.getCommentById,
);

router.post(
  "/",
  authMiddleware(
    UserRole.ADMIN,
    UserRole.MODERATOR,
    UserRole.SUPER_ADMIN,
    UserRole.USER,
  ),
  CommentController.createComment,
);

export const CommentRoutes = router;
