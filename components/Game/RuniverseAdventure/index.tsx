import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../../context/CharacterContext';
import CharacterCreation from '../CharacterCreation';
import GameInterface from '../GameInterface';
import styles from "@/app/pixelbutton.module.css";

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

interface GameState {
  storyText: string;
  options: { optionText: string; nextStep: string }[];
}

// Place this function inside your RuniverseAdventure component, but outside of any other functions
// Alternatively, you can define it outside the component if preferred

const readAndProcessStream = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
  let accumulatedContent = '';
  let buffer = '';
  let doneReading = false;
  const decoder = new TextDecoder();

  while (!doneReading) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    const chunk = decoder.decode(value);
    buffer += chunk;

    // Split the buffer by newlines to get complete JSON objects
    let lines = buffer.split('\n');

    // Keep the last line in the buffer (it might be incomplete)
    buffer = lines.pop() || '';

    for (let line of lines) {
      if (line.trim() === '') {
        continue;
      }
      try {
        const parsedChunk = JSON.parse(line);
        const deltaContent = parsedChunk.choices?.[0]?.delta?.content || '';
        accumulatedContent += deltaContent;

        // Check if the stream has finished
        if (parsedChunk.choices?.[0]?.finish_reason === 'stop') {
          doneReading = true;
          break;
        }
      } catch (e) {
        console.error("Error parsing line as JSON:", e);
        // If parsing fails, the line may be incomplete; skip it
        continue;
      }
    }
  }

  // After the loop, process any remaining data in the buffer
  if (buffer.trim() !== '') {
    try {
      const parsedChunk = JSON.parse(buffer);
      const deltaContent = parsedChunk.choices?.[0]?.delta?.content || '';
      accumulatedContent += deltaContent;
    } catch (e) {
      console.error("Error parsing buffer as JSON after stream ended:", e);
    }
  }

  return accumulatedContent;
};

const parseAccumulatedContent = (content: string) => {
  let parsedData;
  try {
    parsedData = JSON.parse(content);
    return parsedData;
  } catch (e) {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      const jsonString = jsonMatch[1];
      try {
        parsedData = JSON.parse(jsonString);
        return parsedData;
      } catch (e2) {
        console.error("Error parsing JSON content from code block:", e2);
        throw e2;
      }
    } else {
      console.error("Error parsing accumulated content as JSON:", e);
      console.error("JSON code block not found in the content");
      throw e;
    }
  }
};

