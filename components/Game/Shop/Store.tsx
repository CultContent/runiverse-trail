import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../../context/CharacterContext';

const Store: React.FC = () => {
  const { selectedCharacter, updateCharacterAttributes } = useCharacter();
  const [activeTab, setActiveTab] = useState('head');
  const [items, setItems] = useState<{ [key: string]: { name: string; path: string }[] }>({
    head: [],
    body: [],
    prop: [],
  });

  useEffect(() => {
    if (selectedCharacter) {
      console.log('Fetching store items for contract:', selectedCharacter.contract);
      fetch(`/api/store/outfits?contract=${selectedCharacter.contract}`)
        .then(response => response.json())
        .then(data => {
          console.log('Fetched store items:', data);
          setItems(data);
        })
        .catch(error => console.error('Error fetching store items:', error));
    }
  }, [selectedCharacter]);

  const handleItemClick = (category: string, itemName: string) => {
    if (!selectedCharacter || !selectedCharacter.attributes) {
      console.log('Selected character or attributes missing.', selectedCharacter);
      return;
    }
    console.log('Item clicked:', category, itemName);
    const updatedAttributes = selectedCharacter.attributes.map(attr =>
      attr.trait_type.toLowerCase() === category 
        ? { ...attr, value: itemName.replace(/\s+/g, '_').toLowerCase() }
        : attr
    );
    console.log('Updated Attributes:', updatedAttributes);
    updateCharacterAttributes(updatedAttributes);
  };

  const getFilteredHeads = () => {
    if (!selectedCharacter || !selectedCharacter.attributes) return items.head;
    const headTrait = selectedCharacter.attributes.find(attr => attr.trait_type.toLowerCase() === 'head');
    if (!headTrait) return items.head;
    return items.head.filter(item => item.name.startsWith(headTrait.value as string));
  };

  const getItemsToDisplay = () => {
    if (activeTab === 'head') {
      return getFilteredHeads();
    }
    return items[activeTab];
  };

  return (
    <div className="bg-white shadow-md rounded p-4 w-full">
      <div className="flex mb-4 space-x-2">
        {Object.keys(items).map(tab => (
          <button
            key={tab}
            className={`py-2 px-4 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => {
              console.log('Tab clicked:', tab);
              setActiveTab(tab);
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {getItemsToDisplay().map((item, index) => (
          <div
            key={index}
            className="border p-4 relative group bg-gray-100 cursor-pointer"
            onClick={() => {
              console.log('Item clicked - category:', activeTab, 'item:', item.name);
              handleItemClick(activeTab, item.name);
            }}
          >
            <img src={item.path} alt={item.name} className="w-32 h-32 mx-auto" />
            <div className="mt-2 text-lg text-gray-700 text-center">{item.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
            <div className="flex justify-center mt-2 space-x-2">
              <button className="bg-blue-500 text-white py-1 px-2 rounded text-sm">Buy</button>
              <button className="bg-gray-500 text-white py-1 px-2 rounded text-sm">Gift</button>
              <button className="bg-green-500 text-white py-1 px-2 rounded text-sm">Reserve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
