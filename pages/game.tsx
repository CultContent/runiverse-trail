// pages/game.tsx
import React, { useState } from 'react';
import GameInterface from '../components/Game/GameInterface';

interface GameOption {
  optionText: string;
  nextStep: string;
}

const GamePage: React.FC = () => {
  const [storyText, setStoryText] = useState<string>('');
  const [options, setOptions] = useState<GameOption[]>([]);
  const [continueAvailable, setContinueAvailable] = useState<boolean>(false);

  const handleOptionClick = (nextStep: string) => {
    // Handle option selection using nextStep
  };

  const handleContinue = () => {
    // Handle continue action
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GameInterface 
        storyText={storyText}
        options={options}
        continueAvailable={continueAvailable}
        onOptionClick={handleOptionClick}
        onContinue={handleContinue}
      />
    </div>
  );
};

export default GamePage;
