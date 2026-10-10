import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, Navigate, Outlet, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import LeaderboardPage from "./pages/LeaderboardPage";

import WordlePage from "./pages/WordlePage";
import CrosswordPage from "./pages/CrosswordPage";
import SnakeGamePage from "./pages/SnakeGamePage";
import HangmanPage from "./pages/HangmanPage";
import ScramblePage from "./pages/ScramblePage";
import Game2048Page from "./pages/Game2048Page";

function Layout() {
  const [gamesOpen, setGamesOpen] = useState(false);
  const dropdownRef = useRef(null); // Create a ref for the dropdown

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setGamesOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]); // Re-run if dropdownRef changes (though it won't in this case)

  return (
    <div className="min-h-screen flex flex-col bg-[var(--page-bg)] text-[var(--text-dark)]">
      <header className="app-header">
        <div className="header-container flex justify-between items-center px-6 py-4 bg-[var(--accent-green)] text-white relative">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="bg-white text-[var(--accent-green)] w-10 h-10 rounded-lg flex items-center justify-center font-bold">
              T&P
            </div>
            <div>
              <div className="font-semibold text-lg">Think & Play</div>
              <div className="text-sm text-[var(--text-light)]/80">
                Where Fun Meets Brainpower.
              </div>
            </div>
          </div>

          {/* Navbar */}
          <nav className="hidden md:flex items-center gap-6 relative">
            <Link to="/" className="font-medium text-white/90 hover:text-white">
              Home
            </Link>

            {/* Dropdown Menu for Games */}
            <div className="relative">
              <button
                onClick={() => setGamesOpen(!gamesOpen)}
                className="font-medium text-white/90 hover:text-white"
              >
                Games ▾
              </button>

              {gamesOpen && (
                <div
                  className="absolute mt-2 w-44 rounded-lg bg-gray-800 shadow-lg z-50"
                  ref={dropdownRef} // Add ref to the dropdown div
                >
                  <div className="px-3 py-2 text-gray-300 font-semibold border-b border-gray-700">
                    Games
                  </div>
                  <div className="flex flex-col p-2 space-y-2">
                    <Link
                      to="/wordle"
                      className="block w-full font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => setGamesOpen(false)}
                    >
                      🎯 Play Wordle
                    </Link>
                    <Link
                      to="/quiz"
                      className="block w-full font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => setGamesOpen(false)}
                    >
                      📝 Take a Quiz
                    </Link>
                    <Link
                      to="/crossword"
                      className="block w-full font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => setGamesOpen(false)}
                    >
                      ➕ Crossword
                    </Link>
                    <Link
                      to="/snake-game"
                      className="block w-full font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => setGamesOpen(false)}
                    >
                      🐍 Play Snake
                    </Link>
                    <Link
                      to="/hangman"
                      className="block w-full font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => setGamesOpen(false)}
                    >
                      🪢 Play Hangman
                    </Link>
                    <Link
                      to="/scramble"
                      className="block w-full font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => setGamesOpen(false)}
                    >
                      🔄 Play Scramble
                    </Link>
                    <Link
                      to="/2048"
                      className="block w-full font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => setGamesOpen(false)}
                    >
                      🔢 Play 2048
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/leaderboard"
              className="font-medium text-white/90 hover:text-white"
            >
              Leaderboard
            </Link>
          </nav>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] mt-6 py-3 text-sm">
        <div className="flex justify-center items-center text-[var(--text-muted)] container mx-auto px-4">
          <div>© 2025 Think & Play</div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<Layout />}>
        <Route
          index
          element={<HomePage />}
        />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="wordle" element={<WordlePage />} />
        <Route path="crossword" element={<CrosswordPage />} />
        <Route path="snake-game" element={<SnakeGamePage />} />
        <Route path="hangman" element={<HangmanPage />} />
        <Route path="scramble" element={<ScramblePage />} />
        <Route path="2048" element={<Game2048Page />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="signup" element={<Navigate to="/" replace />} />
        <Route path="login" element={<Navigate to="/" replace />} />
        <Route path="forgot-password" element={<Navigate to="/" replace />} />
        <Route path="reset-password/:token" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
