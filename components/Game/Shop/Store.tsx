import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../../context/CharacterContext';

const WIZARD_CONTRACT = "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42";
const WARRIOR_CONTRACT = "0x9690b63eb85467be5267a3603f770589ab12dc95";
const BABY_CONTRACT = "0x4b1e130ae84c97b931ffbe91ead6b1da16993d45";
const SOUL_CONTRACT = "0x251b5f14a825c537ff788604ea1b58e49b70726f";

interface Attribute {
  trait_type: string;
  value: string | number;
  filename: string | null;
  original_value?: string | number;
}

interface EquippedItems {
  [key: string]: string | null;
}

interface Character {
  id: string;
  contract: string;
  name?: string;
  attributes?: Attribute[];
  image?: string;
  background_color?: string;
  consciousId?: string; 
}

interface StoreItem {
  name: string;
  path: string;
}

// -----------------------
// CharacterPreview Component Integrated Here
// -----------------------
const CharacterPreview: React.FC = () => {
  const { selectedCharacter } = useCharacter();
  const [equippedItems, setEquippedItems] = useState<EquippedItems>({});

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

  const getTraitImage = (trait: Attribute) => {
    if (selectedCharacter) {
      const collectionFolder = getCollectionFolder(selectedCharacter.contract);
      const traitValue =
        typeof trait.value === 'string'
          ? trait.value.replace(/\s+/g, '_').toLowerCase()
          : trait.value;

      // Return the correct image path
      return `/assets/${collectionFolder}/${trait.trait_type.toLowerCase()}/${traitValue}.png`;
    }
    return '';
  };

  const handleEquipItem = (traitType: string, value: string) => {
    setEquippedItems(prev => ({
      ...prev,
      [traitType.toLowerCase()]: value === prev[traitType.toLowerCase()] ? null : value,
    }));
  };

  const handleResetEquipped = () => {
    setEquippedItems({});
  };

  const handleBuyEquipped = () => {
    console.log('Buying equipped items:', equippedItems);
  };

  if (!selectedCharacter || !selectedCharacter.attributes) {
    return <div className="text-gray-700">Loading...</div>;
  }

  // Define the order of traits to ensure correct layering
  const traitOrder: { [key: string]: number } = {
    background: 0,
    familiar: 1,
    bottoms: 2,
    tops: 3,
    body: 4,
    prop: 5,
    head: 6,
    hats: 7, // Ensure hats render on top of head
    eye_accessory: 8,
  };

  // Sort the attributes based on the defined order
  const sortedAttributes = selectedCharacter.attributes
    .filter(attr => traitOrder.hasOwnProperty(attr.trait_type.toLowerCase()))
    .sort((a, b) => traitOrder[a.trait_type.toLowerCase()] - traitOrder[b.trait_type.toLowerCase()]);

  return (
    <div className="max-w-6xl rounded-lg bg-darkgray shadow-md p-6">
      
      {/* Character Preview Section */}
      <div className="mb-3 bg-yellow rounded-lg p-4">
        {/* Character ID Input */}
        <div className="">
          <h3 className="text-md font-semibold text-black  uppercase text-center">Character ID</h3>
          <input
            className="font-atirose w-full px-3 py-2 rounded-md 
                       text-black text-xl bg-yellow  uppercase text-center"
            type="text"
            value={selectedCharacter.name || ''}
            readOnly
            aria-label="Character ID"
          />
        </div>

        {/* Character Traits */}
        <div className="relative w-96 h-96">
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
                <div key={`${traitType}-${displayValue}`} className="absolute inset-0">
                  <img
                    src={getTraitImage({ ...trait, value: displayValue })}
                    alt={`${trait.trait_type} - ${displayValue}`}
                    className="w-96 h-96 object-contain cursor-pointer 
                             transition-opacity duration-200 hover:opacity-90"
                    style={{ zIndex: traitOrder[traitType] || index }}
                    onClick={() => handleEquipItem(trait.trait_type, String(displayValue))}
                    onKeyDown={e => e.key === 'Enter' && 
                      handleEquipItem(trait.trait_type, String(displayValue))}
                    tabIndex={0}
                    role="button"
                    aria-label={`Toggle ${trait.trait_type} - ${displayValue}`}
                  />
                </div>
              );
            })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-3">
        <button
          className="px-6 py-2 bg-blue text-sm text-white rounded-md
                     transition-colors duration-200 hover:bg-blue-600
                     disabled:bg-blue-300 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 uppercase"
          onClick={handleBuyEquipped}
          disabled={Object.keys(equippedItems).length === 0}
          aria-label="Buy equipped items"
        >
          Buy Equipped Item
        </button>
        <button
          className="px-6 py-2 bg-gray-500 text-sm text-white rounded-md
                     transition-colors duration-200 hover:bg-gray-600
                     disabled:bg-gray-500 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 uppercase"
          onClick={handleResetEquipped}
          disabled={Object.keys(equippedItems).length === 0}
          aria-label="Reset to default appearance"
        >
          Return to Default
        </button>
      </div>

      {/* Attributes List */}
      <div className="border border-yellow rounded-lg p-4 uppercase">
        <h4 className="text-md text-white mb-3">Attributes</h4>
        <ul className="space-y-2">
          {selectedCharacter.attributes.map((attribute, index) => (
            <li key={index} className="text-white text-sm flex justify-between items-center">
              <span className="">
                {attribute.trait_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:
              </span>
              <span className="text-white">
                {equippedItems[attribute.trait_type.toLowerCase()] || attribute.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};




// -----------------------
// Store Component
// -----------------------
const Store: React.FC = () => {
  const { selectedCharacter, updateCharacterAttributes } = useCharacter();
  const [activeTab, setActiveTab] = useState('eye_accessories');
  const [items, setItems] = useState<{ [key: string]: StoreItem[] }>({
    eye_accessories: [],
    body: [],
    prop: [],
    hats: [],
    tops: [],
    bottoms: [],
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (selectedCharacter) {
      fetch(`/api/store/outfits?contract=${selectedCharacter.contract}`)
        .then(response => response.json())
        .then(data => {
          console.log('Fetched store items:', data);
          setItems({
            eye_accessories: data.head || [],
            body: data.body || [],
            prop: data.prop || [],
            hats: data.hats || [],
            tops: data.tops || [],
            bottoms: data.bottoms || [],
          });
        })
        .catch(error => {
          console.error('Error fetching store items:', error);
          setErrorMessage('Failed to fetch store items.');
        });
    }
  }, [selectedCharacter]);

  // Ensure tops and bottoms exist in attributes
  useEffect(() => {
    if (selectedCharacter && selectedCharacter.attributes) {
      const normalizeTraitType = (traitType: string) => traitType.replace(/\s+/g, '_').toLowerCase();
      let updatedAttributes = [...selectedCharacter.attributes];
      const hasTops = updatedAttributes.some(attr => normalizeTraitType(attr.trait_type) === 'tops');
      const hasBottoms = updatedAttributes.some(attr => normalizeTraitType(attr.trait_type) === 'bottoms');
      const hasHats = updatedAttributes.some(attr => normalizeTraitType(attr.trait_type) === 'hats');
  
      let needsUpdate = false;
      if (!hasTops) {
        updatedAttributes.push({ trait_type: "tops", value: "none", filename: null });
        needsUpdate = true;
      }
      if (!hasBottoms) {
        updatedAttributes.push({ trait_type: "bottoms", value: "none", filename: null });
        needsUpdate = true;
      }
      if (!hasHats) {
        updatedAttributes.push({ trait_type: "hats", value: "none", filename: null });
        needsUpdate = true;
      }
  
      if (needsUpdate) {
        updateCharacterAttributes(updatedAttributes);
      }
    }
  }, [selectedCharacter, updateCharacterAttributes]);
  
  const normalizeTraitType = (traitType: string) => {
    return traitType.replace(/\s+/g, '_').toLowerCase();
  };
  

  const handleItemClick = (category: string, itemName: string) => {
    if (!selectedCharacter?.attributes) {
      setErrorMessage('Selected character or attributes are missing.');
      return;
    }
  
    const normalizedCategory = normalizeTraitType(category);
    const newValue = itemName.replace(/\s+/g, '_').toLowerCase();
  
    let updatedAttributes = [...selectedCharacter.attributes];
  
    const headIndex = updatedAttributes.findIndex(
      attr => normalizeTraitType(attr.trait_type) === 'head'
    );
    const bodyIndex = updatedAttributes.findIndex(
      attr => normalizeTraitType(attr.trait_type) === 'body'
    );
    const hatIndex = updatedAttributes.findIndex(
      attr => normalizeTraitType(attr.trait_type) === 'hats'
    );
  
    const headTrait = headIndex > -1 ? updatedAttributes[headIndex] : null;
    const bodyTrait = bodyIndex > -1 ? updatedAttributes[bodyIndex] : null;
    const hatTrait = hatIndex > -1 ? updatedAttributes[hatIndex] : null;
  
    const isOnesieEquipped =
      bodyTrait &&
      typeof bodyTrait.value === 'string' &&
      bodyTrait.value.endsWith('_onesie');
  
    // Handle hat logic
    if (normalizedCategory === 'hats') {
      if (headTrait) {
        // If equipping a new hat
        if (newValue !== 'none') {
          const originalHead = headTrait.original_value || headTrait.value;
          const cleanedHead = String(originalHead).replace(/_\w+$/, ''); // Remove existing hat suffix
          updatedAttributes[headIndex] = {
            ...headTrait,
            value: `${cleanedHead}_${newValue}`.toLowerCase(),
            original_value: originalHead,
          };
        } else {
          // Unequipping hat: revert head to original value
          updatedAttributes[headIndex] = {
            ...headTrait,
            value: String(headTrait.original_value || headTrait.value)
              .toLowerCase()
              .replace(/_\w+$/, ''), // Remove the hat suffix
            original_value: headTrait.original_value, // Retain original head
          };
        }
  
        // Update hat value
        if (hatTrait) {
          updatedAttributes[hatIndex] = { ...hatTrait, value: newValue };
        }
      }
    }
  
    // Handle body/onesie logic
    if (normalizedCategory === 'body') {
      const isNewItemOnesie = newValue.endsWith('_onesie');
  
      updatedAttributes = updatedAttributes.map(attr => {
        const type = normalizeTraitType(attr.trait_type);
  
        // Clear hats before equipping a onesie
        if (type === 'hats' && isNewItemOnesie) {
          return { ...attr, value: 'none' };
        }
  
        // Handle head logic for onesies
        if (type === 'head') {
          if (isNewItemOnesie) {
            const originalHead = attr.original_value || attr.value;
      
            const cleanedHead = String(originalHead).replace(/_onesie$/, ''); // Only remove _onesie if it exists
            const newHeadValue = `${cleanedHead}_onesie`.toLowerCase();
            return {
              ...attr,
              value: newHeadValue,
              original_value: originalHead,
            };
          } else {
            // Removing the onesie
            let headValue = String(attr.value);
            if (attr.original_value) {
              headValue = String(attr.original_value).toLowerCase();
            } else {
              headValue = headValue.replace(/_onesie$/, '');
            }
  
            return {
              ...attr,
              value: headValue,
              original_value: attr.original_value,
            };
          }
        }
  
        // Update body value
        if (type === 'body') {
          return { ...attr, value: newValue };
        }
  
        return attr;
      });
    }
  
    // Handle other categories (e.g., tops, bottoms, etc.)
    updatedAttributes = updatedAttributes.map(attr => {
      const type = normalizeTraitType(attr.trait_type);
      if (type === normalizedCategory && type !== 'tops' && type !== 'bottoms') {
        return { ...attr, value: newValue };
      }
      return attr;
    });
  
    const uniqueUpdatedAttributes = updatedAttributes.filter(
      (attr, index, self) =>
        index === self.findIndex(t => t.trait_type === attr.trait_type)
    );
  
    console.log('Updated Attributes:', uniqueUpdatedAttributes);
    updateCharacterAttributes(uniqueUpdatedAttributes);
  };
  
  





  const getFilteredEyeAccessories = () => {
    if (!selectedCharacter || !selectedCharacter.attributes) return items.eye_accessories;
    const headTrait = selectedCharacter.attributes.find(attr => normalizeTraitType(attr.trait_type) === 'head');
    if (!headTrait) return items.eye_accessories;

    let headName = '';
    if (typeof headTrait.filename === 'string') {
      headName = headTrait.filename.toLowerCase().replace(/_/g, ' ');
    } else if (typeof headTrait.value === 'string') {
      headName = headTrait.value.toLowerCase().replace(/_/g, ' ');
    }

    return items.eye_accessories.filter(item => item.name.toLowerCase().startsWith(headName));
  };

  const getItemsToDisplay = () => {
    const allItems = activeTab === 'eye_accessories' ? getFilteredEyeAccessories() : items[activeTab];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = allItems.slice(startIndex, endIndex);

    const placeholders = Array.from({ length: itemsPerPage - itemsToDisplay.length }, (_, index) => ({
      name: `placeholder_${index}`,
      path: '',
    }));

    return [...itemsToDisplay, ...placeholders];
  };

  const totalPages = Math.ceil((activeTab === 'eye_accessories' ? getFilteredEyeAccessories() : items[activeTab]).length / itemsPerPage);

  return (
    <div className="flex space-x-4">
      {/* Render CharacterPreview on the left */}
      <CharacterPreview />

      {/* Store section on the right */}
      <div className="bg-darkgray shadow-md rounded-lg p-6 w-full">
        {errorMessage && <div className="bg-red-500 text-white p-4 mb-4 rounded">{errorMessage}</div>}
        <div className="flex mb-6 space-x-4">
          {['eye_accessories', 'body', 'prop', 'hats', 'tops', 'bottoms'].map(tab => (
            <button
              key={tab}
              className={`py-3 px-6 rounded-lg text-sm ${activeTab === tab ? 'bg-yellow text-black' : 'bg-fg3 text-black'}`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab.toUpperCase().replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 min-h-screen uppercase">
          {getItemsToDisplay().map((item, index) => (
            <div
              key={index}
              className="p-4 flex items-center bg-bg0 rounded-lg cursor-pointer r"
              onClick={() => {
                if (item.path) {
                  handleItemClick(activeTab, item.name);
                }
              }}
            >
              {item.path ? (
                <>
                  <img src={item.path} alt={item.name} className="w-24 h-24 mr-6" />
                  <div>
                    <div className="text-md text-white">{item.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
                    <div className="text-md text-white">Price: 0</div>
                    <div className="flex mt-2 space-x-4">
                      <button className="bg-blue text-white uppercase py-2 px-4 rounded text-sm">Buy</button>
                      <button className="bg-gray-500 text-white uppercase py-2 px-4 rounded text-sm">Gift</button>
                      <button className="bg-yellow text-black uppercase py-2 px-4 rounded text-sm">Reserve</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-24 h-24 mr-6 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-6 text-black">
          <button
            className="py-3 px-6 rounded bg-fg3 text-sm uppercase text-black"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="py-3 px-6 text-sm text-white ">{currentPage} / {totalPages}</span>
          <button
            className="py-3 px-6 rounded text-sm bg-fg3 uppercase text-black"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Store;
