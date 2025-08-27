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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Leaderboard</h4>
        <Link to="/" className="btn btn-primary btn-sm">Home</Link>
      </div>

      <div className="leaderboard card p-3">
        <div className="leaderboard-header">
          <div>
            <div className="title">Top Players</div>
            <div className="sub">Sorted by highest score — latest entries first</div>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div className="text-muted small">Updated: {new Date().toLocaleString()}</div>
            <div className="leaderboard-filter" style={{minWidth:240}}>
              <div className="input-group">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Filter by username"
                  aria-label="Filter by username"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query ? (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setQuery("")}
                    aria-label="Clear filter"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border text-primary" role="status" aria-hidden="true" />
          </div>
        ) : (
          <>
            <div className="table-responsive mt-3">
              <table className="table leaderboard-table mb-0">
                <thead>
                  <tr>
                    <th style={{width: "6%"}}>Sr No.</th>
                    <th style={{width: "48%"}}>Name</th>
                    <th style={{width: "23%"}}>Date</th>
                    <th style={{width: "23%"}}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length ? (
                    filtered.map((l, i) => {
                      const rank = list.indexOf(l) + 1; // show global rank
                      const name = l.username || "Anonymous";
                      const dateObj = l.date ? new Date(l.date) : null;
                      const dateOnly = dateObj ? dateObj.toLocaleDateString() : "—";
                      const timeOnly = dateObj ? dateObj.toLocaleTimeString() : "—";
                      return (
                        <tr key={l._id || `${name}-${i}`} className="leaderboard-row">
                          <td className="align-middle">{rank}</td>

                          <td className="align-middle">
                            <div className="d-flex align-items-center gap-3">
                              <div className="leaderboard-avatar-sm" aria-hidden="true">{initials(name)}</div>
                              <div>
                                <div className="fw-bold">
                                  {name}
                                  {rank === 1 && <span className="ms-2 medal gold" title="Gold">★</span>}
                                  {rank === 2 && <span className="ms-2 medal silver" title="Silver">★</span>}
                                  {rank === 3 && <span className="ms-2 medal bronze" title="Bronze">★</span>}
                                </div>
                                <div className="small text-muted">Score: <strong>{l.score}</strong></div>
                              </div>
                            </div>
                          </td>

                          <td className="align-middle">{dateOnly}</td>
                          <td className="align-middle">{timeOnly}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">
                        {query ? `No scores found for "${query}"` : "No scores yet — be the first!"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="small text-muted">{filtered.length} result(s)</div>
              <div>
                <Link to="/quiz" className="btn btn-outline-primary btn-sm">Play & Submit Score</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}