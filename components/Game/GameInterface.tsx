import React, { useState, useEffect } from 'react';

interface GameInterfaceProps {
  storyText: string;
  options: { optionText: string; nextStep: string }[];
  onOptionClick: (nextStep: string) => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ storyText, options = [], onOptionClick }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
    setDisplayedText('');
  }, [storyText, options]);

  // Simulate typing effect for the story text
  useEffect(() => {
    if (currentIndex < storyText.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + storyText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 50); // Adjust this value for typing speed
      return () => clearTimeout(timer);
    }
  }, [currentIndex, storyText]);

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-6">Outside the Court of Chaos Magic</h1>

        {/* Image Section */}
        <img
          src="/gameimages/court_of_chaos_magic.png"
          alt="Court of Chaos Magic"
          className="w-full rounded-lg shadow-lg mb-6"
        />

        {/* Story Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center mb-4">Story</h2>
          {/* Render only the story text, filter out any raw JSON */}
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{displayedText}</p>
        </div>

        {/* Options Section */}
        {options.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">What would you like to do?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer rounded-lg shadow p-4 text-center"
                  onClick={() => onOptionClick(option.nextStep)}
                >
                  {/* Render only the option text */}
                  <p className="text-lg font-medium">{option.optionText}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameInterface;
