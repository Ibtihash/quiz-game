// server/server.js
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import routes
import authRoutes from './routes/auth.js';
import questionsRoute from './routes/questions.js';
import wordleScoresRoute from './routes/wordleScores.js';
import quizScoresRoute from './routes/quizScores.js';
import crosswordScoresRoute from './routes/crosswordScores.js';
import snakeScoresRoute from './routes/snakeScores.js';
import hangmanScoresRoute from './routes/hangmanScores.js';

// ...

// Setup
const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
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

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-game';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

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

startServer(currentPort);
