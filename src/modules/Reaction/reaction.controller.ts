import { Request, Response } from "express";
import { ReactionService } from "./reaction.service";

const createReaction = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.userId = user?.id;
    const result = await ReactionService.createReact(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to Reaction" });
  }
};

export const ReactionController = {
  createReaction,
};
