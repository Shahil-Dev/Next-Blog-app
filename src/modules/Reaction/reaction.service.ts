import { prisma } from "../../lib/prisma.js";

const createReact = async (payload: {
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

export const ReactionService = {
  // Add service methods here
  createReact,
};
