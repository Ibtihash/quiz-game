import { Router } from 'express';
import RiddlesScore from '../models/RiddlesScore.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { username, score, riddlesSolved } = req.body;
    if (!username || score == null || riddlesSolved == null) {
      return res.status(400).json({ error: 'username, score, and riddlesSolved are required' });
    }

    const doc = await RiddlesScore.create({ username, score, riddlesSolved });
    res.status(201).json(doc);
  } catch (err) {
    console.error('Error saving riddles score:', err);
    res.status(500).json({ error: 'Failed to save riddles score' });
  }
});

router.get('/top', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const docs = await RiddlesScore.find({})
      .sort({ score: -1, createdAt: 1 })
      .limit(limit);
    res.json(docs);
  } catch (err) {
    console.error('Error fetching riddles leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch riddles leaderboard' });
  }
});

export default router;
