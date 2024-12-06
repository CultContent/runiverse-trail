import React, { useState, useEffect } from 'react';
import CharacterPreview from '../Shop/CharacterPreview';
import { useCharacter } from '@/context/CharacterContext';
import { Tab } from '@headlessui/react';

// Update categories to match Store
const CATEGORIES = [
  'Eye Accessories',
  'Body',
  'Props',
  'Hats',
  'Tops',
  'Bottoms'
];

const convertCategoryName = (category: string): string => {
  const conversions: { [key: string]: string } = {
    'Eye Accessories': 'eye_accessories',
    'Body': 'body',
    'Props': 'prop',
    'Hats': 'hats',
    'Tops': 'tops',
    'Bottoms': 'bottoms'
  };
  return conversions[category] || category.toLowerCase();
};

const EquipScreen: React.FC = () => {
  const { selectedCharacter, updateCharacterAttributes } = useCharacter();
  const [activeTab, setActiveTab] = useState('eye_accessories');
  const [items, setItems] = useState<{ [key: string]: { name: string; path: string }[] }>({
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

  const normalizeTraitType = (traitType: string) => {
    return traitType.replace(/\s+/g, '_').toLowerCase();
  };

  const getFilteredEyeAccessories = () => {
    if (!selectedCharacter || !selectedCharacter.attributes) return items.eye_accessories;
    const headTrait = selectedCharacter.attributes.find(attr => normalizeTraitType(attr.trait_type) === 'head');
    if (!headTrait) return items.eye_accessories;

    let headName = '';
    if (typeof headTrait.original_value === 'string') {
      headName = headTrait.original_value.toLowerCase().replace(/_/g, ' ');
    } else if (typeof headTrait.value === 'string') {
      headName = headTrait.value.toLowerCase().replace(/_/g, ' ');
    }

    return items.eye_accessories.filter(item => item.name.startsWith(headName));
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

  const handleItemClick = (category: string, itemName: string) => {
    if (!selectedCharacter?.attributes) {
      console.error('Selected character or attributes are missing.');
      return;
    }

    try {
      const normalizedCategory = normalizeTraitType(category);
      const newValue = itemName.replace(/\s+/g, '_').toLowerCase();
      let updatedAttributes = [...selectedCharacter.attributes];

      // Check if a body/onesie is equipped
      const bodyTrait = updatedAttributes.find(attr => 
        normalizeTraitType(attr.trait_type) === 'body'
      );
      const isOnesieEquipped = bodyTrait?.value && typeof bodyTrait.value === 'string' && bodyTrait.value.endsWith('_onesie');

      // Handle transitions between body and tops/bottoms
      if (normalizedCategory === 'tops' || normalizedCategory === 'bottoms') {
        // If switching from body to tops/bottoms
        if (bodyTrait?.value) {
          // Clear body and set up tops/bottoms
          updatedAttributes = updatedAttributes.map(attr => {
            const type = normalizeTraitType(attr.trait_type);
            
            switch(type) {
              case 'body':
                return { ...attr, value: 'none' };
              case 'tops':
                return { ...attr, value: normalizedCategory === 'tops' ? newValue : 'black_jacket' };
              case 'bottoms':
                return { ...attr, value: normalizedCategory === 'bottoms' ? newValue : 'pants_with_boots_black_wiz' };
              case 'head':
                if (isOnesieEquipped) {
                  const baseValue = (attr.original_value || attr.value) as string;
                  return {
                    ...attr,
                    value: baseValue.replace('_onesie', '').toLowerCase(),
                    original_value: attr.original_value || attr.value
                  };
                }
                return attr;
              default:
                return attr;
            }
          });

          // Ensure both tops and bottoms exist
          const hasTop = updatedAttributes.some(attr => normalizeTraitType(attr.trait_type) === 'tops');
          const hasBottom = updatedAttributes.some(attr => normalizeTraitType(attr.trait_type) === 'bottoms');

          if (!hasTop) {
            updatedAttributes.push({
              trait_type: 'tops',
              value: normalizedCategory === 'tops' ? newValue : 'black_jacket',
              filename: null
            });
          }
          if (!hasBottom) {
            updatedAttributes.push({
              trait_type: 'bottoms',
              value: normalizedCategory === 'bottoms' ? newValue : 'pants_with_boots_black_wiz',
              filename: null
            });
          }
        } else {
          // Normal tops/bottoms equipping - ensure both exist
          const hasTop = updatedAttributes.some(attr => normalizeTraitType(attr.trait_type) === 'tops');
          const hasBottom = updatedAttributes.some(attr => normalizeTraitType(attr.trait_type) === 'bottoms');

          // First add any missing complementary items
          if (!hasTop && normalizedCategory === 'bottoms') {
            updatedAttributes.push({
              trait_type: 'tops',
              value: 'black_jacket',
              filename: null
            });
          }
          if (!hasBottom && normalizedCategory === 'tops') {
            updatedAttributes.push({
              trait_type: 'bottoms',
              value: 'pants_with_black_boots_wiz',
              filename: null
            });
          }

          // Then update the selected item
          updatedAttributes = updatedAttributes.map(attr => {
            if (normalizeTraitType(attr.trait_type) === normalizedCategory) {
              return { ...attr, value: newValue };
            }
            return attr;
          });
        }
      } else if (normalizedCategory === 'body') {
        // If switching from tops/bottoms to body
        const isNewItemOnesie = newValue.endsWith('_onesie');
        
        updatedAttributes = updatedAttributes.map(attr => {
          const type = normalizeTraitType(attr.trait_type);
          
          // Clear tops, bottoms, and hats (if onesie)
          if (type === 'tops' || type === 'bottoms' || (type === 'hats' && isNewItemOnesie)) {
            return { ...attr, value: 'none' };
          }
          
          // Update head for onesie
          if (type === 'head' && isNewItemOnesie) {
            const baseValue = (attr.original_value || attr.value) as string;
            return {
              ...attr,
              value: `${baseValue}_onesie`.toLowerCase(),
              original_value: attr.original_value || attr.value
            };
          }
          
          // Update body value
          if (type === 'body') {
            return { ...attr, value: newValue };
          }
          
          return attr;
        });
      } else {
        // Handle other equipment types (hats, props, etc.)
        if (normalizedCategory === 'hats' && isOnesieEquipped) {
          console.error('Cannot equip hats while wearing a onesie!');
          return;
        }
        
        updatedAttributes = updatedAttributes.map(attr => {
          if (normalizeTraitType(attr.trait_type) === normalizedCategory) {
            return { ...attr, value: newValue };
          }
          return attr;
        });
      }

      const uniqueUpdatedAttributes = updatedAttributes.filter((attr, index, self) =>
        index === self.findIndex((t) => t.trait_type === attr.trait_type)
      );

      updateCharacterAttributes(uniqueUpdatedAttributes);
    } catch (error) {
      console.error('Error handling item click:', error);
    }
  };

  const handleResetAll = () => {
    if (!selectedCharacter?.attributes) return;
    // Store initial attributes when character is first loaded
    const originalAttributes = selectedCharacter.attributes.map(attr => ({
      ...attr,
      value: attr.original_value || attr.value
    }));
    updateCharacterAttributes(originalAttributes);
  };

  const handleSaveEquipment = () => {
    // TODO: Implement save functionality when backend is ready
    console.log('Saving equipment...');
  };

  return (
    <div className="flex gap-8 p-4">
      {/* Left side - Character Preview */}
      <div className="flex-shrink-0">
        <CharacterPreview />
      </div>

      {/* Right side - Equipment Selection */}
      <div className="flex-grow">
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-2xl font-bold mb-4">Equipment</h2>
          
          <div className="flex mb-6 space-x-4">
            {['eye_accessories', 'body', 'prop', 'hats', 'tops', 'bottoms'].map(tab => (
              <button
                key={tab}
                className={`py-3 px-6 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
              >
                {tab.toUpperCase().replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 min-h-[50rem]">
            {getItemsToDisplay().map((item, index) => (
              <div
                key={index}
                className="border p-4 flex items-center bg-gray-100 cursor-pointer"
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
                      <div className="text-lg text-gray-700">
                        {item.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-24 h-24 mr-6 bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              className="py-3 px-6 rounded bg-gray-300 text-gray-700"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="py-3 px-6">{currentPage} / {totalPages}</span>
            <button
              className="py-3 px-6 rounded bg-gray-300 text-gray-700"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          {errorMessage && (
            <div className="text-red-500 mt-4">{errorMessage}</div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end space-x-4">
            <button 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={handleResetAll}
            >
              Reset All
            </button>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleSaveEquipment}
            >
              Save Equipment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipScreen; 