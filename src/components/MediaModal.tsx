import React, { useState, useEffect } from 'react';
import { X, Maximize2, Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'image' | 'video';
  src: string;
  title?: string;
}

const MediaModal: React.FC<MediaModalProps> = ({ isOpen, onClose, type, src, title }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement | HTMLVideoElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          onClose();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!contentRef.current) return;

    if (!document.fullscreenElement) {
      contentRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Update playing state based on video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div 
        ref={modalRef}
        className="relative bg-black rounded-xl overflow-hidden max-w-5xl w-full mx-auto shadow-2xl"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 flex justify-between items-center z-10">
          {title && (
            <h3 className="text-white font-medium truncate">{title}</h3>
          )}
          <div className="flex items-center space-x-2 ml-auto">
            {type === 'video' && !src.includes('youtube.com') && !src.includes('youtu.be') && !src.includes('vimeo.com') && (
              <>
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              </>
            )}
            <button
              onClick={toggleFullscreen}
              className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Toggle fullscreen"
            >
              <Maximize2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex items-center justify-center">
          {type === 'image' ? (
            <div 
              ref={contentRef as React.RefObject<HTMLDivElement>}
              className="w-full h-full flex items-center justify-center"
            >
              <img 
                src={src} 
                alt={title || "Image"} 
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          ) : (
            <>
              {src.includes('youtube.com') || src.includes('youtu.be') ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={src.replace('watch?v=', 'embed/')}
                    title={title || "Video"}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : src.includes('vimeo.com') ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={src.replace('vimeo.com', 'player.vimeo.com/video')}
                    title={title || "Video"}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <video
                  ref={contentRef as React.RefObject<HTMLVideoElement>}
                  ref={videoRef}
                  src={src}
                  controls={false}
                  muted={isMuted}
                  className="max-w-full max-h-[80vh]"
                  playsInline
                  onClick={togglePlayPause}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaModal;