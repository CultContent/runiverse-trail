import React from 'react';
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

const CharacterPreview: React.FC = () => {
  const { selectedCharacter } = useCharacter();

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

  if (!selectedCharacter || !selectedCharacter.attributes) {
    console.log('Selected Character or Attributes missing:', selectedCharacter);
    return <div>Loading...</div>;
  }

  console.log('Rendering CharacterPreview with attributes:', selectedCharacter.attributes);

  return (
    <div className="bg-white shadow-md rounded p-4 w-60">
      <div className="text-center mb-2">
        <h3 className="font-bold text-gray-700">Character ID</h3>
        <input className="border p-1 rounded w-full bg-gray-100 text-gray-700" type="text" value={selectedCharacter.name} readOnly />
      </div>
      <div className="flex justify-center mb-4 relative w-60 h-60">
        {selectedCharacter.attributes.map((trait, index) => (
          <img
            key={index}
            src={getTraitImage(trait)}
            alt={trait.trait_type}
            className="absolute"
            style={{ zIndex: index }}
            width="250"
            height="250"
          />
        ))}
      </div>
      <div className="flex justify-center space-x-2 mb-4">
        <button className="bg-blue-500 text-white py-1 px-4 rounded">Buy Equipped Item</button>
        <button className="bg-gray-500 text-white py-1 px-4 rounded">Return to Default</button>
      </div>
      <div className="bg-gray-100 p-2 rounded">
        <h4 className="font-bold text-gray-700 mb-2">Attributes</h4>
        <ul>
          {selectedCharacter.attributes.map((attribute, index) => (
            <li key={index} className="text-gray-700">
              <strong>{attribute.trait_type}:</strong> {attribute.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CharacterPreview;
