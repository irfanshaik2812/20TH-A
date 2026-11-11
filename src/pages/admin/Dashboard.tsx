import React from 'react';
import { Link } from 'react-router-dom';
import { useAnniversaryData } from '../../hooks/useAnniversaryData';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import {
  Image,
  Clock,
  Mail,
  Heart,
  MessageCircleHeart,
  Sparkles,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Share2
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { analytics, guestbook, timeline, photos } = useAnniversaryData();
  const { settings } = useSiteSettings();

  const pendingWishes = guestbook.filter((g) => g.status === 'pending');

  const stats = [
    {
      title: 'Scrapbook Photos',
      value: analytics.photoCount,
      path: '/admin/gallery',
      icon: Image,
      color: 'bg-pink-50 text-pink-700 border-pink-200'
    },
    {
      title: 'Love Story Milestones',
      value: analytics.milestoneCount,
      path: '/admin/timeline',
      icon: Clock,
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      title: "Children's Letters",
      value: analytics.letterCount,
      path: '/admin/letters',
      icon: Mail,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Pending Guestbook Wishes',
      value: analytics.pendingWishesCount,
      path: '/admin/guestbook',
      icon: MessageCircleHeart,
      color: analytics.pendingWishesCount > 0
        ? 'bg-orange-50 text-orange-700 border-orange-200 animate-pulse'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#FCEEF2] via-[#FFFDF9] to-[#F8DCE5] border border-[#F8DCE5] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B75F7D] mb-1 block">
            Welcome to the Family Admin Console
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl text-[#70515A] font-bold">
            Forever Together Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#70515A]/80 mt-1">
            Celebrating {settings.parents_names} · 12 November 2026
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/share"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#B75F7D] hover:bg-[#9E4B66] shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Generate & Share Link</span>
          </Link>
          <Link
            to="/?view=parents"
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#70515A] bg-[#FFFDF9] border border-[#F8DCE5] hover:bg-[#FCEEF2] shadow-sm transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Parent Mode</span>
          </Link>
        </div>
      </div>

      {/* Pending Wishes Alert banner */}
      {pendingWishes.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-orange-900">
                {pendingWishes.length} Pending Anniversary Wish{pendingWishes.length > 1 ? 'es' : ''} Awaiting Review
              </h4>
              <p className="text-xs text-orange-700">
                Relatives have left blessings on the digital guestbook. Review and approve them for public display.
              </p>
            </div>
          </div>
          <Link
            to="/admin/guestbook"
            className="px-4 py-1.5 text-xs font-semibold bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors shrink-0"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={idx}
              to={s.path}
              className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-[#D88CA5] transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-[#70515A]/80 truncate">{s.title}</span>
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#70515A] tabular-nums">
                  {s.value}
                </span>
                <span className="text-[10px] text-[#C99A9A] block mt-1">Click to manage</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <h3 className="font-serif text-xl font-semibold text-[#70515A] mb-4">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/gallery"
            className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-2xl p-4 flex items-center gap-3 hover:bg-[#FCEEF2]/50 transition-colors"
          >
            <PlusCircle className="w-5 h-5 text-[#B75F7D]" />
            <div>
              <p className="text-xs font-semibold text-[#70515A]">Upload New Photo</p>
              <p className="text-[11px] text-[#C99A9A]">Add to Scrapbook album</p>
            </div>
          </Link>

          <Link
            to="/admin/timeline"
            className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-2xl p-4 flex items-center gap-3 hover:bg-[#FCEEF2]/50 transition-colors"
          >
            <Clock className="w-5 h-5 text-[#B75F7D]" />
            <div>
              <p className="text-xs font-semibold text-[#70515A]">Add Love Milestone</p>
              <p className="text-[11px] text-[#C99A9A]">Add to Love Story timeline</p>
            </div>
          </Link>

          <Link
            to="/admin/letters"
            className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-2xl p-4 flex items-center gap-3 hover:bg-[#FCEEF2]/50 transition-colors"
          >
            <Mail className="w-5 h-5 text-[#B75F7D]" />
            <div>
              <p className="text-xs font-semibold text-[#70515A]">Compose A Letter</p>
              <p className="text-[11px] text-[#C99A9A]">Personal message from child</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Overview Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Milestones Summary */}
        <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#FCEEF2]">
            <h4 className="font-serif text-lg font-semibold text-[#70515A]">Timeline Milestones ({timeline.length})</h4>
            <Link to="/admin/timeline" className="text-xs font-semibold text-[#B75F7D] hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {timeline.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FCEEF2]/40 text-xs">
                <div>
                  <p className="font-semibold text-[#70515A]">{t.title}</p>
                  <p className="text-[10px] text-[#C99A9A]">{t.milestone_date}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] ${t.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                  {t.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Breakdown Summary */}
        <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#FCEEF2]">
            <h4 className="font-serif text-lg font-semibold text-[#70515A]">Photo Albums ({photos.length} photos)</h4>
            <Link to="/admin/gallery" className="text-xs font-semibold text-[#B75F7D] hover:underline">
              Manage Gallery
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {['wedding', 'family', 'travel', 'special'].map((albumKey) => {
              const count = photos.filter((p) => p.album === albumKey).length;
              return (
                <div key={albumKey} className="p-3 rounded-xl bg-[#FCEEF2]/40 border border-[#F8DCE5]">
                  <span className="capitalize font-semibold text-[#70515A] block">{albumKey}</span>
                  <span className="text-base font-serif font-bold text-[#B75F7D]">{count} photos</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
