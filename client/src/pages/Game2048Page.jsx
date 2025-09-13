import React, { useState, useEffect, useCallback } from "react";
import { API } from "../api";

// Utility Functions
const initialBoard = () => {
  const board = Array(4).fill(0).map(() => Array(4).fill(0));
  addRandomTile(board);
  addRandomTile(board);
  return board;
};

const addRandomTile = (board) => {
  const emptyCells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({ r, c });
      }
    }
  }
  if (emptyCells.length > 0) {
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
};

const slideTiles = (row) => {
  let newRow = row.filter((tile) => tile !== 0);
  let zeros = Array(row.length - newRow.length).fill(0);
  return newRow.concat(zeros);
};

const mergeTiles = (row) => {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }
  return row;
};

const rotateBoard = (board) => {
  const newBoard = Array(4).fill(0).map(() => Array(4).fill(0));
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      newBoard[c][3 - r] = board[r][c];
    }
  }
  return newBoard;
};

// Main Page Component
const Game2048Page = () => {
  const [board, setBoard] = useState(initialBoard);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const checkGameOver = useCallback((currentBoard) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentBoard[r][c] === 0) return false;
        if (r < 3 && currentBoard[r][c] === currentBoard[r + 1][c]) return false;
        if (c < 3 && currentBoard[r][c] === currentBoard[r][c + 1]) return false;
      }
    }
    return true;
  }, []);

  const checkGameWon = useCallback((currentBoard) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentBoard[r][c] === 2048) return true;
      }
    }
    return false;
  }, []);

  const move = useCallback((direction) => {
    if (gameOver || gameWon) return;

    let newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
    let currentScore = score;

    const applyMove = (row) => {
      const originalRow = [...row];
      let processedRow = slideTiles(row);
      processedRow = mergeTiles(processedRow);
      processedRow = slideTiles(processedRow);

      for (let i = 0; i < originalRow.length; i++) {
        if (originalRow[i] !== processedRow[i]) moved = true;
        if (originalRow[i] !== 0 && processedRow[i] === originalRow[i] * 2) {
          currentScore += processedRow[i];
        }
      }
      return processedRow;
    };

    switch (direction) {
      case "left":
        for (let r = 0; r < 4; r++) newBoard[r] = applyMove(newBoard[r]);
        break;
      case "right":
        for (let r = 0; r < 4; r++)
          newBoard[r] = applyMove(newBoard[r].reverse()).reverse();
        break;
      case "up":
        newBoard = rotateBoard(newBoard);
        for (let r = 0; r < 4; r++) newBoard[r] = applyMove(newBoard[r]);
        newBoard = rotateBoard(rotateBoard(rotateBoard(newBoard)));
        break;
      case "down":
        newBoard = rotateBoard(newBoard);
        for (let r = 0; r < 4; r++)
          newBoard[r] = applyMove(newBoard[r].reverse()).reverse();
        newBoard = rotateBoard(rotateBoard(rotateBoard(newBoard)));
        break;
      default:
        break;
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(currentScore);
      if (checkGameWon(newBoard)) setGameWon(true);
      else if (checkGameOver(newBoard)) setGameOver(true);
    } else if (checkGameOver(newBoard)) {
      setGameOver(true);
    }
  }, [board, score, gameOver, gameWon, checkGameOver, checkGameWon]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          move("up");
          break;
        case "ArrowDown":
          move("down");
          break;
        case "ArrowLeft":
          move("left");
          break;
        case "ArrowRight":
          move("right");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move]);

  const submitScore = async () => {
    const username = localStorage.getItem("quiz_username") || "Guest";
    try {
      await API.postGame2048Score({ username, score });
    } catch (error) {
      console.error("Failed to submit score", error);
    }
  };

  useEffect(() => {
    if (gameOver) {
      submitScore();
    }
  }, [gameOver]);

  const resetGame = () => {
    setBoard(initialBoard());
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  };

  const getTileColor = (value) => {
    switch (value) {
      case 2: return "bg-emerald-500";
      case 4: return "bg-emerald-600";
      case 8: return "bg-emerald-700";
      case 16: return "bg-emerald-800";
      case 32: return "bg-emerald-900";
      case 64: return "bg-teal-500";
      case 128: return "bg-teal-600";
      case 256: return "bg-teal-700";
      case 512: return "bg-teal-800";
      case 1024: return "bg-teal-900";
      case 2048: return "bg-blue-500";
      default: return "bg-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      {/* Removed <Header /> */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8">2048 Game</h1>

      <div className="flex flex-col items-center">
        <div className="flex justify-between w-full max-w-md mb-4">
          <div className="text-xl font-bold">Score: {score}</div>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            New Game
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 p-4 bg-gray-400 rounded-lg shadow-lg">
          {board.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-20 h-20 flex items-center justify-center rounded-md text-3xl font-bold text-white ${getTileColor(tile)}`}
              >
                {tile !== 0 ? tile : ""}
              </div>
            ))
          )}
        </div>

        {gameWon && <div className="mt-4 text-3xl font-bold text-green-600">You Win!</div>}
        {gameOver && <div className="mt-4 text-3xl font-bold text-red-600">Game Over!</div>}
      </div>
    </div>
  );
};

export default Game2048Page;
