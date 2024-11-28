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
    if (!selectedCharacter?.attributes) {
      setErrorMessage('Selected character or attributes are missing.');
      return;
    }

    try {
      const normalizedCategory = normalizeTraitType(category);
      const newValue = itemName.replace(/\s+/g, '_').toLowerCase();
      let updatedAttributes = [...selectedCharacter.attributes];

      // Check if a onesie is equipped
      const bodyTrait = updatedAttributes.find(attr => 
        normalizeTraitType(attr.trait_type) === 'body' && 
        typeof attr.value === 'string' && 
        attr.value.endsWith('_onesie')
      );
      const isOnesieEquipped = !!bodyTrait;

      // Prevent hat equipping when onesie is equipped
      if (normalizedCategory === 'hats' && isOnesieEquipped) {
        setErrorMessage('Cannot equip hats while wearing a onesie!');
        return;
      }

      // Handle body equipping (onesie logic)
      if (normalizedCategory === 'body') {
        const isNewItemOnesie = newValue.endsWith('_onesie');
        
        updatedAttributes = updatedAttributes.map(attr => {
          const type = normalizeTraitType(attr.trait_type);
          
          // Clear tops, bottoms, and hats when equipping body
          if (type === 'tops' || type === 'bottoms' || type === 'hats') {
            return { ...attr, value: 'none' };
          }
          
          // Update head for onesie
          if (type === 'head') {
            const baseValue = (attr.original_value || attr.value) as string;
            return {
              ...attr,
              value: isNewItemOnesie ? `${baseValue}_onesie`.toLowerCase() : baseValue.replace('_onesie', '').toLowerCase(),
              original_value: attr.original_value || attr.value
            };
          }
          
          // Update body value
          if (type === 'body') {
            return { ...attr, value: newValue };
          }
          
          return attr;
        });
      }

      // Rest of your existing handleItemClick logic...
      // (Keep the existing logic for other categories)

      const uniqueUpdatedAttributes = updatedAttributes.filter((attr, index, self) =>
        index === self.findIndex((t) => t.trait_type === attr.trait_type)
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
