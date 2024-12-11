import React from 'react';
import CharacterPreview from '../components/Game/Shop/CharacterPreview';
import Inventory from '../components/Game/Shop/Inventory';
import Store from '../components/Game/Shop/Store';

const StorePage: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center min-h-screen p-4 space-y-4 my-16">
    <div className="flex flex-col items-center space-x-4">

        <h1 className="text-5xl font-atirose uppercase mb-8 text-center">Runiverse <br/>store</h1>
        <Store />

      </div>
      
    </div>
  );
};

export default StorePage;
