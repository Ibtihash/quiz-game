
import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';

const BOARD_SIZE = 20;
const CELL_SIZE = 20; // in pixels

const SnakeGamePage = () => {
  const [gameMode, setGameMode] = useState('Easy');
  const [gameState, setGameState] = useState('StartMenu'); // 'StartMenu', 'Playing', 'GameOver'
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [fruit, setFruit] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [fruitEatenCount, setFruitEatenCount] = useState(0);
  const [isHugeFruit, setIsHugeFruit] = useState(false);
  const [hasScoreBeenSubmitted, setHasScoreBeenSubmitted] = useState(false);

  const username = localStorage.getItem('quiz_username');

  const generateFruit = useCallback((snakeBody, currentObstacles) => {
    let newFruit;
    do {
      newFruit = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (
      snakeBody.some(segment => segment.x === newFruit.x && segment.y === newFruit.y) ||
      currentObstacles.some(obstacle => obstacle.x === newFruit.x && obstacle.y === newFruit.y)
    );
    return newFruit;
  }, []);

  const generateObstacles = useCallback(() => {
    const newObstacles = [];
    for (let i = 0; i < 10; i++) {
      let newObstacle;
      do {
        newObstacle = {
          x: Math.floor(Math.random() * BOARD_SIZE),
          y: Math.floor(Math.random() * BOARD_SIZE),
        };
      } while (
        (newObstacle.x > 5 && newObstacle.x < 15 && newObstacle.y > 5 && newObstacle.y < 15)
      );
      newObstacles.push(newObstacle);
    }
    return newObstacles;
  }, []);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setScore(0);
    setFruitEatenCount(0);
    setIsHugeFruit(false);
    setHasScoreBeenSubmitted(false); // Reset submission status
    let currentObstacles = [];
    if (gameMode === 'Hard') {
      currentObstacles = generateObstacles();
      setObstacles(currentObstacles);
    } else {
      setObstacles([]);
    }
    setFruit(generateFruit([{ x: 10, y: 10 }], currentObstacles));
    setGameState('Playing');
  }, [gameMode, generateFruit, generateObstacles]);

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  }, [direction]);

  useEffect(() => {
    if (gameState === 'Playing') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [gameState, handleKeyDown]);

  const gameLoop = useCallback(() => {
    if (gameState !== 'Playing') return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
        default:
          break;
      }

      // Wall collision
      if (gameMode === 'Easy') {
        if (head.x < 0) head.x = BOARD_SIZE - 1;
        if (head.x >= BOARD_SIZE) head.x = 0;
        if (head.y < 0) head.y = BOARD_SIZE - 1;
        if (head.y >= BOARD_SIZE) head.y = 0;
      } else if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        setGameState('GameOver');
        return prevSnake;
      }

      // Self collision
      for (let i = 1; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
          setGameState('GameOver');
          return prevSnake;
        }
      }
      
      // Obstacle collision
      if (gameMode === 'Hard' && obstacles.some(ob => ob.x === head.x && ob.y === head.y)) {
        setGameState('GameOver');
        return prevSnake;
      }

      newSnake.unshift(head);

      // Fruit collision
      if (head.x === fruit.x && head.y === fruit.y) {
        const points = isHugeFruit ? 10 : 4;
        setScore(prevScore => prevScore + points);
        setFruitEatenCount(prevCount => {
          const newCount = prevCount + 1;
          if (newCount % 4 === 0) {
            setIsHugeFruit(true);
          } else {
            setIsHugeFruit(false);
          }
          return newCount;
        });
        setFruit(generateFruit(newSnake, obstacles));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameState, direction, gameMode, fruit, obstacles, isHugeFruit, generateFruit]);

  useEffect(() => {
    const interval = setInterval(gameLoop, 150);
    return () => clearInterval(interval);
  }, [gameLoop]);

  useEffect(() => {
    if (gameState === 'GameOver' && score > 0 && !hasScoreBeenSubmitted) {
      API.postSnakeScore({ username, score })
        .then(() => {
          setHasScoreBeenSubmitted(true);
        })
        .catch(err => console.error(err));
    }
  }, [gameState, score, username, hasScoreBeenSubmitted]);

  const renderCell = (x, y) => {
    const isSnake = snake.some(segment => segment.x === x && segment.y === y);
    const isSnakeHead = snake[0].x === x && snake[0].y === y;
    const isFruit = fruit.x === x && fruit.y === y;
    const isObstacle = gameMode === 'Hard' && obstacles.some(ob => ob.x === x && ob.y === y);
    const isHuge = isHugeFruit && isFruit;

    let cellClass = 'w-5 h-5';
    if (isSnake) cellClass += ' bg-green-500';
    if (isSnakeHead) cellClass += ' bg-green-700';
    if (isFruit) cellClass += isHuge ? ' bg-yellow-500' : ' bg-red-500';
    if (isObstacle) cellClass += ' bg-gray-800';
    if (!isSnake && !isFruit && !isObstacle) cellClass += ' bg-gray-200';
    if (gameMode !== 'Easy') cellClass += ' border border-gray-300';
    if (isHuge) cellClass += ' rounded-full';


    return <div key={`${x}-${y}`} className={cellClass} style={{ width: CELL_SIZE, height: CELL_SIZE }}></div>;
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center my-4">Snake Game</h1>
      <div className="flex gap-4 mb-4">
        <div className="text-lg font-semibold">Score: {score}</div>
        <div className="text-lg font-semibold">High Score: {highScore}</div>
      </div>

      {gameState === 'StartMenu' && (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">Select Difficulty</h2>
          <div className="flex gap-4">
            <button onClick={() => { setGameMode('Easy'); resetGame(); }} className="px-4 py-2 bg-blue-500 text-white rounded">Easy</button>
            <button onClick={() => { setGameMode('Medium'); resetGame(); }} className="px-4 py-2 bg-yellow-500 text-white rounded">Medium</button>
            <button onClick={() => { setGameMode('Hard'); resetGame(); }} className="px-4 py-2 bg-red-500 text-white rounded">Hard</button>
          </div>
        </div>
      )}

      {gameState === 'Playing' && (
        <div className="grid border-2 border-gray-400" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) =>
            renderCell(i % BOARD_SIZE, Math.floor(i / BOARD_SIZE))
          )}
        </div>
      )}

      {gameState === 'GameOver' && (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">Game Over</h2>
          <p className="text-xl">Your Score: {score}</p>
          <button onClick={resetGame} className="px-4 py-2 bg-blue-500 text-white rounded">Play Again</button>
        </div>
      )}
    </div>
  );
};

export default SnakeGamePage;
