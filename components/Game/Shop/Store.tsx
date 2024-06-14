import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../../context/CharacterContext';

const Store: React.FC = () => {
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

  interface Attribute {
    trait_type: string;
    value: string | number;
    filename: string | null;
    original_value?: string | number;
  }

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

  const handleItemClick = (category: string, itemName: string) => {
    if (!selectedCharacter || !selectedCharacter.attributes) {
      setErrorMessage('Selected character or attributes are missing.');
      return;
    }

    try {
      console.log('Original Attributes:', selectedCharacter.attributes);

      const normalizedCategory = normalizeTraitType(category);
      const newValue = itemName.replace(/\s+/g, '_').toLowerCase();

      let updatedAttributes: Attribute[] = selectedCharacter.attributes.map(attr => {
        const normalizedTraitType = normalizeTraitType(attr.trait_type);

        if (normalizedTraitType === normalizedCategory) {
          if (normalizedCategory === 'head' || normalizedCategory === 'eye_accessory') {
            return { ...attr, value: newValue, original_value: attr.original_value ?? attr.value };
          }
          return { ...attr, value: newValue };
        }

        if ((normalizedCategory === 'body' || normalizedCategory === 'tops' || normalizedCategory === 'bottoms') && normalizedTraitType === 'head') {
          const originalValue = attr.original_value ?? attr.value;
          if (typeof attr.value === 'string' && attr.value.endsWith('_onesie')) {
            return {
              ...attr,
              value: typeof originalValue === 'string'
                ? originalValue.replace('_onesie', '').toLowerCase()
                : originalValue
            };
          }
        }
        return attr;
      });

      const headTraitIndex = updatedAttributes.findIndex(attr => normalizeTraitType(attr.trait_type) === 'head');

      // If tops category is selected
      if (normalizedCategory === 'tops') {
        updatedAttributes = updatedAttributes.map(attr => {
          if (normalizeTraitType(attr.trait_type) === 'body') {
            return { ...attr, value: '' as string | number }; // Ensure value is a string or number
          }
          return attr;
        });

        const bottomTraitIndex = updatedAttributes.findIndex(attr => normalizeTraitType(attr.trait_type) === 'bottoms');
        if (bottomTraitIndex !== -1 && updatedAttributes[bottomTraitIndex].value == null) {
          updatedAttributes[bottomTraitIndex] = { ...updatedAttributes[bottomTraitIndex], value: 'cargo_pants_black_wiz' };
        } else if (bottomTraitIndex === -1) {
          updatedAttributes.push({ trait_type: 'bottoms', value: 'cargo_pants_black_wiz', filename: null });
        }

        const topTraitIndex = updatedAttributes.findIndex(attr => normalizeTraitType(attr.trait_type) === 'tops');
        if (topTraitIndex !== -1) {
          updatedAttributes[topTraitIndex] = { ...updatedAttributes[topTraitIndex], value: newValue };
        } else {
          updatedAttributes.push({ trait_type: 'tops', value: newValue, filename: null });
        }

        if (headTraitIndex !== -1) {
          const originalValue = updatedAttributes[headTraitIndex].original_value ?? updatedAttributes[headTraitIndex].value;
          updatedAttributes[headTraitIndex] = {
            ...updatedAttributes[headTraitIndex],
            value: typeof originalValue === 'string'
              ? originalValue.replace('_onesie', '').toLowerCase()
              : originalValue
          };
        }
      }

      // If bottoms category is selected
      if (normalizedCategory === 'bottoms') {
        updatedAttributes = updatedAttributes.map(attr => {
          if (normalizeTraitType(attr.trait_type) === 'body') {
            return { ...attr, value: '' as string | number }; // Ensure value is a string or number
          }
          return attr;
        });

        const topTraitIndex = updatedAttributes.findIndex(attr => normalizeTraitType(attr.trait_type) === 'tops');
        if (topTraitIndex !== -1 && updatedAttributes[topTraitIndex].value == null) {
          updatedAttributes[topTraitIndex] = { ...updatedAttributes[topTraitIndex], value: 'black_jacket' };
        } else if (topTraitIndex === -1) {
          updatedAttributes.push({ trait_type: 'tops', value: 'black_jacket', filename: null });
        }

        const bottomTraitIndex = updatedAttributes.findIndex(attr => normalizeTraitType(attr.trait_type) === 'bottoms');
        if (bottomTraitIndex !== -1) {
          updatedAttributes[bottomTraitIndex] = { ...updatedAttributes[bottomTraitIndex], value: newValue };
        } else {
          updatedAttributes.push({ trait_type: 'bottoms', value: newValue, filename: null });
        }

        if (headTraitIndex !== -1) {
          const originalValue = updatedAttributes[headTraitIndex].original_value ?? updatedAttributes[headTraitIndex].value;
          updatedAttributes[headTraitIndex] = {
            ...updatedAttributes[headTraitIndex],
            value: typeof originalValue === 'string'
              ? originalValue.replace('_onesie', '').toLowerCase()
              : originalValue
          };
        }
      }

      // If body category is selected, set top and bottom to null and remove the hat
      if (normalizedCategory === 'body') {
        updatedAttributes = updatedAttributes.map(attr => {
          if (normalizeTraitType(attr.trait_type) === 'tops' || normalizeTraitType(attr.trait_type) === 'bottoms' || normalizeTraitType(attr.trait_type) === 'hats') {
            return { ...attr, value: '' as string | number }; // Ensure value is a string or number
          }
          return attr;
        });

        // Ensure head attribute is updated to add the onesie suffix only if the selected item ends with '_onesie'
        if (headTraitIndex !== -1) {
          const originalValue = updatedAttributes[headTraitIndex].original_value ?? updatedAttributes[headTraitIndex].value;
          if (typeof newValue === 'string' && newValue.endsWith('_onesie')) {
            updatedAttributes[headTraitIndex] = {
              ...updatedAttributes[headTraitIndex],
              value: typeof originalValue === 'string'
                ? `${originalValue}_onesie`.toLowerCase()
                : originalValue
            };
          } else {
            updatedAttributes[headTraitIndex] = {
              ...updatedAttributes[headTraitIndex],
              value: typeof originalValue === 'string'
                ? originalValue.toLowerCase()
                : originalValue
            };
          }
        }
      }

      // If eye accessories category is selected
      if (normalizedCategory === 'eye_accessories') {
        const eyeAccessoryTraitIndex = updatedAttributes.findIndex(attr => normalizeTraitType(attr.trait_type) === 'eye_accessory');
        if (eyeAccessoryTraitIndex !== -1) {
          updatedAttributes[eyeAccessoryTraitIndex] = { ...updatedAttributes[eyeAccessoryTraitIndex], value: newValue };
        } else {
          updatedAttributes.push({ trait_type: 'eye_accessory', value: newValue, filename: null });
        }
      }

      // If hats category is selected, handle the hat attribute separately
      if (normalizedCategory === 'hats') {
        const hatTraitIndex = updatedAttributes.findIndex(attr => normalizeTraitType(attr.trait_type) === 'hats');
        if (hatTraitIndex !== -1) {
          updatedAttributes[hatTraitIndex] = { ...updatedAttributes[hatTraitIndex], value: newValue };
        } else {
          updatedAttributes.push({ trait_type: 'hats', value: newValue, filename: null });
        }
      }

      const uniqueUpdatedAttributes = updatedAttributes.filter((attr, index, self) =>
        index === self.findIndex((t) => (
          t.trait_type === attr.trait_type
        ))
      );

      console.log('Updated Attributes:', uniqueUpdatedAttributes);

      updateCharacterAttributes(uniqueUpdatedAttributes);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error handling item click:', error);
      setErrorMessage('Failed to handle item click.');
    }
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

  return (
    <div className="bg-white shadow-md rounded p-6 w-full">
      {errorMessage && <div className="bg-red-500 text-white p-4 mb-4 rounded">{errorMessage}</div>}
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
                  <div className="text-lg text-gray-700">{item.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
                  <div className="text-lg text-gray-700">Price: 0</div>
                  <div className="flex mt-2 space-x-4">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded text-sm">Buy</button>
                    <button className="bg-gray-500 text-white py-2 px-4 rounded text-sm">Gift</button>
                    <button className="bg-green-500 text-white py-2 px-4 rounded text-sm">Reserve</button>
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
    </div>
  );
};

export default Store;
