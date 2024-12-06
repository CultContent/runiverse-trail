import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';

interface FormData {
  traits: string;
  backstory: string;
  motivation: string;
  skills: string;
}

const CharacterCreation: React.FC = () => {
  const { selectedCharacter, updateCharacterAttributes, updateConsciousId } = useCharacter();
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
      const response = await fetch('/api/consciousnft/character', {
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

      // Update the consciousId in the CharacterContext
      if (result.characterId) {
        updateConsciousId(result.characterId);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderInputScreen = (type: keyof FormData) => (
    <div className="flex flex-col items-center mt-4">
      <textarea
        name={type}
        value={formData[type]}
        onChange={handleInputChange}
        placeholder={`Enter ${type}`}
        /* className="w-full h-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black text-white" */
        className="resize-none outline-none bg-transparent w-[750px] h-[340px] text-lg text-white placeholder:text-black font-ocra placeholder:text-white placeholder:uppercase"
      />
      <button
        onClick={() => handleSave(type)}
        className="mb-4 border border-yellow px-6 rounded-xl font-ocra py-2 uppercase hover:bg-yellow hover:text-black"
      >
        Save
      </button>
    </div>
  );

  return (
    <div className="h-full flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <h1 className="font-atirose text-7xl uppercase">Character Creation</h1>
      {selectedCharacter && (
        <div className="mt-6 mb-4 flex flex-col items-center text-center">
          <img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-60 h-60 border object-cover rounded-full" />
          <h2 className="text-3xl font-vcr text-black font-bold mt-2">{selectedCharacter.name}</h2>
        </div>
      )}
      <div className="flex flex-row gap-4 flex-wrap">
        <div
          /* className="m-4 p-4 border border-gray-300 w-48 text-center cursor-pointer hover:bg-gray-100" */
          className="border border-yellow font-ocra uppercase py-1.5 rounded-xl text-sm text-center w-[130px] hover:text-black hover:bg-yellow cursor-pointer"
          onClick={() => setInputType('traits')}
        >
          <div>Traits</div>
        </div>
        <div
          /* className="m-4 p-4 border border-gray-300 w-48 text-center cursor-pointer hover:bg-gray-100" */
          className="border border-yellow font-ocra uppercase py-1.5 rounded-xl text-sm text-center w-[130px] hover:text-black hover:bg-yellow cursor-pointer"
          onClick={() => setInputType('backstory')}
        >
          <div>Backstory</div>
        </div>
        <div
          /* className="m-4 p-4 border border-gray-300 w-48 text-center cursor-pointer hover:bg-gray-100" */
          className="border border-yellow font-ocra uppercase py-1.5 rounded-xl text-sm text-center w-[130px] hover:text-black hover:bg-yellow cursor-pointer"
          onClick={() => setInputType('motivation')}
        >
          <div>Motivation</div>
        </div>
        <div
         /*  className="m-4 p-4 border border-gray-300 w-48 text-center cursor-pointer hover:bg-gray-100" */
         className="border border-yellow font-ocra uppercase py-1.5 rounded-xl text-sm text-center w-[130px] hover:text-black hover:bg-yellow cursor-pointer"
          onClick={() => setInputType('skills')}
        >
          <div>Skills</div>
        </div>
      </div>
      
      <div className="border border-yellow rounded-xl px-5 text-white">
        {inputType && renderInputScreen(inputType as keyof FormData)}
      </div>
      
      <button className="bg-yellow text-black font-ocra uppercase text-md px-3.5 py-2 rounded-xl" onClick={handleSubmit}>
        Create Character
      </button>
      </div>
    </div>
  );
};

export default CharacterCreation;
