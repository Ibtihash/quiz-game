import React, { useState, useEffect, useCallback } from "react";

const GUESS_LENGTH = 5;
const MAX_GUESSES = 6;
const MAX_HINTS = 2;
import { WORDS as ALL_WORDS } from "../wordlist";
import { BASE_URL } from "../api";
const API_BASE = BASE_URL

// Helper to get a new solution word
const getNewSolution = (words) =>
  words.length > 0
    ? words[Math.floor(Math.random() * words.length)].toUpperCase()
    : "";

// Helper to get statuses for a guess
function getGuessStatuses(guess, solution) {
  const statuses = Array(GUESS_LENGTH).fill("absent");
  const solutionLetters = solution.split("");
  const guessLetters = guess.split("");

  // 1st pass: find correct letters (green)
  guessLetters.forEach((letter, i) => {
    if (solutionLetters[i] === letter) {
      statuses[i] = "correct";
      solutionLetters[i] = null; // Mark as used
    }
  });

  // 2nd pass: find present letters (yellow)
  guessLetters.forEach((letter, i) => {
    if (statuses[i] === "correct") return;

    const presentIndex = solutionLetters.indexOf(letter);
    if (presentIndex !== -1) {
      statuses[i] = "present";
      solutionLetters[presentIndex] = null; // Mark as used
    }
  });

  return statuses;
}

