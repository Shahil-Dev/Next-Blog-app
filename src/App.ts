import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { PostRoutes } from "./modules/Post/post.route";
import { CommentRoutes } from "./modules/Comment/comment.route";
import { ReactionRoutes } from "./modules/Reaction/reaction.route";
import { FriendRequestRoutes } from "./modules/FriendRequest/friendRequest.route";
import globalErrorHandler from "./Middleware/globalErrorHandler";
import { notFound } from "./Middleware/notFound";

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
