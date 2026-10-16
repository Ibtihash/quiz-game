import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../api";
import GameInstructions from "../components/GameInstructions";

const RIDDLES = [
  {
    question: "What has keys but cannot open locks?",
    answer: "keyboard",
    hint: "You use it to type.",
  },
  {
    question: "What has hands but cannot clap?",
    answer: "clock",
    hint: "It tells you the time.",
  },
  {
    question: "What gets wetter the more it dries?",
    answer: "towel",
    hint: "You use it after a shower.",
  },
  {
    question: "What has a face and two hands but no arms or legs?",
    answer: "clock",
    hint: "It hangs on a wall or sits on a desk.",
  },
  {
    question: "What can travel around the world while staying in one corner?",
    answer: "stamp",
    hint: "It rides on an envelope.",
  },
  {
    question: "What has one eye but cannot see?",
    answer: "needle",
    hint: "It is used with thread.",
  },
  {
    question: "What goes up but never comes down?",
    answer: "age",
    hint: "Everyone gets more of it over time.",
  },
  {
    question: "What has many teeth but cannot bite?",
    answer: "comb",
    hint: "It helps arrange your hair.",
  },
];

const normalize = (value) => value.trim().toLowerCase().replace(/[^a-z]/g, "");
const shuffle = (items) => items.slice().sort(() => Math.random() - 0.5);

export default function RiddlesPage() {
  const [riddles, setRiddles] = useState(() => shuffle(RIDDLES));
  const [riddleIndex, setRiddleIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [riddlesSolved, setRiddlesSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [finished, setFinished] = useState(false);

  const riddle = riddles[riddleIndex];

  const submitAnswer = (event) => {
    event.preventDefault();
    if (!answer.trim() || feedback || finished) return;

    const correct = normalize(answer) === normalize(riddle.answer);
    if (correct) {
      setScore((currentScore) => currentScore + (showHint ? 5 : 10));
      setRiddlesSolved((currentSolved) => currentSolved + 1);
      setStreak((currentStreak) => currentStreak + 1);
      setFeedback("Correct! Great thinking.");
    } else {
      setStreak(0);
      setFeedback(`Not quite. The answer was ${riddle.answer}.`);
    }
  };

  const nextRiddle = async () => {
    if (riddleIndex === riddles.length - 1) {
      try {
        await API.postRiddlesScore({
          username: localStorage.getItem("quiz_username") || "Guest",
          score,
          riddlesSolved,
        });
      } catch (error) {
        console.error("Failed to save riddle score", error);
      }
      setFinished(true);
      return;
    }

    setRiddleIndex((index) => index + 1);
    setAnswer("");
    setFeedback("");
    setShowHint(false);
  };

  const resetGame = () => {
    setRiddles(shuffle(RIDDLES));
    setRiddleIndex(0);
    setAnswer("");
    setScore(0);
    setRiddlesSolved(0);
    setStreak(0);
    setFeedback("");
    setShowHint(false);
    setFinished(false);
  };

  return (
    <div className="game-screen mx-auto flex max-w-2xl flex-col items-center p-6">
      <div className="mb-6 flex w-full items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Riddles</h1>
        <button
          type="button"
          onClick={() => setShowInstructions(true)}
          className="rounded-lg border border-[var(--accent-green)] px-3 py-2 text-sm text-[var(--accent-green)] hover:bg-green-50"
        >
          Instructions
        </button>
      </div>

      <div className="game-card w-full p-6">
        {finished ? (
          <div className="text-center">
            <div className="mb-3 text-5xl">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800">Riddle round complete!</h2>
            <p className="mt-3 text-gray-600">Final score: <strong>{score}</strong></p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={resetGame}
                className="rounded-lg bg-[var(--accent-green)] px-4 py-2 text-white hover:bg-green-700"
              >
                Play Again
              </button>
              <Link to="/leaderboard" className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50">
                Leaderboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between text-sm text-gray-600">
              <span>Riddle {riddleIndex + 1} / {riddles.length}</span>
              <span>Score: <strong>{score}</strong> | Streak: <strong>{streak}</strong></span>
            </div>
            <h2 className="text-center text-2xl font-semibold text-gray-800">{riddle.question}</h2>
            <form onSubmit={submitAnswer} className="mt-8">
              <input
                type="text"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Type your answer"
                disabled={Boolean(feedback)}
                autoFocus
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-center text-lg focus:border-[var(--accent-green)] focus:outline-none"
              />
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button
                  type="submit"
                  disabled={!answer.trim() || Boolean(feedback)}
                  className="rounded-lg bg-[var(--accent-green)] px-5 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Check Answer
                </button>
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  disabled={showHint || Boolean(feedback)}
                  className="rounded-lg border border-blue-500 px-5 py-2 text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showHint ? "Hint shown" : "Show Hint"}
                </button>
              </div>
            </form>
            {showHint && <p className="mt-5 text-center text-blue-700">Hint: {riddle.hint}</p>}
            {feedback && (
              <div className="mt-5 text-center">
                <p className={normalize(answer) === normalize(riddle.answer) ? "text-lg font-semibold text-green-600" : "text-lg font-semibold text-red-600"}>
                  {feedback}
                </p>
                <button
                  type="button"
                  onClick={nextRiddle}
                  className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                  {riddleIndex === riddles.length - 1 ? "Finish Round" : "Next Riddle"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showInstructions && (
        <GameInstructions
          title="Riddles"
          onClose={() => setShowInstructions(false)}
          instructions={[
            "Read each riddle and type the answer in the box.",
            "A correct answer earns 10 points, or 5 points if you used a hint.",
            "A correct answer also increases your streak. An incorrect answer resets the streak.",
            "Complete all riddles to save your score and see your result.",
          ]}
        />
      )}
    </div>
  );
}
