import express from "express";
import { authMiddleware, UserRole } from "../../Middleware/authMiddleware.js";
import { FriendRequestController } from "./friendRequest.controller.js";


const router = express.Router();

router.use(authMiddleware(UserRole.USER, UserRole.ADMIN));



router.post("/send", FriendRequestController.sendRequest);
router.patch("/accept/:requestId", FriendRequestController.acceptRequest);
router.patch("/reject/:requestId", FriendRequestController.rejectRequest);
router.delete("/cancel/:requestId", FriendRequestController.cancelRequest);
router.delete("/unfriend", FriendRequestController.unfriend);



export const FriendRequestRoutes = router;
