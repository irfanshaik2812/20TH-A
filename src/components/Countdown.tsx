import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Heart } from 'lucide-react';

interface CountdownProps {
  targetDate?: string; // ISO date string e.g. '2026-11-12T00:00:00+05:30'
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate = '2026-11-12T00:00:00+05:30'
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="bg-[#FFFDF9]/85 backdrop-blur-md border border-[#F8DCE5] rounded-3xl p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
        {/* Decorative corner florals */}
        <div className="absolute top-2 left-3 text-[#E8B4C8]/40 text-xl select-none">❧</div>
        <div className="absolute top-2 right-3 text-[#E8B4C8]/40 text-xl select-none">❧</div>
        
        <div className="flex items-center justify-center gap-2 mb-2 text-xs font-semibold uppercase tracking-widest text-[#B75F7D]">
          <Calendar className="w-3.5 h-3.5" />
          <span>Anniversary Date: 12 November 2026 · Asia/Kolkata</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#70515A] mb-6">
          {timeLeft.isPast ? (
            <span className="flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-[#B75F7D] fill-[#B75F7D]" />
              Today We Celebrate 20 Beautiful Years Together!
              <Heart className="w-5 h-5 text-[#B75F7D] fill-[#B75F7D]" />
            </span>
          ) : (
            'Counting Down To The 20th Wedding Anniversary'
          )}
        </h3>

        {/* Counter cards */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
          {[
            { label: 'Days', val: timeLeft.days },
            { label: 'Hours', val: timeLeft.hours },
            { label: 'Minutes', val: timeLeft.minutes },
            { label: 'Seconds', val: timeLeft.seconds }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FCEEF2]/70 rounded-2xl p-3 sm:p-4 border border-[#F8DCE5] flex flex-col items-center justify-center transition-transform hover:-translate-y-0.5"
            >
              <span className="font-serif text-2xl sm:text-4xl font-semibold text-[#B75F7D] tabular-nums">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-[#70515A]/80 tracking-wide mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-[#C99A9A]">
          <Clock className="w-3.5 h-3.5" />
          <span>Over 7,300 days of warmth, kindness, and eternal love</span>
        </div>
      </div>
    </div>
  );
};
