import mongoose from 'mongoose';

const crosswordScoreSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, maxlength: 24 },
  score: { type: Number, required: true, min: 0 },
  timeTaken: { type: Number, required: true, min: 0 }, // Time in seconds or milliseconds
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
}, { timestamps: true });

crosswordScoreSchema.index({ score: -1, timeTaken: 1, createdAt: 1 });

export default mongoose.model('CrosswordScore', crosswordScoreSchema);