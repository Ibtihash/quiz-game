import mongoose from 'mongoose';

const quizScoreSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, maxlength: 24 },
  score: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 1 },
  accuracy: { type: Number, required: true, min: 0, max: 100 },
}, { timestamps: true });

quizScoreSchema.index({ score: -1, createdAt: 1 });

export default mongoose.model('QuizScore', quizScoreSchema);