const RuniverseAdventure: React.FC = () => {
  const { selectedCharacter } = useCharacter();
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<string>('');
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [gameState, setGameState] = useState<GameState>({ storyText: '', options: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      console.log("Creating adventure...");
      
      const createResponse = await fetch("/api/consciousnft/create-adventure", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterId: selectedCharacter?.consciousId,
          storyId: selectedStory,
        })
      });
      if (!createResponse.ok) {
        throw new Error(`HTTP error! status: ${createResponse.status}`);
      }
      
      const adventureData = await createResponse.json();
      setAdventure(adventureData.data.adventure);
      console.log(adventureData.data.adventure.id);
  
      console.log("Starting adventure stream...");
      
      const streamResponse = await fetch("/api/consciousnft/stream-adventure", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adventureId: adventureData.data.adventure.id,
        })
      });
      
      
      if (!streamResponse.ok) {
        throw new Error(`HTTP error! status: ${streamResponse.status}`);
      }

      const reader = streamResponse.body?.getReader();
      if (!reader) {
        throw new Error("No readable stream available");
      }

      setGameState({ storyText: '', options: [] });

      let accumulatedContent = '';
      let buffer = '';
      let doneReading = false;
      const decoder = new TextDecoder();

      while (!doneReading) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        buffer += chunk;

        // Split the buffer by newlines to get complete JSON objects
        let lines = buffer.split('\n');

        // Keep the last line in the buffer (it might be incomplete)
        buffer = lines.pop() || '';

        for (let line of lines) {
          if (line.trim() === '') {
            continue;
          }
          try {
            const parsedChunk = JSON.parse(line);
            const deltaContent = parsedChunk.choices?.[0]?.delta?.content || '';
            accumulatedContent += deltaContent;

            // Check if the stream has finished
            if (parsedChunk.choices?.[0]?.finish_reason === 'stop') {
              doneReading = true;
              break;
            }
          } catch (e) {
            console.error("Error parsing line as JSON:", e);
            // If parsing fails, the line may be incomplete; skip it
            continue;
          }
        }
      }

      // After the loop, process any remaining data in the buffer
      if (buffer.trim() !== '') {
        try {
          const parsedChunk = JSON.parse(buffer);
          const deltaContent = parsedChunk.choices?.[0]?.delta?.content || '';
          accumulatedContent += deltaContent;
        } catch (e) {
          console.error("Error parsing buffer as JSON after stream ended:", e);
        }
      }

      // Now process the accumulated content
      console.log("Accumulated Content:", accumulatedContent);

      // Extract the JSON code block from the accumulated content
      const jsonMatch = accumulatedContent.match(/```json\s*([\s\S]*?)\s*```/);

      if (jsonMatch && jsonMatch[1]) {
        const jsonString = jsonMatch[1];

        try {
          const parsedData = JSON.parse(jsonString);
          // Update the gameState with the parsed storytext and options
          setGameState({
            storyText: parsedData.storytext || '',
            options: parsedData.options || [],
          });
        } catch (e) {
          console.error("Error parsing JSON content:", e);
          setError("Error parsing story data");
        }
      } else {
        console.error("JSON code block not found in the content");
        setError("Story data not found");
      }

    } catch (error) {
      console.error("Error starting adventure:", error);
      setError("Error starting adventure");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = async (nextStep: string) => {
    try {
      setLoading(true);
      console.log('Selected next step:', nextStep);
  
      if (!adventure) {
        throw new Error("No active adventure");
      }
  
      const response = await fetch("/api/consciousnft/stream-adventure", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adventureId: adventure.id,
          characterMessage: nextStep,
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No readable stream available");
      }
  
      setGameState({ storyText: '', options: [] });
  
      const accumulatedContent = await readAndProcessStream(reader);
  
      console.log("Accumulated Content:", accumulatedContent);
  
      try {
        const parsedData = parseAccumulatedContent(accumulatedContent);
        setGameState({
          storyText: parsedData.storytext || '',
          options: parsedData.options || [],
        });
      } catch (e) {
        console.error("Error parsing story data:", e);
        setError("Error parsing story data");
      }
  
    } catch (error) {
      console.error("Error continuing adventure:", error);
      setError("Error continuing adventure");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAdventure = async () => {
    try {
      setLoading(true);
      console.log('Continuing adventure...');
  
      if (!adventure) {
        throw new Error("No active adventure");
      }
  
      const response = await fetch('/api/consciousnft/continue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adventureId: adventure.id,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Received next storyId:', data.storyId);
  
      // Start the next adventure with the received storyId
      setSelectedStory(data.storyId);
      handleStartAdventure();
    } catch (error) {
      console.error("Error continuing adventure:", error);
      setError("Error continuing adventure");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="mx-auto border">
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="font-atirose uppercase text-7xl font-bold mb-4 tracking-wide">Runiverse Adventure</h1>

        {!selectedCharacter && <CharacterCreation />}

        {selectedCharacter && !adventure && (
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-vcr text-2xl text-center font-semibold">Selected Character</h2>
            <div className="flex flex-col items-center">
              <img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-16 h-16 rounded-full mr-4" />
              <span className="font-vcr text-2xl mt-3">{selectedCharacter.name}</span>
            </div>

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
          </div>
        )}

        {error && <div className="text-red-500 font-vcr mt-4">{error}</div>}
        {adventure && (
          <GameInterface
            storyText={gameState.storyText}
            options={gameState.options}
            continueAvailable={true} // Always true since we want to display the continue button
            onOptionClick={handleOptionClick}
            onContinue={handleContinueAdventure}
          />
        )}
      </div>
    </div>
  );
};

export default RuniverseAdventure;
