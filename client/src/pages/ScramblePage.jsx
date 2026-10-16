import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { API as api } from '../api';
import GameInstructions from '../components/GameInstructions';

const wordList = [
  "react", "javascript", "scramble", "programming", "developer",
  "computer", "keyboard", "monitor", "application", "interface",
  "algorithm", "database", "framework", "component", "function",
  "challenge", "success", "victory", "puzzle", "coding", "frontend",
  "backend", "database", "server", "client", "network", "security",
  "testing", "deploy", "version", "control", "repository", "branch",
  "commit", "merge", "pull", "request", "debug", "optimize", "refactor"
];

const ScramblePage = () => {
  const [word, setWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [guess, setGuess] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const username = localStorage.getItem('quiz_username'); // Get username

  const scrambleWord = (wordToScramble) => {
    const scrambled = wordToScramble.split('').sort(() => 0.5 - Math.random()).join('');
    if (scrambled === wordToScramble) {
      return scrambleWord(wordToScramble);
    }
    return scrambled;
  };

  const selectRandomWord = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const newWord = wordList[randomIndex].toLowerCase();
    setWord(newWord);
    setScrambledWord(scrambleWord(newWord));
    setGuess('');
    setGameEnded(false);
    setStartTime(Date.now());
    setEndTime(null);
  }, []);

  useEffect(() => {
    selectRandomWord();
  }, [selectRandomWord]);

  const handleGuessChange = (e) => {
    setGuess(e.target.value.toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameEnded) return;

    const isCorrect = guess === word;
    setEndTime(Date.now());
    setGameEnded(true);

    if (username) {
      const time = Math.round((Date.now() - startTime) / 1000);
      const score = isCorrect ? Math.max(100 - time, 10) : 0;
      const outcome = isCorrect ? 'win' : 'lose';

      api.postScrambleScore({
        username,
        score,
        time,
        word,
        outcome
      }).then(response => {
        console.log('Scramble score submitted:', response.data);
      }).catch(error => {
        console.error('Error submitting scramble score:', error);
      });
    }
  };

  return (
    <div className="game-screen flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 sm:text-5xl">Scramble</h1>
        <button
          type="button"
          onClick={() => setShowInstructions(true)}
          className="px-3 py-2 rounded-lg border border-blue-500 text-blue-700 hover:bg-blue-50"
        >
          Instructions
        </button>
      </div>

      <div className="game-card p-5 mb-4 w-full max-w-md sm:p-8 sm:mb-8">
        <div className="text-3xl font-bold tracking-widest mb-5 text-center text-blue-700 sm:text-4xl sm:mb-8">
          {scrambledWord}
        </div>

        {gameEnded ? (
          <div className="text-3xl font-semibold mb-6 text-center">
            {guess === word ? (
              <span className="text-green-600">🎉 You got it! 🎉</span>
            ) : (
              <span className="text-red-600">Wrong! The word was: <span className="font-bold">{word.toUpperCase()}</span></span>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="text"
              value={guess}
              onChange={handleGuessChange}
              className="w-full p-3 text-2xl text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Your guess..."
              autoFocus
            />
            <button
              type="submit"
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Submit
            </button>
          </form>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={selectRandomWord}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Play Again
          </button>
          <Link
            to="/"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
      {showInstructions && (
        <GameInstructions
          title="Scramble"
          onClose={() => setShowInstructions(false)}
          instructions={[
            "Unscramble the displayed letters to find the hidden word.",
            "Type your answer in the input box and press Submit.",
            "A correct answer earns a score based on how quickly you solve it; an incorrect answer scores zero.",
            "Use Play Again to receive a new scrambled word.",
          ]}
        />
      )}
    </div>
  );
};

export default ScramblePage;
