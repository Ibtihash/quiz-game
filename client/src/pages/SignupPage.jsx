import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || `Signup failed (${res.status})`);
      }

      navigate("/login", { state: { message: "Account created! Please log in." } });
    } catch (err) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-[var(--page-bg)] px-4 min-h-screen">
      <div className="bg-white border border-[var(--border-color)] rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <div className="bg-[var(--accent-green)] text-white rounded-lg w-12 h-12 flex items-center justify-center text-xl font-bold mr-3">
            Q
          </div>
          <div>
            <h3 className="text-lg font-semibold">Create account</h3>
            <p className="text-sm text-[var(--text-muted)]">
              Join QuizMaster — it's free
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          <p className="text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[var(--accent-green)] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
