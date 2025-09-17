import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { BASE_URL } from "../api";

const API_BASE = BASE_URL

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage(data.message || "Password has been reset successfully.");
        setTimeout(() => nav("/login"), 3000);
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
            <h3 className="text-lg font-semibold">Reset Password</h3>
            <p className="text-sm text-[var(--text-muted)]">
              Enter your new password
            </p>
          </div>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm text-[var(--text-muted)] mb-1"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm text-[var(--text-muted)] mb-1"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-[var(--accent-green)] text-white rounded-lg text-sm hover:bg-green-700 flex items-center"
              type="submit"
              disabled={loading}
            >
              {loading && (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
              )}
              Reset Password
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
