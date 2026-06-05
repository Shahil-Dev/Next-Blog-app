import { Router } from "express";
import { PostController } from "./post.controller";
import { authMiddleware, UserRole } from "../../Middleware/authMiddleware";

const router = Router();

router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getPostById);
router.post("/", authMiddleware(UserRole.USER), PostController.createPost);

export const PostRoutes = router;
