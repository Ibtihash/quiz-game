import mongoose from 'mongoose';

const snakeScoreSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, maxlength: 24 },
  score: { type: Number, required: true, min: 0 },
}, { timestamps: true });

snakeScoreSchema.index({ score: -1, createdAt: 1 });

export default mongoose.model('SnakeScore', snakeScoreSchema);