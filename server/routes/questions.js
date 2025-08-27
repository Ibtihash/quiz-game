import express from "express";
import fetch from "node-fetch";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Leaderboard from "../models/Leaderboard.js";

const router = express.Router();

let sessionToken = null;

// fallback questions (10)
const fallbackQuestions = [
  { question: "What is the capital of France?", correct_answer: "Paris", incorrect_answers: ["London", "Berlin", "Rome"] },
  { question: "Which planet is known as the Red Planet?", correct_answer: "Mars", incorrect_answers: ["Venus", "Jupiter", "Saturn"] },
  { question: "Who wrote 'Hamlet'?", correct_answer: "William Shakespeare", incorrect_answers: ["Charles Dickens", "Leo Tolstoy", "Mark Twain"] },
  { question: "Which gas do plants absorb from the atmosphere?", correct_answer: "Carbon Dioxide", incorrect_answers: ["Oxygen", "Nitrogen", "Helium"] },
  { question: "What is the largest mammal?", correct_answer: "Blue Whale", incorrect_answers: ["Elephant", "Giraffe", "Hippopotamus"] },
  { question: "Which element has the chemical symbol O?", correct_answer: "Oxygen", incorrect_answers: ["Gold", "Osmium", "Oxide"] },
  { question: "How many continents are there on Earth?", correct_answer: "7", incorrect_answers: ["5", "6", "8"] },
  { question: "What is the hardest natural substance?", correct_answer: "Diamond", incorrect_answers: ["Gold", "Iron", "Platinum"] },
  { question: "Which ocean is the largest?", correct_answer: "Pacific Ocean", incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"] },
  { question: "Who painted the Mona Lisa?", correct_answer: "Leonardo da Vinci", incorrect_answers: ["Vincent van Gogh", "Pablo Picasso", "Michelangelo"] },
];

// Helper to introduce a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get or refresh token
async function getSessionToken(forceNew = false) {
  if (!sessionToken || forceNew) {
    try {
      const tokenUrl = "https://opentdb.com/api_token.php?command=request";
      const res = await fetch(tokenUrl);
      const data = await res.json();
      if (data && data.response_code === 0 && data.token) {
        sessionToken = data.token;
        console.log("✅ Got OpenTDB token:", sessionToken);
      } else {
        console.warn("⚠️ Could not get session token from OpenTDB:", data);
        sessionToken = null;
      }
    } catch (err) {
      console.warn("⚠️ Error fetching token:", err.message);
      sessionToken = null;
    }
  }
  return sessionToken;
}

// Helper to fetch questions with robust retry logic
async function fetchApiQuestions() {
  // Ensure token exists (best-effort)
  let token = await getSessionToken();
  const tryFetch = async (amount, tokenToUse) => {
    const url = tokenToUse
      ? `https://opentdb.com/api.php?amount=${amount}&type=multiple&token=${tokenToUse}`
      : `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
    const res = await fetch(url);
    return res.json();
  };

  try {
    // 1) Try with token and amount 20
    let amount = 20;
    let data = await tryFetch(amount, token);
    console.log("OpenTDB API response:", { response_code: data.response_code, results_length: Array.isArray(data.results) ? data.results.length : null });

    // If token issues or not enough questions, refresh token and retry
    if ([3, 4, 5].includes(data.response_code)) {
      console.warn(`⚠️ Token issue or not enough questions (code: ${data.response_code}). Retrying with a fresh token...`);
      sessionToken = null;
      token = await getSessionToken(true);
      await delay(500);
      data = await tryFetch(amount, token);
      console.log("OpenTDB API retry response:", { response_code: data.response_code, results_length: Array.isArray(data.results) ? data.results.length : null });

      // If still not enough, try lower amount
      if (data.response_code === 5) {
        console.warn("⚠️ Not enough questions for amount=20. Trying with amount=10...");
        amount = 10;
        data = await tryFetch(amount, token);
        console.log("OpenTDB API lower amount response:", { response_code: data.response_code, results_length: Array.isArray(data.results) ? data.results.length : null });

        // Try once without token as final attempt
        if (data.response_code === 5) {
          console.warn("⚠️ OpenTDB cannot fulfill the request even after lowering amount. Trying without token...");
          await delay(300);
          data = await tryFetch(amount, null);
          console.log("OpenTDB API no-token response:", { response_code: data.response_code, results_length: Array.isArray(data.results) ? data.results.length : null });
        }
      }
    }

    // If successful response_code 0 and has results -> return
    if (data && data.response_code === 0 && Array.isArray(data.results) && data.results.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn("⚠️ Error fetching from OpenTDB:", err.message);
  }

  // Fallback
  return null;
}

// --- USER SIGNUP ---
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: "username and password required" });

    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: "username already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();
    return res.status(201).json({ message: "signup successful", username });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    return res.status(500).json({ error: "signup failed" });
  }
});

// --- USER LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: "username and password required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    // Note: production -> issue JWT. For now, return username
    return res.json({ message: "login successful", username: user.username });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    return res.status(500).json({ error: "login failed" });
  }
});

// --- GET QUESTIONS ---
router.get("/", async (req, res) => {
  try {
    const data = await fetchApiQuestions();
    if (!data || data.response_code !== 0 || !Array.isArray(data.results) || data.results.length === 0) {
      console.warn("⚠️ API fetch failed or returned empty. Using fallback questions.");
      return res.json({ results: fallbackQuestions.slice(0, 10) });
    }
    const selected = data.results.slice(0, 10).map((q) => ({
      question: q.question,
      correct_answer: q.correct_answer,
      incorrect_answers: q.incorrect_answers,
    }));
    return res.json({ results: selected });
  } catch (err) {
    console.error("❌ Error in GET /api/questions:", err.message);
    return res.json({ results: fallbackQuestions.slice(0, 10) });
  }
});

// --- SUBMIT QUIZ RESULT ---
router.post("/submit", async (req, res) => {
  try {
    const { username, score } = req.body || {};
    if (!username || typeof score !== "number") return res.status(400).json({ error: "username and numeric score required" });

    const entry = new Leaderboard({ username, score, date: new Date() });
    await entry.save();
    return res.json({ message: "score submitted" });
  } catch (err) {
    console.error("❌ Submit error:", err.message);
    return res.status(500).json({ error: "could not submit score" });
  }
});

// --- GET LEADERBOARD ---
router.get("/leaderboard", async (req, res) => {
  try {
    const top = await Leaderboard.find().sort({ score: -1, date: 1 }).limit(100);
    return res.json(top);
  } catch (err) {
    console.error("❌ Leaderboard fetch error:", err.message);
    return res.status(500).json({ error: "could not fetch leaderboard" });
  }
});

export default router;
