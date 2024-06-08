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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

    // Check if a onesie is equipped when trying to change the head
    const headTrait = selectedCharacter.attributes.find(attr => attr.trait_type.toLowerCase() === 'head');
    if (category === 'head' && headTrait && typeof headTrait.value === 'string' && headTrait.value.endsWith('onesie')) {
      setErrorMessage("New heads can't be equipped when a onesie is on.");
      return;
    }

    setErrorMessage(null); // Clear error message if any

    const updatedAttributes = selectedCharacter.attributes.map(attr => {
      if (attr.trait_type.toLowerCase() === category) {
        const newValue = itemName.replace(/\s+/g, '_').toLowerCase();
        console.log(`Updating ${category} attribute to ${newValue}`);
        if (category === 'head') {
          return { ...attr, value: newValue, original_value: attr.original_value ?? attr.value };
        }
        return { ...attr, value: newValue };
      } else if (category === 'body' && attr.trait_type.toLowerCase() === 'head') {
        const originalValue = attr.original_value ?? attr.value;
        if (typeof originalValue === 'string' && itemName.endsWith('onesie')) {
          console.log(`Item has onesie suffix. Checking head attribute: ${attr.value}`);
          if (typeof attr.value === 'string' && !attr.value.endsWith('onesie')) {
            console.log(`Adding onesie suffix to head attribute: ${attr.value}`);
            return { ...attr, value: `${originalValue}_onesie`.toLowerCase() };
          }
        } else {
          if (typeof attr.value === 'string' && attr.value.endsWith('onesie')) {
            console.log(`Removing onesie suffix from head attribute: ${attr.value}`);
            return { ...attr, value: (originalValue as string).toLowerCase() };
          }
        }
      }
      return attr;
    });
    console.log('Updated Attributes:', updatedAttributes);
    updateCharacterAttributes(updatedAttributes);
  };

  const getFilteredHeads = () => {
    if (!selectedCharacter || !selectedCharacter.attributes) return items.head;
    const headTrait = selectedCharacter.attributes.find(attr => attr.trait_type.toLowerCase() === 'head');
    if (!headTrait) return items.head;

    let headName = '';
    if (typeof headTrait.original_value === 'string') {
      headName = headTrait.original_value.toLowerCase().replace(/_/g, ' ');
    } else if (typeof headTrait.value === 'string') {
      headName = headTrait.value.toLowerCase().replace(/_/g, ' ');
    }

    const filteredHeads = items.head.filter(item => item.name.startsWith(headName));
    return filteredHeads;
  };

  const getItemsToDisplay = () => {
    const allItems = activeTab === 'head' ? getFilteredHeads() : items[activeTab];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = allItems.slice(startIndex, endIndex);

    // Add placeholders to fill the page if there are fewer than itemsPerPage items
    const placeholders = Array.from({ length: itemsPerPage - itemsToDisplay.length }, (_, index) => ({
      name: `placeholder_${index}`,
      path: '', // Empty path for placeholders
    }));

    return [...itemsToDisplay, ...placeholders];
  };

  const totalPages = Math.ceil((activeTab === 'head' ? getFilteredHeads() : items[activeTab]).length / itemsPerPage);

  return (
    <div className="bg-white shadow-md rounded p-6 w-full">
      {errorMessage && <div className="bg-red-500 text-white p-4 mb-4 rounded">{errorMessage}</div>}
      <div className="flex mb-6 space-x-4">
        {Object.keys(items).map(tab => (
          <button
            key={tab}
            className={`py-3 px-6 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => {
              console.log('Tab clicked:', tab);
              setActiveTab(tab);
              setCurrentPage(1); // Reset to first page on tab change
            }}
          >
            {tab.toUpperCase()}
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
                console.log('Item clicked - category:', activeTab, 'item:', item.name);
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
              <div className="w-24 h-24 mr-6 bg-gray-200"></div> // Placeholder
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
