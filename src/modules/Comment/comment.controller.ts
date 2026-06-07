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

const getCommentById = async (req:Request,res:Response)=>{
   try {
    const {commentId} = req.params;
    const result = await CommentService.getCommentById(commentId as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Comment" });
  }
}



export const CommentController = {
  createComment,
  getCommentById
};
