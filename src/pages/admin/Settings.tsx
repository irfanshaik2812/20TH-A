import React, { useState } from 'react';
import {
  supabaseUrl,
  supabaseAnonKey,
  isSupabaseConfigured,
  setCustomSupabaseCredentials,
  testSupabaseConnection,
  seedDefaultDataToSupabase,
  ConnectionTestResult
} from '../../lib/supabase';
import { useAnniversaryData } from '../../hooks/useAnniversaryData';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import {
  Database,
  Cloud,
  Save,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Key,
  Globe,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Server,
  Layers,
  HardDrive
} from 'lucide-react';

const SQL_SCHEMA_SCRIPT = `-- ==============================================================================
-- FOREVER TOGETHER ❤️ - SUPABASE DATABASE & STORAGE COMPLETE SCHEMA MIGRATION
-- Parents' 20th Wedding Anniversary Application (November 12, 2006 – 2026)
-- Run this script in your Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title TEXT NOT NULL DEFAULT 'Forever Together',
  parents_names TEXT NOT NULL DEFAULT 'Mom & Dad',
  anniversary_date TIMESTAMPTZ NOT NULL DEFAULT '2026-11-12 00:00:00+05:30',
  welcome_heading TEXT NOT NULL DEFAULT 'To The Two People Who Mean The World To Us',
  welcome_subtitle TEXT NOT NULL DEFAULT 'Happy 20th Wedding Anniversary ❤️',
  welcome_tagline TEXT NOT NULL DEFAULT 'A little surprise awaits you...',
  welcome_photo_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
  background_music_url TEXT DEFAULT 'https://cdn.freesound.org/previews/612/612089_5674468-lq.mp3',
  background_music_title TEXT DEFAULT 'A Thousand Years (Instrumental Romance)',
  music_enabled BOOLEAN DEFAULT true,
  cake_message_title TEXT NOT NULL DEFAULT 'Happy 20th Anniversary, Mom & Dad!',
  cake_message_subtitle TEXT NOT NULL DEFAULT 'May your love continue to grow stronger with every passing year.',
  surprise_heading TEXT NOT NULL DEFAULT 'One Last Surprise Awaits You...',
  surprise_button_text TEXT NOT NULL DEFAULT 'OPEN YOUR SURPRISE ❤️',
  surprise_video_url TEXT DEFAULT 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  surprise_message TEXT NOT NULL DEFAULT 'Dear Mom and Dad, Everything we are today is because of everything you have done for us. HAPPY 20TH WEDDING ANNIVERSARY! ❤️',
  surprise_photos JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. TIMELINE EVENTS TABLE
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milestone_date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  file_path TEXT,
  video_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. GALLERY PHOTOS TABLE
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  caption TEXT,
  photo_url TEXT NOT NULL,
  file_path TEXT,
  album TEXT NOT NULL DEFAULT 'family',
  date_taken TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. LETTERS FROM CHILDREN TABLE
CREATE TABLE IF NOT EXISTS letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author TEXT NOT NULL,
  relationship TEXT NOT NULL DEFAULT 'Your Child',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  audio_recording_url TEXT,
  file_path TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. REASONS WHY WE LOVE YOU TABLE
CREATE TABLE IF NOT EXISTS love_reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Heart',
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. DIGITAL GUESTBOOK TABLE
CREATE TABLE IF NOT EXISTS guestbook (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  message TEXT NOT NULL,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. MUSIC TRACKS PLAYLIST TABLE
CREATE TABLE IF NOT EXISTS music_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT DEFAULT 'Instrumental',
  file_url TEXT NOT NULL,
  file_path TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. STORAGE BUCKETS (Public Read)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('anniversary-photos', 'anniversary-photos', true),
  ('anniversary-audio', 'anniversary-audio', true),
  ('anniversary-videos', 'anniversary-videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Objects Policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for Anniversary Photos') THEN
    CREATE POLICY "Public Access for Anniversary Photos" ON storage.objects FOR SELECT USING (bucket_id = 'anniversary-photos');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for Anniversary Audio') THEN
    CREATE POLICY "Public Access for Anniversary Audio" ON storage.objects FOR SELECT USING (bucket_id = 'anniversary-audio');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for Anniversary Videos') THEN
    CREATE POLICY "Public Access for Anniversary Videos" ON storage.objects FOR SELECT USING (bucket_id = 'anniversary-videos');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow Uploads to Anniversary Buckets') THEN
    CREATE POLICY "Allow Uploads to Anniversary Buckets" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('anniversary-photos', 'anniversary-audio', 'anniversary-videos'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow Deletes from Anniversary Buckets') THEN
    CREATE POLICY "Allow Deletes from Anniversary Buckets" ON storage.objects FOR DELETE USING (bucket_id IN ('anniversary-photos', 'anniversary-audio', 'anniversary-videos'));
  END IF;
END $$;

-- Enable Row Level Security & Open Policies for Family Anniversary Site
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public all site_settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Public all timeline_events" ON timeline_events FOR ALL USING (true);
CREATE POLICY "Public all gallery_photos" ON gallery_photos FOR ALL USING (true);
CREATE POLICY "Public all letters" ON letters FOR ALL USING (true);
CREATE POLICY "Public all love_reasons" ON love_reasons FOR ALL USING (true);
CREATE POLICY "Public all guestbook" ON guestbook FOR ALL USING (true);
CREATE POLICY "Public all music_tracks" ON music_tracks FOR ALL USING (true);

-- Enable Realtime Broadcast for Live Visitor Sync
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE site_settings, timeline_events, gallery_photos, letters, love_reasons, guestbook, music_tracks;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;
`;

