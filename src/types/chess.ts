export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export type Position = {
  row: number;
  col: number;
};

export type Board = (Piece | null)[][];

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  promotion?: PieceType;
  castle?: 'kingside' | 'queenside';
  enPassant?: boolean;
}

export interface GameState {
  board: Board;
  currentPlayer: PieceColor;
  moveHistory: Move[];
  isCheck: boolean;
  isCheckmate: boolean;
  selectedSquare: Position | null;
  possibleMoves: Position[];
}