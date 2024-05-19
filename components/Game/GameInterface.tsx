// GameInterface.tsx
import React from 'react';

const GameInterface: React.FC = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-6">Sloane's Ship (Celine)</h1>
      <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-6">
        <img
          src="path_to_image.jpg"
          alt="Ship"
          className="w-full lg:w-1/2 rounded-lg mb-6 lg:mb-0"
        />
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
            <p>
              "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born..."
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
            <p className="text-xl font-semibold">What would you like to do aboard the ship?</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg">
              Check out crew quarters
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg">
              Rummage through bags
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg">
              Throw supplies overboard
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg">
              Leave and go to "The Weird House"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;
