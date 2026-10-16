import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, Navigate, Outlet, Link, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import LeaderboardPage from "./pages/LeaderboardPage";

import WordlePage from "./pages/WordlePage";
import CrosswordPage from "./pages/CrosswordPage";
import SnakeGamePage from "./pages/SnakeGamePage";
import HangmanPage from "./pages/HangmanPage";
import ScramblePage from "./pages/ScramblePage";
import Game2048Page from "./pages/Game2048Page";
import RiddlesPage from "./pages/RiddlesPage";

function Layout() {
  const location = useLocation();
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

  const isGameRoute = ["/quiz", "/wordle", "/crossword", "/snake-game", "/hangman", "/scramble", "/2048", "/riddles"].includes(location.pathname);

  return (
    <div className={`${isGameRoute ? "h-dvh" : "min-h-screen"} flex flex-col bg-[var(--page-bg)] text-[var(--text-dark)]`}>
      <header className="app-header">
        <div className="header-container relative">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img src="/think-and-play-logo.png" alt="Think and Play logo" className="brand-mark" />
            <div>
              <div className="brand-wordmark">Think & Play</div>
              <div className="brand-tagline">
                Where Fun Meets Brainpower.
              </div>
            </div>
          </div>

          {/* Navbar */}
          <nav className="flex items-center gap-1 sm:gap-2 relative">
            <Link to="/" className="site-nav-link">
              Home
            </Link>

            {/* Dropdown Menu for Games */}
            <div className="relative">
              <button
                onClick={() => setGamesOpen(!gamesOpen)}
                className="site-nav-link"
              >
                Games ▾
              </button>

              {gamesOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-[var(--header-bg)] p-1 shadow-2xl z-50"
                  ref={dropdownRef} // Add ref to the dropdown div
                >
                  <div className="border-b border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Games
                  </div>
                  <div className="flex flex-col p-2 space-y-2">
                    <Link
                      to="/wordle"
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                      onClick={() => setGamesOpen(false)}
                    >
                      Wordle
                    </Link>
                    <Link
                      to="/quiz"
                      className="block w-full font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => setGamesOpen(false)}
                    >
                      Quiz
                    </Link>
                    <Link
                      to="/crossword"
                      className="block w-full font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => setGamesOpen(false)}
                    >
                      Crossword
                    </Link>
                    <Link
                      to="/snake-game"
                      className="block w-full font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => setGamesOpen(false)}
                    >
                      Snake
                    </Link>
                    <Link
                      to="/hangman"
                      className="block w-full font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => setGamesOpen(false)}
                    >
                      Hangman
                    </Link>
                    <Link
                      to="/scramble"
                      className="block w-full font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => setGamesOpen(false)}
                    >
                      Scramble
                    </Link>
                    <Link
                      to="/2048"
                      className="block w-full font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => setGamesOpen(false)}
                    >
                      2048
                    </Link>
                    <Link
                      to="/riddles"
                      className="block w-full font-medium text-white/90 hover:text-white px-3 py-2 rounded-md hover:bg-blue-600 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => setGamesOpen(false)}
                    >
                      Riddles
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/leaderboard"
              className="site-nav-link"
            >
              Leaderboard
            </Link>
          </nav>

        </div>
      </header>

      {/* Main Content */}
      <main className={isGameRoute ? "flex-1 min-h-0 overflow-hidden" : "flex-1"}>
        <Outlet />
      </main>

      {/* Footer */}
      {!isGameRoute && <footer className="border-t border-[var(--border-color)] mt-6 py-3 text-sm">
        <div className="flex justify-center items-center text-[var(--text-muted)] container mx-auto px-4">
          <div>© 2025 Think & Play</div>
        </div>
      </footer>}
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
        <Route path="riddles" element={<RiddlesPage />} />
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
