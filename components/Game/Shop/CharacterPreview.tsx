import React, { useState } from 'react';
import { useCharacter } from '../../../context/CharacterContext';

const WIZARD_CONTRACT = "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42";
const WARRIOR_CONTRACT = "0x9690b63eb85467be5267a3603f770589ab12dc95";
const BABY_CONTRACT = "0x4b1e130ae84c97b931ffbe91ead6b1da16993d45";
const SOUL_CONTRACT = "0x251b5f14a825c537ff788604ea1b58e49b70726f";

interface Attribute {
  trait_type: string;
  value: string | number;
  filename: string | null;
}

interface EquippedItems {
  [key: string]: string | null;
}

const CharacterPreview: React.FC = () => {
  const { selectedCharacter } = useCharacter();
  const [equippedItems, setEquippedItems] = useState<EquippedItems>({});

  const getTraitImage = (trait: Attribute) => {
    if (selectedCharacter) {
      const collectionFolder = getCollectionFolder(selectedCharacter.contract);
      const traitValue = typeof trait.value === 'string' ? trait.value.replace(/\s+/g, '_').toLowerCase() : trait.value;
      return `/assets/${collectionFolder}/${trait.trait_type.toLowerCase()}/${traitValue}.png`;
    }
    return '';
  };

  const getCollectionFolder = (contract: string) => {
    switch (contract.toLowerCase()) {
      case WIZARD_CONTRACT.toLowerCase():
        return 'wizards';
      case WARRIOR_CONTRACT.toLowerCase():
        return 'warriors';
      case BABY_CONTRACT.toLowerCase():
        return 'babies';
      case SOUL_CONTRACT.toLowerCase():
        return 'souls';
      default:
        return '';
    }
  };

  const handleEquipItem = (traitType: string, value: string) => {
    setEquippedItems(prev => ({
      ...prev,
      [traitType.toLowerCase()]: value === prev[traitType.toLowerCase()] ? null : value
    }));
  };

  const handleResetEquipped = () => {
    setEquippedItems({});
  };

  const handleBuyEquipped = () => {
    // Implement purchase logic here
    console.log('Buying equipped items:', equippedItems);
  };

  if (!selectedCharacter || !selectedCharacter.attributes) {
    return <div className="text-gray-700">Loading...</div>;
  }

  // Define the order of traits to ensure correct layering
  // Removed 'background' since it's not one of the required traits
  const traitOrder: { [key: string]: number } = {
    familiar: 1,
    bottoms: 2,
    tops: 3,
    body: 4,
    prop: 5,
    head: 6,
    eye_accessory: 7,
    hats: 8
  };

  // Sort the attributes based on the defined order
  const sortedAttributes = selectedCharacter.attributes
    .filter(attr => traitOrder.hasOwnProperty(attr.trait_type.toLowerCase()))
    .sort((a, b) => traitOrder[a.trait_type.toLowerCase()] - traitOrder[b.trait_type.toLowerCase()]);

  return (
    <div className="bg-white shadow-md rounded p-4 w-60">
      <div className="text-center mb-2">
        <h3 className="font-bold text-gray-700">Character ID</h3>
        <input 
          className="border p-1 rounded w-full bg-gray-100 text-gray-700" 
          type="text" 
          value={selectedCharacter.name} 
          readOnly 
          aria-label="Character ID"
        />
      </div>
      <div className="flex justify-center mb-4 relative w-60 h-60">
        {sortedAttributes
          .filter(trait => {
            const equippedValue = equippedItems[trait.trait_type.toLowerCase()];
            return (equippedValue !== null && equippedValue !== undefined) 
              ? equippedValue !== 'none' 
              : trait.value !== 'none' && trait.value !== '';
          })
          .map((trait, index) => {
            const traitType = trait.trait_type.toLowerCase();
            const displayValue = equippedItems[traitType] || trait.value;
            
            return (
              <img
                key={`${traitType}-${displayValue}`}
                src={getTraitImage({ ...trait, value: displayValue })}
                alt={`${trait.trait_type} - ${displayValue}`}
                className="absolute cursor-pointer hover:opacity-90 transition-opacity"
                style={{ zIndex: traitOrder[traitType] || index }}
                width="250"
                height="250"
                onClick={() => handleEquipItem(trait.trait_type, String(displayValue))}
                onKeyDown={(e) => e.key === 'Enter' && handleEquipItem(trait.trait_type, String(displayValue))}
                tabIndex={0}
                role="button"
                aria-label={`Toggle ${trait.trait_type} - ${displayValue}`}
              />
            );
          })}
      </div>
      <div className="flex justify-center space-x-2 mb-4">
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded transition-colors"
          onClick={handleBuyEquipped}
          disabled={Object.keys(equippedItems).length === 0}
          aria-label="Buy equipped items"
        >
          Buy Equipped Item
        </button>
        <button 
          className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded transition-colors"
          onClick={handleResetEquipped}
          disabled={Object.keys(equippedItems).length === 0}
          aria-label="Reset to default appearance"
        >
          Return to Default
        </button>
      </div>
      <div className="bg-gray-100 p-2 rounded">
        <h4 className="font-bold text-gray-700 mb-2">Attributes</h4>
        <ul className="space-y-1">
          {selectedCharacter.attributes.map((attribute, index) => (
            <li key={index} className="text-gray-700">
              <strong>{attribute.trait_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</strong>{' '}
              {equippedItems[attribute.trait_type.toLowerCase()] || attribute.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CharacterPreview;
