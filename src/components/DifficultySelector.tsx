import React from 'react';
import { Difficulty } from '../types/chess';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  onDifficultyChange,
}) => {
  return (
    <div className="flex gap-4 mb-6">
      {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
        <button
          key={level}
          onClick={() => onDifficultyChange(level)}
          className={`
            px-4 py-2 rounded-lg font-semibold capitalize
            ${
              difficulty === level
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          {level}
        </button>
      ))}
    </div>
  );
};