import express from "express";
import { CommentController } from "./comment.controller.js";
import { authMiddleware, UserRole } from "../../Middleware/authMiddleware.js";

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

router.delete(
  "/:commentId",
  authMiddleware(
    UserRole.ADMIN,
    UserRole.MODERATOR,
    UserRole.SUPER_ADMIN,
    UserRole.USER,
  ),
  CommentController.deletedComment,
);
router.patch(
  "/:commentId",
  authMiddleware(UserRole.USER),
  CommentController.updateComment,
);

router.patch(
  "/:commentId/moderated",
  authMiddleware(UserRole.USER),
  CommentController.moderatedComment,
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
