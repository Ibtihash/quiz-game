// filepath: c:\Users\Tashi\OneDrive\Desktop\quiz-game\client\src\pages\HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const nav = useNavigate();
  const username = localStorage.getItem("quiz_username") || "Guest";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
     

      {/* DASHBOARD GRID */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div>
            <h5 className="dashboard-title">Play a Quiz</h5>
            <p className="dashboard-text">10 random questions. Time yourself and compete.</p>
          </div>
          <button className="dashboard-btn" onClick={() => nav("/quiz")}>Start</button>
        </div>

        <div className="dashboard-card">
          <div>
            <h5 className="dashboard-title">Leaderboard</h5>
            <p className="dashboard-text">See top players worldwide.</p>
          </div>
          <button className="dashboard-btn" onClick={() => nav("/leaderboard")}>View</button>
        </div>

        <div className="dashboard-card">
          <div>
            <h5 className="dashboard-title">Profile</h5>
            <p className="dashboard-text">Manage account and preferences.</p>
          </div>
          <button className="dashboard-btn opacity-50 cursor-not-allowed" disabled>Open</button>
        </div>
      </div>

      {/* INFO CARD */}
      <div className="info-card">
        <h6 className="info-title">How it works</h6>
        <p className="info-text">
          Use hints to reveal clues (limited per question). Your score is submitted to the leaderboard at the end.
        </p>
      </div>
    </div>
  );
}
