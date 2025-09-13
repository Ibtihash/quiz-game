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
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    uppercase: false,
    specialChar: false,
    alphanumeric: false,
  });
  const [passwordCriteriaVisible, setPasswordCriteriaVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "password") {
      const password = e.target.value;
      setPasswordCriteria({
        minLength: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        alphanumeric: /[a-zA-Z0-9]/.test(password),
      });
    }
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

    if (!passwordCriteria.minLength || !passwordCriteria.uppercase || !passwordCriteria.specialChar || !passwordCriteria.alphanumeric) {
      setError("Password does not meet the requirements.");
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
        throw new Error(data.message || `Registration failed (${res.status})`);
      }

      navigate("/login");
    } catch (err) {
      setError(err.message || "An error occurred during signup");
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
          <h2 className="text-center text-2xl font-bold text-gray-800">Sign Up</h2>
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
              onFocus={() => setPasswordCriteriaVisible(true)}
              onBlur={() => setPasswordCriteriaVisible(false)}
            />
            {passwordCriteriaVisible && (
              <div className="text-xs text-gray-500">
                <p className="font-bold">Password must contain:</p>
                <p className={passwordCriteria.minLength ? "text-green-500" : "text-gray-500"}>{passwordCriteria.minLength ? "✓" : "- "} At least 8 characters</p>
                <p className={passwordCriteria.uppercase ? "text-green-500" : "text-gray-500"}>{passwordCriteria.uppercase ? "✓" : "- "} At least one uppercase letter</p>
                <p className={passwordCriteria.specialChar ? "text-green-500" : "text-gray-500"}>{passwordCriteria.specialChar ? "✓" : "- "} At least one special character</p>
                <p className={passwordCriteria.alphanumeric ? "text-green-500" : "text-gray-500"}>{passwordCriteria.alphanumeric ? "✓" : "- "} Alphanumeric characters</p>
              </div>
            )}
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
            className={`w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-[var(--accent-green)] hover:bg-green-700 ${
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
