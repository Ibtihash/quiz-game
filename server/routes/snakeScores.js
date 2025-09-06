import { Router } from 'express';
import SnakeScore from '../models/SnakeScore.js';

const router = Router();

// POST /api/snake-scores { username, score }
router.post('/', async (req, res) => {
  console.log('Received POST request to /api/snake-scores');
  console.log('Request body:', req.body);
  try {
    const { username, score } = req.body;
    if (!username || score == null) {
      console.log('Validation failed: username or score missing.');
      return res.status(400).json({ error: 'username and score are required' });
    }
    console.log('Validation passed. Data:', { username, score });
    const doc = await SnakeScore.create({ username, score });
    console.log('Snake score saved successfully:', doc);
    res.status(201).json(doc);
  } catch (err) {
    console.error('Error saving snake score:', err);
    res.status(500).json({ error: 'Failed to save snake score' });
  }
});

// GET /api/snake-scores/top?limit=20
router.get('/top', async (req, res) => {
  console.log('Received GET request to /api/snake-scores/top');
  console.log('Request query:', req.query);
  try {
    const { limit = 20 } = req.query;
    const docs = await SnakeScore.find({}).sort({ score: -1, createdAt: 1 }).limit(Number(limit));
    console.log('Fetched top snake scores:', docs.length);
    res.json(docs);
  } catch (err) {
    console.error('Error fetching snake leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch snake leaderboard' });
  }
});

export default router;