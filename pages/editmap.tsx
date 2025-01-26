import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { Plus, Upload, Trash2 } from 'lucide-react';
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
  title: string;
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

export default function RuniverseMap({
  width = 2000,
  height = 1800,
  gridSize = 50
}: RuniverseMapProps) {
  // Single Edit
  const [selectedCell, setSelectedCell] = useState<Coordinates | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<LocationData | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newResource, setNewResource] = useState('');
  const [newActionTitle, setNewActionTitle] = useState('');

  // Bulk Edit
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [multiSelectedCells, setMultiSelectedCells] = useState<Coordinates[]>([]);
  const [bulkEditingData, setBulkEditingData] = useState<{
    biome?: string;
    description?: string;
  }>({});
  const [rectStartCoord, setRectStartCoord] = useState<Coordinates | null>(null);
  const [isRectSelecting, setIsRectSelecting] = useState(false);

  // Map / Zoom
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [minZoom, setMinZoom] = useState(1);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const [mapData, setMapData] = useState<LocationMap>({});
  const [isMobile, setIsMobile] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const COLS = Math.floor(width / gridSize);
  const ROWS = Math.floor(height / gridSize);
  const MAX_ZOOM = 2;
  const ZOOM_STEP = 0.1;

  // =========================
  // Initial Setup / Data Load
  // =========================
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  useEffect(() => {
    const updateMinZoom = () => {
      const newMinZoom = calculateMinZoom();
      setMinZoom(newMinZoom);
      setZoom((z) => Math.max(newMinZoom, z));
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
      const initialPos = constrainPosition(
        {
          x: (container.clientWidth - width) / 2,
          y: (container.clientHeight - height) / 2
        },
        zoom
      );
      setPosition(initialPos);
    }

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // =====================
  // Keyboard Navigation
  // =====================
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (bulkEditMode) return; // No arrow/E behavior in bulk mode
      if (!selectedCell) return; // If no tile selected, do nothing

      let newX = selectedCell.x;
      let newY = selectedCell.y;
      let handled = false;

      switch (event.key) {
        case 'ArrowUp':
          newY = Math.max(0, selectedCell.y - 1);
          handled = true;
          break;
        case 'ArrowDown':
          newY = Math.min(ROWS - 1, selectedCell.y + 1);
          handled = true;
          break;
        case 'ArrowLeft':
          newX = Math.max(0, selectedCell.x - 1);
          handled = true;
          break;
        case 'ArrowRight':
          newX = Math.min(COLS - 1, selectedCell.x + 1);
          handled = true;
          break;
        case 'e':
        case 'E':
          // Toggle editing
          setIsEditing((prev) => {
            const nextEdit = !prev;
            if (nextEdit) {
              // Start editing data
              const loc = getLocationData(selectedCell.x, selectedCell.y);
              setEditingData(
                loc || {
                  id: crypto.randomUUID(),
                  x: selectedCell.x,
                  y: selectedCell.y,
                  biome: '',
                  description: '',
                  resources: [],
                  actions: []
                }
              );
            } else {
              // Cancel editing
              setEditingData(null);
            }
            return nextEdit;
          });
          handled = true;
          break;
      }

      if (handled) {
        event.preventDefault(); // prevent scrolling
        if (newX !== selectedCell.x || newY !== selectedCell.y) {
          setSelectedCell({ x: newX, y: newY });
          setIsEditing(false);
          setEditingData(null);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, bulkEditMode, ROWS, COLS]);

  // ==============
  // Zoom / Pan
  // ==============
  function calculateMinZoom() {
    const container = mapContainerRef.current;
    if (!container) return 1;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const widthRatio = containerWidth / width;
    const heightRatio = containerHeight / height;
    return Math.max(widthRatio, heightRatio);
  }

  function constrainPosition(pos: { x: number; y: number }, currentZoom: number) {
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
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      const newPosition = constrainPosition({ x: newX, y: newY }, zoom);
      setPosition(newPosition);
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
    if (isRectSelecting) {
      setIsRectSelecting(false);
      setRectStartCoord(null);
    }
  }

  function handleMouseEnter() {
    setIsMouseOver(true);
    document.body.style.overflow = 'hidden';
  }

  function handleMouseLeave() {
    setIsMouseOver(false);
    document.body.style.overflow = 'auto';
    setIsDragging(false);
  }

  function handleWheel(e: React.WheelEvent) {
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
      let newPos = {
        x: mouseX - relativeX * newZoom,
        y: mouseY - relativeY * newZoom
      };
      newPos = constrainPosition(newPos, newZoom);
      setZoom(newZoom);
      setPosition(newPos);
    }
  }

  // ================
  // Tile Selections
  // ================
  function getLocationData(x: number, y: number): LocationData | null {
    const key = `${x}-${y}`;
    return mapData[key] || null;
  }

  function handleCellClick(x: number, y: number, e: MouseEvent<HTMLDivElement>) {
    if (bulkEditMode) {
      // SHIFT for rectangle
      if (e.shiftKey) {
        if (!isRectSelecting) {
          setIsRectSelecting(true);
          setRectStartCoord({ x, y });
        } else {
          if (rectStartCoord) {
            const minX = Math.min(rectStartCoord.x, x);
            const maxX = Math.max(rectStartCoord.x, x);
            const minY = Math.min(rectStartCoord.y, y);
            const maxY = Math.max(rectStartCoord.y, y);
            const newSelected: Coordinates[] = [];
            for (let cx = minX; cx <= maxX; cx++) {
              for (let cy = minY; cy <= maxY; cy++) {
                newSelected.push({ x: cx, y: cy });
              }
            }
            setMultiSelectedCells((prev) => {
              const combined = [...prev];
              newSelected.forEach((coord) => {
                if (!combined.find((sel) => sel.x === coord.x && sel.y === coord.y)) {
                  combined.push(coord);
                }
              });
              return combined;
            });
          }
        }
      } else {
        // Toggle single
        setMultiSelectedCells((prev) => {
          const found = prev.find((c) => c.x === x && c.y === y);
          if (found) {
            return prev.filter((c) => !(c.x === x && c.y === y));
          } else {
            return [...prev, { x, y }];
          }
        });
      }
      return;
    }

    // Normal single
    if (!isDragging) {
      setSelectedCell({ x, y });
      setIsEditing(false);
      setEditingData(null);
    }
  }

  function handleToggleBulkEdit() {
    setBulkEditMode(!bulkEditMode);
    setMultiSelectedCells([]);
    setSelectedCell(null);
    setIsEditing(false);
    setEditingData(null);
    setRectStartCoord(null);
    setIsRectSelecting(false);
  }

  // ====================
  // Single Tile CRUD
  // ====================
  async function handleCreate() {
    if (!editingData || !selectedCell) return;
    if (!editingData.biome || !editingData.description) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('map_tiles')
        .insert([
          {
            id: editingData.id,
            x: selectedCell.x,
            y: selectedCell.y,
            biome: editingData.biome,
            description: editingData.description,
            image_url: editingData.imageUrl,
            resources: editingData.resources || [],
            actions: editingData.actions || []
          }
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setMapData((prev) => ({
          ...prev,
          [`${selectedCell.x}-${selectedCell.y}`]: {
            ...data,
            imageUrl: data.image_url,
            resources: data.resources || [],
            actions: data.actions || []
          }
        }));
        setIsEditing(false);
        setEditingData(null);
      }
    } catch (err) {
      console.error('Error creating tile:', err);
      alert('Error creating tile. Please try again.');
    }
  }

  async function handleUpdate() {
    if (!editingData || !selectedCell) return;
    try {
      const { error } = await supabase
        .from('map_tiles')
        .update({
          biome: editingData.biome,
          description: editingData.description,
          image_url: editingData.imageUrl,
          resources: editingData.resources || [],
          actions: editingData.actions || []
        })
        .eq('id', editingData.id);
      if (error) throw error;

      setMapData((prev) => ({
        ...prev,
        [`${selectedCell.x}-${selectedCell.y}`]: editingData
      }));
      setIsEditing(false);
      setEditingData(null);
    } catch (err) {
      console.error('Error updating tile:', err);
    }
  }

  // ====================
  // Bulk Edits
  // ====================
  async function handleBulkSave() {
    if (multiSelectedCells.length === 0) {
      alert('No tiles selected to bulk update.');
      return;
    }
    if (!bulkEditingData.biome && !bulkEditingData.description) {
      alert('No fields to bulk update. Please specify at least one field.');
      return;
    }
    try {
      for (const cell of multiSelectedCells) {
        const key = `${cell.x}-${cell.y}`;
        const existing = mapData[key];
        if (!existing) {
          // create
          const newId = crypto.randomUUID();
          const insertionData: Partial<LocationData> = {
            id: newId,
            x: cell.x,
            y: cell.y,
            biome: bulkEditingData.biome || 'Unknown',
            description: bulkEditingData.description || 'No description',
            imageUrl: undefined,
            resources: [],
            actions: []
          };
          const { data, error } = await supabase
            .from('map_tiles')
            .insert([{ ...insertionData, image_url: insertionData.imageUrl }])
            .select()
            .single();
          if (error) throw error;
          setMapData((prev) => ({
            ...prev,
            [key]: {
              ...data,
              imageUrl: data.image_url,
              resources: data.resources || [],
              actions: data.actions || []
            }
          }));
        } else {
          // update
          const updatedData: Partial<LocationData> = {
            biome: bulkEditingData.biome ?? existing.biome,
            description: bulkEditingData.description ?? existing.description
          };
          const { error } = await supabase
            .from('map_tiles')
            .update({
              biome: updatedData.biome,
              description: updatedData.description
            })
            .eq('id', existing.id);
          if (error) throw error;
          setMapData((prev) => ({
            ...prev,
            [key]: {
              ...existing,
              ...updatedData
            }
          }));
        }
      }
      setBulkEditingData({});
      setMultiSelectedCells([]);
      alert('Bulk update succeeded!');
    } catch (err) {
      console.error('Error in bulk update:', err);
      alert('Error in bulk update. Please try again.');
    }
  }

  // ==================
  // Resource / Action
  // ==================
  function handleAddResource() {
    if (!editingData || !newResource.trim()) {
      alert('Please enter a resource name');
      return;
    }
    const resource: Resource = {
      id: crypto.randomUUID(),
      name: newResource.trim()
    };
    setEditingData((prev) => (prev ? { ...prev, resources: [...prev.resources, resource] } : null));
    setNewResource('');
  }

  function handleRemoveResource(resourceId: string) {
    setEditingData((prev) =>
      prev ? { ...prev, resources: prev.resources.filter((r) => r.id !== resourceId) } : null
    );
  }

  function handleAddAction() {
    if (!editingData || !newActionTitle.trim()) {
      alert('Please enter an action name');
      return;
    }
    const action: Action = {
      id: crypto.randomUUID(),
      title: newActionTitle.trim()
    };
    setEditingData((prev) => (prev ? { ...prev, actions: [...prev.actions, action] } : null));
    setNewActionTitle('');
  }

  function handleRemoveAction(actionId: string) {
    setEditingData((prev) =>
      prev ? { ...prev, actions: prev.actions.filter((a) => a.id !== actionId) } : null
    );
  }

  // =================
  // Image
  // =================
  async function handleImageUpload(file: File) {
    if (!editingData) return;
    setUploadingImage(true);
    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size too large (max 5MB).');
      }
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'gif'].includes(fileExt || '')) {
        throw new Error('Invalid file type. Please upload JPG/PNG/GIF.');
      }
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `tile-images/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('runiverse-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });
      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from('runiverse-images')
        .getPublicUrl(filePath);

      setEditingData((prev) => (prev ? { ...prev, imageUrl: publicData.publicUrl } : null));
    } catch (error: any) {
      console.error('Error uploading:', error);
      alert(error?.message || 'Failed to upload image. Try again.');
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleImageDelete() {
    if (!editingData?.imageUrl) return;
    try {
      const filePath = editingData.imageUrl.split('/').pop();
      if (!filePath) return;
      const { error } = await supabase.storage
        .from('runiverse-images')
        .remove([`tile-images/${filePath}`]);
      if (error) throw error;

      setEditingData((prev) => (prev ? { ...prev, imageUrl: undefined } : null));
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image. Please try again.');
    }
  }

  // =============
  // Render
  // =============
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* MAP CONTAINER */}
      <div
        ref={mapContainerRef}
        className="absolute top-0 left-0 w-full h-full overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        {/* SCALING LAYER */}
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s',
            width,
            height,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            handleMouseDown({
              button: 0,
              clientX: touch.clientX,
              clientY: touch.clientY
            } as unknown as React.MouseEvent);
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            handleMouseMove({
              button: 0,
              clientX: touch.clientX,
              clientY: touch.clientY
            } as unknown as React.MouseEvent);
          }}
          onTouchEnd={handleMouseUp}
          className="relative"
        >
          {/* MAP IMAGE (zIndex 0) */}
          <img
            src="/img/runiversemap.png"
            alt="Runiverse Map"
            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none select-none z-0"
            draggable={false}
          />
          {/* GRID (zIndex > 0) */}
          <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
            {Array.from({ length: ROWS }).map((_, rowIdx) => (
              <div key={rowIdx} className="flex">
                {Array.from({ length: COLS }).map((__, colIdx) => {
                  // single highlight
                  const singleSelected =
                    !bulkEditMode &&
                    selectedCell &&
                    selectedCell.x === colIdx &&
                    selectedCell.y === rowIdx;
                  // multi highlight
                  const multiSelected =
                    bulkEditMode &&
                    !!multiSelectedCells.find((c) => c.x === colIdx && c.y === rowIdx);

                  let highlightClass = 'hover:bg-white hover:bg-opacity-20';
                  if (singleSelected) {
                    highlightClass = 'bg-green-300 bg-opacity-80';
                  } else if (multiSelected) {
                    highlightClass = 'bg-blue-300 bg-opacity-80';
                  }

                  return (
                    <div
                      key={colIdx}
                      className={`border border-black border-opacity-20 ${highlightClass} transition-colors cursor-pointer`}
                      style={{
                        width: gridSize,
                        height: gridSize,
                        pointerEvents: 'auto' // allow clicks
                      }}
                      onClick={(e) => handleCellClick(colIdx, rowIdx, e)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EDIT PANEL (fix it top or top-right) */}
      <div className="absolute top-0 right-0 w-[350px] md:w-[400px] bg-gray-900 text-white p-4 h-full overflow-auto z-50">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleToggleBulkEdit}
            className={`px-4 py-2 rounded ${
              bulkEditMode ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {bulkEditMode ? 'Disable Bulk Edit' : 'Enable Bulk Edit'}
          </button>
        </div>

        {/* Bulk Edit Pane */}
        {bulkEditMode && (
          <div className="mb-6 p-3 border border-gray-700 rounded space-y-4">
            <h2 className="text-lg font-bold">Bulk Edit</h2>
            <p className="text-gray-300 text-sm">
              Selected Tiles: {multiSelectedCells.map((c) => `(${c.x},${c.y})`).join(', ')}
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Biome (optional)</label>
              <select
                value={bulkEditingData.biome || ''}
                onChange={(e) =>
                  setBulkEditingData((prev) => ({
                    ...prev,
                    biome: e.target.value || undefined
                  }))
                }
                className="w-full p-2 rounded text-black"
              >
                <option value="">(no change)</option>
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
              <label className="block text-sm font-medium mb-1">Description (optional)</label>
              <textarea
                value={bulkEditingData.description || ''}
                onChange={(e) =>
                  setBulkEditingData((prev) => ({
                    ...prev,
                    description: e.target.value || undefined
                  }))
                }
                className="w-full p-2 rounded text-black h-24"
                placeholder="If provided, overwrites descriptions"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBulkSave}
                className="flex-1 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
              >
                Save Bulk Edits
              </button>
              <button
                onClick={() => {
                  setBulkEditingData({});
                  setMultiSelectedCells([]);
                }}
                className="flex-1 px-4 py-2 bg-gray-500 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Single Tile Panel (when not in bulk mode) */}
        {!bulkEditMode && (
          <div>
            {selectedCell ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">
                    Tile ({selectedCell.x}, {selectedCell.y})
                  </h2>
                  {!isEditing ? (
                    <button
                      className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => {
                        setIsEditing(true);
                        const loc = getLocationData(selectedCell.x, selectedCell.y);
                        setEditingData(
                          loc || {
                            id: crypto.randomUUID(),
                            x: selectedCell.x,
                            y: selectedCell.y,
                            biome: '',
                            description: '',
                            resources: [],
                            actions: []
                          }
                        );
                      }}
                    >
                      {getLocationData(selectedCell.x, selectedCell.y) ? 'Edit' : 'Create'}
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={
                          getLocationData(selectedCell.x, selectedCell.y)
                            ? handleUpdate
                            : handleCreate
                        }
                        className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditingData(null);
                        }}
                        className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Show all tile info at once: image, biome, desc, resources, actions */}
                {!isEditing && (
                  <div className="space-y-2">
                    {getLocationData(selectedCell.x, selectedCell.y) ? (
                      <>
                        {getLocationData(selectedCell.x, selectedCell.y)?.imageUrl && (
                          <img
                            src={getLocationData(selectedCell.x, selectedCell.y)!.imageUrl}
                            alt="Tile"
                            className="w-full h-32 object-cover rounded border border-gray-600"
                          />
                        )}
                        <p>
                          <span className="font-semibold">Biome:</span>{' '}
                          {getLocationData(selectedCell.x, selectedCell.y)!.biome}
                        </p>
                        <p>{getLocationData(selectedCell.x, selectedCell.y)!.description}</p>
                        <div>
                          <p className="font-semibold">Resources:</p>
                          {getLocationData(selectedCell.x, selectedCell.y)?.resources?.length
                            ? getLocationData(selectedCell.x, selectedCell.y)!.resources.map(
                                (r) => (
                                  <div key={r.id} className="ml-2 text-sm">
                                    - {r.name}
                                  </div>
                                )
                              )
                            : 'None'}
                        </div>
                        <div>
                          <p className="font-semibold">Actions:</p>
                          {getLocationData(selectedCell.x, selectedCell.y)?.actions?.length
                            ? getLocationData(selectedCell.x, selectedCell.y)!.actions.map(
                                (a) => (
                                  <div key={a.id} className="ml-2 text-sm">
                                    - {a.title}
                                  </div>
                                )
                              )
                            : 'None'}
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400">
                        Unexplored territory. Press Edit or Create to add tile data.
                      </p>
                    )}
                  </div>
                )}

                {isEditing && editingData && (
                  <div className="space-y-3">
                    {/* Image Upload */}
                    <div className="relative border-2 border-dashed border-gray-500 rounded h-32 flex items-center justify-center overflow-hidden">
                      {editingData.imageUrl ? (
                        <div className="w-full h-full relative">
                          <img
                            src={editingData.imageUrl}
                            alt="Tile"
                            className="w-full h-full object-cover rounded"
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
                          className="text-sm bg-gray-400 px-2 py-1 rounded hover:bg-gray-300"
                          disabled={uploadingImage}
                        >
                          {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        </button>
                      )}
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
                    </div>

                    {/* Biome */}
                    <div>
                      <label className="block text-sm font-medium">Biome</label>
                      <select
                        value={editingData.biome}
                        onChange={(e) =>
                          setEditingData((prev) => (prev ? { ...prev, biome: e.target.value } : null))
                        }
                        className="w-full p-2 rounded text-black"
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

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium">Description</label>
                      <textarea
                        value={editingData.description}
                        onChange={(e) =>
                          setEditingData((prev) =>
                            prev ? { ...prev, description: e.target.value } : null
                          )
                        }
                        className="w-full p-2 rounded text-black h-20"
                      />
                    </div>

                    {/* Resources */}
                    <div className="border border-gray-700 p-2 rounded">
                      <p className="font-semibold mb-1">Resources</p>
                      {editingData.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between bg-gray-800 rounded px-2 py-1 mb-1"
                        >
                          <span>{resource.name}</span>
                          <button
                            onClick={() => handleRemoveResource(resource.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <div className="flex mt-1 gap-2">
                        <input
                          type="text"
                          placeholder="New Resource"
                          value={newResource}
                          onChange={(e) => setNewResource(e.target.value)}
                          className="flex-1 p-2 rounded text-black"
                        />
                        <button
                          onClick={handleAddResource}
                          className="px-2 py-1 bg-blue-500 rounded hover:bg-blue-600 text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border border-gray-700 p-2 rounded">
                      <p className="font-semibold mb-1">Actions</p>
                      {editingData.actions.map((action) => (
                        <div
                          key={action.id}
                          className="flex items-center justify-between bg-gray-800 rounded px-2 py-1 mb-1"
                        >
                          <span>{action.title}</span>
                          <button
                            onClick={() => handleRemoveAction(action.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <div className="flex mt-1 gap-2">
                        <input
                          type="text"
                          placeholder="New Action"
                          value={newActionTitle}
                          onChange={(e) => setNewActionTitle(e.target.value)}
                          className="flex-1 p-2 rounded text-black"
                        />
                        <button
                          onClick={handleAddAction}
                          className="px-2 py-1 bg-blue-500 rounded hover:bg-blue-600 text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400">
                {!bulkEditMode && <p>No tile selected.</p>}
              </div>
            )}
          </div>
        )}

        {/* Info at bottom about zoom/pan */}
        <div className="mt-6 text-xs text-gray-500">
          {isMobile
            ? 'Drag to pan. Pinch to zoom.'
            : 'Click and drag to pan. Use mouse wheel to zoom. Arrow keys to move tile selection. Press E to edit.'}
        </div>
      </div>
    </div>
  );
}