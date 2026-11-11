import React, { useState } from 'react';
import { useAnniversaryData } from '../hooks/useAnniversaryData';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  QrCode,
  Sparkles,
  Heart,
  X,
  Lock,
  Eye
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { createShareableLink } = useAnniversaryData();

  const [slug, setSlug] = useState('mom-and-dad-20th');
  const [isParentViewOnly, setIsParentViewOnly] = useState(true);
  const [baseUrl, setBaseUrl] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect public URL
  React.useEffect(() => {
    async function loadConfig() {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      let target = origin;
      try {
        const resp = await fetch('/api/anniversary/config');
        if (resp.ok) {
          const cfg = await resp.json();
          if (cfg.sharedUrl && (origin.includes('localhost') || origin.includes('ais-dev'))) {
            target = cfg.sharedUrl;
          } else if (cfg.appUrl && origin.includes('localhost')) {
            target = cfg.appUrl;
          }
        }
      } catch {
        // use origin
      }
      setBaseUrl(target);
    }
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'forever-together-20th';
    const res = await createShareableLink({
      slug: cleanSlug,
      title: 'Forever Together - 20th Anniversary',
      note: 'A digital storybook created with infinite love',
      isParentViewOnly,
      baseUrlOverride: baseUrl
    });

    setLoading(false);
    if (res.success && res.shareUrl) {
      setGeneratedUrl(res.shareUrl);
    } else {
      setError(res.error || 'Failed to generate link');
    }
  };

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Happy 20th Wedding Anniversary Mom & Dad! ❤️\nWe created a special digital anniversary website filled with our memories, love story, letters, and celebration for you:\n${generatedUrl || window.location.href}`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#70515A]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#70515A] hover:text-[#B75F7D] rounded-full hover:bg-[#FCEEF2] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#F8DCE5]">
          <div className="w-11 h-11 rounded-2xl bg-[#FCEEF2] text-[#B75F7D] flex items-center justify-center shadow-xs">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#70515A]">
              Create & Share Website Link
            </h3>
            <p className="text-xs text-[#70515A]/70">
              Publish all photos, songs, videos & letters to a shareable link
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#70515A] mb-1">
              Custom Link Name (Slug)
            </label>
            <div className="flex items-center bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3 py-2 text-xs text-[#70515A] focus-within:border-[#B75F7D]">
              <span className="text-[#C99A9A] select-none truncate">.../?celebrate=</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="mom-and-dad-20th"
                className="w-full bg-transparent focus:outline-none font-medium text-[#B75F7D] pl-1"
              />
            </div>
            <p className="text-[11px] text-[#C99A9A] mt-1">
              Example: <code className="text-[#B75F7D]">mom-and-dad-20th</code> or <code className="text-[#B75F7D]">happy-anniversary</code>
            </p>
          </div>

          {/* Option: Parent View Only Mode */}
          <div className="bg-[#FCEEF2]/60 border border-[#F8DCE5] rounded-2xl p-3.5 flex items-start gap-3">
            <input
              type="checkbox"
              id="parentView"
              checked={isParentViewOnly}
              onChange={(e) => setIsParentViewOnly(e.target.checked)}
              className="mt-0.5 accent-[#B75F7D] w-4 h-4 rounded"
            />
            <label htmlFor="parentView" className="text-xs text-[#70515A] cursor-pointer">
              <strong className="block font-semibold text-[#70515A]">
                Pure Storybook Mode for Parents (Recommended)
              </strong>
              Hides admin lock buttons from the navigation bar so parents and relatives enjoy an undisturbed romantic experience.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-white text-xs font-semibold bg-gradient-to-r from-[#D88CA5] via-[#B75F7D] to-[#9E4B66] shadow-md shadow-[#B75F7D]/25 hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Publishing & Generating Link...' : 'Publish & Generate Shareable Link'}</span>
          </button>
        </form>

        {/* Generated Link Display & Share Actions */}
        {generatedUrl && (
          <div className="mt-6 pt-5 border-t border-[#F8DCE5] space-y-4 animate-fadeIn">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B75F7D] block mb-1">
                Your Shareable Link Is Ready:
              </span>
              <div className="flex items-center gap-2 bg-[#FCEEF2] border border-[#F8DCE5] rounded-xl p-2.5">
                <input
                  type="text"
                  readOnly
                  value={generatedUrl}
                  className="w-full bg-transparent text-xs font-mono text-[#70515A] focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#B75F7D] hover:bg-[#9E4B66] shrink-0 flex items-center gap-1 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#25D366] hover:bg-[#1ebe5b] transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>

              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#70515A] bg-[#FFFDF9] hover:bg-[#FCEEF2] border border-[#F8DCE5] transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-[#B75F7D]" />
                <span>Open in New Tab</span>
              </a>
            </div>

            {/* QR Code Quick Scan Preview */}
            <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-2xl p-3 flex items-center gap-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                  generatedUrl
                )}`}
                alt="QR Code"
                className="w-16 h-16 rounded-lg border border-[#F8DCE5] p-1 bg-white shrink-0"
              />
              <div className="text-xs text-[#70515A]">
                <p className="font-semibold flex items-center gap-1 text-[#B75F7D]">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan with Phone Camera</span>
                </p>
                <p className="text-[11px] text-[#C99A9A] mt-0.5">
                  Anyone can point their phone camera at this QR code to immediately open the anniversary celebration.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-center text-[#C99A9A] italic">
              ✨ All photographs, letters, music, and cake celebration data are hosted on the server and will open automatically on any mobile phone or computer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
