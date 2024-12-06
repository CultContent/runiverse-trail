import React from 'react';

interface GameInterfaceProps {
  storyText: string;
  options: { optionText: string; nextStep: string }[];
  continueAvailable: boolean;
  onOptionClick: (nextStep: string) => void;
  onContinue: () => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ storyText, options, continueAvailable, onOptionClick, onContinue }) => {
  return (
    <div className="text-white p-4">
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-6xl font-bold text-center mb-6 font-atirose uppercase">Adventure</h1>
        <div className="bg-gray-700 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <p className="text-lg whitespace-pre-wrap">{storyText}</p>
          </div>
        </div>
        {options.length > 0 && (
          <div className="bg-gray-700 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 text-center">
              <h2 className="text-2xl font-semibold text-white">What would you like to do?</h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer rounded-lg shadow"
                  onClick={() => onOptionClick(option.nextStep)}
                >
                  <div className="p-4 text-center">
                    <p className="text-lg">{option.optionText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <button
            onClick={onContinue}
            className=" text-black mt-4 bg-yellow hover:bg-button-hover-bg py-2 px-4 rounded transition duration-300 font-ocra uppercase"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;
