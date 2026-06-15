import { Request, Response } from "express";
import { CommentService } from "./comment.service.js";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    req.body.userId = user.id;
    const result = await CommentService.createComment(req.body);

    res.status(201).json({
      success: true,
      message: "Comment posted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create comment",
    });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    if (!commentId) {
      return res
        .status(400)
        .json({ success: false, message: "Comment ID is required" });
    }

    const result = await CommentService.getCommentById(commentId as string);
    res.status(200).json({
      success: true,
      message: "Comment fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Failed to fetch comment",
    });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;

    if (!user || !user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please log in." });
    }

    const result = await CommentService.updateComment(
      commentId as string,
      req.body,
      user.id as string,
    );

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update comment",
    });
  }
};

const deletedComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;

    if (!user || !user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please log in." });
    }

    const result = await CommentService.deletedComment(
      commentId as string,
      user.id as string,
    );

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(403).json({
      success: false,
      message: error.message || "Failed to delete comment",
    });
  }
};

const moderatedComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    if (!commentId) {
      return res
        .status(400)
        .json({ success: false, message: "Comment ID is required" });
    }

    const result = await CommentService.moderatedComment(
      commentId as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Comment status moderated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to moderate comment",
    });
  }
};

export const CommentController = {
  createComment,
  getCommentById,
  deletedComment,
  updateComment,
  moderatedComment,
};
