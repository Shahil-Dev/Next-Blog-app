import express from "express";
import { PostRoutes } from "./modules/Post/post.route";

const app = express();


app.use(express.json());

app.use("/posts",PostRoutes)


app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
