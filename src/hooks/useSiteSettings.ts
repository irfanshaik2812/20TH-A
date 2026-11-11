import { useState, useEffect, useCallback, useRef } from 'react';
import { SiteSettings } from '../types/database';
import { defaultSiteSettings } from '../lib/defaultData';
import { supabase, isSupabaseConfigured, autoSyncSupabaseCredentials } from '../lib/supabase';
import { decodeCelebrationPackageFromUrl } from '../lib/celebrationPackager';

const LOCAL_STORAGE_SETTINGS_KEY = 'anniversary_site_settings';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    if (typeof window !== 'undefined') {
      const pkg = decodeCelebrationPackageFromUrl();
      if (pkg?.site_settings) {
        return { ...defaultSiteSettings, ...pkg.site_settings };
      }

      const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (saved) {
        try {
          return { ...defaultSiteSettings, ...JSON.parse(saved) };
        } catch (e) {
          console.error('Error parsing cached settings:', e);
        }
      }
    }
    return defaultSiteSettings;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const realtimeSubRef = useRef<boolean>(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Ensure server credentials are auto-synced
    await autoSyncSupabaseCredentials();

    // 1. PRIMARY: Fetch from Supabase Cloud Database if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error: supaError } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (!supaError && data) {
          const merged: SiteSettings = {
            ...defaultSiteSettings,
            ...data,
            surprise_photos: Array.isArray(data.surprise_photos)
              ? data.surprise_photos
              : defaultSiteSettings.surprise_photos
          };
          setSettings(merged);
          localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(merged));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, trying fallback:', err);
      }
    }

    // 2. SECONDARY: Check URL portable package
    const pkg = decodeCelebrationPackageFromUrl();
    if (pkg?.site_settings) {
      const merged: SiteSettings = {
        ...defaultSiteSettings,
        ...pkg.site_settings,
        surprise_photos: Array.isArray(pkg.site_settings.surprise_photos)
          ? pkg.site_settings.surprise_photos
          : defaultSiteSettings.surprise_photos
      };
      setSettings(merged);
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(merged));
      setLoading(false);
      return;
    }

    // 3. TERTIARY: Fetch from server API
    try {
      const resp = await fetch('/api/anniversary/data', { cache: 'no-store' });
      if (resp.ok) {
        const json = await resp.json();
        if (json.success && json.site_settings) {
          const merged: SiteSettings = {
            ...defaultSiteSettings,
            ...json.site_settings,
            surprise_photos: Array.isArray(json.site_settings.surprise_photos)
              ? json.site_settings.surprise_photos
              : defaultSiteSettings.surprise_photos
          };
          setSettings(merged);
          localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(merged));
          setLoading(false);
          return;
        }
      }
    } catch {
      // offline fallback
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();

    // Set up Supabase Realtime Listener for instant global updates
    if (isSupabaseConfigured() && supabase && !realtimeSubRef.current) {
      realtimeSubRef.current = true;
      const channel = supabase
        .channel('anniversary_settings_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'site_settings' },
          (payload) => {
            if (payload.new) {
              const updated = payload.new as SiteSettings;
              setSettings((prev) => ({
                ...prev,
                ...updated,
                surprise_photos: Array.isArray(updated.surprise_photos)
                  ? updated.surprise_photos
                  : prev.surprise_photos
              }));
              localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(updated));
            } else {
              fetchSettings();
            }
          }
        )
        .subscribe();

      return () => {
        supabase?.removeChannel(channel);
        realtimeSubRef.current = false;
      };
    }
  }, [fetchSettings]);

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> => {
    try {
      const updated: SiteSettings = {
        ...settings,
        ...newSettings,
        updated_at: new Date().toISOString()
      };

      setSettings(updated);
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(updated));

      // 1. PRIMARY: Persist directly to Supabase Cloud Database
      if (isSupabaseConfigured() && supabase) {
        // Query to check if an id exists
        const { data: existing } = await supabase.from('site_settings').select('id').limit(1).maybeSingle();
        const recordId = existing?.id || updated.id;

        const payload = {
          ...updated,
          ...(recordId ? { id: recordId } : {})
        };

        const { error: supaError } = await supabase
          .from('site_settings')
          .upsert(payload);

        if (supaError) {
          console.warn('Supabase update warning:', supaError.message);
        }
      }

      // 2. Also notify server backend
      try {
        await fetch('/api/anniversary/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'site_settings', value: updated })
        });
      } catch {
        // ignore
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update settings';
      return { success: false, error: message };
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings: fetchSettings
  };
}
