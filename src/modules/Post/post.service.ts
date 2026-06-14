import { Prisma, Post, CommentStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../Middleware/authMiddleware";

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
    }, //  as Prisma.PostOrderByWithRelationInput,
    include: {
      _count: {
        select: { comments: true },
      },
    },
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

    include: {
      comments: {
        where: {
          parentId: null,
          status: CommentStatus.APPROVED,
        },
        orderBy: { createdAt: "desc" },
        include: {
          replies: {
            where: { status: CommentStatus.APPROVED },
          },
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });
  return result;
};

const updatePost = async (
  postId: string,
  data: { title?: string; content?: string; tags: string[] },
  authorId: string,
) => {
  const postData = await prisma.post.findFirst({
    where: {
      id: postId,
      authorId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (postData?.authorId !== authorId) {
  }

  if (!postData) {
    throw new Error(
      "Post not found or you are not authorized to update this post",
    );
  }

  return await prisma.post.update({
    where: {
      id: postId,
    },
    data,
  });
};

const deletedPost = async (
  postId: string,
  userId: string,
  isAdmin: boolean,
) => {
  const postData = await prisma.post.findFirstOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!isAdmin && postData?.authorId !== authorId) {
    throw new Error("You are not owner or creator of the post ");
  }

  if (!postData) {
    throw new Error(
      "Post not found or you are not authorized to delete this post",
    );
  }

  return await prisma.post.delete({
    where: {
      id: postData.id,
    },
  });
};

const getMyPost = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  const total = await prisma.post.count({
    where: {
      authorId,
    },
  });
  return {
    data: {
      result,
    },
    total,
  };
};

const getState = async () => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalPost,
      totalComments,
      ApprovedComment,
      RejectedComment,
      totalUser,
      AdminCount,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECTED,
        },
      }),
      await tx.user.count(),
      await tx.user.count({
        where:{
            role:UserRole.ADMIN
        }
      })
    ]);
    return {
      totalPost,
      totalComments,
      ApprovedComment,
      RejectedComment,
      totalUser,
      AdminCount
    };
  });
};

export const PostService = {
  createPost,
  getAllPosts,
  geAllPostByID,
  updatePost,
  getMyPost,
  deletedPost,
  getState,
};


 