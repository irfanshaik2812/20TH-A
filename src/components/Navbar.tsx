import React, { useState, useEffect } from 'react';
import { Heart, Lock, Menu, X, Gift, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShareModal } from './ShareModal';

interface NavbarProps {
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isParentView, setIsParentView] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsParentView(params.get('view') === 'parents');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Love Story', href: '#timeline' },
    { label: 'Memories', href: '#gallery' },
    { label: 'Letters', href: '#letters' },
    { label: 'Why We Love You', href: '#reasons' },
    { label: 'Celebration', href: '#cake' },
    { label: 'Guestbook', href: '#guestbook' }
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#F8DCE5] shadow-xs py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <a
          href="#welcome"
          onClick={(e) => handleScrollTo(e, '#welcome')}
          className="flex items-center gap-2 group whitespace-nowrap shrink-0"
        >
          <span className="font-cursive text-3xl sm:text-4xl text-[#B75F7D] transition-transform duration-300 group-hover:scale-105">
            Forever Together
          </span>
          <Heart className="w-4 h-4 text-[#D88CA5] fill-[#D88CA5]/40 transition-transform duration-300 group-hover:rotate-12" />
        </a>

        {/* Zone 2: Clean single-line nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#70515A]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="hover:text-[#B75F7D] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#B75F7D] hover:after:w-full after:transition-all after:duration-200 whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#B75F7D] bg-[#FCEEF2] hover:bg-[#F8DCE5] border border-[#F8DCE5] rounded-full transition-all"
            title="Share Celebration Website"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <a
            href="#surprise"
            onClick={(e) => handleScrollTo(e, '#surprise')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide text-white bg-[#B75F7D] rounded-full hover:bg-[#9E4B66] shadow-sm hover:shadow-[#D88CA5]/30 transition-all duration-200 whitespace-nowrap shrink-0"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Open Surprise</span>
          </a>

          {/* Secure Admin Portal Link - Hidden when viewed by parents in pure gift mode */}
          {!isParentView && (
            <Link
              to="/admin"
              title="Administrator Portal"
              className="p-2 text-[#C99A9A] hover:text-[#B75F7D] rounded-full hover:bg-[#FCEEF2] transition-colors"
              aria-label="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#70515A] hover:text-[#B75F7D] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF9] border-b border-[#F8DCE5] px-6 py-4 shadow-lg animate-fadeIn">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="py-2 text-sm font-medium text-[#70515A] hover:text-[#B75F7D] border-b border-[#FCEEF2] last:border-none"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShareModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-[#B75F7D] bg-[#FCEEF2] border border-[#F8DCE5] rounded-full"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Anniversary Website</span>
              </button>
              <a
                href="#surprise"
                onClick={(e) => handleScrollTo(e, '#surprise')}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-white bg-[#B75F7D] rounded-full"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Open Surprise</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </header>
  );
};
