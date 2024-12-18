import { Board, Position, PieceColor } from '../../types/chess';

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

export const findKingPosition = (board: Board, kingColor: PieceColor): Position | null => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.type === 'king' && piece.color === kingColor) {
        return { row, col };
      }
    }
  }
  return null;
};

export const makeMove = (board: Board, from: Position, to: Position): Board => {
  const newBoard = board.map(row => [...row]);
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;
  return newBoard;
};