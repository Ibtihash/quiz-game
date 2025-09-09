import mongoose from 'mongoose';

const scrambleScoreSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, maxlength: 24 },
  score: { type: Number, required: true, min: 0 },
  time: { type: Number, required: true, min: 0 },
  word: { type: String, required: true, trim: true },
  outcome: { type: String, required: true, enum: ['win', 'lose'] },
}, { timestamps: true });

// Index for leaderboard: higher score first, lower time first, earlier createdAt first
scrambleScoreSchema.index({ score: -1, time: 1, createdAt: 1 });

export default mongoose.model('ScrambleScore', scrambleScoreSchema);
