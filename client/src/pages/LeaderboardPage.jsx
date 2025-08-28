// filepath: c:\Users\Tashi\OneDrive\Desktop\quiz-game\client\src\pages\LeaderboardPage.jsx
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

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/questions/leaderboard`);
        const data = await res.json().catch(() => []);
        const sorted = (data || [])
          .slice()
          .sort((a, b) => (b.score - a.score) || (new Date(a.date) - new Date(b.date)));
        setList(sorted);
      } catch {
        setList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const normalized = (s = "") => String(s).toLowerCase();
  const filtered = list.filter((l) => normalized(l.username).includes(normalized(query)));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-semibold">Leaderboard</h4>
        <Link to="/" className="dashboard-btn">Home</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-medium">Top Players</div>
            <div className="text-sm text-gray-500">Sorted by highest score — latest entries first</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-400">Updated: {new Date().toLocaleString()}</div>
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
                    <th className="px-3 py-2 text-left w-[48%]">Name</th>
                    <th className="px-3 py-2 text-left w-[23%]">Date</th>
                    <th className="px-3 py-2 text-left w-[23%]">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length ? (
                    filtered.map((l, i) => {
                      const rank = list.indexOf(l) + 1;
                      const name = l.username || "Anonymous";
                      const dateObj = l.date ? new Date(l.date) : null;
                      const dateOnly = dateObj ? dateObj.toLocaleDateString() : "—";
                      const timeOnly = dateObj ? dateObj.toLocaleTimeString() : "—";
                      return (
                        <tr key={l._id || `${name}-${i}`} className="border-t">
                          <td className="px-3 py-2">{rank}</td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-3">
                              <div className="bg-green-100 text-green-600 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                                {initials(name)}
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {name}
                                  {rank === 1 && <span className="ml-2 text-yellow-500">★</span>}
                                  {rank === 2 && <span className="ml-2 text-gray-400">★</span>}
                                  {rank === 3 && <span className="ml-2 text-orange-500">★</span>}
                                </div>
                                <div className="text-xs text-gray-500">Score: <strong>{l.score}</strong></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2">{dateOnly}</td>
                          <td className="px-3 py-2">{timeOnly}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500 py-6">
                        {query ? `No scores found for "${query}"` : "No scores yet — be the first!"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-gray-500">{filtered.length} result(s)</div>
              <Link to="/quiz" className="dashboard-btn">Play & Submit Score</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
