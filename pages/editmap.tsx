import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Coordinates {
  x: number;
  y: number;
}

interface LocationData {
  id: string;
  biome: string;
  description: string;
  actions: string[];
  x: number;
  y: number;
}

interface LocationMap {
  [key: string]: LocationData;
}

interface RuniverseMapProps {
  width?: number;
  height?: number;
  gridSize?: number;
}

const RuniverseMap: React.FC<RuniverseMapProps> = ({
  width = 2000,
  height = 1800,
  gridSize = 50
}) => {
  const [selectedCell, setSelectedCell] = useState<Coordinates | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [minZoom, setMinZoom] = useState(1);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [mapData, setMapData] = useState<LocationMap>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<LocationData | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  const COLS = Math.floor(width / gridSize);
  const ROWS = Math.floor(height / gridSize);
  const MAX_ZOOM = 2;
  const ZOOM_STEP = 0.1;

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const { data, error } = await supabase
          .from('map_tiles')
          .select('*');

        if (error) throw error;

        if (data) {
          const formattedData = data.reduce((acc: LocationMap, tile: any) => {
            acc[`${tile.x}-${tile.y}`] = {
              ...tile,
              actions: tile.actions || []
            };
            return acc;
          }, {});
          
          setMapData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
      }
    };

    fetchMapData();
  }, []);

  const handleCreate = async () => {
    if (!editingData || !selectedCell) {
      console.log("Missing editingData or selectedCell");
      return;
    }

    if (!editingData.biome || !editingData.description) {
      alert('Please fill in all required fields');
      return;
    }

    console.log("Creating new tile with data:", editingData);

    try {
      const { data, error } = await supabase
        .from('map_tiles')
        .insert([{
          id: editingData.id,
          x: selectedCell.x,
          y: selectedCell.y,
          biome: editingData.biome,
          description: editingData.description,
          actions: []
        }])
        .select()
        .single();

      if (error) throw error;

      console.log("Tile created successfully:", data);

      if (data) {
        setMapData(prev => ({
          ...prev,
          [`${selectedCell.x}-${selectedCell.y}`]: data
        }));

        setIsEditing(false);
        setEditingData(null);
      }
    } catch (error) {
      console.error('Error creating tile:', error);
      alert('Error creating tile. Please try again.');
    }
  };

  const handleUpdate = async () => {
    if (!editingData || !selectedCell) return;

    try {
      const { error } = await supabase
        .from('map_tiles')
        .update({
          biome: editingData.biome,
          description: editingData.description
        })
        .eq('id', editingData.id);

      if (error) throw error;

      setMapData(prev => ({
        ...prev,
        [`${selectedCell.x}-${selectedCell.y}`]: editingData
      }));

      setIsEditing(false);
      setEditingData(null);
    } catch (error) {
      console.error('Error updating tile:', error);
    }
  };

  const calculateMinZoom = () => {
    const container = mapContainerRef.current;
    if (!container) return 1;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const widthRatio = containerWidth / width;
    const heightRatio = containerHeight / height;
    
    return Math.max(widthRatio, heightRatio);
  };

  const constrainPosition = (pos: { x: number, y: number }, currentZoom: number) => {
    const container = mapContainerRef.current;
    if (!container) return pos;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const scaledWidth = width * currentZoom;
    const scaledHeight = height * currentZoom;

    const minX = containerWidth - scaledWidth;
    const minY = containerHeight - scaledHeight;
    
    return {
      x: Math.min(0, Math.max(minX, pos.x)),
      y: Math.min(0, Math.max(minY, pos.y))
    };
  };

  useEffect(() => {
    const updateMinZoom = () => {
      const newMinZoom = calculateMinZoom();
      setMinZoom(newMinZoom);
      setZoom(z => Math.max(newMinZoom, z));
    };

    updateMinZoom();

    const resizeObserver = new ResizeObserver(updateMinZoom);
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleMouseEnter = () => {
    setIsMouseOver(true);
    document.body.style.overflow = 'hidden';
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false);
    document.body.style.overflow = 'auto';
    setIsDragging(false);
  };

  const handleCellClick = (x: number, y: number): void => {
    if (!isDragging) {
      setSelectedCell({ x, y });
      setIsEditing(false);
      setEditingData(null);
    }
  };

  const closePopup = (): void => {
    setSelectedCell(null);
    setIsEditing(false);
    setEditingData(null);
  };

  const getLocationData = (x: number, y: number): LocationData | null => {
    const key = `${x}-${y}`;
    return mapData[key] || null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const relativeX = (mouseX - position.x) / zoom;
    const relativeY = (mouseY - position.y) / zoom;
    
    const delta = -Math.sign(e.deltaY) * ZOOM_STEP;
    const newZoom = Math.max(minZoom, Math.min(MAX_ZOOM, zoom + delta));
    
    if (newZoom !== zoom) {
      let newPosition = {
        x: mouseX - (relativeX * newZoom),
        y: mouseY - (relativeY * newZoom)
      };

      newPosition = constrainPosition(newPosition, newZoom);
      
      setZoom(newZoom);
      setPosition(newPosition);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      const newPosition = constrainPosition({ x: newX, y: newY }, zoom);
      setPosition(newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);

    const container = mapContainerRef.current;
    if (container) {
      const initialPosition = constrainPosition({
        x: (container.clientWidth - width) / 2,
        y: (container.clientHeight - height) / 2
      }, zoom);
      setPosition(initialPosition);
    }

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="relative w-full flex items-center flex-col justify-center max-w-8xl mx-auto h-full p-12">
      <h1 className="font-atirose text-5xl mb-8">Runiverse Map</h1>
      <div 
        ref={mapContainerRef}
        className="relative overflow-hidden w-full h-screen"
        onWheel={handleWheel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div 
            className="relative"
            style={{ 
              width,
              height,
              backgroundColor: '#d4cec0'
            }}
          >
            <img 
              src="/img/runiversemap.png"
              alt="Runiverse Map"
              className="absolute top-0 left-0 w-full h-full object-cover"
              draggable={false}
            />
            
            <div className="absolute top-0 left-0 w-full h-full">
              {Array.from({ length: ROWS }).map((_, y) => (
                <div key={y} className="flex">
                  {Array.from({ length: COLS }).map((_, x) => (
                    <div
                      key={`${x}-${y}`}
                      className="border border-black border-opacity-20 hover:bg-white hover:bg-opacity-20 cursor-pointer transition-colors"
                      style={{ width: gridSize, height: gridSize }}
                      onClick={() => handleCellClick(x, y)}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="absolute top-0 left-0">
              {Array.from({ length: COLS }).map((_, x) => (
                <div
                  key={x}
                  className="absolute text-xs text-black bg-white bg-opacity-50 px-1"
                  style={{ left: x * gridSize }}
                >
                  {x}
                </div>
              ))}
              {Array.from({ length: ROWS }).map((_, y) => (
                <div
                  key={y}
                  className="absolute text-xs text-black bg-white bg-opacity-50 px-1"
                  style={{ top: y * gridSize }}
                >
                  {y}
                </div>
              ))}
            </div>

            {selectedCell && (
              <div 
                className="absolute bg-white rounded-lg shadow-xl p-4 w-96"
                style={{
                  left: (selectedCell.x * gridSize) + gridSize,
                  top: (selectedCell.y * gridSize) + gridSize,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1000
                }}
              >
                <button
                  onClick={closePopup}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  aria-label="Close popup"
                >
                  <X size={16} />
                </button>
                
                {getLocationData(selectedCell.x, selectedCell.y) ? (
                  // Existing tile view/edit
                  <>
                    {!isEditing ? (
                      <>
                        <div className="mb-3 h-[100px] rounded-lg flex items-center justify-center bg-gray-50">
                          <span className="text-lg font-bold text-black">
                            {getLocationData(selectedCell.x, selectedCell.y)?.biome}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          Coordinates: ({selectedCell.x}, {selectedCell.y})
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">
                          {getLocationData(selectedCell.x, selectedCell.y)?.description}
                        </p>

                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setEditingData(getLocationData(selectedCell.x, selectedCell.y));
                          }}
                          className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 transition-colors"
                        >
                          Edit Tile
                        </button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Biome
                          </label>
                          <select
                            value={editingData?.biome || ''}
                            onChange={(e) => setEditingData(prev => prev ? {...prev, biome: e.target.value} : null)}
                            className="w-full p-2 border rounded text-black focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select a biome...</option>
                            <option value="The Highlands">The Highlands</option>
                            <option value="The Salt">The Salt</option>
                            <option value="Forests">Forests</option>
                            <option value="Plains">Plains</option>
                            <option value="The Sand">The Sand</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={editingData?.description || ''}
                            onChange={(e) => setEditingData(prev => prev ? {...prev, description: e.target.value} : null)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-32"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdate}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setEditingData(null);
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // New tile creation
                  <>
                    {!isEditing ? (
                      <>
                        <div className="mb-3 h-[100px] bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg text-black font-bold">Unexplored Territory</span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          Coordinates: ({selectedCell.x}, {selectedCell.y})
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          This location remains to be discovered...
                        </p>

                        <button
                          onClick={() => {
                            console.log("Creating new tile...");
                            setIsEditing(true);
                            setEditingData({
                              id: crypto.randomUUID(),
                              x: selectedCell.x,
                              y: selectedCell.y,
                              biome: '',
                              description: '',
                              actions: []
                            });
                          }}
                          className="mt-4 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 transition-colors"
                        >
                          Create New Tile
                        </button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Biome
                          </label>
                          <select
                            value={editingData?.biome || ''}
                            onChange={(e) => setEditingData(prev => prev ? {...prev, biome: e.target.value} : null)}
                            className="w-full p-2 border rounded text-black focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select a biome...</option>
                            <option value="The Highlands">The Highlands</option>
                            <option value="The Salt">The Salt</option>
                            <option value="Forests">Forests</option>
                            <option value="Plains">Plains</option>
                            <option value="The Sand">The Sand</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={editingData?.description || ''}
                            onChange={(e) => setEditingData(prev => prev ? {...prev, description: e.target.value} : null)}
                            className="w-full p-2 border text-black rounded focus:ring-2 focus:ring-blue-500 h-32"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={handleCreate}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setEditingData(null);
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-white uppercase">
        Click and drag to pan. Use mouse wheel to zoom.
      </div>
    </div>
  );
};

export default RuniverseMap;