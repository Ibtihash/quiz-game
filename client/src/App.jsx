// filepath: c:\Users\Tashi\OneDrive\Desktop\quiz-game\client\src\App.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet, Link } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import LeaderboardPage from "./pages/LeaderboardPage";

function RequireAuth({ children }) {
  const username = localStorage.getItem("quiz_username");
  return username ? children : <Navigate to="/signup" replace />;
}

function Layout() {
  const username = localStorage.getItem("quiz_username");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--page-bg)] text-[var(--text-dark)]">
      {/* ===== Header ===== */}
      <header className="app-header">
        <div className="header-container">
          {/* Left Section */}
          <div className="header-left">
            <div className="bg-white text-[var(--accent-green)] w-10 h-10 rounded-lg flex items-center justify-center font-bold">
              Q
            </div>
            <div>
              <div className="font-semibold text-lg">QuizMaster</div>
              <div className="text-sm text-[var(--text-light)]/80">
                Test your knowledge
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="header-right">
            <span className="text-sm">
              Signed in as{" "}
              <span className="font-semibold">
                {username || "Guest"}
              </span>
            </span>
            {username && (
              <button
                onClick={() => {
                  localStorage.removeItem("quiz_username");
                  window.location.href = "/login";
                }}
                className="px-3 py-1 border border-white rounded-md text-sm hover:bg-white hover:text-[var(--accent-green)] transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-[var(--border-color)] mt-6 py-3 text-sm">
        <div className="flex justify-between items-center text-[var(--text-muted)] container mx-auto px-4">
          <div>© 2025 QuizMaster</div>
          <div className="flex gap-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/leaderboard" className="hover:underline">Leaderboard</Link>
          </div>
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
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route path="signup" element={<SignupPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route
          path="quiz"
          element={
            <RequireAuth>
              <QuizPage />
            </RequireAuth>
          }
        />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
