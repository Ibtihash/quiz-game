import { Router } from 'express';
import HangmanScore from '../models/HangmanScore.js';

const router = Router();

// POST /api/hangman-scores { username, wrongGuesses, word, outcome }
router.post('/', async (req, res) => {
  console.log('Received POST request to /api/hangman-scores');
  console.log('Request body:', req.body);
  try {
    const { username, wrongGuesses, word, outcome } = req.body;
    if (!username || wrongGuesses == null || !word || !outcome) {
      console.log('Validation failed: username, wrongGuesses, word, or outcome missing.');
      return res.status(400).json({ error: 'username, wrongGuesses, word, and outcome are required' });
    }
    console.log('Validation passed. Data:', { username, wrongGuesses, word, outcome });

    

    const doc = await HangmanScore.create({ username, wrongGuesses, word, outcome });
    console.log('Hangman score saved successfully:', doc);
    res.status(201).json(doc);
  } catch (err) {
    console.error('Error saving hangman score:', err);
    res.status(500).json({ error: 'Failed to save hangman score' });
  }
});

// GET /api/hangman-scores/top?limit=20
router.get('/top', async (req, res) => {
  console.log('Received GET request to /api/hangman-scores/top');
  console.log('Request query:', req.query);
  try {
    const { limit = 20 } = req.query;
    // Sort by wrongGuesses ascending (lower is better), then by createdAt ascending
    const docs = await HangmanScore.find({}).sort({ wrongGuesses: 1, createdAt: 1 }).limit(Number(limit));
    console.log('Fetched top hangman scores:', docs.length);
    res.json(docs);
  } catch (err) {
    console.error('Error fetching hangman leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch hangman leaderboard' });
  }
});

export default router;
