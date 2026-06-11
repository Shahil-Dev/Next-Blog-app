import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  userId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    prisma.comment.findUnique({
      where: {
        id: payload.parentId,
      },
    });
  }

  return await prisma.comment.create({
    data: payload,
  });
};

const getCommentById = async (commentId: string) => {
  return await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};



const deletedComment = async (commentId: string, userId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      userId,
    },
    select: {
      id: true,
    },
  });


  if (!commentData) {
    throw new Error("Comment not found or you are not authorized to delete this comment");
  }

  return await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
};

const updateComment = async (
  commentId: string,
  data: { content?: string; status?: CommentStatus },
  userId: string,
) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      userId,
    },
    select: {
      id: true,
    },
  });

 
  if (!commentData) {
    throw new Error("Comment not found or you are not authorized to update this comment");
  }

  return await prisma.comment.update({
    where: {
      id: commentId, 
    },
    data,
  });
};


export const CommentService = {
  createComment,
  getCommentById,
  deletedComment,
  updateComment,
};
