// GameInterface.tsx
import React from 'react';

const GameInterface: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-800 text-white flex justify-center">
      <div className="w-full max-w-5xl p-4 sm:p-6 bg-gray-800 text-white rounded-lg shadow-lg flex flex-col">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6">Outside the Court of Chaos Magic</h1>
        <div className="w-full space-y-4 sm:space-y-6 flex flex-col items-center">
          <img
            src="http://localhost:3000/gameimages/court_of_chaos_magic.png"
            alt="Court of Chaos Magic"
            className="w-full rounded-lg"
          />
          <div className="w-full bg-gray-700 p-4 sm:p-6 rounded-lg shadow-inner">
            <p className="text-justify text-sm sm:text-base lg:text-lg">
              "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born..."
              "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born..."
              "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born..."
              "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born..."
              "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born..."
              "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born..."
              "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born..."
              "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born..."
            </p>
          </div>
          <div className="w-full bg-gray-700 p-4 sm:p-6 rounded-lg shadow-inner text-center">
            <p className="text-xl sm:text-2xl lg:text-3xl font-semibold">What would you like to do aboard the ship?</p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8 rounded-lg text-base sm:text-lg lg:text-xl">
              Check out crew quarters
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8 rounded-lg text-base sm:text-lg lg:text-xl">
              Rummage through bags
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8 rounded-lg text-base sm:text-lg lg:text-xl">
              Throw supplies overboard
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8 rounded-lg text-base sm:text-lg lg:text-xl">
              Leave and go to "The Weird House"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;
