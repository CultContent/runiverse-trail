// pages/game.tsx
import React from 'react';
import GameInterface from '../components/Game/GameInterface';

const GamePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GameInterface />
    </div>
  );
};

export default GamePage;
