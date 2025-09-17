// server/server.js
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import DB connection
import { connectDB } from './db.js';

// Import routes
import authRoutes from './routes/auth.js';
import questionsRoute from './routes/questions.js';
import wordleScoresRoute from './routes/wordleScores.js';
import quizScoresRoute from './routes/quizScores.js';
import crosswordScoresRoute from './routes/crosswordScores.js';
import snakeScoresRoute from './routes/snakeScores.js';
import hangmanScoresRoute from './routes/hangmanScores.js';
import scrambleScoresRoute from './routes/scrambleScores.js';
import game2048ScoresRoute from './routes/game2048Scores.js'; // Added for Game2048

// Import models (if needed)
import Game2048Score from './models/Game2048Score.js';

// Setup
const app = express();

// ✅ Fix: Proper CORS fallback
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : '*';

app.use(cors({ origin: allowedOrigins }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionsRoute);
app.use('/api/wordle-scores', wordleScoresRoute);
app.use('/api/quiz-scores', quizScoresRoute);
app.use('/api/crossword-scores', crosswordScoresRoute);
app.use('/api/snake-scores', snakeScoresRoute);
app.use('/api/hangman-scores', hangmanScoresRoute);
console.log('Scramble scores route loaded');
app.use('/api/scramble-scores', scrambleScoresRoute);
app.use('/api/game2048-scores', game2048ScoresRoute);

// Test route
app.get('/api/testing123', async (req, res) => {
  res.json({ message: 'Game2048 testing route working!' });
});

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server with port fallback
// Connect to DB (Vercel will handle server startup)
connectDB()
  .then(() => {
    console.log('✅ MongoDB connected successfully.');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

export default app;

const PORT = process.env.PORT || 4000;

// Only start listening if the file is run directly
if (process.env.NODE_ENV !== 'test') { // Avoid EADDRINUSE error during tests
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
}
