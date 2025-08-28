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
    <div className="flex items-center justify-center min-h-screen bg-[var(--page-bg)] px-4">
      <div className="bg-white border border-[var(--border-color)] rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <div className="bg-[var(--accent-green)] text-white rounded-lg w-12 h-12 flex items-center justify-center text-xl font-bold mr-3">
            Q
          </div>
          <div>
            <h3 className="text-lg font-semibold">Welcome back</h3>
            <p className="text-sm text-[var(--text-muted)]">Sign in to continue</p>
          </div>
        </div>

        <form onSubmit={submit} aria-describedby="loginError" noValidate>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm text-[var(--text-muted)] mb-1">
              Username
            </label>
            <input
              id="username"
              className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm text-[var(--text-muted)] mb-1">
              Password
            </label>
            <div className="flex">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                className="flex-1 border border-[var(--border-color)] rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="border border-l-0 border-[var(--border-color)] px-3 rounded-r-lg text-sm text-[var(--text-muted)] hover:bg-gray-50"
                onClick={() => setShowPwd((s) => !s)}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 text-sm">
            <label className="flex items-center gap-2 text-[var(--text-muted)]">
              <input type="checkbox" className="rounded border-gray-300" /> Remember me
            </label>
            <Link to="#" className="text-[var(--accent-green)] hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="flex justify-end gap-2">
            <Link to="/signup" className="px-4 py-2 border rounded-lg text-sm text-[var(--accent-green)] border-[var(--accent-green)] hover:bg-green-50">
              Sign up
            </Link>
            <button
              className="px-4 py-2 bg-[var(--accent-green)] text-white rounded-lg text-sm hover:bg-green-700 flex items-center"
              type="submit"
              disabled={loading}
            >
              {loading && <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>}
              Login
            </button>
          </div>

          {err && <div id="loginError" className="mt-3 text-sm text-red-600">{err}</div>}
        </form>
      </div>
    </div>
  );
}
