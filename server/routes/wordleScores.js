import { Router } from "express";
import WordleScore from "../models/WordleScore.js";

const router = Router();

// Helper: map guesses taken → score
function calculateWordleScore(guessesTaken) {
  switch (guessesTaken) {
    case 1: return 50;
    case 2: return 25;
    case 3: return 12;
    case 4: return 6;
    case 5: return 3;
    case 6: return 1;
    default: return 0;
  }
}

// POST /api/wordle-scores { username, guessesTaken }
router.post("/", async (req, res) => {
  try {
    const { username, guessesTaken } = req.body;
    if (!username || !guessesTaken) {
      return res.status(400).json({ error: "username and guessesTaken are required" });
    }

    const score = calculateWordleScore(Number(guessesTaken));
    const doc = await WordleScore.create({ username, guessesTaken, score });
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save Wordle score" });
  }
});

// GET /api/wordle-scores/top?limit=20
router.get("/top", async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const docs = await WordleScore.find({})
      .sort({ score: -1, createdAt: 1 })
      .limit(Number(limit));
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Wordle leaderboard" });
  }
});

export default router;
