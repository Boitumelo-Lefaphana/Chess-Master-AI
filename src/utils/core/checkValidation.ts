import { Board, Position, PieceColor } from '../../types/chess';
import { findKingPosition } from './boardUtils';
import { validateMove } from './moveEngine';
import { makeMove } from './boardUtils';

export const isInCheck = (board: Board, kingColor: PieceColor): boolean => {
  const kingPos = findKingPosition(board, kingColor);
  if (!kingPos) return false;
  
  // Check if any opponent piece can capture the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== kingColor) {
        if (validateMove(board, { row, col }, kingPos)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

export const isCheckmate = (board: Board, kingColor: PieceColor): boolean => {
  if (!isInCheck(board, kingColor)) return false;
  
  // Try all possible moves for all pieces
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol];
      if (piece?.color !== kingColor) continue;
      
      for (let toRow = 0; toRow < 8; toRow++) {
        for (let toCol = 0; toCol < 8; toCol++) {
          if (validateMove(board, { row: fromRow, col: fromCol }, { row: toRow, col: toCol })) {
            // Try the move
            const newBoard = makeMove(board, { row: fromRow, col: fromCol }, { row: toRow, col: toCol });
            if (!isInCheck(newBoard, kingColor)) {
              return false;
            }
          }
        }
      }
    }
  }
  
  return true;
};