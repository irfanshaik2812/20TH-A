import React, { useState } from 'react';
import { GalleryPhoto, PhotoAlbum } from '../types/database';
import { PhotoLightbox } from './PhotoLightbox';
import { Camera, Calendar, Heart, Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface GalleryProps {
  photos: GalleryPhoto[];
}

export const Gallery: React.FC<GalleryProps> = ({ photos }) => {
  const [selectedAlbum, setSelectedAlbum] = useState<PhotoAlbum>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const publishedPhotos = photos
    .filter((p) => p.is_published)
    .sort((a, b) => a.display_order - b.display_order);

  const filteredPhotos =
    selectedAlbum === 'all'
      ? publishedPhotos
      : publishedPhotos.filter((p) => p.album === selectedAlbum);

  const openLightboxAt = (photoId: string) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photoId);
    if (idx !== -1) {
      setCurrentPhotoIndex(idx);
      setLightboxOpen(true);
    }
  };

  const albums: { id: PhotoAlbum; label: string }[] = [
    { id: 'all', label: 'All Scrapbook' },
    { id: 'wedding', label: 'Wedding Memories' },
    { id: 'family', label: 'Family Moments' },
    { id: 'travel', label: 'Travel Adventures' },
    { id: 'special', label: 'Special Occasions' }
  ];

  // Rotation variations for the authentic scrapbook Polaroid look
  const rotations = ['rotate-1', '-rotate-2', 'rotate-2', '-rotate-1', 'rotate-3', '-rotate-3'];

  return (
    <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FCEEF2]/40 relative overflow-hidden">
      {/* Decorative floral watermark / background accents */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header with IntersectionObserver Fade-in */}
        <ScrollReveal direction="up" distance={32} duration={850}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#B75F7D] mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Cherished Scrapbook</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#70515A] font-normal mb-3">
              Moments Frozen In Time
            </h2>
            <p className="font-cursive text-3xl sm:text-4xl text-[#D88CA5]">
              Snapshots of a lifetime of togetherness
            </p>
          </div>
        </ScrollReveal>

        {/* Album Filter Tabs - segmented control style per design principles */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {albums.map((alb) => (
            <button
              key={alb.id}
              onClick={() => setSelectedAlbum(alb.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${
                selectedAlbum === alb.id
                  ? 'bg-[#B75F7D] text-white shadow-sm shadow-[#B75F7D]/30 scale-105'
                  : 'bg-[#FFFDF9] text-[#70515A] border border-[#F8DCE5] hover:border-[#D88CA5] hover:text-[#B75F7D]'
              }`}
            >
              {alb.label}
            </button>
          ))}
        </div>

        {/* Scrapbook Polaroid Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12 text-[#C99A9A] font-serif text-lg">
            No memories yet in this album. Add them from the admin portal!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredPhotos.map((photo, idx) => {
              const rotClass = rotations[idx % rotations.length];

              return (
                <ScrollReveal
                  key={photo.id}
                  staggerIndex={idx % 6}
                  direction="up"
                  distance={32}
                  duration={750}
                >
                  <div
                    onClick={() => openLightboxAt(photo.id)}
                    className={`group relative bg-[#FFFDF9] p-4 sm:p-5 pb-7 rounded-sm shadow-lg shadow-[#D88CA5]/15 hover:shadow-2xl hover:shadow-[#D88CA5]/30 transition-all duration-300 hover:scale-[1.03] hover:z-20 cursor-pointer border border-[#F8DCE5]/60 ${rotClass} hover:rotate-0`}
                  >
                    {/* Decorative Washi Tape / Paper Clip on top */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#F8DCE5]/80 backdrop-blur-xs border border-white/60 -rotate-2 rounded-xs shadow-xs pointer-events-none group-hover:rotate-0 transition-transform" />

                    {/* Photo Frame */}
                    <div className="relative aspect-4/3 w-full bg-[#FCEEF2] overflow-hidden rounded-xs border border-[#F8DCE5]/40 mb-4">
                      <img
                        src={photo.photo_url}
                        alt={photo.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80';
                        }}
                      />

                      {/* View overlay */}
                      <div className="absolute inset-0 bg-[#70515A]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Enlarge Memory</span>
                        </div>
                      </div>
                    </div>

                    {/* Polaroid Handwritten Caption Area */}
                    <div className="text-center px-2">
                      <h3 className="font-serif text-lg font-semibold text-[#70515A] group-hover:text-[#B75F7D] transition-colors truncate">
                        {photo.title}
                      </h3>

                      {photo.caption && (
                        <p className="font-handwriting text-xl text-[#B75F7D] mt-1 leading-snug">
                          "{photo.caption}"
                        </p>
                      )}

                      {photo.date_taken && (
                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#C99A9A] mt-2">
                          <Calendar className="w-3 h-3" />
                          <span>{photo.date_taken}</span>
                        </div>
                      )}
                    </div>

                    {/* Little bottom-corner heart seal */}
                    <div className="absolute bottom-2 right-2 opacity-40 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-3.5 h-3.5 text-[#D88CA5] fill-current" />
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <PhotoLightbox
        photos={filteredPhotos}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setCurrentPhotoIndex(newIdx)}
      />
    </section>
  );
};
