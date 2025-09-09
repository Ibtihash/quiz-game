const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:4000' : '';

const API = {
  async getQuestions(params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/api/questions?${q}`);
    if (!res.ok) throw new Error('Failed to load questions');
    return res.json();
  },

  // Quiz Scores
  async postQuizScore(payload) {
    const res = await fetch(`${BASE_URL}/api/quiz-scores`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Failed to submit quiz score');
    return res.json();
  },
  async getTopQuizScores(limit = 20) {
    const res = await fetch(`${BASE_URL}/api/quiz-scores/top?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to load quiz leaderboard');
    return res.json();
  },

  // Wordle Scores
  async postWordleScore(payload) {
    const res = await fetch(`${BASE_URL}/api/wordle-scores`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Failed to submit wordle score');
    return res.json();
  },
  async getTopWordleScores(limit = 20) {
    const res = await fetch(`${BASE_URL}/api/wordle-scores/top?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to load wordle leaderboard');
    return res.json();
  },

  // Crossword Scores
  async postCrosswordScore(payload) {
    const res = await fetch(`${BASE_URL}/api/crossword-scores`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Failed to submit crossword score');
    return res.json();
  },
  async getTopCrosswordScores(limit = 20) {
    const res = await fetch(`${BASE_URL}/api/crossword-scores/top?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to load crossword leaderboard');
    return res.json();
  },

  // Snake Scores
  async postSnakeScore(payload) {
    const res = await fetch(`${BASE_URL}/api/snake-scores`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Failed to submit snake score');
    return res.json();
  },
  async getTopSnakeScores(limit = 20) {
    const res = await fetch(`${BASE_URL}/api/snake-scores/top?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to load snake leaderboard');
    return res.json();
  },

  // Hangman Scores
  async postHangmanScore(payload) {
    const res = await fetch(`${BASE_URL}/api/hangman-scores`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Failed to submit hangman score');
    return res.json();
  },
  async getTopHangmanScores(limit = 20) {
    const res = await fetch(`${BASE_URL}/api/hangman-scores/top?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to load hangman leaderboard');
    return res.json();
  },

  // Scramble Scores
  async postScrambleScore(payload) {
    const res = await fetch(`${BASE_URL}/api/scramble-scores`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Failed to submit scramble score');
    return res.json();
  },
  async getTopScrambleScores(limit = 20) {
    const res = await fetch(`${BASE_URL}/api/scramble-scores/top?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to load scramble leaderboard');
    return res.json();
  },
};

export default API;