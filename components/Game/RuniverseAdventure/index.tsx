import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../../context/CharacterContext';
import CharacterCreation from '../CharacterCreation';
import GameInterface from '../GameInterface';
import styles from "@/app/pixelbutton.module.css"

interface Story {
  id: string;
  title?: string;
  description?: string;
}

interface Adventure {
  id: string;
  characterId: string;
  storyId: string;
}

const RuniverseAdventure: React.FC = () => {
  const { selectedCharacter } = useCharacter();
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<string>('');
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [adventureStream, setAdventureStream] = useState<string[]>([]);
  const [formattedStream, setFormattedStream] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [adventureData, setAdventureData] = useState<any>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/consciousnft/story');
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const data = await response.json();
      if (data && Array.isArray(data.stories)) {
        setStories(data.stories);
      } else {
        console.error('Received unexpected data structure for stories:', data);
        setStories([]);
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Failed to load stories');
      setStories([]);
    }
  };

  const handleStartAdventure = async () => {
    try {
      setLoading(true);
      console.log("Starting adventure...");
      const response = await fetch("/api/consciousnft/stream-adventure", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterId: selectedCharacter.consciousId,
          storyId: selectedStory,
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No readable stream available");
      }

      setAdventureStream([]); // Clear previous stream data
      setFormattedStream([]); // Clear previous formatted data

      let storyData = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        storyData += chunk;
        console.log("Received chunk:", chunk);
      }

      console.log("Final story data:", storyData);

      // Clean up JSON string
      storyData = storyData.replace(/`\s+`/g, '').trim();

      // Fix trailing commas in JSON
      storyData = storyData.replace(/,(\s*[\]}])/g, '$1');

      const parsedData = JSON.parse(storyData);
      console.log("Parsed data:", parsedData);

      setAdventureData(parsedData);
    } catch (error) {
      console.error("Error starting adventure:", error);
      setError("Error starting adventure");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (nextStep: string) => {
    // Logic to handle option selection and update the story
    console.log('Selected next step:', nextStep);
  };

  return (
    <div className=" mx-auto bg-[#622aff]">
      <div className="bg-[url('/img/border.png')] h-[131px] bg-auto w-full">
      </div>
      <div className="h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="font-upheav text-7xl font-bold mb-4 tracking-wide">Runiverse Adventure</h1>

      {!selectedCharacter && <CharacterCreation />}

      {selectedCharacter && (
        <div className="flex flex-col items-center gap-3">
          <h2 className="font-vcr text-2xl text-center font-semibold">Selected Character</h2>
          <div className="flex flex-col items-center">
            <img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-16 h-16 rounded-full mr-4" />
            {/* <img src="/characters/heroes/0.png" alt="test" className={styles.adventure_image} /> */}
            <span className="font-vcr text-2xl mt-3">{selectedCharacter.name}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center w-[600px]">
        <h2 className="font-upheav tracking-wide text-2xl font-semibold mb-2">Select a Story</h2>
        <select
          value={selectedStory}
          onChange={(e) => setSelectedStory(e.target.value)}
          className="w-full p-2 rounded text-black font-vcr text-xl"
        >
          <option value="">Select a story</option>
          {Array.isArray(stories) && stories.length > 0 ? (
            stories.map((story) => (
              <option key={story.id} value={story.id}>{story.title || `Story ${story.id}`}</option>
            ))
          ) : (
            <option disabled>No stories available</option>
          )}
        </select>
      </div>

      <button
        onClick={handleStartAdventure}
        disabled={!selectedCharacter || !selectedStory || loading}
        className={styles.pixels_button}
      >
        {loading ? 'Starting...' : 'Start Adventure'}
      </button>

      {error && <div className="text-red-500 font-vcr mt-4">{error}</div>}

      {adventureData && (
        <GameInterface
          storyText={adventureData.storytext}
          options={adventureData.options}
          onOptionClick={handleOptionClick}
        />
      )}
      </div>
      <div className="bg-[url('/img/border1.png')] h-[131px] bg-auto w-full">
      </div>
    </div>
  );
};

export default RuniverseAdventure;
