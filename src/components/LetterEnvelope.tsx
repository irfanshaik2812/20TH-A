import React, { useState } from 'react';
import { Letter } from '../types/database';
import { Mail, Heart, Volume2, X, Feather } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface LettersProps {
  letters: Letter[];
}

export const LetterEnvelope: React.FC<LettersProps> = ({ letters }) => {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isFlapOpen, setIsFlapOpen] = useState(false);

  const publishedLetters = letters
    .filter((l) => l.is_published)
    .sort((a, b) => a.display_order - b.display_order);

  const handleOpenEnvelope = (letter: Letter) => {
    setSelectedLetter(letter);
    setIsFlapOpen(true);
  };

  const handleClose = () => {
    setIsFlapOpen(false);
    setSelectedLetter(null);
  };

  return (
    <section id="letters" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FFFDF9] relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header with IntersectionObserver Fade-in */}
        <ScrollReveal direction="up" distance={32} duration={850}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#B75F7D] mb-2">
              <Feather className="w-3.5 h-3.5" />
              <span>From Our Hearts</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#70515A] font-normal mb-3">
              Letters From Your Children
            </h2>
            <p className="font-cursive text-3xl sm:text-4xl text-[#D88CA5]">
              Words that can never truly express our gratitude
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D88CA5] to-transparent mx-auto mt-4" />
          </div>
        </ScrollReveal>

        {/* Envelope Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publishedLetters.map((letter, idx) => (
            <ScrollReveal key={letter.id} staggerIndex={idx} direction="up" distance={30} duration={800}>
              <div
                onClick={() => handleOpenEnvelope(letter)}
                className="group relative cursor-pointer flex flex-col items-center"
              >
              {/* Outer Envelope Silhouette */}
              <div className="w-full aspect-4/3 bg-gradient-to-br from-[#FFFDF9] via-[#FCEEF2] to-[#F8DCE5] rounded-2xl border-2 border-[#F8DCE5] shadow-lg shadow-[#D88CA5]/15 group-hover:shadow-2xl group-hover:shadow-[#D88CA5]/30 group-hover:-translate-y-1.5 transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden">
                {/* Envelope Flap Triangular Border */}
                <div className="absolute top-0 left-0 right-0 h-1/2 border-b border-[#D88CA5]/30 bg-gradient-to-b from-[#FFFDF9]/60 to-transparent pointer-events-none" />

                {/* Wax Seal Stamp in Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-gradient-to-tr from-[#9E4B66] via-[#B75F7D] to-[#D88CA5] shadow-md shadow-[#9E4B66]/40 flex items-center justify-center text-white border-2 border-[#FFFDF9] transition-transform duration-300 group-hover:scale-110">
                  <Heart className="w-6 h-6 fill-current animate-pulse" />
                </div>

                {/* Top Label */}
                <div className="flex items-center justify-between text-xs font-serif text-[#C99A9A]">
                  <span className="uppercase tracking-widest">Confidential With Love</span>
                  <Mail className="w-4 h-4 text-[#B75F7D]" />
                </div>

                {/* Bottom Recipient / Author info */}
                <div className="text-center mt-auto pt-10 z-10">
                  <span className="text-[11px] uppercase tracking-wider text-[#B75F7D] font-semibold block">
                    {letter.relationship}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-[#70515A] truncate">
                    {letter.author}
                  </h3>
                  <p className="text-xs text-[#70515A]/70 line-clamp-1 italic mt-0.5">
                    "{letter.title}"
                  </p>
                </div>
              </div>

              {/* Click instruction */}
              <span className="text-xs text-[#B75F7D] font-medium mt-3 opacity-80 group-hover:opacity-100 flex items-center gap-1">
                <span>Click to break seal & read letter</span>
                <Heart className="w-3 h-3 fill-current" />
              </span>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Letter Reading Modal / Parchment View */}
      {selectedLetter && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#70515A]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-2xl bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 sm:p-10 shadow-2xl my-8 text-left"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundImage: 'radial-gradient(#F8DCE5 0.75px, transparent 0.75px)',
              backgroundSize: '24px 24px'
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Close Letter"
              className="absolute top-4 right-4 p-2 text-[#70515A] hover:text-[#B75F7D] rounded-full hover:bg-[#FCEEF2] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letter Header */}
            <div className="border-b border-[#F8DCE5] pb-4 mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#B75F7D] mb-1">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{selectedLetter.relationship} · {selectedLetter.author}</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#70515A] font-semibold">
                {selectedLetter.title}
              </h3>
            </div>

            {/* Optional Audio Recording */}
            {selectedLetter.audio_recording_url && (
              <div className="mb-6 bg-[#FCEEF2] border border-[#F8DCE5] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#B75F7D] text-white flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#70515A]">Personal Voice Note</p>
                  <audio controls className="w-full mt-1 h-8" src={selectedLetter.audio_recording_url} />
                </div>
              </div>
            )}

            {/* Handwritten style message body */}
            <div className="font-serif text-base sm:text-lg text-[#70515A] leading-relaxed whitespace-pre-line space-y-4 font-normal">
              {selectedLetter.message}
            </div>

            {/* Sign-off */}
            <div className="mt-8 pt-4 border-t border-[#F8DCE5] flex items-center justify-between">
              <span className="font-cursive text-3xl sm:text-4xl text-[#B75F7D]">
                With eternal love & respect
              </span>
              <Heart className="w-6 h-6 text-[#D88CA5] fill-[#F8DCE5]" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
