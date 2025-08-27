// filepath: c:\Users\Tashi\OneDrive\Desktop\quiz-game\client\src\pages\HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const nav = useNavigate();
  const username = localStorage.getItem("quiz_username") || "Guest";

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="logo d-flex align-items-center justify-content-center">Q</div>
          <div>
            <h3 className="mb-0">QuizMaster</h3>
            <div className="text-muted small">Sharpen your mind — quick, fun quizzes</div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="text-muted small">Signed in as <strong>{username}</strong></div>
          <button
            className="btn btn-outline-secondary"
            onClick={() => { localStorage.removeItem("quiz_username"); nav("/signup"); }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h5>Play a Quiz</h5>
            <p className="text-muted small">10 random questions. Time yourself and compete.</p>
            <div className="d-flex justify-content-end">
              <button className="btn btn-primary" onClick={() => nav("/quiz")}>Start</button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h5>Leaderboard</h5>
            <p className="text-muted small">See top players worldwide.</p>
            <div className="d-flex justify-content-end">
              <button className="btn btn-outline-secondary" onClick={() => nav("/leaderboard")}>View</button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h5>Profile</h5>
            <p className="text-muted small">Manage account and preferences.</p>
            <div className="d-flex justify-content-end">
              <button className="btn btn-outline-secondary" onClick={() => nav("/")} disabled>Open</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-3">
        <h6 className="mb-2">How it works</h6>
        <p className="text-muted small mb-0">
          Use hints to reveal clues (limited per question). Your score is submitted to the leaderboard at the end.
        </p>
      </div>
    </div>
  );
}