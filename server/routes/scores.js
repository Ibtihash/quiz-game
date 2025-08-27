import { Router } from 'express';
import Score from '../models/Score.js';


const router = Router();


// POST /api/scores { username, score, total }
router.post('/', async (req, res) => {
try {
const { username, score, total } = req.body;
if (!username || score == null || !total) {
return res.status(400).json({ error: 'username, score, and total are required' });
}
const accuracy = Number(((score / total) * 100).toFixed(2));
const doc = await Score.create({ username, score, total, accuracy });
res.status(201).json(doc);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Failed to save score' });
}
});


// GET /api/scores/top?limit=20
router.get('/top', async (req, res) => {
try {
const { limit = 20 } = req.query;
const docs = await Score.find({}).sort({ score: -1, createdAt: 1 }).limit(Number(limit));
res.json(docs);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Failed to fetch leaderboard' });
}
});


export default router;