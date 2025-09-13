import mongoose from 'mongoose';

const game2048ScoreSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, maxlength: 24 },
  score: { type: Number, required: true, min: 0 },
}, { timestamps: true });

game2048ScoreSchema.index({ score: -1, createdAt: 1 });

export default mongoose.model('Game2048Score', game2048ScoreSchema);