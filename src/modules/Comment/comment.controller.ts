import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.userId = user?.id;
    const result = await CommentService.createComment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to Comment" });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await CommentService.getCommentById(commentId as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Comment" });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;

   
    // console.log("Updating Comment:", { commentId, userId: user?.id, body: req.body });

    if (!user || !user.id) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const result = await CommentService.updateComment(
      commentId as string,
      req.body,
      user.id as string,
    );
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateComment controller:", error);

  
    const errorMessage = error instanceof Error ? error.message : "Failed to update comment";
    res.status(400).json({ error: errorMessage });
  }
};

const deletedComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await CommentService.deletedComment(
      commentId as string,
      user?.id as string,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to deleted Comment" });
  }
};
const moderatedComment = async (req: Request, res: Response) => {
  try {
    // const user = req.user;
    const { commentId } = req.params;
    const result = await CommentService.moderatedComment(
      commentId as string,
       req.body
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to moderated Comment" });
  }
};




export const CommentController = {
  createComment,
  getCommentById,
  deletedComment,
  updateComment,
  moderatedComment
};
