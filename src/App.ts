import express from "express";
import { PostRoutes } from "./modules/Post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/posts", PostRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
