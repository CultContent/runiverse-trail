import React, { useState } from 'react';

type TabType = 'event' | 'equip';

const Store: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('event');

  const items: { [key in TabType]: { name: string; price: string; }[] } = {
    event: [
      { name: '1 Day 2x EXP', price: '9,000 NX' },
      { name: '4 Hour 2x EXP', price: '2,000 NX' },
    ],
    equip: [
      { name: 'Royal Hair Coupon', price: '3,300 NX' },
      { name: 'Royal Face Coupon', price: '3,300 NX' },
    ],
  };

  return (
    <div className="bg-white shadow-md rounded p-4 w-full">
      <div className="flex mb-4 space-x-2">
        {Object.keys(items).map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => setActiveTab(tab as TabType)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items[activeTab].map((item, index) => (
          <div key={index} className="border p-4 relative group bg-gray-100">
            <img src={`/path/to/${item.name.replace(/\s/g, '-').toLowerCase()}.png`} alt={item.name} className="w-16 h-16" />
            <div className="absolute top-0 right-0 bg-gray-700 text-white text-xs p-1">
              {item.price}
            </div>
            <div className="absolute bottom-0 left-0 bg-white text-black text-xs p-1 hidden group-hover:block">
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
