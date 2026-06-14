import express from "express";
import { PostRoutes } from "./modules/Post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { CommentRoutes } from "./modules/Comment/comment.route";
import { ReactionRoutes } from "./modules/Reaction/reaction.route";
import globalErrorHandler from "./Middleware/globalErrorHandler";
// import { FriendRequestRoutes } from "./modules/FriendRequest/friendRequest.route";
const app = express();

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/posts", PostRoutes);
app.use("/comments", CommentRoutes);
app.use("/reacts", ReactionRoutes);
// app.use("/friends", FriendRequestRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
 
app.use(globalErrorHandler)
 
export default app;
