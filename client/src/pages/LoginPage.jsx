import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
    }
  }, [location.state]);

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

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        localStorage.setItem("quiz_username", data.user?.username || formData.email);
        navigate("/");
      } else {
        throw new Error(data.message || `Login failed (${res.status})`);
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-[var(--accent-green)] min-h-screen">
      <div className="bg-white border border-[var(--border-color)] rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in-scale">
        
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[var(--accent-green)] text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl">
              T&P
            </div>
            <div>
              <div className="font-semibold text-xl text-gray-800">Think & Play</div>
              <div className="text-sm text-gray-600">
                Where Fun Meets Brainpower.
              </div>
            </div>
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-800">Login</h2>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 mt-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
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
              autoFocus
            />
            <div className="flex">
              <input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                required
                placeholder="Password"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="border border-l-0 border-gray-300 px-3 rounded-r-md text-sm text-[var(--text-muted)] hover:bg-gray-50"
                onClick={() => setShowPwd((s) => !s)}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-[var(--text-muted)]">
              <input type="checkbox" className="rounded border-gray-300" />{" "}
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-[var(--accent-green)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-[var(--accent-green)] hover:bg-green-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          <p className="text-[var(--text-muted)]">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-[var(--accent-green)] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
