import { Router } from 'express';
import QuizScore from '../models/QuizScore.js';

const router = Router();

// POST /api/quiz-scores { username, score, total }
router.post('/', async (req, res) => {
  console.log('Received POST request to /api/quiz-scores');
  console.log('Request body:', req.body);
  try {
    const { username, score, total } = req.body;
    if (!username || score == null || !total) {
      console.log('Validation failed: username, score, or total missing.');
      return res.status(400).json({ error: 'username, score, and total are required' });
    }
    console.log('Validation passed. Data:', { username, score, total });
    const accuracy = Number(((score / total) * 100).toFixed(2));
    console.log('Calculated accuracy:', accuracy);
    const doc = await QuizScore.create({ username, score, total, accuracy });
    console.log('Quiz score saved successfully:', doc);
    res.status(201).json(doc);
  } catch (err) {
    console.error('Error saving quiz score:', err);
    res.status(500).json({ error: 'Failed to save quiz score' });
  }
});

// GET /api/quiz-scores/top?limit=20
router.get('/top', async (req, res) => {
  console.log('Received GET request to /api/quiz-scores/top');
  console.log('Request query:', req.query);
  try {
    const { limit = 20 } = req.query;
    const docs = await QuizScore.find({}).sort({ score: -1, createdAt: 1 }).limit(Number(limit));
    console.log('Fetched top quiz scores:', docs.length);
    res.json(docs);
  } catch (err) {
    console.error('Error fetching quiz leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch quiz leaderboard' });
  }
});

export default router;