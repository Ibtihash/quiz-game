import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { API as api } from '../api';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-4 font-sans">
      <h1 className="text-5xl font-extrabold mb-8 text-gray-800 drop-shadow-lg">Scramble</h1>

      <div className="bg-white rounded-xl shadow-2xl p-8 mb-8 w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
        <div className="text-4xl font-bold tracking-widest mb-8 text-center text-blue-700">
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
    </div>
  );
};

export default ScramblePage;
