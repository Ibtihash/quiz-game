import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const username = localStorage.getItem("quiz_username");

  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome, {username}!</h1>
      <p className="text-xl text-[var(--text-muted)] mb-10">
        What would you like to do today?
      </p>
      <div className="flex justify-center items-center gap-6 flex-wrap">
        <Link
          to="/quiz"
          className="group flex flex-col items-center justify-center w-64 h-48 bg-white border border-[var(--border-color)] rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 text-center"
        >
          <span className="text-5xl mb-4">🧠</span>
          <h2 className="text-xl font-semibold text-[var(--text-dark)]">Take a Quiz</h2>
          <p className="text-sm text-[var(--text-muted)]">Test your knowledge</p>
        </Link>
        <Link
          to="/wordle"
          className="group flex flex-col items-center justify-center w-64 h-48 bg-white border border-[var(--border-color)] rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 text-center"
        >
          <span className="text-5xl mb-4">📝</span>
          <h2 className="text-xl font-semibold text-[var(--text-dark)]">Play Wordle</h2>
          <p className="text-sm text-[var(--text-muted)]">Guess the secret word</p>
        </Link>
      </div>
    </div>
  );
}