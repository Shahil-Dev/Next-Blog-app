import { Router } from "express";
import { PostController } from "./post.controller";
import { authMiddleware, UserRole } from "../../Middleware/authMiddleware";

const router = Router();

router.get("/", PostController.getAllPosts);
router.get(
  "/getStats",
  authMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  PostController.getState,
);
router.get(
  "/my-post",
  authMiddleware(
    UserRole.USER,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
  ),
  PostController.getMyPost,
);
router.get("/:id", PostController.getPostById);

router.post(
  "/",
  authMiddleware(
    UserRole.USER,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
  ),
  PostController.createPost,
);

router.patch(
  "/:postId",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  PostController.updatePost,
);

router.delete(
  "/:postId",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  PostController.deletedPost,
);

export const PostRoutes = router;
