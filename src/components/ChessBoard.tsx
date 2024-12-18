import React from 'react';
import { Board, Position } from '../types/chess';

interface ChessBoardProps {
  board: Board;
  onSquareClick: (position: Position) => void;
  selectedSquare: Position | null;
  possibleMoves: Position[];
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  onSquareClick,
  selectedSquare,
  possibleMoves,
}) => {
  const renderPiece = (piece: any) => {
    if (!piece) return null;
    const pieceSymbols: Record<string, string> = {
      'white-king': '♔',
      'white-queen': '♕',
      'white-rook': '♖',
      'white-bishop': '♗',
      'white-knight': '♘',
      'white-pawn': '♙',
      'black-king': '♚',
      'black-queen': '♛',
      'black-rook': '♜',
      'black-bishop': '♝',
      'black-knight': '♞',
      'black-pawn': '♟',
    };
    return pieceSymbols[`${piece.color}-${piece.type}`];
  };

  const isPossibleMove = (row: number, col: number) => {
    return possibleMoves.some(move => move.row === row && move.col === col);
  };

  return (
    <div className="grid grid-cols-8 w-[560px] h-[560px] border-2 border-gray-800">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isLight = (rowIndex + colIndex) % 2 === 0;
          const isSelected = 
            selectedSquare?.row === rowIndex && 
            selectedSquare?.col === colIndex;
          const isPossible = isPossibleMove(rowIndex, colIndex);

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                flex items-center justify-center text-4xl cursor-pointer
                ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                ${isSelected ? 'ring-4 ring-blue-500' : ''}
                ${isPossible ? 'ring-4 ring-green-500' : ''}
                hover:opacity-90
                relative
              `}
              onClick={() => onSquareClick({ row: rowIndex, col: colIndex })}
            >
              {renderPiece(piece)}
              {isPossible && !piece && (
                <div className="absolute w-3 h-3 bg-green-500 rounded-full opacity-50" />
              )}
              {isPossible && piece && (
                <div className="absolute inset-0 ring-4 ring-red-500 opacity-50" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};