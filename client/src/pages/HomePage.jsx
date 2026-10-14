import React from "react";
import { Link } from "react-router-dom";

const games = [
  { to: "/quiz", icon: "?", title: "Take a Quiz", text: "Test your knowledge across fresh questions.", tone: "blue" },
  { to: "/wordle", icon: "▦", title: "Play Wordle", text: "Find the five-letter word in six tries.", tone: "green" },
  { to: "/crossword", icon: "⊞", title: "Crossword Puzzle", text: "Fill the grid before the timer runs out.", tone: "violet" },
  { to: "/snake-game", icon: "⌁", title: "Play Snake", text: "Guide the snake, collect fruit, beat your run.", tone: "red" },
  { to: "/hangman", icon: "♙", title: "Play Hangman", text: "Reveal the word before your guesses run out.", tone: "amber" },
  { to: "/scramble", icon: "↔", title: "Play Scramble", text: "Unscramble the word as quickly as you can.", tone: "orange" },
  { to: "/2048", icon: "▦", title: "Play 2048", text: "Merge matching tiles and reach 2048.", tone: "cyan" },
  { to: "/riddles", icon: "?", title: "Play Riddles", text: "Solve clever puzzles and build a streak.", tone: "yellow" },
];

const toneClasses = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  green: "bg-green-50 text-green-700 ring-green-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
  red: "bg-red-50 text-red-700 ring-red-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  orange: "bg-orange-50 text-orange-700 ring-orange-100",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  yellow: "bg-yellow-50 text-yellow-700 ring-yellow-100",
};

export default function HomePage() {
  const username = localStorage.getItem("quiz_username");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <section className="relative overflow-hidden rounded-3xl bg-[var(--accent-deep)] px-6 py-10 text-white shadow-xl sm:px-10 lg:py-14">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-5 flex items-center gap-3">
            <img src="/think-and-play-logo.png" alt="Think and Play logo" className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white/10" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Think &amp; Play</p>
              <p className="mt-1 text-sm text-slate-300">Brainpower in motion</p>
            </div>
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-yellow)]">
            {username ? `Welcome back, ${username}` : "Your daily thinking space"}
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Choose a challenge.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            A focused collection of quick games for sharper recall, faster pattern recognition, and a little well-earned fun.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/quiz" className="rounded-lg bg-[var(--accent-yellow)] px-5 py-3 text-sm font-bold text-[var(--accent-deep)] transition hover:bg-yellow-300">
              Start a quiz
            </Link>
            <Link to="/leaderboard" className="rounded-lg border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              View session scores
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent-green)]">Game library</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--text-dark)]">Pick your next challenge</h2>
          </div>
          <span className="hidden text-sm text-[var(--text-muted)] sm:block">{games.length} games available</span>
        </div>
        <div className="game-directory">
          {games.map((game) => (
            <Link key={game.to} to={game.to} className="game-tile group">
              <div className="flex items-start justify-between gap-4">
                <span className={`game-icon grid h-12 w-12 place-items-center rounded-xl text-2xl font-bold tracking-tight ring-1 transition group-hover:scale-105 ${toneClasses[game.tone]}`}>
                  {game.icon}
                </span>
                <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-[var(--accent-green)]">→</span>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-bold text-[var(--text-dark)]">{game.title}</h3>
                <p className="mt-1 text-sm leading-5 text-[var(--text-muted)]">{game.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border-color)] bg-white p-5">
          <p className="feature-mark">01</p>
          <h3 className="mt-3 font-bold">Quick to start</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">No account required. Choose a game and get moving.</p>
        </div>
        <div className="rounded-2xl border border-[var(--border-color)] bg-white p-5">
          <p className="feature-mark">02</p>
          <h3 className="mt-3 font-bold">Clear objectives</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">Every game includes focused instructions before you play.</p>
        </div>
        <div className="rounded-2xl border border-[var(--border-color)] bg-white p-5">
          <p className="feature-mark">03</p>
          <h3 className="mt-3 font-bold">Fresh every session</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">Scores stay temporary and clear when you refresh the website.</p>
        </div>
      </section>
    </div>
  );
}
