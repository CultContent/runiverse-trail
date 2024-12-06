import React from 'react';
import CharacterCreation from '../components/Game/CharacterCreation';

const CharacterCreationPage: React.FC = () => {
  return (
    <div className="h-full mx-auto space-y-4">
      <CharacterCreation />
    </div>
  );
};

export default CharacterCreationPage;
