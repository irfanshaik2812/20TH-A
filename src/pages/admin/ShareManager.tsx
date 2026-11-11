import React, { useState, useEffect } from 'react';
import { useAnniversaryData } from '../../hooks/useAnniversaryData';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  QrCode,
  Sparkles,
  Heart,
  Globe,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  Info,
  CheckCircle2
} from 'lucide-react';

export const ShareManager: React.FC = () => {
  const { createShareableLink, photos, timeline, letters } = useAnniversaryData();
  const isCloud = isSupabaseConfigured();

  const [baseUrl, setBaseUrl] = useState('');
  const [copiedPermanent, setCopiedPermanent] = useState(false);
  const [copiedClean, setCopiedClean] = useState(false);
  const [copiedUniversal, setCopiedUniversal] = useState(false);

  const [universalUrl, setUniversalUrl] = useState<string | null>(null);
  const [loadingUniversal, setLoadingUniversal] = useState(false);

  useEffect(() => {
    async function initDomain() {
      const publicOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      let defaultTarget = publicOrigin;

      try {
        const resp = await fetch('/api/anniversary/config');
        if (resp.ok) {
          const cfg = await resp.json();
          if (cfg.sharedUrl) {
            defaultTarget = cfg.sharedUrl;
          } else if (cfg.appUrl) {
            defaultTarget = cfg.appUrl;
          }
        }
      } catch {
        // fallback to window.location.origin
      }

      setBaseUrl(defaultTarget);
    }

    initDomain();
  }, []);

  const permanentPublicUrl = baseUrl ? `${baseUrl}/?view=parents` : '/?view=parents';
  const cleanPublicUrl = baseUrl ? `${baseUrl}/` : '/';

  const handleCopyPermanent = (cleanOnly = false) => {
    const target = cleanOnly ? cleanPublicUrl : permanentPublicUrl;
    navigator.clipboard.writeText(target);
    if (cleanOnly) {
      setCopiedClean(true);
      setTimeout(() => setCopiedClean(false), 2000);
    } else {
      setCopiedPermanent(true);
      setTimeout(() => setCopiedPermanent(false), 2000);
    }
  };

  const handleGenerateUniversal = async () => {
    setLoadingUniversal(true);
    const res = await createShareableLink({
      slug: 'mom-and-dad-20th',
      title: 'Forever Together - 20th Anniversary',
      note: 'A special digital gift created with infinite love',
      isParentViewOnly: true,
      baseUrlOverride: baseUrl
    });
    setLoadingUniversal(false);
    if (res.success && res.universalUrl) {
      setUniversalUrl(res.universalUrl);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Happy 20th Wedding Anniversary Mom & Dad! ❤️\nWe created a special digital anniversary website filled with our memories, photos, love story, letters, and celebration for you:\n${permanentPublicUrl}`
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="pb-4 border-b border-[#F8DCE5]">
        <h1 className="font-serif text-3xl font-bold text-[#70515A]">
          Permanent Public Website Link
        </h1>
        <p className="text-xs text-[#70515A]/70 mt-1">
          Share this single permanent link with your parents and family. Every photo, milestone, or melody you publish in the Admin updates automatically on this link across all devices.
        </p>
      </div>

      {/* Main Permanent Link Banner Card */}
      <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FCEEF2]/40 to-[#FFFDF9] border-2 border-[#B75F7D]/30 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F8DCE5]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#B75F7D] text-white flex items-center justify-center shadow-xs">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-bold text-[#70515A]">
                  One Permanent URL for All Devices
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Live Global Sync
                </span>
              </div>
              <p className="text-xs text-[#70515A]/80 mt-0.5">
                Always displays your latest published photos, music, and love story without generating new links or redeploying.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isCloud ? 'Supabase Realtime Sync' : 'Local + Server Sync'}</span>
          </div>
        </div>

        {/* The Permanent URL Box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#70515A] uppercase tracking-wider">
            Shareable Permanent Website Link (Parents Storybook Mode)
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white border-2 border-[#F8DCE5] rounded-2xl p-2.5 shadow-xs">
            <input
              type="text"
              readOnly
              value={permanentPublicUrl}
              className="flex-1 bg-transparent px-2 text-xs sm:text-sm font-mono text-[#70515A] focus:outline-none truncate"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyPermanent(false)}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#B75F7D] hover:bg-[#9E4B66] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {copiedPermanent ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPermanent ? 'Copied Link!' : 'Copy Permanent Link'}</span>
              </button>

              <a
                href={permanentPublicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-[#70515A] bg-[#FCEEF2] hover:bg-[#F8DCE5] border border-[#F8DCE5] transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4 text-[#B75F7D]" />
              </a>
            </div>
          </div>
          <p className="text-[11px] text-[#C99A9A]">
            ✨ The <code className="bg-[#FCEEF2] px-1 py-0.5 rounded text-[#B75F7D]">?view=parents</code> parameter opens the pure romantic storybook view, hiding the admin lock so parents enjoy an uncluttered celebration experience.
          </p>
        </div>

        {/* Quick Actions: WhatsApp & QR Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* WhatsApp Share */}
          <a
            href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#1ebe5b] transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send to Parents / Family WhatsApp Group</span>
          </a>

          {/* Clean URL Option */}
          <button
            onClick={() => handleCopyPermanent(true)}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs font-semibold text-[#70515A] bg-white hover:bg-[#FCEEF2] border border-[#F8DCE5] transition-all cursor-pointer"
          >
            {copiedClean ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#B75F7D]" />}
            <span>{copiedClean ? 'Copied Clean Root URL!' : 'Copy Clean Root URL (without parameters)'}</span>
          </button>
        </div>
      </div>

      {/* QR Code and Multi-Device Features */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: QR Code for Phones */}
        <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B75F7D]">
            <QrCode className="w-4 h-4" />
            <span>Scan to Open on Mobile</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                permanentPublicUrl
              )}`}
              alt="Anniversary Website QR Code"
              className="w-32 h-32 rounded-2xl border-2 border-[#F8DCE5] p-2 bg-white shadow-xs shrink-0"
            />
            <div className="text-xs text-[#70515A] space-y-2">
              <p className="font-bold text-[#70515A]">Instant Phone Access</p>
              <p className="text-[11px] text-[#70515A]/80 leading-relaxed">
                Parents or guests can point their phone camera at this QR code to view the 20th anniversary site directly with background music and photos.
              </p>
              <a
                href={permanentPublicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B75F7D] hover:underline"
              >
                <span>Preview mobile view in browser</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: How It Works & Publishing Rules */}
        <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B75F7D]">
            <ShieldCheck className="w-4 h-4" />
            <span>How Live Cloud Publishing Works</span>
          </div>

          <div className="space-y-3 text-xs text-[#70515A]">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#FCEEF2] text-[#B75F7D] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <p>
                <strong>Upload images, music & milestones:</strong> Through the Photo Gallery, Timeline, or Music managers in this admin suite.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#FCEEF2] text-[#B75F7D] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <p>
                <strong>Set to "Published":</strong> Items marked as Published become immediately visible to all public visitors. Items marked Hidden remain drafts.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#FCEEF2] text-[#B75F7D] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <p>
                <strong>No redeployment needed:</strong> When you hit Save, Supabase Database and Storage update in real-time. Anyone visiting the permanent link sees the updates immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Portable Self-Contained Backup Link */}
      <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B75F7D]" />
            <h4 className="font-serif text-lg font-bold text-[#70515A]">
              Self-Contained Portable Backup Link (Optional)
            </h4>
          </div>
          <span className="text-[10px] font-semibold bg-[#FCEEF2] text-[#B75F7D] px-2.5 py-0.5 rounded-full border border-[#F8DCE5]">
            Offline Backup
          </span>
        </div>

        <p className="text-xs text-[#70515A]/80">
          If you want a static, self-contained snapshot link that bundles all current photos and letters directly into the URL itself for offline situations, generate it here:
        </p>

        {universalUrl ? (
          <div className="flex items-center gap-2 bg-[#FCEEF2]/40 border border-[#F8DCE5] rounded-xl p-2.5">
            <input
              type="text"
              readOnly
              value={universalUrl}
              className="flex-1 bg-transparent text-xs font-mono text-[#70515A] focus:outline-none truncate"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(universalUrl);
                setCopiedUniversal(true);
                setTimeout(() => setCopiedUniversal(false), 2000);
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#B75F7D] hover:bg-[#9E4B66] shrink-0 flex items-center gap-1 transition-all cursor-pointer"
            >
              {copiedUniversal ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUniversal ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleGenerateUniversal}
            disabled={loadingUniversal}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-[#70515A] bg-[#FCEEF2] hover:bg-[#F8DCE5] border border-[#F8DCE5] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B75F7D]" />
            <span>{loadingUniversal ? 'Generating Bundle...' : 'Generate Self-Contained Backup Link'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
