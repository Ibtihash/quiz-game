// filepath: c:\Users\Tashi\OneDrive\Desktop\quiz-game\client\src\pages\SignupPage.jsx
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
        setOk("Account created. Redirecting to login...");
        setTimeout(() => nav("/login"), 900);
      } else {
        setErr(data.error || `Signup failed (${res.status})`);
      }
    } catch {
      setErr("Network error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "72vh", padding: 24 }}>
      <div className="form-card p-4 w-100" style={{ maxWidth: 520 }}>
        <div className="d-flex align-items-center mb-3">
          <div className="logo rounded-3 d-flex align-items-center justify-content-center me-3" style={{ width: 56, height: 56 }}>Q</div>
          <div>
            <h4 className="mb-0">Create account</h4>
            <div className="text-muted small">Join QuizMaster — it's free</div>
          </div>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="mb-3">
            <label className="form-label small text-muted">Username</label>
            <input className="form-control form-control-lg" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label small text-muted">Password</label>
            <input type="password" className="form-control form-control-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Link to="/login" className="btn btn-outline-secondary">Go to login</Link>
            <button className="btn btn-primary" type="submit">Create account</button>
          </div>

          <div className="mt-3" style={{ minHeight: 24 }}>
            {err && <div className="text-danger small">{err}</div>}
            {ok && <div className="text-success small">{ok}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}