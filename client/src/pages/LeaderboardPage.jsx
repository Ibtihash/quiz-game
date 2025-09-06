import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

function initials(name = "") {
  return name
    .split(" ")
    .map((s) => s[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function LeaderboardPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("quiz"); // "quiz" or "wordle"

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const url =
        mode === "quiz"
          ? `${API_BASE}/api/quiz-scores/top`
          : `${API_BASE}/api/wordle-scores/top`;

      const res = await fetch(url);
      const data = await res.json().catch(() => []);
      const sorted = (data || [])
        .slice()
        .sort((a, b) => b.score - a.score || new Date(a.createdAt) - new Date(b.createdAt));
      setList(sorted);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [mode]);

  const normalized = (s = "") => String(s).toLowerCase();
  const filtered = list.filter((l) =>
    normalized(l.username).includes(normalized(query))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-semibold">Leaderboard</h4>
        <Link to="/" className="dashboard-btn">Home</Link>
      </div>

      {/* Mode Switch */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode("quiz")}
          className={`px-4 py-2 rounded ${
            mode === "quiz" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Quiz Scores
        </button>
        <button
          onClick={() => setMode("wordle")}
          className={`px-4 py-2 rounded ${
            mode === "wordle" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Wordle Scores
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-medium">
              {mode === "quiz" ? "Top Quiz Players" : "Top Wordle Players"}
            </div>
            <div className="text-sm text-gray-500">
              Sorted by highest score — latest entries first
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-400">
              Updated: {new Date().toLocaleString()}
            </div>
            <div className="flex border rounded overflow-hidden">
              <input
                type="search"
                className="px-3 py-2 text-sm outline-none"
                placeholder="Filter by username"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  type="button"
                  className="px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                  onClick={() => setQuery("")}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin border-4 border-green-500 border-t-transparent rounded-full w-8 h-8" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left w-[6%]">Sr No.</th>
                    <th className="px-3 py-2 text-left w-[40%]">Name</th>
                    <th className="px-3 py-2 text-left w-[18%]">
                      {mode === "quiz" ? "Accuracy" : "Guesses Taken"}
                    </th>
                    <th className="px-3 py-2 text-left w-[18%]">Score</th>
                    <th className="px-3 py-2 text-left w-[18%]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length ? (
                    filtered.map((l, i) => {
                      const rank = i + 1;
                      const name = l.username || "Anonymous";
                      const dateObj = l.createdAt ? new Date(l.createdAt) : null;
                      const dateOnly = dateObj
                        ? dateObj.toLocaleDateString()
                        : "—";

                      return (
                        <tr
                          key={l._id || `${name}-${i}`}
                          className="border-t"
                        >
                          <td className="px-3 py-2">{rank}</td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-3">
                              <div className="bg-green-100 text-green-600 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                                {initials(name)}
                              </div>
                              <div>
                                <div className="font-semibold">{name}</div>
                                {mode === "quiz" && (
                                  <div className="text-xs text-gray-500">
                                    Accuracy: <strong>{l.accuracy}%</strong>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            {mode === "quiz"
                              ? `${l.accuracy}%`
                              : l.guessesTaken}
                          </td>
                          <td className="px-3 py-2">{l.score}</td>
                          <td className="px-3 py-2">{dateOnly}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500 py-6">
                        {query
                          ? `No scores found for "${query}"`
                          : "No scores yet — be the first!"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-gray-500">
                {filtered.length} result(s)
              </div>
              <Link
                to={mode === "quiz" ? "/quiz" : "/wordle"}
                className="dashboard-btn"
              >
                Play & Submit Score
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
