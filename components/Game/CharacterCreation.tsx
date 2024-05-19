import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';

interface FormData {
  traits: string;
  backstory: string;
  motivation: string;
  skills: string;
}

const CharacterCreation: React.FC = () => {
  const { selectedCharacter, updateCharacterAttributes } = useCharacter();
  const [inputType, setInputType] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    traits: '',
    backstory: '',
    motivation: '',
    skills: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (field: keyof FormData) => {
    updateCharacterAttributes([{ trait_type: field, value: formData[field], filename: null }]);
    setInputType(null);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedCharacter?.name,
          backstory: formData.backstory,
          motivation: formData.motivation,
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Error from server: ${response.status} - ${responseText}`);
      }

      const result = JSON.parse(responseText);
      console.log(result);
    } catch (error) {
      console.error('Error:');
    }
  };

  const renderInputScreen = (type: keyof FormData) => (
    <div className="flex flex-col items-center mt-4">
      <textarea
        name={type}
        value={formData[type]}
        onChange={handleInputChange}
        placeholder={`Enter ${type}`}
        className="w-64 h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black text-white"
      />
      <button
        onClick={() => handleSave(type)}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Save
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center p-4">
      {selectedCharacter && (
        <div className="mb-4 text-center">
          <img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-40 h-40 object-cover rounded-full" />
          <h2 className="text-xl font-bold mt-2">{selectedCharacter.name}</h2>
        </div>
      )}
      <div className="flex flex-wrap justify-center">
        <div
          className="m-4 p-4 border border-gray-300 w-48 text-center cursor-pointer hover:bg-gray-100"
          onClick={() => setInputType('traits')}
        >
          <div>Traits</div>
        </div>
        <div
          className="m-4 p-4 border border-gray-300 w-48 text-center cursor-pointer hover:bg-gray-100"
          onClick={() => setInputType('backstory')}
        >
          <div>Backstory</div>
        </div>
        <div
          className="m-4 p-4 border border-gray-300 w-48 text-center cursor-pointer hover:bg-gray-100"
          onClick={() => setInputType('motivation')}
        >
          <div>Motivation</div>
        </div>
        <div
          className="m-4 p-4 border border-gray-300 w-48 text-center cursor-pointer hover:bg-gray-100"
          onClick={() => setInputType('skills')}
        >
          <div>Skills</div>
        </div>
      </div>

      {inputType && renderInputScreen(inputType as keyof FormData)}

      <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg">
        Create Character
      </button>
    </div>
  );
};

export default CharacterCreation;
