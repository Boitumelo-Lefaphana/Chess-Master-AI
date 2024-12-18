import { Board, Position, Piece } from '../types/chess';
import { isPathClear } from './boardUtils';

export const isPawnMove = (
  board: Board,
  from: Position,
  to: Position,
  piece: Piece
): boolean => {
  const direction = piece.color === 'white' ? -1 : 1;
  const startRow = piece.color === 'white' ? 6 : 1;
  
  const dx = to.col - from.col;
  const dy = to.row - from.row;
  
  // Regular move forward
  if (dx === 0 && dy === direction && !board[to.row][to.col]) {
    return true;
  }
  
  // Initial two-square move
  if (dx === 0 && dy === 2 * direction && from.row === startRow) {
    const intermediateRow = from.row + direction;
    return !board[intermediateRow][from.col] && !board[to.row][to.col];
  }
  
  // Capture
  if (Math.abs(dx) === 1 && dy === direction) {
    const targetPiece = board[to.row][to.col];
    return !!targetPiece && targetPiece.color !== piece.color;
  }
  
  return false;
};

export const isKnightMove = (
  board: Board,
  from: Position,
  to: Position
): boolean => {
  const dx = Math.abs(to.col - from.col);
  const dy = Math.abs(to.row - from.row);
  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
};

export const isBishopMove = (
  board: Board,
  from: Position,
  to: Position
): boolean => {
  const dx = Math.abs(to.col - from.col);
  const dy = Math.abs(to.row - from.row);
  return dx === dy && isPathClear(board, from, to);
};

export const isRookMove = (
  board: Board,
  from: Position,
  to: Position
): boolean => {
  const dx = Math.abs(to.col - from.col);
  const dy = Math.abs(to.row - from.row);
  return ((dx === 0 && dy > 0) || (dy === 0 && dx > 0)) && 
    isPathClear(board, from, to);
};

export const isQueenMove = (
  board: Board,
  from: Position,
  to: Position
): boolean => {
  return isBishopMove(board, from, to) || isRookMove(board, from, to);
};

export const isKingMove = (
  board: Board,
  from: Position,
  to: Position,
  piece: Piece,
  moveHistory: any[]
): boolean => {
  const dx = Math.abs(to.col - from.col);
  const dy = Math.abs(to.row - from.row);
  
  // Regular move
  if (dx <= 1 && dy <= 1) {
    return true;
  }
  
  // Castling
  if (dy === 0 && dx === 2) {
    if (piece.type !== 'king') return false;
    
    const row = from.row;
    const rookCol = to.col > from.col ? 7 : 0;
    const rook = board[row][rookCol];
    
    if (!rook || rook.type !== 'rook' || rook.color !== piece.color) {
      return false;
    }
    
    // Check if path is clear
    const direction = to.col > from.col ? 1 : -1;
    for (let col = from.col + direction; col !== rookCol; col += direction) {
      if (board[row][col] !== null) {
        return false;
      }
    }
    
    return true;
  }
  
  return false;
};