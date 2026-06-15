import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { PostRoutes } from "./modules/Post/post.route.js";
import { CommentRoutes } from "./modules/Comment/comment.route.js";
import { ReactionRoutes } from "./modules/Reaction/reaction.route.js";
import { FriendRequestRoutes } from "./modules/FriendRequest/friendRequest.route.js";
import { notFound } from "./Middleware/notFound.js";
import globalErrorHandler from "./Middleware/globalErrorHandler.js";


const app = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
  }),
);
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/posts", PostRoutes);
app.use("/comments", CommentRoutes);
app.use("/reacts", ReactionRoutes);
app.use("/friends", FriendRequestRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World! Backend Server is running successfully.");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
