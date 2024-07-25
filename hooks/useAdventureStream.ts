import { useState, useEffect } from 'react';

interface ChunkData {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      content?: string;
    };
  }[];
}

const useAdventureStream = () => {
    const [adventureText, setAdventureText] = useState<string>('');
  
    const processChunk = (chunk: string) => {
      try {
        const data: ChunkData = JSON.parse(chunk);
        const content = data.content || '';
        setAdventureText((prev) => prev + content);
      } catch (error) {
        console.error('Error processing chunk:', error);
      }
    };
  
    const startAdventure = async () => {
      try {
        const response = await fetch("/api/consciousnft/stream-adventure", {
          method: "POST",
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
  
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunkText = new TextDecoder().decode(value);
          processChunk(chunkText);
        }
      } catch (error) {
        console.error("Error starting adventure:", error);
      }
    };
  
    return { adventureText, startAdventure };
  };
  
  export default useAdventureStream;