// filepath: c:\Users\Tashi\OneDrive\Desktop\quiz-game\client\src\pages\LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/questions/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        localStorage.setItem("quiz_username", data.username || username);
        nav("/");
      } else {
        setErr(data.error || `Login failed (${res.status})`);
      }
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "72vh", padding: "24px" }}>
      <div className="form-card p-4 w-100" style={{ maxWidth: 520 }}>
        <div className="d-flex align-items-center mb-3">
          <div className="logo rounded-3 d-flex align-items-center justify-content-center me-3" style={{ width: 56, height: 56 }}>
            Q
          </div>
          <div>
            <h4 className="mb-0">Welcome back</h4>
            <div className="text-muted small">Sign in to continue to QuizMaster</div>
          </div>
        </div>

        <form onSubmit={submit} aria-describedby="loginError" noValidate>
          <div className="mb-3">
            <label htmlFor="username" className="form-label small text-muted">Username</label>
            <input
              id="username"
              className="form-control form-control-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              aria-required="true"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label small text-muted">Password</label>
            <div className="input-group">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                className="form-control form-control-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required="true"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label small text-muted" htmlFor="rememberMe">Remember me</label>
            </div>
            <Link to="#" className="small text-muted">Forgot password?</Link>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Link to="/signup" className="btn btn-outline-secondary">Sign up</Link>
            <button className="btn btn-primary d-flex align-items-center" type="submit" disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
              Login
            </button>
          </div>

          <div id="loginError" role="status" aria-live="polite" className="mt-3" style={{ minHeight: 22 }}>
            {err && <div className="text-danger small">{err}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}