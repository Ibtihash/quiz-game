// server/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';


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
import riddlesScoresRoute from './routes/riddlesScores.js';

// Import models (if needed)
import Game2048Score from './models/Game2048Score.js';

// Setup
const app = express();

const allowedOrigins = [
  ...(process.env.CORS_ORIGIN || '').split(','),
  'https://thinkandplay.vercel.app',
  'http://localhost:5173',
]
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  optionsSuccessStatus: 204,
};

const __dirname = path.resolve();

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Keep the health check independent from the database connection.
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database unavailable:', err.message);
    res.status(503).json({ message: 'Database unavailable' });
  }
});

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
app.use('/api/riddles-scores', riddlesScoresRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}

// Test route
app.get('/api/testing123', async (req, res) => {
  res.json({ message: 'Game2048 testing route working!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server with port fallback
export default app;

const PORT = process.env.PORT || 4000;

// Only start listening if the file is run directly
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
}
