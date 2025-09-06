import React, { useState, useEffect, useRef } from "react";
import api from "../api";

// Word pool (can be expanded or fetched via API)
const WORDS = ["CODE", "AI", "REACT", "JSX", "QUIZ", "NODE", "APP", "JAVA", "HTML", "CSS"];

const SETTINGS = {
  easy: { size: 4, time: 120 }, // 2 minutes
  medium: { size: 6, time: 300 }, // 5 minutes
  hard: { size: 8, time: 480 }, // 8 minutes
};

export default function CrosswordPage() {
  const [difficulty, setDifficulty] = useState("medium");
  const [size, setSize] = useState(SETTINGS[difficulty].size);
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [gridValues, setGridValues] = useState([]);
  const [colors, setColors] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(SETTINGS[difficulty].time);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Refs for inputs
  const inputRefs = useRef([]);

  // Generate empty grid with open cells only (no blocking words)
  const generateEmptyGrid = (size) => {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => 1));
  };

  // Place words into grid
  const generateSolution = (grid, size) => {
    const sol = Array.from({ length: size }, () => Array(size).fill(""));

    const possibleWords = WORDS.filter((w) => w.length <= size);
    const wordsToPlace = [];
    for (let i = 0; i < 3; i++) {
      wordsToPlace.push(possibleWords[Math.floor(Math.random() * possibleWords.length)]);
    }

    wordsToPlace.forEach((word) => {
      const direction = Math.random() > 0.5 ? "H" : "V";
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 50) {
        attempts++;
        let r = Math.floor(Math.random() * size);
        let c = Math.floor(Math.random() * size);

        if (direction === "H" && c + word.length <= size) {
          let fits = true;
          for (let i = 0; i < word.length; i++) {
            if (grid[r][c + i] === 0) {
              fits = false;
              break;
            }
          }
          if (fits) {
            for (let i = 0; i < word.length; i++) {
              sol[r][c + i] = word[i];
            }
            placed = true;
          }
        }

        if (direction === "V" && r + word.length <= size) {
          let fits = true;
          for (let i = 0; i < word.length; i++) {
            if (grid[r + i][c] === 0) {
              fits = false;
              break;
            }
          }
          if (fits) {
            for (let i = 0; i < word.length; i++) {
              sol[r + i][c] = word[i];
            }
            placed = true;
          }
        }
      }
    });

    return sol;
  };

  // Initialize game
  const initGame = (mode) => {
    const newSize = SETTINGS[mode].size;
    const newTime = SETTINGS[mode].time;
    const emptyGrid = generateEmptyGrid(newSize);
    const sol = generateSolution(emptyGrid, newSize);

    setSize(newSize);
    setGrid(emptyGrid);
    setSolution(sol);
    setGridValues(Array.from({ length: newSize }, () => Array(newSize).fill("")));
    setColors(Array.from({ length: newSize }, () => Array(newSize).fill("")));
    setHintsUsed(0);
    setStartTime(null);
    setTimeLeft(newTime);
    setIsTimerRunning(false);
    setGameOver(false);

    // Reset refs
    inputRefs.current = Array.from({ length: newSize }, () =>
      Array.from({ length: newSize }, () => null)
    );
  };

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (!isTimerRunning || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameOver(true);
          setIsTimerRunning(false);
          alert("⏰ Could not complete in time!");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, gameOver]);

  // Handle typing + auto navigation
  const handleChange = (r, c, value) => {
    if (gameOver) return;
    if (!isTimerRunning && value.length > 0) {
      setIsTimerRunning(true);
      setStartTime(Date.now());
    }

    if (value.length > 1) return;
    const updatedGrid = gridValues.map((row) => [...row]);
    updatedGrid[r][c] = value.toUpperCase();
    setGridValues(updatedGrid);

    if (value && c + 1 < size) {
      inputRefs.current[r][c + 1]?.focus();
    }
  };

  const handleKeyDown = (r, c, e) => {
    if (e.key === "Backspace") {
      if (gridValues[r][c] === "") {
        if (c > 0) {
          inputRefs.current[r][c - 1]?.focus();
        }
      }
    }
  };

  // Check answers
  const checkAnswers = () => {
    if (gameOver) return;

    const newColors = gridValues.map((row, r) =>
      row.map((val, c) => {
        if (solution[r][c] === "") return "";
        if (val.toUpperCase() === solution[r][c].toUpperCase()) return "bg-green-300";
        if (solution.some((row2) => row2.includes(val.toUpperCase()))) return "bg-yellow-300";
        return "bg-red-300";
      })
    );

    setColors(newColors);

    let allCorrect = true;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (solution[r][c] !== "" && gridValues[r][c].toUpperCase() !== solution[r][c].toUpperCase()) {
          allCorrect = false;
        }
      }
    }

    if (allCorrect) {
      setIsTimerRunning(false);
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const score = size * 10 - timeTaken;
      saveScore(score, timeTaken);
      alert("✅ Crossword solved!");
    }
  };

  // Save score
  const saveScore = async (score, timeTaken) => {
    const username = localStorage.getItem("username");
    if (!username) {
      alert("You must be logged in to save your score.");
      return;
    }
    try {
      await api.post("/crossword-scores", {
        username,
        score,
        timeTaken,
        difficulty,
      });
    } catch (error) {
      console.error("Failed to save score", error);
    }
  };

  // Hints
  const giveHint = () => {
    if (gameOver) return;
    if (hintsUsed >= (difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3)) {
      alert("⚠️ No more hints left!");
      return;
    }

    let available = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (solution[r][c] !== "" && gridValues[r][c] !== solution[r][c]) {
          available.push([r, c]);
        }
      }
    }

    if (available.length === 0) return;

    const [r, c] = available[Math.floor(Math.random() * available.length)];
    const updatedGrid = gridValues.map((row) => [...row]);
    updatedGrid[r][c] = solution[r][c];
    setGridValues(updatedGrid);
    setHintsUsed(hintsUsed + 1);
  };

  const newGame = () => initGame(difficulty);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="container-pro text-center p-6">
      <h1 className="text-3xl font-bold mb-6">Crossword Puzzle</h1>

      <div className="flex justify-center items-center gap-6 mb-4">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border border-gray-400 px-3 py-1 rounded"
        >
          <option value="easy">Easy (4x4, 2 min)</option>
          <option value="medium">Medium (6x6, 5 min)</option>
          <option value="hard">Hard (8x8, 8 min)</option>
        </select>
        <p className="text-xl font-mono">⏳ {formatTime(timeLeft)}</p>
      </div>

      <div className="inline-block border-4 border-gray-700 rounded-lg shadow-lg">
        {grid.map((row, rIndex) => (
          <div key={rIndex} className="flex">
            {row.map((cell, cIndex) => (
              <div
                key={cIndex}
                className={`w-12 h-12 border border-gray-400 flex items-center justify-center ${
                  cell === 0 ? "bg-gray-800" : colors[rIndex][cIndex] || "bg-white"
                }`}
              >
                {cell === 1 && (
                  <input
                    ref={(el) => {
                      if (!inputRefs.current[rIndex]) {
                        inputRefs.current[rIndex] = [];
                      }
                      inputRefs.current[rIndex][cIndex] = el;
                    }}
                    id={`cell-${rIndex}-${cIndex}`}
                    type="text"
                    maxLength="1"
                    value={gridValues[rIndex]?.[cIndex] || ""}
                    onChange={(e) => handleChange(rIndex, cIndex, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(rIndex, cIndex, e)}
                    className="w-full h-full text-center font-bold text-lg uppercase focus:outline-none bg-transparent"
                    disabled={gameOver}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-4 flex-wrap">
        <button
          onClick={checkAnswers}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={gameOver}
        >
          Check Answers
        </button>
        <button
          onClick={giveHint}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          disabled={gameOver}
        >
          Get Hint ({(difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3) - hintsUsed} left)
        </button>
        <button
          onClick={newGame}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          🔄 New Game
        </button>
      </div>
    </div>
  );
}
