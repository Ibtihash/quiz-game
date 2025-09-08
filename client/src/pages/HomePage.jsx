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
        {/* Quiz Card */}
        <Link
          to="/quiz"
          className="group flex flex-col items-center justify-center w-64 h-48 bg-white border border-[var(--border-color)] rounded-xl shadow-lg p-6 text-center cursor-pointer transform transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:bg-blue-50"
        >
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🧠</span>
          <h2 className="text-xl font-semibold text-[var(--text-dark)] group-hover:text-blue-600">
            Take a Quiz
          </h2>
          <p className="text-sm text-[var(--text-muted)]">Test your knowledge</p>
        </Link>

        {/* Wordle Card */}
        <Link
          to="/wordle"
          className="group flex flex-col items-center justify-center w-64 h-48 bg-white border border-[var(--border-color)] rounded-xl shadow-lg p-6 text-center cursor-pointer transform transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:bg-green-50"
        >
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📝</span>
          <h2 className="text-xl font-semibold text-[var(--text-dark)] group-hover:text-green-600">
            Play Wordle
          </h2>
          <p className="text-sm text-[var(--text-muted)]">Guess the secret word</p>
        </Link>

        {/* Crossword Card */}
        <Link
          to="/crossword"
          className="group flex flex-col items-center justify-center w-64 h-48 bg-white border border-[var(--border-color)] rounded-xl shadow-lg p-6 text-center cursor-pointer transform transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:bg-purple-50"
        >
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🧩</span>
          <h2 className="text-xl font-semibold text-[var(--text-dark)] group-hover:text-purple-600">
            Crossword Puzzle
          </h2>
          <p className="text-sm text-[var(--text-muted)]">Solve the puzzle</p>
        </Link>

        {/* Snake Game Card */}
        <Link
          to="/snake-game"
          className="group flex flex-col items-center justify-center w-64 h-48 bg-white border border-[var(--border-color)] rounded-xl shadow-lg p-6 text-center cursor-pointer transform transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:bg-red-50"
        >
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🐍</span>
          <h2 className="text-xl font-semibold text-[var(--text-dark)] group-hover:text-red-600">
            Play Snake
          </h2>
          <p className="text-sm text-[var(--text-muted)]">Eat the fruit</p>
        </Link>

        {/* Hangman Card */}
        <Link
          to="/hangman"
          className="group flex flex-col items-center justify-center w-64 h-48 bg-white border border-[var(--border-color)] rounded-xl shadow-lg p-6 text-center cursor-pointer transform transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:bg-yellow-50"
        >
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🪢</span>
          <h2 className="text-xl font-semibold text-[var(--text-dark)] group-hover:text-yellow-600">
            Play Hangman
          </h2>
          <p className="text-sm text-[var(--text-muted)]">Guess the word</p>
        </Link>
      </div>
    </div>
  );
}
