import { Board, Position, Piece } from '../../types/chess';
import { isPathClear } from './boardUtils';
import {
  isPawnMove,
  isKnightMove,
  isBishopMove,
  isRookMove,
  isQueenMove,
  isKingMove
} from './pieceValidation';

export const validateMove = (
  board: Board,
  from: Position,
  to: Position
): boolean => {
  const piece = board[from.row][from.col];
  if (!piece) return false;

  const targetPiece = board[to.row][to.col];
  if (targetPiece && targetPiece.color === piece.color) return false;

  switch (piece.type) {
    case 'pawn':
      return isPawnMove(board, from, to, piece);
    case 'knight':
      return isKnightMove(board, from, to);
    case 'bishop':
      return isBishopMove(board, from, to);
    case 'rook':
      return isRookMove(board, from, to);
    case 'queen':
      return isQueenMove(board, from, to);
    case 'king':
      return isKingMove(board, from, to, piece, []);
    default:
      return false;
  }
};

export const calculatePossibleMoves = (board: Board, from: Position): Position[] => {
  const possibleMoves: Position[] = [];
  const piece = board[from.row][from.col];
  if (!piece) return [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (validateMove(board, from, { row, col })) {
        possibleMoves.push({ row, col });
      }
    }
  }

  return possibleMoves;
};