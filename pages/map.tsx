import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Coordinates {
  x: number;
  y: number;
}

interface LocationData {
  name: string;
  description: string;
  imageUrl?: string;
}

interface LocationMap {
  [key: string]: LocationData;
}

interface RuniverseMapProps {
  width?: number;
  height?: number;
  gridSize?: number;
}

const RuniverseMap: React.FC<RuniverseMapProps> = ({
  width = 1000,
  height = 600,
  gridSize = 50
}) => {
  const [selectedCell, setSelectedCell] = useState<Coordinates | null>(null);
  
  const COLS = Math.floor(width / gridSize);
  const ROWS = Math.floor(height / gridSize);

  const locationData: LocationMap = {
    "3-2": {
      name: "The Court of Chaos Magic",
      description: "A mysterious court where chaos magic reigns supreme.",
    },
    "2-1": {
      name: "Purple Wizard Pavilion",
      description: "Home to the enigmatic Purple Wizard and their magical experiments.",
    },
  };

  const handleCellClick = (x: number, y: number): void => {
    setSelectedCell({ x, y });
  };

  const closePopup = (): void => {
    setSelectedCell(null);
  };

  const getLocationData = (x: number, y: number): LocationData | null => {
    const key = `${x}-${y}`;
    return locationData[key] || null;
  };

  return (
    <div className="relative w-full flex items-center flex-col justify-center max-w-8xl mx-auto h-screen">
      <div 
        className="relative border border-gray-300"
        style={{ 
          width,
          height,
          backgroundColor: '#d4cec0'
        }}
      >
        <img 
          src="/img/runiversemap.png"
          alt="Runiverse Map"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: ROWS }).map((_, y) => (
            <div key={y} className="flex">
              {Array.from({ length: COLS }).map((_, x) => (
                <div
                  key={`${x}-${y}`}
                  className="border border-black border-opacity-20 hover:bg-white hover:bg-opacity-20 cursor-pointer transition-colors"
                  style={{ width: gridSize, height: gridSize }}
                  onClick={() => handleCellClick(x, y)}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="absolute top-0 left-0">
          {Array.from({ length: COLS }).map((_, x) => (
            <div
              key={x}
              className="absolute text-xs text-white bg-black bg-opacity-50 px-1"
              style={{ left: x * gridSize }}
            >
              {x}
            </div>
          ))}
          {Array.from({ length: ROWS }).map((_, y) => (
            <div
              key={y}
              className="absolute text-xs text-white bg-black bg-opacity-50 px-1"
              style={{ top: y * gridSize }}
            >
              {y}
            </div>
          ))}
        </div>

        {selectedCell && (
          <div 
            className="absolute bg-white rounded-lg shadow-xl p-4 w-64"
            style={{
              left: (selectedCell.x * gridSize) + gridSize,
              top: (selectedCell.y * gridSize) + gridSize,
              transform: 'translate(-50%, -50%)',
              zIndex: 1000
            }}
          >
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close popup"
            >
              <X size={16} />
            </button>
            
            <div className="mb-3">
              <img 
                src="/api/placeholder/200/150"
                alt="Location Preview"
                className="w-full rounded-lg"
              />
            </div>
            
            <h3 className="font-bold mb-2">
              {getLocationData(selectedCell.x, selectedCell.y)?.name || 
                `Location (${selectedCell.x}, ${selectedCell.y})`}
            </h3>
            <p className="text-sm text-gray-600">
              {getLocationData(selectedCell.x, selectedCell.y)?.description || 
                `This mysterious location at coordinates (${selectedCell.x}, ${selectedCell.y}) holds many secrets waiting to be discovered...`}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Click on any grid cell to learn more about that location.
      </div>
    </div>
  );
};

export default RuniverseMap;