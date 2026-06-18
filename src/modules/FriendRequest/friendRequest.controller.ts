import { Request, Response } from "express";
import { FriendRequestService } from "./friendRequest.service";

const sendRequest = async (req: Request, res: Response) => {
  try {
    const { receiverId } = req.body;
    const result = await FriendRequestService.sendFriendRequest(
      req.user?.id as string,
      receiverId,
    );
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const acceptRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const result = await FriendRequestService.acceptFriendRequest(
      req.user?.id as string,
      requestId as string,
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Friend request accepted",
        data: result,
      });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const rejectRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const result = await FriendRequestService.rejectFriendRequest(
      req.user?.id as string,
      requestId as string,
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Friend request rejected",
        data: result,
      });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const cancelRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const result = await FriendRequestService.cancelFriendRequest(
      req.user?.id as string,
      requestId as string,
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Friend request cancelled",
        data: result,
      });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const unfriend = async (req: Request, res: Response) => {
  try {
    const { targetUserId } = req.body;
    const result = await FriendRequestService.unfriendUser(
      req.user?.id as string,
      targetUserId,
    );
    res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getMyFriends = async (req: Request, res: Response) => {
  try {
    const result = await FriendRequestService.getMyFriends(req.user?.id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getPendingRequests = async (req: Request, res: Response) => {
  try {
    const result = await FriendRequestService.getPendingRequests(req.user?.id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};




export const FriendRequestController = {
  sendRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  unfriend,
   getMyFriends,
  getPendingRequests
};
