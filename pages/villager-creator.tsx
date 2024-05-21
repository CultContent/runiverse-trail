import React, { useEffect, useState } from 'react';

// Correctly type the context parameter using 'any' since TypeScript doesn't provide built-in types for require.context
const loadAssets = (context: any, folder: string) => {
  return context.keys().map((key: string) => `/assets/villagers/${folder}/${key.replace('./', '')}`);
};

type CurrentIndexes = {
  [key: string]: number;
};

type SelectedParts = {
  [key: string]: string;
};

const VillagerCreator: React.FC = () => {
  const [skinTone, setSkinTone] = useState('light');
  const [eyeColor, setEyeColor] = useState('blue'); // Default eye color
  const [currentIndexes, setCurrentIndexes] = useState<CurrentIndexes>({
    background: 0,
    bottoms: 0,
    tops: 0,
    hair: 0,
    facialHair: 0,
    head: 0,
  });
  const [selectedParts, setSelectedParts] = useState<SelectedParts>({
    background: '',
    bottoms: '',
    tops: '',
    hair: '',
    facialHair: '',
    head: '',
    eyes: '',
  });

  const [assets, setAssets] = useState<{ [key: string]: string[] }>({
    background: [],
    bottoms: [],
    tops: [],
    hair: [],
    facialHair: [],
    heads: [],
    eyes: [],
  });

  const [filteredHeads, setFilteredHeads] = useState<string[]>([]);
  const [filteredEyes, setFilteredEyes] = useState<string[]>([]);

  useEffect(() => {
    const newAssets: { [key: string]: string[] } = {
      background: loadAssets(require.context('../public/assets/villagers/background', false, /\.(png|jpe?g|svg)$/), 'background'),
      bottoms: loadAssets(require.context('../public/assets/villagers/bottoms', false, /\.(png|jpe?g|svg)$/), 'bottoms'),
      tops: loadAssets(require.context('../public/assets/villagers/tops', false, /\.(png|jpe?g|svg)$/), 'tops'),
      hair: loadAssets(require.context('../public/assets/villagers/hair', false, /\.(png|jpe?g|svg)$/), 'hair'),
      facialHair: loadAssets(require.context('../public/assets/villagers/facial_hair', false, /\.(png|jpe?g|svg)$/), 'facial_hair'),
      heads: loadAssets(require.context('../public/assets/villagers/heads', false, /\.(png|jpe?g|svg)$/), 'heads'),
      eyes: loadAssets(require.context('../public/assets/villagers/eyes', false, /\.(png|jpe?g|svg)$/), 'eyes'),
    };

    setAssets(newAssets);
    setSelectedParts({
      background: newAssets.background[0],
      bottoms: newAssets.bottoms[0],
      tops: newAssets.tops[0],
      hair: newAssets.hair[0],
      facialHair: newAssets.facialHair[0],
      head: newAssets.heads[0],
      eyes: newAssets.eyes[0],
    });
  }, []);

  useEffect(() => {
    const newFilteredHeads = assets.heads.filter((file) => file.includes(`_${skinTone}.`));
    setFilteredHeads(newFilteredHeads);
    if (newFilteredHeads.length > 0) {
      setSelectedParts((prevParts) => ({
        ...prevParts,
        head: newFilteredHeads[0],
      }));
    }
  }, [skinTone, assets.heads]);

  useEffect(() => {
    if (filteredHeads.length > 0) {
      const headNumberMatch = filteredHeads[currentIndexes.head].match(/head_(\d+)_/);
      if (headNumberMatch) {
        const headNumber = headNumberMatch[1];
        const newFilteredEyes = assets.eyes.filter((file) => file.includes(`_${eyeColor}.`) && file.includes(`_${headNumber}_`));
        setFilteredEyes(newFilteredEyes);
        if (newFilteredEyes.length > 0) {
          setSelectedParts((prevParts) => ({
            ...prevParts,
            eyes: newFilteredEyes[0],
          }));
        }
      }
    }
  }, [filteredHeads, eyeColor, currentIndexes.head, assets.eyes]);

  const changeAsset = (part: string, direction: number) => {
    setCurrentIndexes((prev) => {
      const newIndex = (prev[part] + direction + assets[part].length) % assets[part].length;
      const newAsset = assets[part][newIndex];
      setSelectedParts((prevParts) => ({
        ...prevParts,
        [part]: newAsset,
      }));
      return { ...prev, [part]: newIndex };
    });
  };

  const changeHead = (direction: number) => {
    setCurrentIndexes((prev) => {
      const newIndex = (prev.head + direction + filteredHeads.length) % filteredHeads.length;
      const newHead = filteredHeads[newIndex];
      setSelectedParts((prevParts) => ({
        ...prevParts,
        head: newHead,
      }));
      return { ...prev, head: newIndex };
    });
  };

  const saveVillager = () => {
    const metadata = {
      ...selectedParts,
      skinTone,
      eyeColor,
    };
    console.log('Villager Metadata:', metadata);
    // You can replace this with actual saving logic (e.g., send to a server)
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-8">Villager Creator</h1>
      <div className="character-preview relative w-72 h-72 mx-auto bg-white border border-gray-700 rounded-lg" style={{ width: '300px', height: '300px' }}>
        <img src={selectedParts.background} alt="background" className="absolute w-full h-full object-contain" />
        <img src={selectedParts.bottoms} alt="bottoms" className="absolute w-full h-full object-contain" />
        <img src={selectedParts.tops} alt="tops" className="absolute w-full h-full object-contain" />
        <img src={selectedParts.head} alt="head" className="absolute w-full h-full object-contain" />
        <img src={selectedParts.eyes} alt="eyes" className="absolute w-full h-full object-contain" />
        <img src={selectedParts.facialHair} alt="facial hair" className="absolute w-full h-full object-contain" />
        <img src={selectedParts.hair} alt="hair" className="absolute w-full h-full object-contain" />
      </div>

      <div className="selectors flex flex-col items-center mt-4 space-y-2">
        {Object.keys(currentIndexes).map((part) => (
          part !== 'head' && part !== 'eyes' && (
            <div key={part} className="selector flex items-center justify-between w-64 my-2">
              <button onClick={() => changeAsset(part, -1)} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">◀</button>
              <span className="mx-2 text-white">{part}</span>
              <button onClick={() => changeAsset(part, 1)} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">▶</button>
            </div>
          )
        ))}
        <div className="selector flex items-center justify-between w-64 my-2">
          <button onClick={() => changeHead(-1)} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">◀</button>
          <span className="mx-2 text-white">head</span>
          <button onClick={() => changeHead(1)} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">▶</button>
        </div>
        <div className="selector flex items-center justify-between w-64 my-2">
          <button onClick={() => setEyeColor('blue')} className={`px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 ${eyeColor === 'blue' ? 'bg-blue-600' : ''}`}>Blue</button>
          <button onClick={() => setEyeColor('green')} className={`px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 ${eyeColor === 'green' ? 'bg-green-600' : ''}`}>Green</button>
          <button onClick={() => setEyeColor('brown')} className={`px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 ${eyeColor === 'brown' ? 'bg-brown-600' : ''}`}>Brown</button>
        </div>
      </div>

      <div className="skin-tone-selector flex justify-center mt-4 space-x-2">
        <label className="text-white mr-2">Skin Tone: </label>
        {['dark', 'odd', 'med', 'light'].map((tone) => (
          <button
            key={tone}
            onClick={() => setSkinTone(tone)}
            className={`px-3 py-1 rounded ${skinTone === tone ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
          >
            {tone}
          </button>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button onClick={saveVillager} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500">
          Save Villager
        </button>
      </div>
    </div>
  );
};

export default VillagerCreator;
