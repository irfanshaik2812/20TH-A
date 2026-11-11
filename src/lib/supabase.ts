import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  defaultSiteSettings,
  defaultTimelineEvents,
  defaultGalleryPhotos,
  defaultLetters,
  defaultLoveReasons
} from './defaultData';

// Retrieve credentials from environment variables or custom runtime config
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Optional override stored by admin in local preferences
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('anniversary_supabase_url') || '' : '';
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('anniversary_supabase_key') || '' : '';

export let supabaseUrl = storedUrl || envUrl;
export let supabaseAnonKey = storedKey || envAnonKey;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('placeholder')
  );
};

export let supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * Re-initialize Supabase client dynamically with given or updated credentials
 */
export function initSupabase(url: string, anonKey: string): SupabaseClient | null {
  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();

  if (cleanUrl && cleanKey && cleanUrl.startsWith('http')) {
    supabaseUrl = cleanUrl;
    supabaseAnonKey = cleanKey;
    supabase = createClient(cleanUrl, cleanKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return supabase;
  }
  supabase = null;
  return null;
}

/**
 * Configure or update Supabase credentials at runtime.
 * Saves to localStorage and also broadcasts to the server so ALL visitors connect to the cloud.
 */
export async function setCustomSupabaseCredentials(url: string, anonKey: string) {
  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();

  if (cleanUrl && cleanKey) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('anniversary_supabase_url', cleanUrl);
      localStorage.setItem('anniversary_supabase_key', cleanKey);
    }
    // Broadcast to server store so other devices visiting the URL receive it
    try {
      await fetch('/api/anniversary/config/supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl, anonKey: cleanKey })
      });
    } catch {
      // offline/Vercel static fallback
    }
  } else {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('anniversary_supabase_url');
      localStorage.removeItem('anniversary_supabase_key');
    }
    try {
      await fetch('/api/anniversary/config/supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: '', anonKey: '' })
      });
    } catch {
      // ignore
    }
  }

  initSupabase(cleanUrl, cleanKey);
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

/**
 * Automatically fetch server-level Supabase credentials if client does not have them
 */
export async function autoSyncSupabaseCredentials(): Promise<boolean> {
  if (isSupabaseConfigured()) return true;

  try {
    const resp = await fetch('/api/anniversary/config');
    if (resp.ok) {
      const cfg = await resp.json();
      if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
        initSupabase(cfg.supabaseUrl, cfg.supabaseAnonKey);
        if (typeof window !== 'undefined') {
          localStorage.setItem('anniversary_supabase_url', cfg.supabaseUrl);
          localStorage.setItem('anniversary_supabase_key', cfg.supabaseAnonKey);
        }
        return true;
      }
    }
  } catch {
    // ignore
  }
  return false;
}

export interface ConnectionTestResult {
  success: boolean;
  databaseOk: boolean;
  storageOk: boolean;
  message: string;
  missingTables: string[];
  missingBuckets: string[];
}

/**
 * Performs a comprehensive health check against Supabase Database and Storage
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      success: false,
      databaseOk: false,
      storageOk: false,
      message: 'Supabase credentials are not configured.',
      missingTables: [],
      missingBuckets: []
    };
  }

  const missingTables: string[] = [];
  const missingBuckets: string[] = [];
  const requiredTables = [
    'site_settings',
    'timeline_events',
    'gallery_photos',
    'letters',
    'love_reasons',
    'guestbook'
  ];

  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
        missingTables.push(table);
      }
    } catch {
      missingTables.push(table);
    }
  }

  const requiredBuckets = ['anniversary-photos', 'anniversary-audio', 'anniversary-videos'];
  for (const bucket of requiredBuckets) {
    try {
      const { error } = await supabase.storage.from(bucket).list('', { limit: 1 });
      if (error && (error.message.includes('not found') || error.message.includes('Bucket not found'))) {
        missingBuckets.push(bucket);
      }
    } catch {
      missingBuckets.push(bucket);
    }
  }

  const databaseOk = missingTables.length === 0;
  const storageOk = missingBuckets.length === 0;

  if (databaseOk && storageOk) {
    return {
      success: true,
      databaseOk: true,
      storageOk: true,
      message: 'Connection successful! Cloud Database and Storage buckets are active and ready.',
      missingTables: [],
      missingBuckets: []
    };
  }

  let details = '';
  if (missingTables.length > 0) {
    details += `Missing tables: ${missingTables.join(', ')}. `;
  }
  if (missingBuckets.length > 0) {
    details += `Missing storage buckets: ${missingBuckets.join(', ')}. `;
  }

  return {
    success: false,
    databaseOk,
    storageOk,
    message: `Connected to Supabase, but schema setup is incomplete. ${details}Please run the migration script in Supabase SQL Editor.`,
    missingTables,
    missingBuckets
  };
}

/**
 * Seeds initial 20th Anniversary data into Supabase if empty
 */
