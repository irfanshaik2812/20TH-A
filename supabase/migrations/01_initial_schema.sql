-- ==============================================================================
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
  surprise_message TEXT NOT NULL DEFAULT 'Dear Mom and Dad,&#10;&#10;Everything we are today is because of everything you have done for us. Your sacrifices, guidance, patience and unconditional love have made our lives beautiful. You are our greatest blessing and our forever heroes.&#10;&#10;Thank you for being our parents. We love you endlessly.&#10;&#10;HAPPY 20TH WEDDING ANNIVERSARY! ❤️',
  surprise_photos JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. TIMELINE EVENTS TABLE (Alternating milestone love story)
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

-- 3. GALLERY PHOTOS TABLE (Polaroid Scrapbook)
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  caption TEXT,
  photo_url TEXT NOT NULL,
  file_path TEXT,
  album TEXT NOT NULL DEFAULT 'family', -- 'wedding', 'family', 'travel', 'special'
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
  status TEXT NOT NULL DEFAULT 'approved', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. MUSIC TRACKS PLAYLIST (Optional extra audio tracks)
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

-- 8. SITE MEDIA (UPLOAD TRACKER) TABLE
CREATE TABLE IF NOT EXISTS site_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  file_size BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_timeline_events_order ON timeline_events(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_album ON gallery_photos(album, display_order);
CREATE INDEX IF NOT EXISTS idx_letters_order ON letters(display_order);
CREATE INDEX IF NOT EXISTS idx_love_reasons_order ON love_reasons(display_order);
CREATE INDEX IF NOT EXISTS idx_guestbook_status ON guestbook(status, created_at DESC);

-- ==============================================================================
-- STORAGE BUCKETS INITIALIZATION
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('anniversary-photos', 'anniversary-photos', true),
  ('anniversary-audio', 'anniversary-audio', true),
  ('anniversary-videos', 'anniversary-videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Objects Policies (Allow public reading and admin/authorized uploads)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for Anniversary Photos'
  ) THEN
    CREATE POLICY "Public Access for Anniversary Photos" ON storage.objects
      FOR SELECT USING (bucket_id = 'anniversary-photos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for Anniversary Audio'
  ) THEN
    CREATE POLICY "Public Access for Anniversary Audio" ON storage.objects
      FOR SELECT USING (bucket_id = 'anniversary-audio');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for Anniversary Videos'
  ) THEN
    CREATE POLICY "Public Access for Anniversary Videos" ON storage.objects
      FOR SELECT USING (bucket_id = 'anniversary-videos');
  END IF;

  -- Allow uploads to public anniversary buckets
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow Uploads to Anniversary Buckets'
  ) THEN
    CREATE POLICY "Allow Uploads to Anniversary Buckets" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id IN ('anniversary-photos', 'anniversary-audio', 'anniversary-videos'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow Deletes from Anniversary Buckets'
  ) THEN
    CREATE POLICY "Allow Deletes from Anniversary Buckets" ON storage.objects
      FOR DELETE USING (bucket_id IN ('anniversary-photos', 'anniversary-audio', 'anniversary-videos'));
  END IF;
END $$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_media ENABLE ROW LEVEL SECURITY;

-- 1. Site Settings Policies
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin update site_settings" ON site_settings FOR UPDATE USING (true);
CREATE POLICY "Admin insert site_settings" ON site_settings FOR INSERT WITH CHECK (true);

-- 2. Timeline Events Policies
CREATE POLICY "Public read timeline" ON timeline_events FOR SELECT USING (true);
CREATE POLICY "Admin insert timeline" ON timeline_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update timeline" ON timeline_events FOR UPDATE USING (true);
CREATE POLICY "Admin delete timeline" ON timeline_events FOR DELETE USING (true);

-- 3. Gallery Photos Policies
CREATE POLICY "Public read gallery" ON gallery_photos FOR SELECT USING (true);
CREATE POLICY "Admin insert gallery" ON gallery_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update gallery" ON gallery_photos FOR UPDATE USING (true);
CREATE POLICY "Admin delete gallery" ON gallery_photos FOR DELETE USING (true);

-- 4. Letters Policies
CREATE POLICY "Public read letters" ON letters FOR SELECT USING (true);
CREATE POLICY "Admin insert letters" ON letters FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update letters" ON letters FOR UPDATE USING (true);
CREATE POLICY "Admin delete letters" ON letters FOR DELETE USING (true);

-- 5. Love Reasons Policies
CREATE POLICY "Public read reasons" ON love_reasons FOR SELECT USING (true);
CREATE POLICY "Admin insert reasons" ON love_reasons FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update reasons" ON love_reasons FOR UPDATE USING (true);
CREATE POLICY "Admin delete reasons" ON love_reasons FOR DELETE USING (true);

-- 6. Guestbook Policies
CREATE POLICY "Public read guestbook" ON guestbook FOR SELECT USING (true);
CREATE POLICY "Public insert guestbook" ON guestbook FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update guestbook" ON guestbook FOR UPDATE USING (true);
CREATE POLICY "Admin delete guestbook" ON guestbook FOR DELETE USING (true);

-- 7. Music Tracks Policies
CREATE POLICY "Public read music" ON music_tracks FOR SELECT USING (true);
CREATE POLICY "Admin manage music" ON music_tracks FOR ALL USING (true);

-- 8. Site Media Policies
CREATE POLICY "Public read site_media" ON site_media FOR SELECT USING (true);
CREATE POLICY "Admin manage site_media" ON site_media FOR ALL USING (true);

-- ==============================================================================
-- REALTIME SUBSCRIPTIONS
-- Ensures every visitor's screen updates instantly when the admin publishes content
-- ==============================================================================
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE site_settings, timeline_events, gallery_photos, letters, love_reasons, guestbook, music_tracks;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
  WHEN undefined_object THEN
    NULL;
END $$;
