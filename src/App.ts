import express from "express";
import { PostRoutes } from "./modules/Post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
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

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
