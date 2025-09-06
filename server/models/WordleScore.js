import mongoose from 'mongoose';

const wordleScoreSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, maxlength: 24 },
  guessesTaken: { type: Number, required: true, min: 0, max: 6 }, // how many rows used
  score: { type: Number, required: true, min: 0 },
}, { timestamps: true });

// Highest score first, earliest wins if tie
wordleScoreSchema.index({ score: -1, createdAt: 1 });

export default mongoose.model('WordleScore', wordleScoreSchema);
