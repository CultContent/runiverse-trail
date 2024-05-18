import React from 'react';

const CharacterPreview: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded p-4 w-60">
      <div className="text-center mb-2">
        <h3 className="font-bold text-gray-700">Character ID</h3>
        <input className="border p-1 rounded w-full bg-gray-100 text-gray-700" type="text" value="Artist" readOnly />
      </div>
      <div className="flex justify-center mb-4 relative">
        <img src="/path/to/character.png" alt="Character" className="z-10" />
        <img src="/path/to/corgi.png" alt="Corgi Pup" className="absolute bottom-0 right-0 z-0" />
      </div>
      <div className="flex justify-center space-x-2">
        <button className="bg-blue-500 text-white py-1 px-4 rounded">Buy Equipped Item</button>
        <button className="bg-gray-500 text-white py-1 px-4 rounded">Return to Default</button>
      </div>
    </div>
  );
};

export default CharacterPreview;
