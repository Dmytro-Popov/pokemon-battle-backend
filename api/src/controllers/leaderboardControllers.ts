import { RequestHandler } from "express";
import Score from "../models/Score";

export const getLeaderboard: RequestHandler = async (_req, res) => {
  const scores = await Score.find().sort({ points: -1 }).limit(50);
  res.json(scores.map((s) => ({ id: s._id, name: s.username, points: s.points })));
};

export const updateLeaderboard: RequestHandler = async (req, res) => {
//   const name = String(req.body.name ?? "").trim();
  const points = Number(req.body.points);

//   if (!name) return res.status(400).json({ message: "Name is required." });
  if (!Number.isFinite(points) || points <= 0) {
    return res
      .status(400)
      .json({ message: "Points must be a positive number." });
  }

  const score = await Score.findOneAndUpdate(
    { userId: req.user!.id },
    {
      $inc: { points },
      $set: { username: req.user!.username, date: new Date() },
    },
    { upsert: true, new: true },
  );
  res
    .status(201)
    .json({ id: score._id, name: score.username, points: score.points });
};
