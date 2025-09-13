import { Router } from 'express';
import Game2048Score from '../models/Game2048Score.js';

console.log('game2048Scores.js router loaded');

const router = Router();

// POST /api/game2048-scores { username, score }
router.post('/', async (req, res) => {
  console.log('Received POST request to /api/game2048-scores');
  console.log('Request body:', req.body);
  try {
    const { username, score } = req.body;
    if (!username || score == null) {
      console.log('Validation failed: username or score missing.');
      return res.status(400).json({ error: 'username and score are required' });
    }
    console.log('Validation passed. Data:', { username, score });
    const doc = await Game2048Score.create({ username, score });
    console.log('Game2048 score saved successfully:', doc);
    res.status(201).json(doc);
  } catch (err) {
    console.error('Error saving Game2048 score:', err);
    res.status(500).json({ error: 'Failed to save Game2048 score' });
  }
});

// GET /api/game2048-scores/top?limit=10
router.get('/top', async (req, res) => {
  console.log('Received GET request to /api/game2048-scores/top');
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const topScores = await Game2048Score.find()
      .sort({ score: -1 })
      .limit(limit);
    res.json(topScores);
  } catch (err) {
    console.error('Error fetching top Game2048 scores:', err);
    res.status(500).json({ error: 'Failed to fetch top scores' });
  }
});

export default router;