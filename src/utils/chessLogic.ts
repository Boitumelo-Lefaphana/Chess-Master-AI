import { Board, Piece, Position } from '../types/chess';

export const createInitialBoard = (): Board => {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Initialize pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black' };
    board[6][i] = { type: 'pawn', color: 'white' };
  }

  // Initialize other pieces
  const pieces: ('rook' | 'knight' | 'bishop' | 'queen' | 'king')[] = 
    ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

  pieces.forEach((piece, i) => {
    board[0][i] = { type: piece, color: 'black' };
    board[7][i] = { type: piece, color: 'white' };
  });

  return board;
};

export const isValidMove = (
  board: Board,
  from: Position,
  to: Position,
  currentPlayer: 'white' | 'black'
): boolean => {
  const piece = board[from.row][from.col];
  if (!piece || piece.color !== currentPlayer) return false;
  
  // Basic move validation (simplified for this example)
  const dx = Math.abs(to.col - from.col);
  const dy = Math.abs(to.row - from.row);
  
  switch (piece.type) {
    case 'pawn':
      // Simplified pawn movement
      return dy === 1 && dx === 0;
    case 'rook':
      return dx === 0 || dy === 0;
    case 'knight':
      return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    case 'bishop':
      return dx === dy;
    case 'queen':
      return dx === dy || dx === 0 || dy === 0;
    case 'king':
      return dx <= 1 && dy <= 1;
    default:
      return false;
  }
};