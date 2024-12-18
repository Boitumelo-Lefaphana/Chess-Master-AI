import React, { useState, useCallback, useEffect } from 'react';
import { ChessBoard } from './components/ChessBoard';
import { DifficultySelector } from './components/DifficultySelector';
import { createInitialBoard } from './utils/chessLogic';
import { GameState, Position, Difficulty } from './types/chess';
import { Brain } from 'lucide-react';
import { handlePieceSelection, handlePieceMove } from './utils/gameState';
import { getComputerMove } from './utils/ai/computerPlayer';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    currentPlayer: 'white',
    moveHistory: [],
    isCheck: false,
    isCheckmate: false,
    selectedSquare: null,
    possibleMoves: []
  });

  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [isComputerThinking, setIsComputerThinking] = useState(false);

  useEffect(() => {
    if (gameState.currentPlayer === 'black' && !gameState.isCheckmate) {
      setIsComputerThinking(true);
      // Add a small delay to make the computer's "thinking" visible
      setTimeout(() => {
        const computerMove = getComputerMove(gameState.board, 'black', difficulty);
        if (computerMove) {
          setGameState(prev => ({
            ...prev,
            ...handlePieceMove(prev, computerMove.to, computerMove.from)
          }));
        }
        setIsComputerThinking(false);
      }, 500);
    }
  }, [gameState.currentPlayer, gameState.isCheckmate, difficulty]);

  const handleSquareClick = useCallback((position: Position) => {
    if (gameState.isCheckmate || gameState.currentPlayer === 'black' || isComputerThinking) return;

    setGameState(prev => {
      if (!prev.selectedSquare) {
        return {
          ...prev,
          ...handlePieceSelection(prev, position)
        };
      }

      if (!prev.possibleMoves.some(move => 
        move.row === position.row && move.col === position.col)) {
        return {
          ...prev,
          selectedSquare: null,
          possibleMoves: []
        };
      }

      return {
        ...prev,
        ...handlePieceMove(prev, position)
      };
    });
  }, [gameState.isCheckmate, isComputerThinking]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-xl p-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Brain className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Chess Master AI</h1>
        </div>

        <DifficultySelector 
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />

        <div className="mb-4 text-center">
          <p className="text-lg font-semibold text-gray-700">
            {isComputerThinking ? (
              <span className="text-blue-600">Computer is thinking...</span>
            ) : (
              <>Current Player: <span className="capitalize">{gameState.currentPlayer}</span></>
            )}
          </p>
          {gameState.isCheck && !gameState.isCheckmate && (
            <p className="text-red-600 font-bold mt-2">Check!</p>
          )}
          {gameState.isCheckmate && (
            <p className="text-red-600 font-bold mt-2">
              Checkmate! {gameState.currentPlayer === 'white' ? 'Black' : 'White'} wins!
            </p>
          )}
        </div>

        <ChessBoard
          board={gameState.board}
          onSquareClick={handleSquareClick}
          selectedSquare={gameState.selectedSquare}
          possibleMoves={gameState.possibleMoves}
        />

        <div className="mt-6 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Move History:</h3>
          <div className="max-h-32 overflow-y-auto">
            {gameState.moveHistory.map((move, index) => (
              <div key={index} className="mb-1">
                {index + 1}. {move.piece.color} {move.piece.type} 
                {move.captured ? ` captures ${move.captured.type}` : ''}
                {move.promotion ? ` promotes to ${move.promotion}` : ''}
                {move.castle ? ` castles ${move.castle}` : ''}
                {move.enPassant ? ' en passant' : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;