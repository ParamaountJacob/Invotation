import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize2 } from 'lucide-react';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  onFullscreen: () => void;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ src, poster, onFullscreen }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle video play/pause
  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
        // Show controls again if autoplay fails
        setShowControls(true);
      });
    }
  };

  // Combined mouse enter handler - auto-play video and show controls
  const handleVideoMouseEnter = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }

    // Auto-play video on hover
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Error auto-playing video on hover:', error);
      });
    }
  };

  // Combined mouse leave handler - pause video if not playing and hide controls
  const handleVideoMouseLeave = () => {
    // Pause video if it wasn't intentionally played
    if (videoRef.current && !isPlaying) {
      videoRef.current.pause();
    }

    // Hide controls after delay if video is playing
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  };

  // Update state when video plays or pauses
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleLoadedData = () => setIsLoaded(true);

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('loadeddata', handleLoadedData);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative rounded-lg overflow-hidden bg-black"
      onMouseEnter={handleVideoMouseEnter}
      onMouseLeave={handleVideoMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full max-h-[300px] object-contain"
        playsInline
        preload="metadata"
      />

      {/* Play/Pause Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          } ${isPlaying ? 'bg-black/10' : 'bg-black/30'}`}
        onClick={togglePlayPause}
      >
        {(!isPlaying || !isLoaded) && (
          <button
            className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            aria-label="Play video"
          >
            <Play className="w-8 h-8" />
          </button>
        )}
      </div>

      {/* Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'
          } bg-gradient-to-t from-black/70 to-transparent`}
      >
        <button
          onClick={togglePlayPause}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onFullscreen();
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-colors"
          aria-label="Fullscreen"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;