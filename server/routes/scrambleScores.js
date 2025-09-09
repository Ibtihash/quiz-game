import { Router } from 'express';
import ScrambleScore from '../models/ScrambleScore.js';

const router = Router();

// POST /api/scramble-scores
router.post('/', async (req, res) => {
  try {
    const { username, score, time, word, outcome } = req.body;
    if (!username || score == null || time == null || !word || !outcome) {
      return res.status(400).json({ error: 'username, score, time, word, and outcome are required' });
    }

    const doc = await ScrambleScore.create({ username, score, time, word, outcome });
    res.status(201).json(doc);
  } catch (err) {
    console.error('Error saving scramble score:', err);
    res.status(500).json({ error: 'Failed to save scramble score' });
  }
});

// GET /api/scramble-scores/top?limit=20
router.get('/top', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const docs = await ScrambleScore.find({})
      .sort({ score: -1, time: 1, createdAt: 1 })
      .limit(Number(limit));

    res.json(docs);
  } catch (err) {
    console.error('Error fetching scramble leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch scramble leaderboard' });
  }
});

export default router;
