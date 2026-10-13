export const BASE_URL = "https://quiz-game-uywu.vercel.app";

// Scores intentionally live only in this browser session. A full refresh clears this module state.
const temporaryScores = {
  quiz: [],
  wordle: [],
  crossword: [],
  snake: [],
  hangman: [],
  scramble: [],
  game2048: [],
  riddles: [],
};

const saveTemporaryScore = (mode, payload) => {
  const entry = {
    ...payload,
    _id: `${mode}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };
  temporaryScores[mode].push(entry);
  return entry;
};

const getTemporaryScores = (mode, limit) =>
  temporaryScores[mode].slice(-limit).reverse();

const API = {
  async getQuestions(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/api/questions?${q}`);
    if (!res.ok) throw new Error('Failed to load questions');
    return res.json();
  },

  // Quiz Scores
  async postQuizScore(payload) { return saveTemporaryScore('quiz', payload); },
  async getTopQuizScores(limit = 20) { return getTemporaryScores('quiz', limit); },

  // Wordle Scores
  async postWordleScore(payload) { return saveTemporaryScore('wordle', payload); },
  async getTopWordleScores(limit = 20) { return getTemporaryScores('wordle', limit); },

  // Crossword Scores
  async postCrosswordScore(payload) { return saveTemporaryScore('crossword', payload); },
  async getTopCrosswordScores(limit = 20) { return getTemporaryScores('crossword', limit); },

  // Snake Scores
  async postSnakeScore(payload) { return saveTemporaryScore('snake', payload); },
  async getTopSnakeScores(limit = 20) { return getTemporaryScores('snake', limit); },

  // Hangman Scores
  async postHangmanScore(payload) { return saveTemporaryScore('hangman', payload); },
  async getTopHangmanScores(limit = 20) { return getTemporaryScores('hangman', limit); },

  // Scramble Scores
  async postScrambleScore(payload) { return saveTemporaryScore('scramble', payload); },
  async getTopScrambleScores(limit = 20) { return getTemporaryScores('scramble', limit); },

  // 2048 Scores
  async postGame2048Score(payload) { return saveTemporaryScore('game2048', payload); },
  async getTopGame2048Scores(limit = 20) { return getTemporaryScores('game2048', limit); },

  // Riddles Scores
  async postRiddlesScore(payload) { return saveTemporaryScore('riddles', payload); },
  async getTopRiddlesScores(limit = 20) { return getTemporaryScores('riddles', limit); },
};

export { API };