import React from 'react';
import { LoveReason } from '../types/database';
import { Heart, Compass, ShieldCheck, Sparkles, Crown, HeartHandshake } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface ReasonsProps {
  reasons: LoveReason[];
}

// Icon resolver helper
const getReasonIcon = (iconName: string) => {
  switch (iconName) {
    case 'HeartHandshake':
      return <HeartHandshake className="w-6 h-6" />;
    case 'Compass':
      return <Compass className="w-6 h-6" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-6 h-6" />;
    case 'Sparkles':
      return <Sparkles className="w-6 h-6" />;
    case 'Crown':
      return <Crown className="w-6 h-6" />;
    default:
      return <Heart className="w-6 h-6" />;
  }
};

export const ReasonsCards: React.FC<ReasonsProps> = ({ reasons }) => {
  const publishedReasons = reasons
    .filter((r) => r.is_published)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="reasons" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FCEEF2]/30 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header with IntersectionObserver Fade-in */}
        <ScrollReveal direction="up" distance={32} duration={850}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#B75F7D] mb-2">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Countless Blessings</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#70515A] font-normal mb-3">
              Reasons Why We Love You ❤️
            </h2>
            <p className="font-cursive text-3xl sm:text-4xl text-[#D88CA5]">
              Six reminders of the boundless grace you bring into our lives
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D88CA5] to-transparent mx-auto mt-4" />
          </div>
        </ScrollReveal>

        {/* 6 Animated Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {publishedReasons.map((reason, idx) => (
            <ScrollReveal key={reason.id} staggerIndex={idx} direction="up" distance={28} duration={750}>
              <div
                className="group relative bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-[#D88CA5]/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full"
              >
                {/* Subtle floral watermark in card corner */}
                <div className="absolute top-4 right-4 text-[#F8DCE5] group-hover:text-[#D88CA5]/40 transition-colors font-serif text-3xl select-none">
                  0{idx + 1}
                </div>

              <div>
                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-2xl bg-[#FCEEF2] border border-[#F8DCE5] text-[#B75F7D] flex items-center justify-center mb-6 group-hover:bg-[#B75F7D] group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-xs">
                  {getReasonIcon(reason.icon_name)}
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl text-[#70515A] font-semibold mb-3 group-hover:text-[#B75F7D] transition-colors">
                  {reason.title}
                </h3>

                {/* Message */}
                <p className="font-serif italic text-base sm:text-lg text-[#70515A]/85 leading-relaxed font-normal">
                  "{reason.message}"
                </p>
              </div>

              {/* Bottom Heart Accent */}
              <div className="mt-6 pt-4 border-t border-[#FCEEF2] flex items-center justify-between text-xs text-[#C99A9A]">
                <span className="font-medium">Forever Treasured</span>
                <Heart className="w-3.5 h-3.5 text-[#D88CA5] fill-[#D88CA5]/30 group-hover:fill-[#B75F7D] transition-colors" />
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