// --- Components ---
function Tile({ letter, status, animation = "" }) {
  const statusClass = {
    correct: "bg-green-500 border-green-500 text-white",
    present: "bg-yellow-500 border-yellow-500 text-white",
    absent: "bg-gray-700 border-gray-700 text-white",
    empty: "bg-transparent border-gray-500",
    typing: "bg-transparent border-gray-400 scale-105",
    revealed: "bg-gray-400 border-gray-400 text-white", // new status
  }[status];

  return (
    <div
      className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold uppercase transition-all duration-300 transform ${statusClass} ${animation}`}
    >
      {letter}
    </div>
  );
}

function Row({ guess, solution, submitted = false }) {
  const tiles = [];
  const statuses = guess
    ? getGuessStatuses(guess, solution)
    : Array(GUESS_LENGTH).fill("empty");

  for (let i = 0; i < GUESS_LENGTH; i++) {
    const letter = guess?.[i];
    const animation = submitted ? `animate-flip-in` : "";
    tiles.push(
      <Tile key={i} letter={letter} status={statuses[i]} animation={animation} />
    );
  }

  return <div className="grid grid-cols-5 gap-1.5">{tiles}</div>;
}

function CurrentRow({ currentGuess, isInvalid, revealedLetters }) {
  const tiles = [];
  const animation = isInvalid ? "animate-shake" : "";

  for (let i = 0; i < GUESS_LENGTH; i++) {
    let letter = currentGuess[i];
    let status = letter ? "typing" : "empty";

    const revealed = revealedLetters.find((rl) => rl.index === i);
    if (revealed) {
      letter = revealed.letter;
      status = "revealed";
    }

    tiles.push(<Tile key={i} letter={letter} status={status} />);
  }
  return <div className={`grid grid-cols-5 gap-1.5 ${animation}`}>{tiles}</div>;
}

function Keyboard({ onKey, onEnter, onDelete, guessStatuses }) {
  const keys = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    ["ENTER", ..."ZXCVBNM".split(""), "DELETE"],
  ];

  const handleClick = (key) => {
    if (key === "ENTER") {
      onEnter();
    } else if (key === "DELETE") {
      onDelete();
    } else {
      onKey(key);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-6 w-full">
      {keys.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5 w-full">
          {row.map((key) => {
            const status = guessStatuses[key];
            const statusClass = {
              correct: "bg-green-500 text-white",
              present: "bg-yellow-500 text-white",
              absent: "bg-gray-700 text-white",
            }[status];

            const style = key.length > 1 ? { flex: 1.5 } : { flex: 1 };

            return (
              <button
                key={key}
                onClick={() => handleClick(key)}
                style={style}
                className={`h-14 rounded-md font-bold uppercase text-sm flex items-center justify-center transition-all duration-200 ${status ? statusClass : "bg-gray-300 hover:bg-gray-400"} shadow-md`}
              >
                {key === "DELETE" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// --- Main Page Component ---
export default function WordlePage() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [guessStatuses, setGuessStatuses] = useState({});
  const [wordList, setWordList] = useState([]);
  const [loadingWords, setLoadingWords] = useState(true);
  const [isInvalid, setIsInvalid] = useState(false);

  // Hint state
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedLetters, setRevealedLetters] = useState([]); // Stores { letter: 'A', index: 0 }

  useEffect(() => {
    const loadWords = () => {
      try {
        setLoadingWords(true);
        const words = [
          ...new Set(
            ALL_WORDS.filter(
              (word) => word.length === GUESS_LENGTH && /^[a-z]+$/.test(word)
            )
          ),
        ];
        setWordList(words);
      } catch (error) {
        console.error("Failed to load word list:", error);
        setMessage("Error loading words. Please try again later.");
      } finally {
        setLoadingWords(false);
      }
    };
    loadWords();
  }, []);

  const startNewGame = useCallback(() => {
    if (wordList.length === 0) return;
    setSolution(getNewSolution(wordList));
    setGuesses([]);
    setCurrentGuess("");
    setIsGameOver(false);
    setMessage("");
    setGuessStatuses({});
    setHintsUsed(0);
    setRevealedLetters([]);
  }, [wordList]);

  useEffect(() => {
    if (wordList.length > 0) {
      startNewGame();
    }
  }, [wordList, startNewGame]);

  const sendWordleScore = useCallback(async (guessesCount) => {
    let username = localStorage.getItem("quiz_username");
    if (!username || username.trim() === '') {
      username = "Guest";
    }
    const scoreData = {
        username,
        gameType: 'wordle',
        guessesTaken: guessesCount,
        score: 0, // Will be calculated in backend
        total: 1, // Always 1 for Wordle
        accuracy: 0 // Not applicable for Wordle
    };

    try {
        const response = await fetch(`${API_BASE}/api/wordle-scores`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(scoreData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to send Wordle score:", errorData.error);
            setMessage("Failed to save score.");
        } else {
            setMessage("Score saved successfully!");
        }
    } catch (error) {
        console.error("Network error sending Wordle score:", error);
        setMessage("Network error saving score.");
    } finally {
        setTimeout(() => setMessage(""), 3000);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (isGameOver) return;

    if (currentGuess.length !== GUESS_LENGTH) {
      setMessage("Not enough letters");
      setIsInvalid(true);
      setTimeout(() => {
        setMessage("");
        setIsInvalid(false);
      }, 2000);
      return;
    }

    if (!wordList.includes(currentGuess.toLowerCase())) {
      setMessage("Not in word list");
      setIsInvalid(true);
      setTimeout(() => {
        setMessage("");
        setIsInvalid(false);
      }, 2000);
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    // Update keyboard statuses
    const newStatuses = { ...guessStatuses };
    const guessResultStatuses = getGuessStatuses(currentGuess, solution);

    currentGuess.split("").forEach((letter, i) => {
      const status = guessResultStatuses[i];
      const existingStatus = newStatuses[letter];

      if (status === "correct") {
        newStatuses[letter] = "correct";
      } else if (status === "present" && existingStatus !== "correct") {
        newStatuses[letter] = "present";
      } else if (status === "absent" && !existingStatus) {
        newStatuses[letter] = "absent";
      }
    });
    setGuessStatuses(newStatuses);

    setCurrentGuess("");
    setRevealedLetters([]); // Clear hints for the next guess

    if (currentGuess === solution) {
      setIsGameOver(true);
      setMessage(`You won in ${newGuesses.length} guesses!`);
      sendWordleScore(newGuesses.length); // Send score
    } else if (newGuesses.length === MAX_GUESSES) {
      setIsGameOver(true);
      setMessage(`Game over! The word was ${solution}.`);
      sendWordleScore(0); // Send 0 guesses for loss (or a specific value to indicate loss)
    }
  }, [isGameOver, currentGuess, wordList, guesses, solution, guessStatuses, sendWordleScore]);

  const handleKeyPress = useCallback(
    (e) => {
      if (isGameOver) return;

      const key = e.key.toUpperCase();

      if (key === "ENTER") {
        handleSubmit();
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (currentGuess.length < GUESS_LENGTH && /^[A-Z]$/.test(key)) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [isGameOver, handleSubmit, currentGuess.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const handleHint = useCallback(() => {
    if (hintsUsed >= MAX_HINTS || isGameOver) return;

    const solutionLetters = solution.split("");
    const currentGuessLetters = currentGuess.split("");

    // Find indices that are not yet correctly guessed and not yet hinted
    const availableHintIndices = [];
    for (let i = 0; i < GUESS_LENGTH; i++) {
      const isGuessedCorrectly = guesses.some((guess) => guess[i] === solutionLetters[i]);
      const isAlreadyHinted = revealedLetters.some((rl) => rl.index === i);
      const isCurrentGuessCorrect = currentGuessLetters[i] === solutionLetters[i];

      if (!isGuessedCorrectly && !isAlreadyHinted && !isCurrentGuessCorrect) {
        availableHintIndices.push(i);
      }
    }

    if (availableHintIndices.length === 0) {
      setMessage("No more unique hints available!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const randomIndex =
      availableHintIndices[Math.floor(Math.random() * availableHintIndices.length)];
    const letterToReveal = solutionLetters[randomIndex];

    setRevealedLetters((prev) => [...prev, { letter: letterToReveal, index: randomIndex }]);
    setHintsUsed((prev) => prev + 1);
    setMessage(`Hint: '${letterToReveal}' at position ${randomIndex + 1}`);
    setTimeout(() => setMessage(""), 2000);
  }, [hintsUsed, isGameOver, solution, currentGuess, guesses, revealedLetters]);

  const remainingGuesses = MAX_GUESSES - guesses.length - 1;

  if (loadingWords) {
    return (
      <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto h-96">
        <h1 className="text-3xl font-bold mb-4">Wordle</h1>
        <div className="flex items-center gap-2 text-lg">
          <span className="animate-spin border-4 border-[var(--accent-green)] border-t-transparent rounded-full w-6 h-6"></span>
          <span>Loading words...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes flip-in {
          0% {
            transform: rotateX(90deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }

        .animate-flip-in {
          animation: flip-in 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-4">Wordle</h1>

        {message && (
          <div className="absolute top-24 bg-white text-black px-4 py-2 rounded-md shadow-lg font-semibold z-10">
            {message}
          </div>
        )}

        <div className="grid grid-rows-6 gap-1.5 mb-6">
          {guesses.map((guess, i) => (
            <Row key={i} guess={guess} solution={solution} submitted={true} />
          ))}
          {!isGameOver && (
            <CurrentRow
              currentGuess={currentGuess}
              isInvalid={isInvalid}
              revealedLetters={revealedLetters}
            />
          )}
          {Array(Math.max(0, remainingGuesses))
            .fill(0)
            .map((_, i) => (
              <Row key={i + guesses.length + 1} />
            ))}
        </div>

        <div className="flex gap-4 mb-4">
          {isGameOver ? (
            <button
              onClick={startNewGame}
              className="px-6 py-2 bg-[var(--accent-green)] text-white rounded-lg text-lg hover:bg-green-700"
            >
              New Game
            </button>
          ) : (
            <button
              onClick={handleHint}
              disabled={hintsUsed >= MAX_HINTS || isGameOver}
              className={`px-6 py-2 rounded-lg text-lg text-white ${hintsUsed >= MAX_HINTS || isGameOver
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"}`}
            >
              Hint ({MAX_HINTS - hintsUsed} left)
            </button>
          )}
        </div>

        <Keyboard
          onKey={(key) => handleKeyPress({ key })}
          onEnter={handleSubmit}
          onDelete={() => handleKeyPress({ key: "Backspace" })}
          guessStatuses={guessStatuses}
        />
      </div>
    </>
  );
}
