import { Prisma, Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "authorId" | "createdAt" | "updatedAt">,
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
  SortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  SortBy: string;
  SortOrder: string;
}) => {
  const andConditions: Prisma.PostWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: { has: search },
        },
      ],
    });
  }

  if (tags && tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags,
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({ isFeatured: isFeatured });
  }

  if (authorId) {
    andConditions.push({ authorId: authorId });
  }

  const whereConditions: Prisma.PostWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.post.findMany({
    take: limit,
    skip,
    where: whereConditions,
    orderBy: {
      [SortBy]: SortOrder,
    } as Prisma.PostOrderByWithRelationInput,
  });

  const count = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: result,
    pagination: {
      count,
      page,
      limit,
      totalPageLimit: Math.ceil(count / limit),
    },
  };
};

const geAllPostByID = async (id: string) => {
  const result = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};

export const PostService = {
  createPost,
  getAllPosts,
  geAllPostByID,
};
