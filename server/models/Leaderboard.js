import mongoose from "mongoose";

const LeaderboardSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  date: { type: Date, default: () => new Date() },
});

export default mongoose.models.Leaderboard || mongoose.model("Leaderboard", LeaderboardSchema);