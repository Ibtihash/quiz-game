import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './db.js';
import questionsRoute from './routes/questions.js';
import scoresRoute from './routes/scores.js';


const app = express();


// Security & middleware
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*'}));


// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));


// Routes
app.use('/api/questions', questionsRoute);
app.use('/api/scores', scoresRoute);


const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizgame';


connectDB(MONGODB_URI).then(() => {
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});