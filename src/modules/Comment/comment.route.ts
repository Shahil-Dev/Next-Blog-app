import express from "express";
import { CommentController } from "./comment.controller";
import { authMiddleware, UserRole } from "../../Middleware/authMiddleware";

const router = express.Router();
router.use("/", authMiddleware(UserRole.ADMIN,UserRole.MODERATOR,UserRole.SUPER_ADMIN,UserRole.USER),
    CommentController.createComment);
export const CommentRoutes = router;
