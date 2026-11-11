import React, { useState } from 'react';
import { TimelineEvent } from '../types/database';
import { Heart, Calendar, Film, X } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const publishedEvents = events
    .filter((e) => e.is_published)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="timeline" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden bg-[#FFFDF9]">
      {/* Background soft ambient blur */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#FCEEF2]/70 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#F8DCE5]/50 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header with IntersectionObserver Fade-in */}
        <ScrollReveal direction="up" distance={32} duration={850}>
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#B75F7D] mb-2 block">
              Chapter by Chapter · Our Family Foundation
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#70515A] font-normal mb-3">
              Our Love Story Timeline
            </h2>
            <p className="font-cursive text-3xl sm:text-4xl text-[#D88CA5]">
              Every milestone written in the stars
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D88CA5] to-transparent mx-auto mt-4" />
          </div>
        </ScrollReveal>

        {/* Vertical Timeline Container with Line in the Middle */}
        <div className="relative">
          {/* Central Rose Gold Timeline Spine - Strictly in the Middle */}
          <div className="absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 sm:w-1 bg-gradient-to-b from-[#F8DCE5] via-[#D88CA5] to-[#B75F7D] rounded-full shadow-xs" />

          {/* Alternating Milestone Rows */}
          <div className="space-y-16 sm:space-y-24">
            {publishedEvents.map((event, idx) => {
              const isLeftPicture = idx % 2 === 0; // Even index: Picture on Left, Odd index: Picture on Right

              // Picture & Details Card Component
              const PictureCard = (
                <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-4 sm:p-6 shadow-lg shadow-[#D88CA5]/15 hover:shadow-2xl hover:shadow-[#D88CA5]/25 transition-all duration-300 group hover:-translate-y-1">
                  {/* Photograph (Prominent Centerpiece of the Card) */}
                  {event.photo_url && (
                    <div className="relative aspect-4/3 sm:aspect-16/10 w-full mb-4 rounded-2xl overflow-hidden bg-[#FCEEF2] border border-[#F8DCE5]/60 shadow-inner">
                      <img
                        src={event.photo_url}
                        alt={event.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#70515A]/25 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-[#B75F7D] flex items-center gap-1 shadow-xs">
                        <Calendar className="w-3 h-3" />
                        <span>{event.milestone_date}</span>
                      </div>
                    </div>
                  )}

                  {/* Title & Description */}
                  <h3 className="font-serif text-lg sm:text-2xl text-[#70515A] font-bold mb-2 group-hover:text-[#B75F7D] transition-colors leading-tight">
                    {event.title}
                  </h3>

                  <p className="text-[#70515A]/85 text-xs sm:text-sm leading-relaxed font-light">
                    {event.description}
                  </p>

                  {/* Optional Video Button */}
                  {event.video_url && (
                    <div className="mt-4 pt-3 border-t border-[#FCEEF2]">
                      <button
                        onClick={() => setSelectedVideo(event.video_url || null)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#B75F7D] bg-[#FCEEF2] hover:bg-[#F8DCE5] transition-colors"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Watch Milestone Video</span>
                      </button>
                    </div>
                  )}
                </div>
              );

              // Opposite Side Decorative Flourish & Date Stamp
              const CompanionDetails = (
                <div className={`flex flex-col ${isLeftPicture ? 'items-start text-left pl-3 sm:pl-6' : 'items-end text-right pr-3 sm:pr-6'}`}>
                  <span className="font-cursive text-2xl sm:text-4xl text-[#D88CA5]">
                    Chapter 0{idx + 1}
                  </span>
                  <span className="font-serif text-xs sm:text-lg font-semibold text-[#70515A] mt-0.5 sm:mt-1">
                    {event.milestone_date}
                  </span>
                  <div className={`w-8 sm:w-14 h-0.5 bg-gradient-to-r from-[#D88CA5] to-transparent my-1 sm:my-2 ${isLeftPicture ? '' : 'rotate-180'}`} />
                  <span className="text-[11px] sm:text-xs text-[#C99A9A] line-clamp-2 max-w-[200px] italic">
                    "{event.title}"
                  </span>
                </div>
              );

              return (
                <ScrollReveal
                  key={event.id}
                  direction={isLeftPicture ? 'left' : 'right'}
                  distance={36}
                  duration={800}
                >
                  <div className="relative grid grid-cols-2 gap-4 sm:gap-10 md:gap-14 items-center">
                    {/* Center Timeline Node with Heart Icon */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-9 sm:w-11 h-9 sm:h-11 rounded-full bg-[#FFFDF9] border-2 border-[#D88CA5] shadow-md shadow-[#D88CA5]/30 flex items-center justify-center text-[#B75F7D] transition-transform hover:scale-125">
                      <Heart className="w-4 h-4 fill-[#F8DCE5]" />
                    </div>

                    {/* Left Column */}
                    <div className="w-full">
                      {isLeftPicture ? PictureCard : CompanionDetails}
                    </div>

                    {/* Right Column */}
                    <div className="w-full">
                      {isLeftPicture ? CompanionDetails : PictureCard}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Modal if clicked */}
      {selectedVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 z-10 p-2 text-white/80 hover:text-white bg-black/50 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={selectedVideo}
                title="Milestone Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
