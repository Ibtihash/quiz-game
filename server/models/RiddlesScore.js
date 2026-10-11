import mongoose from 'mongoose';

const riddlesScoreSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, maxlength: 24 },
  score: { type: Number, required: true, min: 0 },
  riddlesSolved: { type: Number, required: true, min: 0 },
}, { timestamps: true });

riddlesScoreSchema.index({ score: -1, createdAt: 1 });

export default mongoose.model('RiddlesScore', riddlesScoreSchema);
