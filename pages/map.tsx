import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface Coordinates {
  x: number;
  y: number;
}

interface LocationData {
  name: string;
  description: string;
  imageUrl?: string;
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  const COLS = Math.floor(width / gridSize);
  const ROWS = Math.floor(height / gridSize);
  const MAX_ZOOM = 2;
  const ZOOM_STEP = 0.1;

  const locationData: LocationMap = {
    "3-2": {
      name: "The Court of Chaos Magic",
      description: "A mysterious court where chaos magic reigns supreme.",
    },
    "2-1": {
      name: "Purple Wizard Pavilion",
      description: "Home to the enigmatic Purple Wizard and their magical experiments.",
    },
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
      // Reset body overflow when component unmounts
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
    }
  };

  const closePopup = (): void => {
    setSelectedCell(null);
  };

  const getLocationData = (x: number, y: number): LocationData | null => {
    const key = `${x}-${y}`;
    return locationData[key] || null;
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + ZOOM_STEP, MAX_ZOOM);
    setZoom(newZoom);
    setPosition(prev => constrainPosition(prev, newZoom));
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(minZoom, zoom - ZOOM_STEP);
    setZoom(newZoom);
    setPosition(prev => constrainPosition(prev, newZoom));
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
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        {/* <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          aria-label="Zoom in"
        >
          <ZoomIn size={24} />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          aria-label="Zoom out"
        >
          <ZoomOut size={24} />
        </button> */}
      </div>

      <div 
        ref={mapContainerRef}
        className="relative overflow-hidden border border-gray-300 w-full h-screen"
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
                  className="absolute text-xs text-white bg-black bg-opacity-50 px-1"
                  style={{ left: x * gridSize }}
                >
                  {x}
                </div>
              ))}
              {Array.from({ length: ROWS }).map((_, y) => (
                <div
                  key={y}
                  className="absolute text-xs text-white bg-black bg-opacity-50 px-1"
                  style={{ top: y * gridSize }}
                >
                  {y}
                </div>
              ))}
            </div>

            {selectedCell && (
              <div 
                className="absolute bg-white rounded-lg shadow-xl p-4 w-64"
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
                
                <div className="mb-3">
                  <img 
                    src="/api/placeholder/200/150"
                    alt="Location Preview"
                    className="w-full rounded-lg"
                  />
                </div>
                
                <h3 className="font-bold mb-2">
                  {getLocationData(selectedCell.x, selectedCell.y)?.name || 
                    `Location (${selectedCell.x}, ${selectedCell.y})`}
                </h3>
                <p className="text-sm text-gray-600">
                  {getLocationData(selectedCell.x, selectedCell.y)?.description || 
                    `This mysterious location at coordinates (${selectedCell.x}, ${selectedCell.y}) holds many secrets waiting to be discovered...`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Click and drag to pan. Use mouse wheel to zoom.
      </div>
    </div>
  );
};

export default RuniverseMap;