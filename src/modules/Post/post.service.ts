import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updated">) => {
  const result = await prisma.post.create({
    data,
  });
  return result;
};

export const PostService = {
  // Add service methods here
    createPost,
};
