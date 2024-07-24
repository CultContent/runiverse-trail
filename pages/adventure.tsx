import React from 'react';
import RuniverseAdventure from '../components/Game/RuniverseAdventure';
import { CharacterProvider } from '../context/CharacterContext';

const AdventurePage: React.FC = () => {
  return (
    <CharacterProvider>
      <RuniverseAdventure />
    </CharacterProvider>
  );
};

export default AdventurePage;