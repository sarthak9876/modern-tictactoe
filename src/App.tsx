import React, { useState, useEffect } from 'react';
import { X, Circle, RotateCcw, Notebook as Robot, User } from 'lucide-react';

type Player = 'X' | 'O' | null;
type Board = Player[];
type GameMode = 'pvp' | 'ai';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

function App() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player>(null);
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [autoResetDelay, setAutoResetDelay] = useState(1500);

  const checkWinner = (squares: Board): Player => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const getAvailableMoves = (squares: Board): number[] => {
    return squares.reduce((moves: number[], square, index) => {
      if (!square) moves.push(index);
      return moves;
    }, []);
  };

  const minimax = (squares: Board, depth: number, isMaximizing: boolean): number => {
    const winner = checkWinner(squares);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (getAvailableMoves(squares).length === 0) return 0;

    const availableMoves = getAvailableMoves(squares);
    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (const move of availableMoves) {
      squares[move] = isMaximizing ? 'O' : 'X';
      const score = minimax(squares, depth + 1, !isMaximizing);
      squares[move] = null;
      bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
    }

    return bestScore;
  };

  const getBestMove = (squares: Board): number => {
    let bestScore = -Infinity;
    let bestMove = 0;
    const availableMoves = getAvailableMoves(squares);

    for (const move of availableMoves) {
      squares[move] = 'O';
      const score = minimax(squares, 0, false);
      squares[move] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  };

  const handleAIMove = () => {
    const bestMove = getBestMove([...board]);
    handleClick(bestMove);
  };

  useEffect(() => {
    if (gameMode === 'ai' && !isXNext && !winner) {
      const timer = setTimeout(() => {
        handleAIMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, winner]);

  const isDraw = !winner && board.every(square => square !== null);

  useEffect(() => {
    if (isDraw || winner) {
      const timer = setTimeout(() => {
        resetGame();
      }, autoResetDelay);
      return () => clearTimeout(timer);
    }
  }, [isDraw, winner]);

  const handleClick = (index: number) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const toggleGameMode = () => {
    setGameMode(prev => prev === 'pvp' ? 'ai' : 'pvp');
    resetGame();
  };

  const renderSquare = (index: number) => {
    return (
      <button
        className="w-24 h-24 border-2 border-gray-300 rounded-lg flex items-center justify-center
                   hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2
                   focus:ring-blue-400 focus:border-transparent"
        onClick={() => handleClick(index)}
        disabled={!!winner || !!board[index] || (gameMode === 'ai' && !isXNext)}
      >
        {board[index] === 'X' && <X className="w-12 h-12 text-blue-500" />}
        {board[index] === 'O' && <Circle className="w-12 h-12 text-red-500" />}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Tic Tac Toe</h1>
          <button
            onClick={toggleGameMode}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg
                     hover:bg-gray-200 transition-colors duration-200"
          >
            {gameMode === 'pvp' ? (
              <>
                <User className="w-5 h-5" />
                <span>vs Player</span>
              </>
            ) : (
              <>
                <Robot className="w-5 h-5" />
                <span>vs AI</span>
              </>
            )}
          </button>
        </div>
        
        <div className="mb-8">
          {!winner && !isDraw && (
            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-700">
              {gameMode === 'ai' && !isXNext ? (
                <div className="flex items-center gap-2">
                  AI thinking... <Robot className="w-6 h-6 animate-pulse" />
                </div>
              ) : (
                <>
                  Next Player: {isXNext ? 
                    <X className="w-6 h-6 text-blue-500" /> : 
                    <Circle className="w-6 h-6 text-red-500" />
                  }
                </>
              )}
            </div>
          )}
          {winner && (
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-600">
              Winner: {winner === 'X' ? 
                <X className="w-8 h-8 text-blue-500" /> : 
                <Circle className="w-8 h-8 text-red-500" />
              }
            </div>
          )}
          {isDraw && (
            <div className="text-2xl font-bold text-yellow-600 text-center">
              It's a Draw!
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {Array(9).fill(null).map((_, index) => (
            <div key={index}>
              {renderSquare(index)}
            </div>
          ))}
        </div>

        <button
          onClick={resetGame}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white
                     rounded-lg font-semibold flex items-center justify-center gap-2
                     hover:from-blue-600 hover:to-blue-700 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          <RotateCcw className="w-5 h-5" />
          Reset Game
        </button>
      </div>
    </div>
  );
}

export default App;