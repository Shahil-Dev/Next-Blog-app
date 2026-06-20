import { prisma } from "../../lib/prisma.js";

const sendFriendRequest = async (senderId: string, receiverId: string) => {
  if (senderId === receiverId) {
    throw new Error("You cannot send a friend request to yourself");
  }

  const receiverExists = await prisma.user.findUnique({
    where: { id: receiverId },
  });
  if (!receiverExists) {
    throw new Error("User not found");
  }

  const existingRequest = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
  });

  if (existingRequest) {
    if (existingRequest.status === "ACCEPTED") {
      throw new Error("You are already friends with this user");
    }
    if (existingRequest.status === "PENDING") {
      throw new Error("A friend request is already pending between you two");
    }
    if (existingRequest.status === "REJECTED") {
      return await prisma.friendRequest.update({
        where: { id: existingRequest.id },
        data: { senderId, receiverId, status: "PENDING" },
      });
    }
  }

  return await prisma.friendRequest.create({
    data: {
      senderId,
      receiverId,
      status: "PENDING",
    },
  });
};

const acceptFriendRequest = async (userId: string, requestId: string) => {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) throw new Error("Friend request not found");

  if (request.receiverId !== userId) {
    throw new Error("You are not authorized to accept this request");
  }

  if (request.status === "ACCEPTED") {
    throw new Error("You are already friends");
  }

  return await prisma.friendRequest.update({
    where: { id: requestId },
    data: { status: "ACCEPTED" },
  });
};

const rejectFriendRequest = async (userId: string, requestId: string) => {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) throw new Error("Friend request not found");
  if (request.receiverId !== userId) {
    throw new Error("You are not authorized to reject this request");
  }

  return await prisma.friendRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED" },
  });
};

const cancelFriendRequest = async (userId: string, requestId: string) => {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) throw new Error("Friend request not found");
  if (request.senderId !== userId) {
    throw new Error("You can only cancel requests sent by you");
  }
  if (request.status !== "PENDING") {
    throw new Error("You can only cancel pending requests");
  }

  return await prisma.friendRequest.delete({
    where: { id: requestId },
  });
};

const unfriendUser = async (userId: string, targetUserId: string) => {
  const friendship = await prisma.friendRequest.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { senderId: userId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: userId },
      ],
    },
  });

  if (!friendship) {
    throw new Error("You are not friends with this user");
  }

  await prisma.friendRequest.delete({
    where: { id: friendship.id },
  });

  return { message: "Unfriended successfully" };
};

const getMyFriends = async (userId: string) => {
  const friendships = await prisma.friendRequest.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: {
        select: { id: true, name: true, image: true, email: true },
      },
      receiver: {
        select: { id: true, name: true, image: true, email: true },
      },
    },
  });

  const friendList = friendships.map((friendship) => {
    if (friendship.senderId === userId) {
      return friendship.receiver;
    } else {
      return friendship.sender;
    }
  });

  return friendList;
};

const getPendingRequests = async (userId: string) => {
  const pendingRequests = await prisma.friendRequest.findMany({
    where: {
      receiverId: userId,
      status: "PENDING",
    },
    include: {
      sender: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  return pendingRequests;
};

export const FriendRequestService = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  unfriendUser,
  getMyFriends,
  getPendingRequests,
};
