import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setOk("");
    try {
      const res = await fetch(`${API_BASE}/api/questions/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setOk("Account created! Redirecting...");
        setTimeout(() => nav("/login"), 900);
      } else {
        setErr(data.error || `Signup failed (${res.status})`);
      }
    } catch {
      setErr("Network error");
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
            <h3 className="text-lg font-semibold">Create account</h3>
            <p className="text-sm text-[var(--text-muted)]">Join QuizMaster — it's free</p>
          </div>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="mb-4">
            <label className="block text-sm text-[var(--text-muted)] mb-1">Username</label>
            <input
              className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-[var(--text-muted)] mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Link to="/login" className="px-4 py-2 border rounded-lg text-sm text-[var(--accent-green)] border-[var(--accent-green)] hover:bg-green-50">
              Go to login
            </Link>
            <button type="submit" className="px-4 py-2 bg-[var(--accent-green)] text-white rounded-lg text-sm hover:bg-green-700">
              Create account
            </button>
          </div>

          <div className="mt-3 text-sm">
            {err && <div className="text-red-600">{err}</div>}
            {ok && <div className="text-green-600">{ok}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}
