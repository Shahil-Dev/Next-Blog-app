import { NextFunction, Request, Response } from "express";
import { PostService } from "./post.service";
import PaginationAndSortingHelper from "../../Helpers/PaginationAndSortingHelper";
import { UserRole } from "../../Middleware/authMiddleware";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }
    const result = await PostService.createPost(req.body, user.id as string);
    res
      .status(201)
      .json({
        success: true,
        message: "Post created successfully",
        data: result,
      });
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
          ? false
          : undefined
      : undefined;

    const authorId = req.query.authorId as string | undefined;

    const { page, limit, skip, SortBy, SortOrder } = PaginationAndSortingHelper(
      req.query,
    );

    const result = await PostService.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
      authorId,
      page,
      limit,
      skip,
      SortBy,
      SortOrder,
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Posts fetched successfully",
        ...result,
      });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Post ID is required" });
    }
    const result = await PostService.geAllPostByID(id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { postId } = req.params;

    if (!user || !user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please log in." });
    }

    const result = await PostService.updatePost(
      postId as string,
      req.body,
      user.id as string,
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Post updated successfully",
        data: result,
      });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deletedPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { postId } = req.params;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const isAdmin = user.role === UserRole.ADMIN;
    const result = await PostService.deletedPost(
      postId as string,
      user.id as string,
      isAdmin,
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Post deleted successfully",
        data: result,
      });
  } catch (error: any) {
    res.status(403).json({
      success: false,
      message: error.message || "Failed to delete post",
    });
  }
};

const getMyPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
    }
    const result = await PostService.getMyPost(user.id);
    res
      .status(200)
      .json({
        success: true,
        message: "Your posts fetched successfully",
        ...result,
      });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your posts",
      error: error.message,
    });
  }
};

const getState = async (req: Request, res: Response) => {
  try {
    const result = await PostService.getState();
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

export const PostController = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletedPost,
  getMyPost,
  getState,
};
