import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../api";

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
  const [mode, setMode] = useState("quiz"); // "quiz", "wordle", "crossword", "snake", "hangman", "scramble", or "game2048"

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let data;
      if (mode === "quiz") data = await API.getTopQuizScores();
      else if (mode === "wordle") data = await API.getTopWordleScores();
      else if (mode === "crossword") data = await API.getTopCrosswordScores();
      else if (mode === "snake") data = await API.getTopSnakeScores();
      else if (mode === "hangman") data = await API.getTopHangmanScores();
      else if (mode === "scramble") data = await API.getTopScrambleScores();
      else if (mode === "game2048") data = await API.getTopGame2048Scores();

      const sorted = (data || [])
        .slice()
        .sort((a, b) => {
          if (mode === "hangman") {
            if (a.outcome === "win" && b.outcome === "lose") return -1;
            if (a.outcome === "lose" && b.outcome === "win") return 1;
            return (
              a.wrongGuesses - b.wrongGuesses ||
              new Date(a.createdAt) - new Date(b.createdAt)
            );
          } else if (mode === "scramble") {
            return (
              b.score - a.score ||
              a.time - b.time ||
              new Date(a.createdAt) - new Date(b.createdAt)
            );
          }
          return b.score - a.score || new Date(a.createdAt) - new Date(b.createdAt);
        });
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

  const getModeTitle = () => {
    if (mode === "quiz") return "Top Quiz Players";
    if (mode === "wordle") return "Top Wordle Players";
    if (mode === "crossword") return "Top Crossword Players";
    if (mode === "snake") return "Top Snake Players";
    if (mode === "hangman") return "Top Hangman Players";
    if (mode === "game2048") return "Top 2048 Players";
    return "Top Players";
  };

  const getColumnHeader = () => {
    if (mode === "quiz") return "Accuracy";
    if (mode === "wordle") return "Guesses Taken";
    if (mode === "crossword") return "Time Taken";
    if (mode === "hangman") return "Word";
    if (mode === "snake" || mode === "scramble") return "Score";
    if (mode === "game2048") return "Score";
    return null;
  };

  const getColumnValue = (item) => {
    if (mode === "quiz") return `${item.accuracy}%`;
    if (mode === "wordle") return item.guessesTaken;
    if (mode === "crossword") return `${item.timeTaken}s`;
    if (mode === "hangman") return item.word;
    if (mode === "snake" || mode === "scramble") return item.score;
    if (mode === "game2048") return item.score;
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-semibold">Leaderboard</h4>
        <Link to="/" className="dashboard-btn">Home</Link>
      </div>

      {/* Mode Switch */}
      <div className="flex gap-4 mb-4 justify-center">
        {["quiz", "wordle", "crossword", "snake", "hangman", "scramble", "game2048"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded ${
              mode === m ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)} Scores
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-medium">{getModeTitle()}</div>
            <div className="text-sm text-gray-500">
              {mode === "hangman"
                ? "Sorted by fewest wrong guesses — latest entries first"
                : "Sorted by highest score — latest entries first"}
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
              <table className="w-full text-sm border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 w-[6%]">Sr No.</th>
                    <th className="px-3 py-2 w-[40%]">Name</th>
                    {getColumnHeader() && (
                      <th className="px-3 py-2 w-[18%]">{getColumnHeader()}</th>
                    )}
                    <th className="px-3 py-2 w-[18%]">Date</th>
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
                        <tr key={l._id || `${name}-${i}`} className="border-t">
                          <td className="px-3 py-2">{rank}</td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-3">
                              <div className="bg-green-100 text-green-600 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                                {initials(name)}
                              </div>
                              <div>
                                <div className="font-semibold">{name}</div>
                                {mode === "hangman" && (
                                  <div className="text-xs text-gray-500">
                                    Word: <strong>{l.word}</strong>, Outcome:{" "}
                                    <strong>{l.outcome}</strong>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          {getColumnHeader() && (
                            <td className="px-3 py-2">{getColumnValue(l)}</td>
                          )}
                          <td className="px-3 py-2">{dateOnly}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500 py-6">
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
                to={
                  mode === "quiz"
                    ? "/quiz"
                    : mode === "wordle"
                    ? "/wordle"
                    : mode === "crossword"
                    ? "/crossword"
                    : mode === "snake"
                    ? "/snake-game"
                    : mode === "hangman"
                    ? "/hangman" 
                    : mode === "game2048"
                    ? "/game2048"
                    : "/"
                }
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