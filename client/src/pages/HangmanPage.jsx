import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { API as api } from '../api';
import GameInstructions from '../components/GameInstructions';

const wordList = [
  "react", "javascript", "hangman", "programming", "developer",
  "computer", "keyboard", "monitor", "application", "interface",
  "algorithm", "database", "framework", "component", "function",
  "challenge", "success", "victory", "puzzle", "coding", "frontend",
  "backend", "database", "server", "client", "network", "security",
  "testing", "deploy", "version", "control", "repository", "branch",
  "commit", "merge", "pull", "request", "debug", "optimize", "refactor"
];

const HangmanDrawing = ({ wrongGuesses }) => {
  const HEAD = (
    <div
      key="head"
      className="w-10 h-10 rounded-full border-4 border-gray-800 absolute top-12 right-[-16px] transition-all duration-300 ease-out"
    />
  );
  const BODY = (
    <div
      key="body"
      className="w-1.5 h-20 bg-gray-800 absolute top-24 right-0 transition-all duration-300 ease-out"
    />
  );
  const RIGHT_ARM = (
    <div
      key="right-arm"
      className="w-16 h-1.5 bg-gray-800 absolute top-28 right-[-60px] rotate-[-30deg] origin-bottom-left transition-all duration-300 ease-out"
    />
  );
  const LEFT_ARM = (
    <div
      key="left-arm"
      className="w-16 h-1.5 bg-gray-800 absolute top-28 right-[10px] rotate-[30deg] origin-bottom-right transition-all duration-300 ease-out"
    />
  );
  const RIGHT_LEG = (
    <div
      key="right-leg"
      className="w-16 h-1.5 bg-gray-800 absolute top-44 right-[-50px] rotate-[60deg] origin-bottom-left transition-all duration-300 ease-out"
    />
  );
  const LEFT_LEG = (
    <div
      key="left-leg"
      className="w-16 h-1.5 bg-gray-800 absolute top-44 right-[0px] rotate-[-60deg] origin-bottom-right transition-all duration-300 ease-out"
    />
  );

  const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

  return (
    <div className="relative">
      {BODY_PARTS.slice(0, wrongGuesses)}

      {/* Rope */}
      <div className="h-12 w-1.5 bg-gray-800 absolute top-0 right-0" />
      {/* Top beam */}
      <div className="h-1.5 w-28 bg-gray-800 ml-12" />
      {/* Vertical beam */}
      <div className="h-64 w-1.5 bg-gray-800 ml-12" />
      {/* Base */}
      <div className="h-1.5 w-48 bg-gray-800" />
    </div>
  );
};

const HangmanPage = () => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrongGuesses = 6;
  const [gameEnded, setGameEnded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const username = localStorage.getItem('quiz_username'); // Get username

  const selectRandomWord = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    setWord(wordList[randomIndex].toLowerCase());
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameEnded(false);
  }, []);

  useEffect(() => {
    selectRandomWord();
  }, [selectRandomWord]);

  const displayWord = word.split('').map(letter => {
    return guessedLetters.includes(letter) ? letter : '_';
  }).join(' ');

  const isWinner = displayWord.split(' ').join('') === word;
  const isLoser = wrongGuesses >= maxWrongGuesses;

  useEffect(() => {
    if ((isWinner || isLoser) && !gameEnded && word) { // Added '&& word' condition
      setGameEnded(true);
      if (username) {
        const outcome = isWinner ? 'win' : 'lose';
        api.postHangmanScore({
          username,
          wrongGuesses,
          word,
          outcome
        }).then(response => {
          console.log('Hangman score submitted:', response.data);
        }).catch(error => {
          console.error('Error submitting hangman score:', error);
        });
      }
    }
  }, [isWinner, isLoser, gameEnded, wrongGuesses, word, username]);


  const handleGuess = (letter) => {
    if (gameEnded || guessedLetters.includes(letter.toLowerCase())) {
      return;
    }

    const lowerCaseLetter = letter.toLowerCase();
    setGuessedLetters(prev => [...prev, lowerCaseLetter]);

    if (!word.includes(lowerCaseLetter)) {
      setWrongGuesses(prev => prev + 1);
    }
  };

  

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return (
    <div
      className="game-screen flex flex-col items-center justify-center p-4"
      tabIndex={0} // Make the div focusable
      onKeyDown={(e) => {
        const pressedKey = e.key.toLowerCase();
        // Check if the pressed key is a letter and not already guessed
        if (pressedKey.match(/^[a-z]$/) && !guessedLetters.includes(pressedKey) && !gameEnded) {
          handleGuess(pressedKey);
        }
      }}
    >
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 sm:text-5xl">Hangman</h1>
        <button
          type="button"
          onClick={() => setShowInstructions(true)}
          className="px-3 py-2 rounded-lg border border-blue-500 text-blue-700 hover:bg-blue-50"
        >
          Instructions
        </button>
      </div>

      <div className="game-card p-4 mb-4 w-full max-w-md sm:p-8 sm:mb-8">
        <div className="relative w-36 h-44 mb-4 sm:w-48 sm:h-64 sm:mb-6">
          <HangmanDrawing wrongGuesses={wrongGuesses} />
        </div>

        <div className="text-4xl font-bold tracking-widest mb-4 text-center text-blue-700 sm:text-6xl sm:mb-8">
          {displayWord}
        </div>

        {gameEnded ? (
          <div className="text-3xl font-semibold mb-6 text-center">
            {isWinner ? (
              <span className="text-green-600">🎉 You won! 🎉</span>
            ) : (
              <span className="text-red-600">Game Over! The word was: <span className="font-bold">{word.toUpperCase()}</span></span>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-2 mb-6">
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => handleGuess(letter)}
                  disabled={guessedLetters.includes(letter) || gameEnded}
                  className={`
                    p-3 rounded-lg text-xl font-bold uppercase transition-all duration-200
                    ${guessedLetters.includes(letter)
                      ? (word.includes(letter) ? 'bg-green-200 text-green-800 cursor-not-allowed' : 'bg-red-200 text-red-800 cursor-not-allowed')
                      : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
                    }
                    ${gameEnded ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {letter}
                </button>
              ))}
            </div>
            <div className="text-lg mb-4 text-gray-700 text-center">
              Wrong Guesses: <span className="font-bold text-red-500">{wrongGuesses}</span> / {maxWrongGuesses}
            </div>
          </>
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
          title="Hangman"
          onClose={() => setShowInstructions(false)}
          instructions={[
            "Guess the hidden word by selecting letters from the keyboard or pressing letter keys.",
            "Correct guesses reveal every matching position in the word.",
            "You can make up to six wrong guesses before the game ends.",
            "Win by revealing the complete word. Use Play Again to start a new word.",
          ]}
        />
      )}
    </div>
  );
};

export default HangmanPage;
