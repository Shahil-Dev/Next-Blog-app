import { CommentStatus, Post, Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { UserRole } from "../../Middleware/authMiddleware.js";

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
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ],
    });
  }

  if (tags && tags.length > 0) {
    andConditions.push({ tags: { hasEvery: tags } });
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
    orderBy: { [SortBy]: SortOrder },
    include: {
      _count: { select: { comments: true } },
    },
  });

  const count = await prisma.post.count({ where: whereConditions });

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
    where: { id },
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
      _count: { select: { comments: true } },
    },
  });

  if (!result) {
    throw new Error("Post not found with the provided ID");
  }
  return result;
};

const updatePost = async (
  postId: string,
  data: { title?: string; content?: string; tags?: string[] },
  authorId: string,
) => {
  const postData = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!postData) {
    throw new Error("Post not found");
  }

  if (postData.authorId !== authorId) {
    throw new Error("You are not authorized to update this post");
  }

  return await prisma.post.update({
    where: { id: postId },
    data,
  });
};

const deletedPost = async (
  postId: string,
  userId: string,
  isAdmin: boolean,
) => {
  const postData = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!postData) {
    throw new Error("Post not found");
  }

  // Check if user is either Admin or the Owner of the post
  if (!isAdmin && postData.authorId !== userId) {
    throw new Error("You are not authorized to delete this post");
  }

  return await prisma.post.delete({
    where: { id: postId },
  });
};

const getMyPost = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: { authorId },
    include: {
      _count: { select: { comments: true } },
    },
  });

  const total = await prisma.post.count({ where: { authorId } });

  return {
    data: result,
    total,
  };
};

const getState = async () => {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const [
      totalPost,
      totalComments,
      ApprovedComment,
      RejectedComment,
      totalUser,
      AdminCount,
    ] = await Promise.all([
      tx.post.count(),
      tx.comment.count(),
      tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
      tx.comment.count({ where: { status: CommentStatus.REJECTED } }),
      tx.user.count(),
      tx.user.count({ where: { role: UserRole.ADMIN } }),
    ]);

    return {
      totalPost,
      totalComments,
      ApprovedComment,
      RejectedComment,
      totalUser,
      AdminCount,
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
