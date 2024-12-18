import { Board, Position, Piece, PieceColor } from '../types/chess';

export const isPathClear = (board: Board, from: Position, to: Position): boolean => {
  const dx = Math.sign(to.col - from.col);
  const dy = Math.sign(to.row - from.row);
  let x = from.col + dx;
  let y = from.row + dy;
  
  while (x !== to.col || y !== to.row) {
    if (board[y][x] !== null) {
      return false;
    }
    x += dx;
    y += dy;
  }
  
  return true;
};

export const isInCheck = (board: Board, kingColor: PieceColor): boolean => {
  // Find king position
  let kingPos: Position | null = null;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.type === 'king' && piece.color === kingColor) {
        kingPos = { row, col };
        break;
      }
    }
    if (kingPos) break;
  }
  
  if (!kingPos) return false;
  
  // Check if any opponent piece can capture the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== kingColor) {
        if (canPieceMove(board, { row, col }, kingPos)) {
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
          if (canPieceMove(board, { row: fromRow, col: fromCol }, { row: toRow, col: toCol })) {
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

export const makeMove = (board: Board, from: Position, to: Position): Board => {
  const newBoard = board.map(row => [...row]);
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;
  return newBoard;
};