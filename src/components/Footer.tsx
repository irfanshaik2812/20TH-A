import React from 'react';
import { Heart, ArrowUp, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FCEEF2]/60 border-t border-[#F8DCE5] py-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Brand flourish */}
        <span className="font-cursive text-4xl sm:text-5xl text-[#B75F7D] mb-2">
          Forever Together
        </span>

        <p className="font-serif italic text-sm sm:text-base text-[#70515A]/80 max-w-md mb-6">
          "A lifetime of love, laughter, sacrifices, and unconditional devotion. Happy Anniversary, Mom & Dad."
        </p>

        {/* Floating Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFDF9] border border-[#F8DCE5] text-[#70515A] hover:text-[#B75F7D] text-xs font-medium shadow-xs hover:shadow-md transition-all mb-8"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Back to Top</span>
        </button>

        {/* Divider */}
        <div className="w-full max-w-xs h-px bg-[#F8DCE5] mb-6" />

        {/* Copyright and Family Admin Link */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between text-xs text-[#C99A9A] gap-4">
          <div className="flex items-center gap-1.5">
            <span>Crafted with infinite love by your children</span>
            <Heart className="w-3.5 h-3.5 text-[#B75F7D] fill-current" />
            <span>· 12 November 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="flex items-center gap-1 hover:text-[#B75F7D] transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
