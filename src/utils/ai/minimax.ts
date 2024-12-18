import { Board, Position, PieceColor, Move } from '../../types/chess';
import { evaluateBoard } from './evaluation';
import { calculatePossibleMoves } from '../core/moveEngine';
import { makeMove } from '../core/boardUtils';
import { validateMove } from '../core/moveEngine';

interface MoveEvaluation {
  from: Position;
  to: Position;
  score: number;
}

const getRandomMove = (moves: MoveEvaluation[]): MoveEvaluation => {
  return moves[Math.floor(Math.random() * moves.length)];
};

const getBestMove = (moves: MoveEvaluation[]): MoveEvaluation => {
  return moves.reduce((best, current) => 
    current.score > best.score ? current : best
  );
};

export const minimax = (
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  color: PieceColor
): number => {
  if (depth === 0) {
    return evaluateBoard(board, color);
  }

  const pieces = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === (isMaximizing ? color : (color === 'white' ? 'black' : 'white'))) {
        pieces.push({ row, col });
      }
    }
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const from of pieces) {
      const moves = calculatePossibleMoves(board, from);
      for (const to of moves) {
        const newBoard = makeMove(board, from, to);
        const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, color);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const from of pieces) {
      const moves = calculatePossibleMoves(board, from);
      for (const to of moves) {
        const newBoard = makeMove(board, from, to);
        const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, color);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
};