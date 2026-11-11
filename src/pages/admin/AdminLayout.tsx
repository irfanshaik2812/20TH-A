import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  LayoutDashboard,
  Home,
  Image,
  Clock,
  Mail,
  Heart,
  Music,
  Gift,
  MessageCircleHeart,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database,
  Cloud,
  Share2
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { signOut, adminEmail } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isCloud = isSupabaseConfigured();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Shareable Links', path: '/admin/share', icon: Share2 },
    { label: 'Welcome & Homepage', path: '/admin/homepage', icon: Home },
    { label: 'Photo Gallery', path: '/admin/gallery', icon: Image },
    { label: 'Timeline Milestones', path: '/admin/timeline', icon: Clock },
    { label: 'Letters From Children', path: '/admin/letters', icon: Mail },
    { label: 'Reasons We Love You', path: '/admin/reasons', icon: Heart },
    { label: 'Background Music', path: '/admin/music', icon: Music },
    { label: 'Surprise & Video', path: '/admin/surprise', icon: Gift },
    { label: 'Guestbook Moderation', path: '/admin/guestbook', icon: MessageCircleHeart },
    { label: 'Website Settings', path: '/admin/settings', icon: SettingsIcon }
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col md:flex-row text-[#70515A]">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#FFFDF9] border-b border-[#F8DCE5] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="font-cursive text-2xl text-[#B75F7D]">Forever Together</span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FCEEF2] text-[#B75F7D] px-2 py-0.5 rounded-full border border-[#F8DCE5]">
            Admin
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-[#70515A] hover:text-[#B75F7D]"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#FFFDF9] border-r border-[#F8DCE5] p-5 flex flex-col justify-between z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="mb-6 pb-4 border-b border-[#F8DCE5]">
            <Link to="/admin" className="block">
              <span className="font-cursive text-3xl text-[#B75F7D] block">Forever Together</span>
              <span className="text-xs font-semibold text-[#70515A]/80 tracking-wide">
                Anniversary Admin Suite
              </span>
            </Link>

            {/* Supabase connection indicator */}
            <div className="mt-3 flex items-center gap-2 text-[11px] px-2.5 py-1.5 rounded-xl bg-[#FCEEF2] border border-[#F8DCE5]">
              {isCloud ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-800 font-medium truncate">Supabase Cloud Active</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-[#B75F7D]" />
                  <span className="text-[#70515A] font-medium truncate">Local Storage Mode</span>
                </>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? currentPath === '/admin'
                  : currentPath.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#B75F7D] text-white shadow-xs'
                      : 'text-[#70515A] hover:bg-[#FCEEF2] hover:text-[#B75F7D]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-[#F8DCE5] space-y-2">
          {adminEmail && (
            <div className="text-[11px] text-[#C99A9A] truncate px-2" title={adminEmail}>
              Logged in as: {adminEmail}
            </div>
          )}

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-[#70515A] hover:text-[#B75F7D] hover:bg-[#FCEEF2] rounded-xl transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] text-[#C99A9A]">View</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
