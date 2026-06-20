import express from "express";
import { authMiddleware, UserRole } from "../../Middleware/authMiddleware.js";
import { ReactionController } from "./reaction.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware(
    UserRole.ADMIN,
    UserRole.MODERATOR,
    UserRole.SUPER_ADMIN,
    UserRole.USER,
  ),
  ReactionController.createReaction,
);

export const ReactionRoutes = router;
