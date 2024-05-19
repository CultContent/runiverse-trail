// CharacterContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Character {
  id: string;
  contract: string;
}

interface CharacterContextType {
  selectedCharacter: Character | null;
  setSelectedCharacter: (character: Character) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  useEffect(() => {
    // Load character from local storage if available
    const savedCharacter = localStorage.getItem('selectedCharacter');
    if (savedCharacter) {
      setSelectedCharacter(JSON.parse(savedCharacter));
    }
  }, []);

  const handleSetSelectedCharacter = (character: Character) => {
    setSelectedCharacter(character);
    localStorage.setItem('selectedCharacter', JSON.stringify(character));
  };

  return (
    <CharacterContext.Provider value={{ selectedCharacter, setSelectedCharacter: handleSetSelectedCharacter }}>
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
