import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, RotateCcw } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface CakeProps {
  messageTitle?: string;
  messageSubtitle?: string;
}

export const AnniversaryCake: React.FC<CakeProps> = ({
  messageTitle = 'Happy Anniversary, Mom & Dad!',
  messageSubtitle = 'May your love continue to grow stronger with every passing year.'
}) => {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [showCelebrationMessage, setShowCelebrationMessage] = useState(false);

  // Play synthetic romantic celebratory chime using Web Audio API
  const playChimeSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 1.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.12);
        osc.stop(audioCtx.currentTime + idx * 0.12 + 1.3);
      });
    } catch {
      // AudioContext not allowed or unsupported
    }
  };

  const handleBlowCandles = () => {
    if (candlesBlown) return;

    setCandlesBlown(true);
    playChimeSound();

    // Trigger celebratory confetti cannon
    const count = 200;
    const defaults = {
      origin: { y: 0.65 },
      colors: ['#F8DCE5', '#D88CA5', '#B75F7D', '#E8B4C8', '#FFD700', '#FFFFFF']
    };

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.5),
      spread: 60
    });
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.3),
      spread: 100
    });
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.2),
      spread: 120,
      decay: 0.91,
      scalar: 1.2
    });

    // Reveal message after short smoke flourish
    setTimeout(() => {
      setShowCelebrationMessage(true);
    }, 400);
  };

  const handleRelight = () => {
    setCandlesBlown(false);
    setShowCelebrationMessage(false);
  };

  return (
    <section id="cake" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FFFDF9] relative overflow-hidden text-center">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header with IntersectionObserver Fade-in */}
        <ScrollReveal direction="up" distance={32} duration={850}>
          <div className="max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#B75F7D] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ceremony of Love</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#70515A] font-normal mb-2">
              Make A Beautiful Wish Together
            </h2>
            <p className="font-cursive text-3xl sm:text-4xl text-[#D88CA5]">
              Blow out the candles and celebrate your eternal bond
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Cake Illustration Stage */}
        <div className="relative w-full max-w-md mx-auto my-6 flex flex-col items-center">
          {/* Candles Row */}
          <div className="flex items-end justify-center gap-6 sm:gap-8 mb-[-4px] z-20">
            {[1, 2, 3].map((candleIndex) => (
              <div key={candleIndex} className="relative flex flex-col items-center">
                {/* Flame / Smoke */}
                {!candlesBlown ? (
                  <div className="relative animate-candle">
                    {/* Flame Core */}
                    <div className="w-4 h-6 rounded-full bg-gradient-to-t from-orange-400 via-yellow-300 to-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                    {/* Flame Halo */}
                    <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-xs" />
                  </div>
                ) : (
                  /* Animated Smoke Rise */
                  <div className="h-6 flex items-center justify-center animate-smoke">
                    <span className="w-2.5 h-6 text-gray-400 opacity-60 text-lg font-serif">~</span>
                  </div>
                )}

                {/* Candle Wick */}
                <div className="w-0.5 h-2 bg-neutral-800" />

                {/* Candle Stick */}
                <div className="w-3.5 sm:w-4 h-12 sm:h-14 bg-gradient-to-r from-[#F8DCE5] via-[#FFFDF9] to-[#D88CA5] rounded-t-xs shadow-xs border-x border-[#F8DCE5]" />
              </div>
            ))}
          </div>

          {/* Tier 1 (Top Tier) */}
          <div className="relative w-44 sm:w-52 h-14 bg-gradient-to-r from-[#FFFDF9] via-[#FCEEF2] to-[#FFFDF9] rounded-t-2xl border-2 border-b-0 border-[#F8DCE5] shadow-md z-15 flex items-center justify-around px-4">
            {/* Icing scalloped frosting */}
            <div className="absolute -bottom-1 left-0 right-0 h-3 flex justify-between px-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-4 h-3 bg-[#D88CA5] rounded-full opacity-80" />
              ))}
            </div>
            {/* Center Rose Decoration */}
            <div className="text-[#B75F7D] flex items-center gap-2">
              <Heart className="w-4 h-4 fill-[#B75F7D]" />
              <span className="font-serif text-xs font-bold tracking-wider text-[#70515A]">20 YEARS</span>
              <Heart className="w-4 h-4 fill-[#B75F7D]" />
            </div>
          </div>

          {/* Tier 2 (Middle Tier) */}
          <div className="relative w-64 sm:w-72 h-18 bg-gradient-to-r from-[#FCEEF2] via-[#FFFDF9] to-[#FCEEF2] rounded-t-2xl border-2 border-b-0 border-[#F8DCE5] shadow-lg z-10 flex items-center justify-center">
            {/* Scalloped frosting */}
            <div className="absolute -bottom-1 left-0 right-0 h-3 flex justify-between px-2">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} className="w-4 h-3 bg-[#F8DCE5] rounded-full" />
              ))}
            </div>
            <span className="font-cursive text-2xl text-[#B75F7D]">Mom & Dad</span>
          </div>

          {/* Tier 3 (Bottom Tier) */}
          <div className="relative w-80 sm:w-96 h-22 bg-gradient-to-r from-[#FFFDF9] via-[#F8DCE5] to-[#FFFDF9] rounded-t-3xl border-2 border-b-0 border-[#F8DCE5] shadow-xl z-5 flex items-center justify-around px-6">
            {/* Rose buds on bottom tier */}
            <div className="flex items-center gap-6">
              <span className="text-[#B75F7D] text-lg select-none">🌹</span>
              <span className="text-[#D88CA5] text-sm select-none">🌸</span>
              <span className="text-[#B75F7D] text-base select-none">🌹</span>
              <span className="text-[#D88CA5] text-sm select-none">🌸</span>
              <span className="text-[#B75F7D] text-lg select-none">🌹</span>
            </div>
          </div>

          {/* Cake Stand */}
          <div className="w-96 sm:w-[420px] h-4 bg-gradient-to-r from-[#C99A9A] via-[#FFFDF9] to-[#C99A9A] rounded-full shadow-md z-2 border border-[#C99A9A]/40" />
          <div className="w-40 h-6 bg-gradient-to-r from-[#C99A9A] via-[#FFFDF9] to-[#C99A9A] rounded-b-xl shadow-md z-1" />
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex flex-col items-center gap-4">
          {!candlesBlown ? (
            <button
              onClick={handleBlowCandles}
              className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full text-white text-base sm:text-lg font-semibold bg-gradient-to-r from-[#D88CA5] via-[#B75F7D] to-[#9E4B66] shadow-xl shadow-[#B75F7D]/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D88CA5]"
            >
              <Sparkles className="w-5 h-5" />
              <span>BLOW OUT THE CANDLES ❤️</span>
            </button>
          ) : (
            <button
              onClick={handleRelight}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-[#B75F7D] bg-[#FCEEF2] hover:bg-[#F8DCE5] border border-[#F8DCE5] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Light The Candles Again ✨</span>
            </button>
          )}

          {/* Revealed Celebratory Message */}
          {showCelebrationMessage && (
            <div className="mt-6 bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 sm:p-8 max-w-lg mx-auto shadow-xl shadow-[#D88CA5]/20 animate-fadeIn">
              <Heart className="w-8 h-8 text-[#B75F7D] fill-[#B75F7D] mx-auto mb-3 animate-bounce" />
              <h3 className="font-serif text-2xl sm:text-3xl text-[#70515A] font-bold mb-2">
                {messageTitle}
              </h3>
              <p className="font-serif italic text-base sm:text-lg text-[#B75F7D] leading-relaxed">
                "{messageSubtitle}"
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
