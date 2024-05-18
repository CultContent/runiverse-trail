// CharacterContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Character {
  id: string;
  contract: string;
}

interface CharacterContextType {
  selectedCharacter: Character | null;
  setSelectedCharacter: (character: Character) => void;
  characterImageUrl: string | null;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const characterImageUrl = selectedCharacter 
    ? `/characters/${selectedCharacter.contract}/${selectedCharacter.id}.png` 
    : null;

  return (
    <CharacterContext.Provider value={{ selectedCharacter, setSelectedCharacter, characterImageUrl }}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = (): CharacterContextType => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
