import mongoose from 'mongoose';

const hangmanScoreSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, maxlength: 24 },
  wrongGuesses: { type: Number, required: true, min: 0, max: 6 }, // Number of wrong guesses
  word: { type: String, required: true, trim: true }, // The word that was guessed
  outcome: { type: String, required: true, enum: ['win', 'lose'] }, // 'win' or 'lose'
}, { timestamps: true });

hangmanScoreSchema.index({ wrongGuesses: 1, createdAt: 1 }); // Index for leaderboard: lower wrong guesses first

export default mongoose.model('HangmanScore', hangmanScoreSchema);
