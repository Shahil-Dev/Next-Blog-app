import { Request, Response } from "express";
import { PostService } from "./post.service";
import PaginationAndSortingHelper from "../../Helpers/PaginationAndSortingHelper";

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
    console.log(req.query);
    console.log(PaginationAndSortingHelper(req.query));
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

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get posts",
      error,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  if (!id) {
    throw new Error("Post id required");
  }
  try {
    const result = await PostService.geAllPostByID(id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Failed to get posts" });
  }
};


const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { postId } = req.params;

   
    // console.log("Updating Comment:", { commentId, userId: user?.id, body: req.body });

    if (!user || !user.id) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const result = await PostService.updatePost(
     postId as string,
      req.body,
      user.id as string,
    );
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in update post controller:", error);

  
    const errorMessage = error instanceof Error ? error.message : "Failed to update post";
    res.status(400).json({ error: errorMessage });
  }
};



const deletedPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { postId } = req.params;
    const result = await PostService.deletedPost(
      postId as string,
      user?.id as string,
    );
    res.status(200).json(result);
  } catch (error: any) {
  res.status(500).json({ 
    error: "Failed to delete Post", 
    message: error.message
  });
}
};

export const PostController = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletedPost,
};
