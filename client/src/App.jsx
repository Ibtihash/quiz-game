// filepath: c:\Users\Tashi\OneDrive\Desktop\quiz-game\client\src\App.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
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
  return (
    <div className="app-shell container">
      <header className="d-flex align-items-center justify-content-between py-3">
        <div className="d-flex align-items-center gap-3">
          <div className="logo rounded-3 d-flex align-items-center justify-content-center">Q</div>
          <div>
            <div className="h5 mb-0">QuizMaster</div>
            <div className="text-muted small">Test your knowledge</div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="text-muted small me-2">Signed in as {localStorage.getItem("quiz_username") || "Guest"}</div>
        </div>
      </header>

      <main className="flex-fill">
        <Outlet />
      </main>

      <footer className="mt-4 py-3 border-top">
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">© 2025 QuizMaster</div>
          <div className="text-muted small">Home • Leaderboard</div>
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
