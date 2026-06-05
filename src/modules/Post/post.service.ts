import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "authorId" | "createdAt" | "updated">,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPosts = async ({
  search,
  tags,
  isFeatured,
  authorId,
  page,
  limit,
  skip,
  SortBy,
  SortOrder
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  SortBy?: string | undefined;
  SortOrder?: string | undefined;
}) => {
  const andConditions: PostWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: { has: search as string },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({ isFeatured: isFeatured });
  }

  if (authorId) {
    andConditions.push({ authorId: authorId as string });
  }
   
  const result = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [SortBy || "createdAt"]: SortOrder === "asc" ? "asc" : "desc",
    }
  });

  return result;
};

export const PostService = {
  // Add service methods here
  createPost,
  getAllPosts,
};
