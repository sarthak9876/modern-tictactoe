# Modern Tic Tac Toe Game

A beautiful, responsive Tic Tac Toe game built with React, TypeScript, and Tailwind CSS. Features both Player vs Player and Player vs AI modes with an unbeatable AI opponent using the Minimax algorithm.

![Tic Tac Toe Preview](project-demo/project-demo-img.png)

## Features

- 🎮 Two game modes:
  - Player vs Player
  - Player vs AI (unbeatable)
- 🎨 Modern, responsive design with smooth animations
- 🤖 Intelligent AI using Minimax algorithm
- 🔄 Automatic game reset on completion
- 💅 Beautiful UI with Tailwind CSS
- 🎯 TypeScript for type safety
- 📱 Fully responsive for all devices

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (for icons)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tic-tac-toe.git
   cd tic-tac-toe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## How to Play

1. Choose your game mode (Player vs Player or Player vs AI) using the toggle button
2. In Player vs Player mode:
   - Players take turns clicking on the board
   - X goes first, followed by O
3. In Player vs AI mode:
   - You play as X
   - The AI plays as O
   - The AI is unbeatable and uses the Minimax algorithm
4. The game automatically resets when:
   - A player wins
   - The game ends in a draw

## AI Implementation Details

The AI in this game uses the Minimax algorithm to create an unbeatable opponent. You can find the implementation in `src/App.tsx`.

### How the AI Works

The Minimax algorithm works by:
1. Simulating all possible moves
2. Evaluating each move's outcome
3. Choosing the move that maximizes the AI's chances of winning while minimizing the player's chances

Key functions in the implementation:

1. `minimax(squares: Board, depth: number, isMaximizing: boolean): number`
   - Located in `src/App.tsx`
   - This is the core algorithm that recursively evaluates all possible moves
   - Parameters:
     - `squares`: Current board state
     - `depth`: Current depth in the game tree
     - `isMaximizing`: Whether it's maximizing (AI) or minimizing (player) turn
   - Returns a score for the current board state

2. `getBestMove(squares: Board): number`
   - Uses the minimax algorithm to determine the optimal move
   - Returns the index of the best possible move for the AI

3. `handleAIMove()`
   - Triggers the AI move after a short delay
   - Implements the chosen move on the game board

### Scoring System

The AI evaluates positions with the following scoring:
- Win for AI (O): +10 - depth
- Win for Player (X): depth - 10
- Draw: 0

The depth is subtracted/added to prefer winning in fewer moves and delaying losing as long as possible.

### Code Structure

```typescript
// Core minimax algorithm
const minimax = (squares: Board, depth: number, isMaximizing: boolean): number => {
  const winner = checkWinner(squares);
  if (winner === 'O') return 10 - depth;      // AI wins
  if (winner === 'X') return depth - 10;      // Player wins
  if (getAvailableMoves(squares).length === 0) return 0;  // Draw

  const availableMoves = getAvailableMoves(squares);
  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (const move of availableMoves) {
    squares[move] = isMaximizing ? 'O' : 'X';
    const score = minimax(squares, depth + 1, !isMaximizing);
    squares[move] = null;
    bestScore = isMaximizing ? 
      Math.max(score, bestScore) : 
      Math.min(score, bestScore);
  }

  return bestScore;
};

```

This implementation makes the AI unbeatable - the best a player can achieve against it is a draw.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.