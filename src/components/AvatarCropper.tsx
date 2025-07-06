import { useState, useRef, useCallback } from 'react';
import { X, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { imageLogger } from '../utils/logger';

interface AvatarCropperProps {
  imageFile: File;
  onSave: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

const AvatarCropper: React.FC<AvatarCropperProps> = ({ imageFile, onSave, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  React.useEffect(() => {
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    if (imageRef.current) {
      const img = imageRef.current;
      const containerSize = 320; // Match the w-80 h-80 (320px) container size

      // Calculate scale to ensure the image covers the circular crop area
      // We want the smaller dimension to fill the circle
      const scaleX = containerSize / img.naturalWidth;
      const scaleY = containerSize / img.naturalHeight;
      const initialScale = Math.min(scaleX, scaleY) * 1.2; // Use min to fit the image, with slight zoom

      setScale(initialScale);

      setPosition({ x: 0, y: 0 });

      // Log values to help with debugging
      imageLogger.debug('Image loaded:', {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        containerSize,
        scaleX,
        scaleY,
        initialScale
      });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev * 0.9, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleSave = async () => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    const img = imageRef.current;
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Create circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    // Draw the image
    ctx.drawImage(
      img,
      (size - scaledWidth) / 2 + position.x,
      (size - scaledHeight) / 2 + position.y,
      scaledWidth,
      scaledHeight
    );

    ctx.restore();

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        onSave(blob);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Crop Your Photo</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Preview Area */}
        <div className="mb-6">
          <div
            className="relative w-80 h-80 mx-auto bg-gray-100 rounded-full overflow-hidden border-4 border-gray-200 cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {imageUrl && (
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Crop preview"
                className="absolute select-none pointer-events-none"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: 'center center',
                  left: '50%',
                  top: '50%',
                  marginLeft: '-50%',
                  marginTop: '-50%'
                }}
                onLoad={handleImageLoad}
                draggable={false}
              />
            )}

            {/* Overlay instructions */}
            {imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 hover:opacity-100 transition-opacity">
                  <Move className="w-4 h-4 inline mr-1" />
                  Drag to reposition
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={handleZoomOut}
              className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex-1 mx-4">
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <button
              onClick={handleZoomIn}
              className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Reset</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!imageLoaded}
            className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default AvatarCropper;