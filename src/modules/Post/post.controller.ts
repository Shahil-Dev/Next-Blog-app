import { Request, Response } from "express";
import { PostService } from "./post.service";
import { boolean } from "better-auth";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "You are not authorized" });
    }
    const result = await PostService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    //isFeatured query param can be "true", "false" or undefined
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"?true
      : req.query.isFeatured === "false"?false: undefined
      :  undefined;

    console.log({isFeatured});


    //authorId query param can be a string or undefined
    const authorId = req.query.authorId as string | undefined;

    const result = await PostService.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
      authorId
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to get posts" });
  }
};

export const PostController = {
  createPost,
  getAllPosts,
};
