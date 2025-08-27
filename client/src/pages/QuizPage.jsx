// filepath: c:\Users\Tashi\OneDrive\Desktop\quiz-game\client\src\pages\QuizPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

function shuffle(arr){ return arr.slice().sort(()=>Math.random()-0.5); }

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hintUsed, setHintUsed] = useState(false);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");
  const nav = useNavigate();
  const username = localStorage.getItem("quiz_username") || "Guest";

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/questions`);
        const data = await res.json().catch(()=>({ results: [] }));
        setQuestions(data.results || []);
      } catch {
        setQuestions([]);
      } finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (!questions.length) return;
    const q = questions[idx];
    const opts = shuffle([...(q.incorrect_answers || []), q.correct_answer]);
    setOptions(opts);
    setHintUsed(false);
    setMessage("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, questions.length]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{minHeight: "60vh"}}>
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  if (!questions.length) return <div className="container py-4"><div className="card p-3">No questions available</div></div>;

  const q = questions[idx];

  const useHint = () => {
    if (hintUsed) return;
    setHintUsed(true);
    // Reveal first letter and remove one wrong option if present
    const first = q.correct_answer?.trim().charAt(0) || "";
    const incorrect = (q.incorrect_answers || []).slice();
    if (incorrect.length > 0) incorrect.splice(Math.floor(Math.random()*incorrect.length), 1);
    setOptions(shuffle([...incorrect, q.correct_answer]));
    setMessage(`Hint: first letter is "${first}"`);
  };

  const choose = (opt) => {
    const correct = opt === q.correct_answer;
    if (correct) setScore(s=>s+1);
    if (idx+1 < questions.length) setIdx(i=>i+1);
    else finish();
  };

  const finish = async () => {
    try {
      await fetch(`${API_BASE}/api/questions/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, score }),
      });
    } catch {}
    nav("/leaderboard");
  };

  return (
    <div className="container py-4">
      <div className="question-card card p-3">
        <div>
          <div className="d-flex justify-content-between mb-2">
            <div>
              <small className="text-muted">Question {idx+1} / {questions.length}</small>
              <h5 className="mt-1" dangerouslySetInnerHTML={{ __html: q.question }} />
            </div>
            <div className="text-end">
              <div className="text-muted small">Score</div>
              <div className="h4 mb-0">{score}</div>
            </div>
          </div>

          {message && <div className="alert alert-info py-2 small">{message}</div>}

          <div className="row g-2">
            {options.map((o) => (
              <div className="col-md-6" key={o}>
                <button
                  className="option-btn btn btn-light w-100 text-start"
                  onClick={() => choose(o)}
                  dangerouslySetInnerHTML={{ __html: o }}
                />
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <button className="btn btn-outline-primary me-2" onClick={useHint} disabled={hintUsed}>Use hint</button>
              <button className="btn btn-outline-secondary" onClick={() => { localStorage.removeItem("quiz_username"); nav("/signup"); }}>Logout</button>
            </div>
            <div>
              <button className="btn btn-outline-secondary me-2" onClick={() => nav("/")}>Back</button>
              <button className="btn btn-primary" onClick={finish}>Finish & Submit</button>
            </div>
          </div>
        </div>

        <aside className="mt-3">
          <div className="text-muted small">Category: <strong>{q.category || "General"}</strong></div>
        </aside>
      </div>
    </div>
  );
}