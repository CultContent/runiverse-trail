import React from 'react';

const Inventory: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded p-4 w-60">
      <h3 className="font-bold mb-2 text-gray-700">Inventory</h3>
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 16 }).map((_, index) => (
          <div key={index} className="border p-2 flex justify-center items-center bg-gray-100">
            <img src={`/path/to/item-${index}.png`} alt={`Item ${index}`} className="w-8 h-8" />
            <span className="text-xs text-gray-600">{`Item ${index}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
