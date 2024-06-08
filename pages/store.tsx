import React from 'react';
import CharacterPreview from '../components/Game/Shop/CharacterPreview';
import Inventory from '../components/Game/Shop/Inventory';
import Store from '../components/Game/Shop/Store';

const StorePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-4 bg-gray-800">
    <div className="flex space-x-4">
        <CharacterPreview />
        
        <Store />
        <Inventory />
      </div>
      
    </div>
  );
};

export default StorePage;
