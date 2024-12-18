import { Board, Position, Move, GameState, PieceColor } from '../types/chess';
import { isInCheck, isCheckmate } from './core/checkValidation';
import { handleCastling, handleEnPassant, handlePromotion } from './specialMoves';
import { calculatePossibleMoves } from './core/moveEngine';
import { makeMove } from './core/boardUtils';

export const handlePieceSelection = (
  gameState: GameState,
  position: Position
): Partial<GameState> => {
  const piece = gameState.board[position.row][position.col];
  if (!piece || piece.color !== gameState.currentPlayer) {
    return {
      selectedSquare: null,
      possibleMoves: []
    };
  }

  return {
    selectedSquare: position,
    possibleMoves: calculatePossibleMoves(gameState.board, position)
  };
};

export const handlePieceMove = (
  gameState: GameState,
  to: Position,
  from: Position = gameState.selectedSquare!
): Partial<GameState> => {
  if (!from) return {};
  
  const piece = gameState.board[from.row][from.col]!;
  let newBoard = gameState.board;

  // Handle special moves
  const castleBoard = handleCastling(newBoard, from, to, piece);
  const enPassantBoard = handleEnPassant(
    newBoard, 
    from, 
    to, 
    piece, 
    gameState.moveHistory[gameState.moveHistory.length - 1]
  );
  const promotionBoard = handlePromotion(newBoard, to, piece);

  newBoard = castleBoard || enPassantBoard || promotionBoard || 
    makeMove(newBoard, from, to);

  const move: Move = {
    from,
    to,
    piece,
    captured: gameState.board[to.row][to.col] || undefined,
    castle: castleBoard ? (to.col > from.col ? 'kingside' : 'queenside') : undefined,
    enPassant: !!enPassantBoard,
    promotion: promotionBoard ? 'queen' : undefined
  };

  const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
  const newCheck = isInCheck(newBoard, nextPlayer);
  const newCheckmate = newCheck && isCheckmate(newBoard, nextPlayer);

  return {
    board: newBoard,
    currentPlayer: nextPlayer,
    moveHistory: [...gameState.moveHistory, move],
    isCheck: newCheck,
    isCheckmate: newCheckmate,
    selectedSquare: null,
    possibleMoves: []
  };
};