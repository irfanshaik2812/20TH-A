import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Heart, Sparkles, Film, Image as ImageIcon } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface SurpriseProps {
  heading?: string;
  buttonText?: string;
  videoUrl?: string;
  message?: string;
  photos?: string[];
}

export const SurpriseReveal: React.FC<SurpriseProps> = ({
  heading = 'One Last Surprise Awaits You...',
  buttonText = 'OPEN YOUR SURPRISE ❤️',
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  message = `Dear Mom and Dad,\n\nEverything we are today is because of everything you have done for us.\nYour sacrifices, guidance, patience and unconditional love have made our lives beautiful.\nYou are our greatest blessing and our forever heroes.\nThank you for being our parents.\nWe love you endlessly.\n\nHAPPY WEDDING ANNIVERSARY! ❤️`,
  photos = []
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenSurprise = () => {
    setIsOpened(true);

    // Cinematic double confetti burst
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#F8DCE5', '#D88CA5', '#B75F7D', '#FFD700', '#FFFFFF']
    });

    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.7 },
        colors: ['#D88CA5', '#FFD700', '#B75F7D']
      });
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.7 },
        colors: ['#D88CA5', '#FFD700', '#B75F7D']
      });
    }, 300);
  };

  return (
    <section id="surprise" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FCEEF2]/50 relative overflow-hidden text-center">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header with IntersectionObserver Fade-in */}
        <ScrollReveal direction="up" distance={32} duration={850}>
          <div className="max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#B75F7D] mb-2">
              <Gift className="w-3.5 h-3.5" />
              <span>Grand Finale Tribute</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#70515A] font-normal mb-3">
              {heading}
            </h2>
            <p className="font-cursive text-3xl sm:text-4xl text-[#D88CA5]">
              Unwrap a treasure chest of our love
            </p>
          </div>
        </ScrollReveal>

        {!isOpened ? (
          /* Animated Gift Box Presentation */
          <div className="flex flex-col items-center">
            {/* Gift Box Graphic */}
            <div className="relative my-8 group cursor-pointer" onClick={handleOpenSurprise}>
              {/* Outer soft glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#D88CA5]/40 via-[#F8DCE5]/60 to-[#B75F7D]/40 rounded-full blur-xl animate-pulse" />

              {/* Gift Box Container */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-tr from-[#B75F7D] via-[#D88CA5] to-[#F8DCE5] rounded-3xl shadow-2xl border-4 border-[#FFFDF9] flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
                {/* Gold/Cream Ribbons */}
                <div className="absolute inset-y-0 w-8 sm:w-10 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 shadow-sm" />
                <div className="absolute inset-x-0 h-8 sm:h-10 bg-gradient-to-b from-amber-200 via-yellow-100 to-amber-300 shadow-sm" />

                {/* Bow on Top */}
                <div className="absolute -top-7 sm:-top-8 z-20 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 shadow-lg border-2 border-white flex items-center justify-center text-[#B75F7D]">
                    <Heart className="w-6 h-6 fill-[#B75F7D] animate-ping" />
                  </div>
                </div>

                {/* Center Heart Emblem */}
                <div className="z-10 w-16 h-16 rounded-full bg-[#FFFDF9] shadow-md flex items-center justify-center text-[#B75F7D]">
                  <Gift className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Open Button */}
            <button
              onClick={handleOpenSurprise}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-white text-base sm:text-lg font-semibold bg-gradient-to-r from-[#D88CA5] via-[#B75F7D] to-[#9E4B66] shadow-xl shadow-[#B75F7D]/35 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D88CA5]"
            >
              <Gift className="w-5 h-5" />
              <span>{buttonText}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Revealed Cinematic Content */
          <div className="space-y-10 animate-fadeIn">
            {/* Tribute Video or Slide Player */}
            {videoUrl && (
              <div className="relative w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FFFDF9] bg-black">
                <div className="aspect-video w-full">
                  <iframe
                    src={videoUrl}
                    title="Anniversary Surprise Video"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="bg-[#FFFDF9] p-3 flex items-center justify-center gap-2 text-xs font-semibold text-[#B75F7D]">
                  <Film className="w-4 h-4" />
                  <span>Our Family Keepsake Video · Watch in High Definition</span>
                </div>
              </div>
            )}

            {/* Heartfelt Letter of Gratitude */}
            <div
              className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-8 sm:p-12 shadow-xl shadow-[#D88CA5]/15 max-w-2xl mx-auto text-left relative overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(#F8DCE5 0.75px, transparent 0.75px)',
                backgroundSize: '24px 24px'
              }}
            >
              <div className="flex items-center justify-between border-b border-[#F8DCE5] pb-4 mb-6">
                <span className="font-serif text-xs font-semibold tracking-widest uppercase text-[#B75F7D]">
                  A Message From Your Children
                </span>
                <Heart className="w-5 h-5 text-[#B75F7D] fill-[#B75F7D]" />
              </div>

              <div className="font-serif text-lg sm:text-xl text-[#70515A] leading-relaxed whitespace-pre-line font-normal">
                {message}
              </div>

              <div className="mt-8 pt-4 border-t border-[#F8DCE5] text-right">
                <span className="font-cursive text-3xl sm:text-4xl text-[#B75F7D]">
                  Always & Forever Yours
                </span>
              </div>
            </div>

            {/* Additional Special Tribute Photos if any */}
            {photos.length > 0 && (
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B75F7D] mb-4">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Cherished Family Keepsakes</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {photos.map((photoUrl, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-2xl overflow-hidden border-2 border-[#FFFDF9] shadow-md bg-[#FCEEF2]"
                    >
                      <img
                        src={photoUrl}
                        alt="Family Keepsake"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
