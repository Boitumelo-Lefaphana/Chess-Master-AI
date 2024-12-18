import { Board, Position, Piece, Move } from '../types/chess';

export const handleCastling = (
  board: Board,
  from: Position,
  to: Position,
  piece: Piece
): Board | null => {
  if (piece.type !== 'king') return null;
  
  const dx = to.col - from.col;
  if (Math.abs(dx) !== 2) return null;
  
  const newBoard = board.map(row => [...row]);
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;
  
  // Move rook
  const rookFromCol = dx > 0 ? 7 : 0;
  const rookToCol = dx > 0 ? to.col - 1 : to.col + 1;
  const rook = board[from.row][rookFromCol];
  
  if (rook && rook.type === 'rook') {
    newBoard[from.row][rookToCol] = rook;
    newBoard[from.row][rookFromCol] = null;
  }
  
  return newBoard;
};

export const handleEnPassant = (
  board: Board,
  from: Position,
  to: Position,
  piece: Piece,
  lastMove: Move | null
): Board | null => {
  if (piece.type !== 'pawn') return null;
  if (!lastMove) return null;
  
  const lastPiece = board[lastMove.to.row][lastMove.to.col];
  if (!lastPiece || lastPiece.type !== 'pawn') return null;
  
  const dx = Math.abs(to.col - from.col);
  const dy = to.row - from.row;
  const direction = piece.color === 'white' ? -1 : 1;
  
  if (dx === 1 && dy === direction) {
    if (lastMove.from.row === (piece.color === 'white' ? 1 : 6) &&
        lastMove.to.row === (piece.color === 'white' ? 3 : 4) &&
        lastMove.to.col === to.col) {
      const newBoard = board.map(row => [...row]);
      newBoard[to.row][to.col] = piece;
      newBoard[from.row][from.col] = null;
      newBoard[lastMove.to.row][lastMove.to.col] = null;
      return newBoard;
    }
  }
  
  return null;
};

export const handlePromotion = (
  board: Board,
  to: Position,
  piece: Piece
): Board | null => {
  if (piece.type !== 'pawn') return null;
  
  const promotionRow = piece.color === 'white' ? 0 : 7;
  if (to.row !== promotionRow) return null;
  
  const newBoard = board.map(row => [...row]);
  newBoard[to.row][to.col] = { ...piece, type: 'queen' }; // Auto-promote to queen
  return newBoard;
};