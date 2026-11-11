import React, { useEffect, useState } from 'react';
import { GalleryPhoto } from '../types/database';
import { X, ChevronLeft, ChevronRight, Play, Pause, Calendar, Heart } from 'lucide-react';

interface PhotoLightboxProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate
}) => {
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(false);

  // Keyboard navigation & Esc key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % photos.length);
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + photos.length) % photos.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length, onClose, onNavigate]);

  // Slideshow timer
  useEffect(() => {
    if (!isPlayingSlideshow || !isOpen) return;
    const timer = setInterval(() => {
      onNavigate((currentIndex + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPlayingSlideshow, isOpen, currentIndex, photos.length, onNavigate]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#70515A]/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Header Controls */}
      <div
        className="w-full max-w-5xl flex items-center justify-between text-[#FFFDF9] z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-[#D88CA5] fill-current" />
          <span className="text-sm font-medium tracking-wide">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Slideshow button */}
          <button
            onClick={() => setIsPlayingSlideshow(!isPlayingSlideshow)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors"
          >
            {isPlayingSlideshow ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Slideshow</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Play Slideshow</span>
              </>
            )}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close Lightbox"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative w-full max-w-4xl flex-1 flex items-center justify-center py-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        <button
          onClick={() => onNavigate((currentIndex - 1 + photos.length) % photos.length)}
          aria-label="Previous Photo"
          className="absolute left-2 sm:-left-12 z-20 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all hover:scale-110 focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Polaroid frame display */}
        <div className="max-h-[75vh] bg-[#FFFDF9] p-3 sm:p-4 pb-6 rounded-2xl shadow-2xl flex flex-col items-center max-w-full">
          <img
            src={currentPhoto.photo_url}
            alt={currentPhoto.title}
            referrerPolicy="no-referrer"
            className="max-h-[58vh] w-auto object-contain rounded-lg"
          />
          <div className="mt-3 text-center px-4">
            <h4 className="font-serif text-lg sm:text-2xl text-[#70515A] font-semibold">
              {currentPhoto.title}
            </h4>
            {currentPhoto.caption && (
              <p className="font-handwriting text-lg sm:text-xl text-[#B75F7D] mt-0.5">
                "{currentPhoto.caption}"
              </p>
            )}
            {currentPhoto.date_taken && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#C99A9A] mt-1 font-sans">
                <Calendar className="w-3 h-3" />
                <span>{currentPhoto.date_taken}</span>
              </div>
            )}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={() => onNavigate((currentIndex + 1) % photos.length)}
          aria-label="Next Photo"
          className="absolute right-2 sm:-right-12 z-20 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all hover:scale-110 focus:outline-none"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div
        className="w-full max-w-4xl overflow-x-auto py-2 flex items-center justify-center gap-2 z-20 no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {photos.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => onNavigate(idx)}
            className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
              idx === currentIndex
                ? 'border-[#D88CA5] scale-110 shadow-md'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={item.photo_url}
              alt={item.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
