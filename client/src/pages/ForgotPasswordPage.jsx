import React, { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage(data.message || "Password reset email sent. Please check your inbox.");
      } else {
        setError(data.message || `Request failed (${res.status})`);
      }
    } catch {
      setError("Network error");
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
            <h3 className="text-lg font-semibold">Forgot Password</h3>
            <p className="text-sm text-[var(--text-muted)]">
              Enter your email to reset your password
            </p>
          </div>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm text-[var(--text-muted)] mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2">
            <Link
              to="/login"
              className="px-4 py-2 border rounded-lg text-sm text-[var(--text-muted)] border-[var(--border-color)] hover:bg-gray-50"
            >
              Back to Login
            </Link>
            <button
              className="px-4 py-2 bg-[var(--accent-green)] text-white rounded-lg text-sm hover:bg-green-700 flex items-center"
              type="submit"
              disabled={loading}
            >
              {loading && (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
              )}
              Submit
            </button>
          </div>

          {message && (
            <div className="mt-3 text-sm text-green-600">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
