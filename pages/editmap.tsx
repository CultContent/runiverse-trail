// Part 1: Imports and Interfaces
import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Upload, Trash2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Coordinates {
  x: number;
  y: number;
}

interface Resource {
  id: string;
  name: string;
}

interface Action {
  id: string;
  title: string; // Changed from having both title and description to just title
}

interface LocationData {
  id: string;
  biome: string;
  description: string;
  actions: Action[];
  imageUrl?: string;
  x: number;
  y: number;
  resources: Resource[];
}

interface LocationMap {
  [key: string]: LocationData;
}

interface RuniverseMapProps {
  width?: number;
  height?: number;
  gridSize?: number;
}

// Part 2: Component Definition
const RuniverseMap: React.FC<RuniverseMapProps> = ({
  width = 2000,
  height = 1800,
  gridSize = 50
}) => {
  // State Management
  const [selectedCell, setSelectedCell] = useState<Coordinates | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [minZoom, setMinZoom] = useState(1);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [mapData, setMapData] = useState<LocationMap>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<LocationData | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newResource, setNewResource] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionDescription, setNewActionDescription] = useState('')
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const COLS = Math.floor(width / gridSize);
  const ROWS = Math.floor(height / gridSize);
  const MAX_ZOOM = 2;
  const ZOOM_STEP = 0.1;

  // Mobile Detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Data Fetching
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
              imageUrl: tile.image_url,
              resources: tile.resources || [],
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

  const handleAddAction = () => {
    if (!editingData || !newActionTitle.trim()) {
      alert('Please enter an action name');
      return;
    }
  
    const action: Action = {
      id: crypto.randomUUID(),
      title: newActionTitle.trim()
    };
  
    setEditingData(prev => prev ? {
      ...prev,
      actions: [...(prev.actions || []), action]
    } : null);
  
    setNewActionTitle('');
  };
  
  const handleRemoveAction = (actionId: string) => {
    setEditingData(prev => prev ? {
      ...prev,
      actions: prev.actions.filter(a => a.id !== actionId)
    } : null);
  };

  // Resource Management
  const handleAddResource = () => {
    if (!editingData || !newResource.trim()) {
      alert('Please enter a resource name');
      return;
    }

    const resource: Resource = {
      id: crypto.randomUUID(),
      name: newResource.trim()
    };

    setEditingData(prev => prev ? {
      ...prev,
      resources: [...(prev.resources || []), resource]
    } : null);

    setNewResource('');
  };

  const handleRemoveResource = (resourceId: string) => {
    setEditingData(prev => prev ? {
      ...prev,
      resources: prev.resources.filter(r => r.id !== resourceId)
    } : null);
  };

  // Image Management
  const handleImageUpload = async (file: File) => {
    if (!editingData) return;
    
    setUploadingImage(true);
    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size too large. Please upload an image smaller than 5MB.');
      }
  
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'gif'].includes(fileExt || '')) {
        throw new Error('Invalid file type. Please upload a JPG, PNG, or GIF image.');
      }
  
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `tile-images/${fileName}`;
  
      const { error: uploadError } = await supabase.storage
        .from('runiverse-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
  
      if (uploadError) throw uploadError;
  
      const { data: { publicUrl } } = supabase.storage
        .from('runiverse-images')
        .getPublicUrl(filePath);
  
      setEditingData(prev => prev ? { ...prev, imageUrl: publicUrl } : null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async () => {
    if (!editingData?.imageUrl) return;

    try {
      const filePath = editingData.imageUrl.split('/').pop();
      if (!filePath) return;

      const { error } = await supabase.storage
        .from('runiverse-images')
        .remove([`tile-images/${filePath}`]);

      if (error) throw error;

      setEditingData(prev => prev ? { ...prev, imageUrl: undefined } : null);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  // CRUD Operations
  const handleCreate = async () => {
    if (!editingData || !selectedCell) return;
  
    if (!editingData.biome || !editingData.description) {
      alert('Please fill in all required fields');
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from('map_tiles')
        .insert([{
          id: editingData.id,
          x: selectedCell.x,
          y: selectedCell.y,
          biome: editingData.biome,
          description: editingData.description,
          image_url: editingData.imageUrl,
          resources: editingData.resources || [],
          actions: editingData.actions || [], // Add this line
        }])
        .select()
        .single();
  
      if (error) throw error;
  
      if (data) {
        setMapData(prev => ({
          ...prev,
          [`${selectedCell.x}-${selectedCell.y}`]: {
            ...data,
            imageUrl: data.image_url,
            resources: data.resources || [],
            actions: data.actions || [] // Add this line
          }
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
          description: editingData.description,
          image_url: editingData.imageUrl,
          resources: editingData.resources || [],
          actions: editingData.actions || [] // Add this line
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

  // Map Interaction Functions
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

  // Event Handlers
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

  // Initial Setup Effect
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

  // Part 3: Render
  return (
    <div className="relative w-full flex items-center flex-col justify-center mx-auto h-full p-2 md:p-12">
      <h1 className="font-atirose text-2xl md:text-5xl mb-4 md:mb-8">Runiverse Map</h1>
      <div 
        ref={mapContainerRef}
        className="relative overflow-hidden w-full h-[calc(100vh-120px)]"
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
          onTouchStart={(e) => {
            const touch = e.touches[0];
            handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY } as React.MouseEvent);
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as React.MouseEvent);
          }}
          onTouchEnd={handleMouseUp}
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
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
                <div className="relative bg-white rounded-lg shadow-xl p-4 m-4 max-h-[90vh] overflow-y-auto sm:w-full md:w-[500px]">
                  <div className="relative mb-4">
                    <button
                      onClick={closePopup}
                      className="absolute -top-2 -right-2 p-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                      aria-label="Close popup"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Tabs Navigation */}
                  <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                      <button
                        onClick={() => setActiveTab('info')}
                        className={`${
                          activeTab === 'info'
                            ? 'border-blue-500 text-black text-sm'
                            : 'border-transparent text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap pb-3 px-1 border-b-2 font-medium`}
                      >
                        Basic Info
                      </button>
                      <button
                        onClick={() => setActiveTab('resources')}
                        className={`${
                          activeTab === 'resources'
                            ? 'border-blue-500 text-sm text-black'
                            : 'border-transparent text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap pb-3 px-1 border-b-2 font-medium`}
                      >
                        Resources
                      </button>
                      <button
                        onClick={() => setActiveTab('actions')}
                        className={`${
                          activeTab === 'actions'
                            ? 'border-blue-500 text-sm text-black'
                            : 'border-transparent text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap pb-3 px-1 border-b-2 font-medium`}
                      >
                        Actions
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'info' && (
                  <div className="space-y-4">
                    {getLocationData(selectedCell.x, selectedCell.y) ? (
                      // Existing tile view/edit
                      <>
                        {!isEditing ? (
                          <>
                            <div className="mb-3 h-[100px] rounded-lg flex items-center justify-center bg-gray-50">
                            {getLocationData(selectedCell.x, selectedCell.y)?.imageUrl ? (
                                      <img 
                                        src={getLocationData(selectedCell.x, selectedCell.y)?.imageUrl} 
                                        alt="Tile image"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-lg font-bold text-black">
                                        {getLocationData(selectedCell.x, selectedCell.y)?.biome}
                                      </span>
                                    )}
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-2">
                              Coordinates: ({selectedCell.x}, {selectedCell.y})
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-4">
                              {getLocationData(selectedCell.x, selectedCell.y)?.description}
                            </p>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div>
                            <div className="h-32 w-full relative rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        {editingData?.imageUrl ? (
                                          <div className="relative w-full h-full">
                                            <img 
                                              src={editingData.imageUrl} 
                                              alt="Tile image" 
                                              className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                              onClick={handleImageDelete}
                                              className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                                            >
                                              <Trash2 size={16} />
                                            </button>
                                          </div>
                                        ) : (
                                          <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex flex-col items-center text-gray-600 hover:text-gray-900"
                                            disabled={uploadingImage}
                                          >
                                            <Upload size={24} />
                                            <span className="mt-1 text-sm">
                                              {uploadingImage ? 'Uploading...' : 'Upload Image'}
                                            </span>
                                          </button>
                                        )}
                                      </div>
                                      <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleImageUpload(file);
                                        }}
                                      />
                                    
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Biome
                              </label>
                              <select
                                value={editingData?.biome || ''}
                                onChange={(e) => setEditingData(prev => prev ? {...prev, biome: e.target.value} : null)}
                                className="w-full p-2 border rounded text-black focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select a biome...</option>
                                <option value="Ice Sheet">Ice Sheet</option>
                                <option value="Tundra">Tundra</option>
                                <option value="Taiga">Taiga</option>
                                <option value="Temperate Forest">Temperate Forest</option>
                                <option value="Grassland">Grassland</option>
                                <option value="Tropical Forest">Tropical Forest</option>
                                <option value="Desert">Desert</option>
                                <option value="Steppe">Steppe</option>
                                <option value="Wasteland">Wasteland</option>
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
                                  resources: [],
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
                                <option value="Ice Sheet">Ice Sheet</option>
                                <option value="Tundra">Tundra</option>
                                <option value="Taiga">Taiga</option>
                                <option value="Temperate Forest">Temperate Forest</option>
                                <option value="Grassland">Grassland</option>
                                <option value="Tropical Forest">Tropical Forest</option>
                                <option value="Desert">Desert</option>
                                <option value="Steppe">Steppe</option>
                                <option value="Wasteland">Wasteland</option>
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

                  {/* Resources Tab */}
                  {activeTab === 'resources' && (
                    <div className="space-y-4">
                      {/* Display existing resources */}
                      <h3 className="text-sm font-medium text-gray-900">Resources</h3>
                      {getLocationData(selectedCell.x, selectedCell.y)?.resources && 
                      (getLocationData(selectedCell.x, selectedCell.y)?.resources?.length ?? 0) > 0 && !isEditing && (
                        <div className="space-y-2">
                          {getLocationData(selectedCell.x, selectedCell.y)?.resources.map(resource => (
                            <div 
                              key={resource.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <span className="font-medium text-black">{resource.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Editing mode resources */}
                      {isEditing && (
                        <>
                          {editingData?.resources && editingData.resources.length > 0 && (
                            <div className="space-y-2">
                              {editingData.resources.map(resource => (
                                <div 
                                  key={resource.id}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                  <span className="font-medium text-black">{resource.name}</span>
                                  <button
                                    onClick={() => handleRemoveResource(resource.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter resource name"
                              value={newResource}
                              onChange={(e) => setNewResource(e.target.value)}
                              className="flex-1 p-2 border rounded text-black"
                            />
                            <button
                              onClick={handleAddResource}
                              className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
                            >
                              <Plus/>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Actions Tab */}
                  {activeTab === 'actions' && (
                    <div className="space-y-4">
                      {/* Display existing actions */}
                      <h3 className="text-sm font-medium text-gray-900">Actions</h3>
                      {getLocationData(selectedCell.x, selectedCell.y)?.actions && 
                      (getLocationData(selectedCell.x, selectedCell.y)?.actions?.length ?? 0) > 0 && !isEditing && (
                        <div className="space-y-2">
                          {getLocationData(selectedCell.x, selectedCell.y)?.actions.map(action => (
                            <div 
                              key={action.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <span className="font-medium text-black">{action.title}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Editing mode actions */}
                      {isEditing && (
                        <>
                          {editingData?.actions && editingData.actions.length > 0 && (
                            <div className="space-y-2">
                              {editingData.actions.map(action => (
                                <div 
                                  key={action.id}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                  <span className="font-medium text-black">{action.title}</span>
                                  <button
                                    onClick={() => handleRemoveAction(action.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter action name"
                              value={newActionTitle}
                              onChange={(e) => setNewActionTitle(e.target.value)}
                              className="flex-1 p-2 border rounded text-black"
                            />
                            <button
                              onClick={handleAddAction}
                              className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
                            >
                              <Plus/>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {/* Action Buttons - Always visible at bottom */}
                  <div className="mt-6 flex gap-2">
                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditingData(getLocationData(selectedCell.x, selectedCell.y) || {
                            id: crypto.randomUUID(),
                            x: selectedCell.x,
                            y: selectedCell.y,
                            biome: '',
                            description: '',
                            resources: [],
                            actions: []
                          });
                        }}
                        className="w-full px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 transition-colors"
                      >
                        {getLocationData(selectedCell.x, selectedCell.y) ? 'Edit Tile' : 'Create New Tile'}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={getLocationData(selectedCell.x, selectedCell.y) ? handleUpdate : handleCreate}
                          className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          {getLocationData(selectedCell.x, selectedCell.y) ? 'Save Changes' : 'Create'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditingData(null);
                          }}
                          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 md:mt-8 text-xs md:text-sm text-gray-600 uppercase text-center px-4">
        {isMobile ? 
          "Drag to pan. Pinch to zoom." : 
          "Click and drag to pan. Use mouse wheel to zoom."}
      </div>
    </div>
  );
};

export default RuniverseMap;