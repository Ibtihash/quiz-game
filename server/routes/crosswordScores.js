import { Router } from 'express';
import CrosswordScore from '../models/CrosswordScore.js';

const router = Router();

// POST /api/crossword-scores { username, score, timeTaken, difficulty }
router.post('/', async (req, res) => {
  console.log('Received POST request to /api/crossword-scores');
  console.log('Request body:', req.body);
  try {
    const { username, score, timeTaken, difficulty } = req.body;
    if (!username || score == null || timeTaken == null || !difficulty) {
      console.log('Validation failed: username, score, timeTaken, or difficulty missing.');
      return res.status(400).json({ error: 'username, score, timeTaken, and difficulty are required' });
    }

    const doc = await CrosswordScore.create({ username, score, timeTaken, difficulty });
    console.log('Crossword score saved successfully:', doc);
    res.status(201).json(doc);
  } catch (err) {
    console.error('Error saving crossword score:', err);
    res.status(500).json({ error: 'Failed to save crossword score' });
  }
});

// GET /api/crossword-scores/top?limit=20
router.get('/top', async (req, res) => {
  console.log('Received GET request to /api/crossword-scores/top');
  console.log('Request query:', req.query);
  try {
    const { limit = 20 } = req.query;
    const docs = await CrosswordScore.find({}).sort({ score: -1, timeTaken: 1, createdAt: 1 }).limit(Number(limit));
    console.log('Fetched top crossword scores:', docs.length);
    res.json(docs);
  } catch (err) {
    console.error('Error fetching crossword leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch crossword leaderboard' });
  }
});

export default router;