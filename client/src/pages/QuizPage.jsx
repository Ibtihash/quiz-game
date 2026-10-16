import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API, BASE_URL } from "../api";
import GameInstructions from "../components/GameInstructions";
const API_BASE =  BASE_URL

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hintUsed, setHintUsed] = useState(false);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const nav = useNavigate();
  const username = localStorage.getItem("quiz_username") || "Guest";

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/questions`);
        const data = await res.json().catch(() => ({ results: [] }));
        setQuestions(data.results || []);
      } catch {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!questions.length) return;
    const q = questions[idx];
    const opts = shuffle([...(q.incorrect_answers || []), q.correct_answer]);
    setOptions(opts);
    setHintUsed(false);
    setMessage("");
  }, [idx, questions.length]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin border-4 border-[var(--accent-green)] border-t-transparent rounded-full w-10 h-10"></div>
      </div>
    );

  if (!questions.length)
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white border border-[var(--border-color)] rounded-xl shadow p-4">
          No questions available
        </div>
      </div>
    );

  const q = questions[idx];

  const useHint = () => {
    if (hintUsed) return;
    setHintUsed(true);
    const first = q.correct_answer?.trim().charAt(0) || "";
    // Keep all options, just show a textual hint
    setMessage(`Hint: first letter is "${first}"`);
  };

  const choose = (opt) => {
    const correct = opt === q.correct_answer;
    if (correct) setScore((s) => s + 1);
    if (idx + 1 < questions.length) setIdx((i) => i + 1);
    else finish();
  };

  const finish = async () => {
    await API.postQuizScore({ username, score, total: questions.length });
    nav("/leaderboard");
  };

  return (
    <div className="game-screen mx-auto max-w-5xl p-6">
      <div className="game-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Quiz</h1>
          <button
            type="button"
            onClick={() => setShowInstructions(true)}
            className="px-3 py-2 border rounded-lg text-sm border-[var(--accent-green)] text-[var(--accent-green)] hover:bg-green-50"
          >
            Instructions
          </button>
        </div>
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm text-[var(--text-muted)]">
              Question {idx + 1} / {questions.length}
            </p>
            <h5
              className="font-semibold mt-1"
              dangerouslySetInnerHTML={{ __html: q.question }}
            />
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--text-muted)]">Score</p>
            <div className="text-2xl font-bold text-[var(--accent-green)]">
              {score}
            </div>
          </div>
        </div>

        {message && (
          <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm mb-3">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((o) => (
            <button
              key={o}
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg text-left hover:bg-green-50 transition"
              onClick={() => choose(o)}
              dangerouslySetInnerHTML={{ __html: o }}
            />
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <button
              className="px-3 py-2 border rounded-lg text-sm border-[var(--accent-green)] text-[var(--accent-green)] hover:bg-green-50"
              onClick={useHint}
              disabled={hintUsed}
            >
              Use hint
            </button>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 border rounded-lg text-sm text-[var(--text-muted)] hover:bg-gray-50"
              onClick={() => nav("/")}
            >
              Back
            </button>
            <button
              className="px-3 py-2 bg-[var(--accent-green)] text-white rounded-lg text-sm hover:bg-green-700"
              onClick={finish}
            >
              Finish & Submit
            </button>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-4">
          Category: <strong>{q.category || "General"}</strong>
        </p>
      </div>
      {showInstructions && (
        <GameInstructions
          title="Quiz"
          onClose={() => setShowInstructions(false)}
          instructions={[
            "Read each question and choose one answer.",
            "Use the hint button once per question to reveal the first letter of the correct answer.",
            "A correct answer increases your score by one point.",
            "Use Finish & Submit to send your score to the leaderboard, or continue until all questions are answered.",
          ]}
        />
      )}
    </div>
  );
}
