import { Board, Position, PieceColor, Difficulty } from '../../types/chess';
import { calculatePossibleMoves } from '../core/moveEngine';
import { makeMove } from '../core/boardUtils';
import { minimax } from './minimax';

const DIFFICULTY_SETTINGS = {
  easy: { depth: 1, randomFactor: 0.7 },
  medium: { depth: 2, randomFactor: 0.3 },
  hard: { depth: 3, randomFactor: 0 }
};

export const getComputerMove = (
  board: Board,
  color: PieceColor,
  difficulty: Difficulty
): { from: Position; to: Position } | null => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const possibleMoves: { from: Position; to: Position; score: number }[] = [];

  // Collect all possible moves with their evaluations
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.color === color) {
        const moves = calculatePossibleMoves(board, { row, col });
        for (const move of moves) {
          const newBoard = makeMove(board, { row, col }, move);
          const score = minimax(
            newBoard,
            settings.depth,
            -Infinity,
            Infinity,
            false,
            color
          );
          possibleMoves.push({
            from: { row, col },
            to: move,
            score
          });
        }
      }
    }
  }

  if (possibleMoves.length === 0) return null;

  // Apply difficulty settings
  if (Math.random() < settings.randomFactor) {
    // Make a random move for lower difficulties
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    return possibleMoves[randomIndex];
  }

  // Find the best move
  const bestMove = possibleMoves.reduce((best, current) =>
    current.score > best.score ? current : best
  );

  return bestMove;
};