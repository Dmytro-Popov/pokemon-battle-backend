import { Router } from "express";
import { requireAccessToken } from "../middleware/requireAccessToken";
import {
  getLeaderboard,
  updateLeaderboard,
} from "../controllers/leaderboardControllers";

const router = Router();

router.get("/", getLeaderboard);

router.post("/", requireAccessToken, updateLeaderboard);

export default router;
