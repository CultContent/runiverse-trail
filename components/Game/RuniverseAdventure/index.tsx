import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../../context/CharacterContext';
import CharacterCreation from '../CharacterCreation';

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
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [adventureData, setAdventureData] = useState<any>(null);
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  

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
    if (!selectedCharacter || !selectedStory) {
      setError('Please select a character and a story');
      return;
    }

    if (!selectedCharacter.consciousId) {
      setError('Character has not been created in Conscious NFT. Please create the character first.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/consciousnft/adventure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterId: selectedCharacter.consciousId,
          storyId: selectedStory,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to start adventure: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      setAdventure(data);
      setAdventureData(data);  // Store all the data returned from the API
      if (data.id) {
        startAdventureStream(data.id);
      } else {
        console.error('No adventure ID returned from API');
      }
    } catch (err) {
      console.error('Error starting adventure:', err);
      setError(err.message || 'Failed to start adventure');
    } finally {
      setLoading(false);
    }
  };

  const startAdventureStream = (adventureId: string) => {
    const eventSource = new EventSource(`/api/consciousnft/adventure/stream/${adventureId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAdventureStream((prev) => [...prev, data]);
      console.log('Received data:', data);

      if (data.step === 'end') {
        eventSource.close();
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      setError('Error in adventure stream');
      eventSource.close();
    };
  };

  const startAdventurePolling = (adventureId: string) => {
    const pollAdventure = async () => {
      try {
        const response = await fetch(`/api/consciousnft/adventure/${adventureId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch adventure data');
        }
        const data = await response.json();
        setAdventureData(data);
        console.log('Received adventure data:', data);

        // Check if the adventure is complete
        if (data.status === 'complete') {
          if (pollingInterval) {
            clearInterval(pollingInterval);
          }
        }
      } catch (error) {
        console.error('Error polling adventure:', error);
        setError('Error fetching adventure data');
        if (pollingInterval) {
          clearInterval(pollingInterval);
        }
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(pollAdventure, 5000);
    setPollingInterval(interval);

    // Initial poll
    pollAdventure();
  };

  useEffect(() => {
    return () => {
      // Clean up interval when component unmounts
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Runiverse Adventure</h1>

      {!selectedCharacter && <CharacterCreation />}

      {selectedCharacter && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected Character</h2>
          <div className="flex items-center">
            <img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-16 h-16 rounded-full mr-4" />
            <span>{selectedCharacter.name}</span>
          </div>
        </div>
      )}

        <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select a Story</h2>
        <select 
            value={selectedStory} 
            onChange={(e) => setSelectedStory(e.target.value)}
            className="w-full p-2 border border-black-300 rounded"
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
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Starting...' : 'Start Adventure'}
      </button>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {adventure && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Adventure</h2>
          <p>Adventure ID: {adventure.id}</p>
          <p>Character ID: {adventure.characterId}</p>
          <p>Story ID: {adventure.storyId}</p>
        </div>
      )}
 {adventureData && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Adventure Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(adventureData, null, 2)}
          </pre>
        </div>
      )}

      {adventureStream.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Adventure Stream</h2>
          <div className="border border-gray-300 p-4 rounded h-64 overflow-y-auto">
            {adventureStream.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RuniverseAdventure;