export const Settings: React.FC = () => {
  const { timeline, photos, letters, reasons, guestbook } = useAnniversaryData();
  const { settings } = useSiteSettings();

  const [url, setUrl] = useState(supabaseUrl);
  const [anonKey, setAnonKey] = useState(supabaseAnonKey);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);

  const [seeding, setSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const isConnected = isSupabaseConfigured();

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setNotification({ type: 'error', text: 'Please provide both Supabase Project URL and Anon API Key.' });
      return;
    }

    try {
      await setCustomSupabaseCredentials(url, anonKey);
      setNotification({
        type: 'success',
        text: 'Credentials saved! Reconnecting to your Supabase instance across all devices.'
      });
    } catch {
      setNotification({ type: 'error', text: 'Could not store credentials.' });
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm('Disconnect Supabase credentials and revert to local storage mode?')) {
      await setCustomSupabaseCredentials('', '');
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    setNotification(null);

    const result = await testSupabaseConnection();
    setTestResult(result);
    setTesting(false);

    if (result.success) {
      setNotification({
        type: 'success',
        text: 'All Supabase tables and storage buckets are online and ready!'
      });
    } else {
      setNotification({
        type: 'error',
        text: result.message
      });
    }
  };

  const handleSeedDatabase = async () => {
    if (!isConnected) {
      setNotification({
        type: 'error',
        text: 'Please connect to Supabase first before seeding.'
      });
      return;
    }

    if (window.confirm('Seed your cloud Supabase database with 20th Anniversary starter content? This will populate empty tables with milestones, scrapbooks, and love letters.')) {
      setSeeding(true);
      const res = await seedDefaultDataToSupabase();
      setSeeding(false);

      if (res.success) {
        setNotification({ type: 'success', text: res.message });
      } else {
        setNotification({ type: 'error', text: res.message });
      }
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleExportBackup = () => {
    const backupData = {
      exported_at: new Date().toISOString(),
      site_settings: settings,
      timeline_events: timeline,
      gallery_photos: photos,
      letters: letters,
      love_reasons: reasons,
      guestbook_entries: guestbook
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `Forever_Together_Anniversary_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(blobUrl);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all local content back to romantic defaults? Any unsaved edits will be restored.')) {
      localStorage.removeItem('anniversary_site_settings');
      localStorage.removeItem('anniversary_timeline_events');
      localStorage.removeItem('anniversary_gallery_photos');
      localStorage.removeItem('anniversary_letters');
      localStorage.removeItem('anniversary_love_reasons');
      localStorage.removeItem('anniversary_guestbook_entries');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="pb-4 border-b border-[#F8DCE5]">
        <h1 className="font-serif text-3xl font-bold text-[#70515A]">Centralized Cloud & Database Settings</h1>
        <p className="text-xs text-[#70515A]/70 mt-1">
          Configure Supabase Database, Cloud Storage buckets, and Realtime synchronization so all changes are globally visible to every visitor.
        </p>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Supabase Connection Status Card */}
      <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#FCEEF2] gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-[#FCEEF2] text-[#B75F7D]'
            }`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#70515A]">
                Supabase Centralized Backend
              </h3>
              <p className="text-xs text-[#70515A]/70">
                {isConnected
                  ? 'Connected to your cloud PostgreSQL database & Storage'
                  : 'Operating in Local Mode. Connect Supabase to sync photos & music globally to all devices.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              isConnected
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isConnected ? 'Cloud Sync Active' : 'Local Demo Mode'}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-[#70515A] mb-1">
              Supabase Project URL *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[#FFFDF9] border border-[#F8DCE5] focus:border-[#B75F7D] rounded-xl px-3.5 py-2 text-xs text-[#70515A] focus:outline-none"
              />
              <Globe className="w-4 h-4 text-[#C99A9A] absolute right-3.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#70515A] mb-1">
              Supabase Anon Public API Key *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full bg-[#FFFDF9] border border-[#F8DCE5] focus:border-[#B75F7D] rounded-xl px-3.5 py-2 text-xs text-[#70515A] focus:outline-none font-mono"
              />
              <Key className="w-4 h-4 text-[#C99A9A] absolute right-3.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#FCEEF2]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing || !url.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#70515A] bg-[#FCEEF2] hover:bg-[#F8DCE5] border border-[#F8DCE5] transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Checking Connection...' : 'Test Cloud Connection'}</span>
              </button>

              {isConnected && (
                <button
                  type="button"
                  onClick={handleSeedDatabase}
                  disabled={seeding}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#B75F7D] bg-white hover:bg-[#FCEEF2] border border-[#F8DCE5] transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{seeding ? 'Seeding Content...' : 'Seed 20th Content to Cloud'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {isConnected && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                >
                  Disconnect
                </button>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#B75F7D] hover:bg-[#9E4B66] shadow-xs transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Connect Supabase</span>
              </button>
            </div>
          </div>
        </form>

        {/* Test Connection Diagnostics Box */}
        {testResult && (
          <div className={`mt-6 p-4 rounded-2xl border text-left text-xs ${
            testResult.success
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-rose-50/70 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-2">
              {testResult.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{testResult.message}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-current/20">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 shrink-0" />
                <span>Database Tables: {testResult.databaseOk ? '✓ All Online' : `✗ Missing: ${testResult.missingTables.join(', ')}`}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 shrink-0" />
                <span>Storage Buckets: {testResult.storageOk ? '✓ Active' : `✗ Missing: ${testResult.missingBuckets.join(', ')}`}</span>
              </div>
            </div>
          </div>
        )}

        {/* 1-Click SQL Migration Setup */}
        <div className="mt-8 pt-6 border-t border-[#F8DCE5] text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h4 className="text-xs font-bold text-[#70515A] uppercase tracking-wider">
                1-Step Supabase Database Setup
              </h4>
              <p className="text-xs text-[#70515A]/80">
                Copy this SQL and paste it into your Supabase Dashboard (<span className="font-semibold">SQL Editor → New Query → Run</span>).
              </p>
            </div>

            <button
              onClick={handleCopySql}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#B75F7D] hover:bg-[#9E4B66] shadow-xs shrink-0 transition-all cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'SQL Script Copied!' : 'Copy SQL Schema Script'}</span>
            </button>
          </div>

          <div className="bg-[#2A2024] rounded-2xl p-4 text-[11px] font-mono text-[#F8DCE5] overflow-x-auto max-h-48 border border-[#70515A]/30">
            <pre>{SQL_SCHEMA_SCRIPT.slice(0, 600)}...&#10;-- Click "Copy SQL Schema Script" above for the complete schema</pre>
          </div>
        </div>
      </div>

      {/* Data Backup & Restore */}
      <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 sm:p-8 shadow-xs">
        <h3 className="font-serif text-xl font-bold text-[#70515A] mb-2">
          Data Export & Defaults
        </h3>
        <p className="text-xs text-[#70515A]/70 mb-6">
          Download a complete JSON snapshot of all family letters, timeline milestones, photos, and guestbook wishes.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleExportBackup}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#70515A] bg-[#FCEEF2] hover:bg-[#F8DCE5] border border-[#F8DCE5] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#B75F7D]" />
            <span>Export JSON Archive</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Local Content to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
