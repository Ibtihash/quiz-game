console.log('---- server.js reloaded ----');
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
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 4000;
let currentPort = DEFAULT_PORT;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });
}

// Connect to DB, then start server
connectDB()
  .then(() => {
    startServer(currentPort);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });