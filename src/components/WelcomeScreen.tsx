import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  heading: string;
  subtitle: string;
  tagline: string;
  photoUrl: string;
  onEnterStory: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  heading,
  subtitle,
  tagline,
  photoUrl,
  onEnterStory
}) => {
  return (
    <section
      id="welcome"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FCEEF2] to-[#FFFDF9]"
    >
      {/* Soft atmospheric glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-[#F8DCE5]/60 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#E8B4C8]/30 rounded-full blur-2xl pointer-events-none -z-0" />
      <div className="absolute top-10 right-10 w-48 h-48 bg-[#D88CA5]/20 rounded-full blur-2xl pointer-events-none -z-0" />

      {/* Main Container */}
      <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Top romantic flourish */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF9]/80 border border-[#F8DCE5] text-[#B75F7D] text-xs font-medium tracking-widest uppercase mb-6 shadow-xs animate-float">
          <Sparkles className="w-3.5 h-3.5" />
          <span>A Digital Tribute Made With Endless Love</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        {/* Heading & Subtitle */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#70515A] font-normal tracking-tight leading-[1.15] max-w-3xl mb-3 text-balance">
          {heading}
        </h1>

        <p className="font-cursive text-4xl sm:text-6xl md:text-7xl text-[#B75F7D] my-2 transition-transform hover:scale-105 duration-300">
          {subtitle}
        </p>

        {/* Centerpiece: Parents' Photograph with Ornate Floral / Rose-Gold Frame */}
        <div className="relative my-8 sm:my-10 group">
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-3 sm:-inset-4 rounded-full bg-gradient-to-tr from-[#D88CA5] via-[#F8DCE5] to-[#B75F7D] opacity-40 blur-xl animate-pulse" />

          {/* Decorative Floral Ring Overlay */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full p-2.5 sm:p-3 bg-gradient-to-tr from-[#C99A9A] via-[#FFFDF9] to-[#D88CA5] shadow-2xl shadow-[#B75F7D]/25 transition-all duration-500 group-hover:scale-[1.02]">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#FFFDF9] shadow-inner relative bg-[#FCEEF2]">
              <img
                src={photoUrl}
                alt="Beloved Parents Wedding Anniversary"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                onError={(e) => {
                  // Fallback high quality romantic couple portrait
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#70515A]/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Corner Rose Badge Accent */}
            <div className="absolute -bottom-2 right-4 sm:right-6 bg-[#FFFDF9] border-2 border-[#F8DCE5] rounded-full p-2.5 shadow-md flex items-center justify-center text-[#B75F7D]">
              <Heart className="w-5 h-5 fill-current animate-bounce" />
            </div>
          </div>
        </div>

        {/* Enter Love Story Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onEnterStory}
            className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-white text-base sm:text-lg font-medium tracking-wide bg-gradient-to-r from-[#D88CA5] via-[#B75F7D] to-[#9E4B66] shadow-xl shadow-[#B75F7D]/35 hover:shadow-2xl hover:shadow-[#B75F7D]/50 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D88CA5]"
          >
            <Heart className="w-5 h-5 fill-white transition-transform group-hover:scale-125" />
            <span className="font-sans font-semibold">ENTER OUR LOVE STORY ❤️</span>
            <Sparkles className="w-4 h-4 opacity-80" />
          </button>

          {/* Subtle line: A little surprise awaits you... */}
          <p className="font-serif italic text-sm sm:text-base text-[#70515A]/75 mt-1 tracking-wide">
            {tagline}
          </p>
        </div>
      </div>

      {/* Bottom transition wave indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center text-[#C99A9A] pointer-events-none">
        <span className="text-[11px] uppercase tracking-widest font-medium mb-1">Scroll to explore</span>
        <div className="w-0.5 h-6 bg-[#C99A9A]/40 rounded-full animate-bounce" />
      </div>
    </section>
  );
};
