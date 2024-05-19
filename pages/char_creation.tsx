import React from 'react';
import CharacterCreation from '../components/Game/CharacterCreation';

const CharacterCreationPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-4 bg-gray-800">

      <CharacterCreation />
    </div>
  );
};

export default CharacterCreationPage;
