
import { CommentStatus } from "../../generated/prisma";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  userId: string;
  postId: string;
  parentId?: string;
}) => {
  const postExists = await prisma.post.findUnique({
    where: { id: payload.postId },
  });

  if (!postExists) {
    throw new Error("Target post not found to comment on");
  }

  if (payload.parentId) {
    const parentCommentExists = await prisma.comment.findUnique({
      where: { id: payload.parentId },
    });
    if (!parentCommentExists) {
      throw new Error("Parent comment not found to reply on");
    }
  }

  return await prisma.comment.create({
    data: payload,
  });
};

const getCommentById = async (commentId: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!comment) {
    throw new Error("Comment not found with the provided ID");
  }

  return comment;
};

const deletedComment = async (commentId: string, userId: string) => {
  const commentData = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, userId: true },
  });

  if (!commentData) {
    throw new Error("Comment not found");
  }

  if (commentData.userId !== userId) {
    throw new Error("You are not authorized to delete this comment");
  }

  return await prisma.comment.delete({
    where: { id: commentId },
  });
};

const updateComment = async (
  commentId: string,
  data: { content?: string; status?: CommentStatus },
  userId: string,
) => {
  const commentData = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, userId: true },
  });

  if (!commentData) {
    throw new Error("Comment not found");
  }

  if (commentData.userId !== userId) {
    throw new Error("You are not authorized to update this comment");
  }

  return await prisma.comment.update({
    where: { id: commentId },
    data,
  });
};

const moderatedComment = async (
  id: string,
  data: { status: CommentStatus },
) => {
  const commentData = await prisma.comment.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!commentData) {
    throw new Error("Comment not found for moderation");
  }

  if (commentData.status === data.status) {
    throw new Error(`Comment status is already ${data.status}`);
  }

  return prisma.comment.update({
    where: { id },
    data,
  });
};

export const CommentService = {
  createComment,
  getCommentById,
  deletedComment,
  updateComment,
  moderatedComment,
};