export async function seedDefaultDataToSupabase(): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    // 1. Site Settings
    const { data: existingSettings } = await supabase.from('site_settings').select('id').limit(1);
    if (!existingSettings || existingSettings.length === 0) {
      await supabase.from('site_settings').insert([{
        site_title: defaultSiteSettings.site_title,
        parents_names: defaultSiteSettings.parents_names,
        anniversary_date: defaultSiteSettings.anniversary_date,
        welcome_heading: defaultSiteSettings.welcome_heading,
        welcome_subtitle: defaultSiteSettings.welcome_subtitle,
        welcome_tagline: defaultSiteSettings.welcome_tagline,
        welcome_photo_url: defaultSiteSettings.welcome_photo_url,
        background_music_url: defaultSiteSettings.background_music_url,
        background_music_title: defaultSiteSettings.background_music_title,
        music_enabled: defaultSiteSettings.music_enabled,
        cake_message_title: defaultSiteSettings.cake_message_title,
        cake_message_subtitle: defaultSiteSettings.cake_message_subtitle,
        surprise_heading: defaultSiteSettings.surprise_heading,
        surprise_button_text: defaultSiteSettings.surprise_button_text,
        surprise_video_url: defaultSiteSettings.surprise_video_url,
        surprise_message: defaultSiteSettings.surprise_message,
        surprise_photos: defaultSiteSettings.surprise_photos
      }]);
    }

    // 2. Timeline Events
    const { data: existingTL } = await supabase.from('timeline_events').select('id').limit(1);
    if (!existingTL || existingTL.length === 0) {
      await supabase.from('timeline_events').insert(
        defaultTimelineEvents.map((e) => ({
          milestone_date: e.milestone_date,
          title: e.title,
          description: e.description,
          photo_url: e.photo_url,
          video_url: e.video_url,
          display_order: e.display_order,
          is_published: e.is_published
        }))
      );
    }

    // 3. Gallery Photos
    const { data: existingPhotos } = await supabase.from('gallery_photos').select('id').limit(1);
    if (!existingPhotos || existingPhotos.length === 0) {
      await supabase.from('gallery_photos').insert(
        defaultGalleryPhotos.map((p) => ({
          title: p.title,
          caption: p.caption,
          photo_url: p.photo_url,
          album: p.album,
          date_taken: p.date_taken,
          display_order: p.display_order,
          is_published: p.is_published
        }))
      );
    }

    // 4. Letters
    const { data: existingLetters } = await supabase.from('letters').select('id').limit(1);
    if (!existingLetters || existingLetters.length === 0) {
      await supabase.from('letters').insert(
        defaultLetters.map((l) => ({
          author: l.author,
          relationship: l.relationship,
          title: l.title,
          message: l.message,
          audio_recording_url: l.audio_recording_url,
          display_order: l.display_order,
          is_published: l.is_published
        }))
      );
    }

    // 5. Reasons
    const { data: existingReasons } = await supabase.from('love_reasons').select('id').limit(1);
    if (!existingReasons || existingReasons.length === 0) {
      await supabase.from('love_reasons').insert(
        defaultLoveReasons.map((r) => ({
          title: r.title,
          message: r.message,
          icon_name: r.icon_name,
          display_order: r.display_order,
          is_published: r.is_published
        }))
      );
    }

    return {
      success: true,
      message: 'Database seeded successfully with 20th Anniversary content!'
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to seed database';
    return { success: false, message: msg };
  }
}
