import { useState, useEffect, useCallback, useRef } from 'react';
import {
  TimelineEvent,
  GalleryPhoto,
  Letter,
  LoveReason,
  GuestbookEntry,
  AdminAnalytics
} from '../types/database';
import {
  defaultTimelineEvents,
  defaultGalleryPhotos,
  defaultLetters,
  defaultLoveReasons,
  defaultGuestbookEntries
} from '../lib/defaultData';
import {
  supabase,
  isSupabaseConfigured,
  autoSyncSupabaseCredentials
} from '../lib/supabase';
import {
  encodeCelebrationPackage,
  decodeCelebrationPackageFromUrl
} from '../lib/celebrationPackager';
import { deleteMediaFile } from '../lib/storage';

const STORAGE_KEYS = {
  TIMELINE: 'anniversary_timeline_events',
  GALLERY: 'anniversary_gallery_photos',
  LETTERS: 'anniversary_letters',
  REASONS: 'anniversary_love_reasons',
  GUESTBOOK: 'anniversary_guestbook_entries'
};

function getLocalData<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    if (raw.includes('1996') || raw.includes('Silver Jubilee')) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function setLocalData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
}

const initialPkg = typeof window !== 'undefined' ? decodeCelebrationPackageFromUrl() : null;

export function useAnniversaryData(options?: { onlyPublished?: boolean }) {
  const onlyPublished = options?.onlyPublished ?? false;

  const [timeline, setTimeline] = useState<TimelineEvent[]>(() =>
    initialPkg?.timeline_events && initialPkg.timeline_events.length > 0
      ? initialPkg.timeline_events
      : getLocalData(STORAGE_KEYS.TIMELINE, defaultTimelineEvents)
  );
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() =>
    initialPkg?.gallery_photos && initialPkg.gallery_photos.length > 0
      ? initialPkg.gallery_photos
      : getLocalData(STORAGE_KEYS.GALLERY, defaultGalleryPhotos)
  );
  const [letters, setLetters] = useState<Letter[]>(() =>
    initialPkg?.letters && initialPkg.letters.length > 0
      ? initialPkg.letters
      : getLocalData(STORAGE_KEYS.LETTERS, defaultLetters)
  );
  const [reasons, setReasons] = useState<LoveReason[]>(() =>
    initialPkg?.love_reasons && initialPkg.love_reasons.length > 0
      ? initialPkg.love_reasons
      : getLocalData(STORAGE_KEYS.REASONS, defaultLoveReasons)
  );
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(() =>
    initialPkg?.guestbook && initialPkg.guestbook.length > 0
      ? initialPkg.guestbook
      : getLocalData(STORAGE_KEYS.GUESTBOOK, defaultGuestbookEntries)
  );
  const [loading, setLoading] = useState(true);
  const realtimeSubRef = useRef<boolean>(false);

  // Server persistence helper for offline/hybrid mode
  const saveToServer = async (key: string, value: unknown) => {
    try {
      await fetch('/api/anniversary/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
    } catch {
      // ignore
    }
  };

  // Fetch all collections from Supabase Cloud or server database
  const refreshAll = useCallback(async () => {
    setLoading(true);

    // Auto-sync Supabase credentials from backend if not yet in client
    await autoSyncSupabaseCredentials();

    // 1. PRIMARY: Fetch directly from Supabase Cloud PostgreSQL Database
    if (isSupabaseConfigured() && supabase) {
      try {
        let tlQuery = supabase.from('timeline_events').select('*').order('display_order', { ascending: true });
        let galQuery = supabase.from('gallery_photos').select('*').order('display_order', { ascending: true });
        let letQuery = supabase.from('letters').select('*').order('display_order', { ascending: true });
        let rsnQuery = supabase.from('love_reasons').select('*').order('display_order', { ascending: true });
        let gbQuery = supabase.from('guestbook').select('*').order('created_at', { ascending: false });

        if (onlyPublished) {
          tlQuery = tlQuery.eq('is_published', true);
          galQuery = galQuery.eq('is_published', true);
          letQuery = letQuery.eq('is_published', true);
          rsnQuery = rsnQuery.eq('is_published', true);
          gbQuery = gbQuery.eq('status', 'approved');
        }

        const [
          { data: tlData, error: tlErr },
          { data: galData, error: galErr },
          { data: letData, error: letErr },
          { data: rsnData, error: rsnErr },
          { data: gbData, error: gbErr }
        ] = await Promise.all([tlQuery, galQuery, letQuery, rsnQuery, gbQuery]);

        let hasAnyData = false;

        if (!tlErr && tlData) {
          setTimeline(tlData);
          setLocalData(STORAGE_KEYS.TIMELINE, tlData);
          if (tlData.length > 0) hasAnyData = true;
        }
        if (!galErr && galData) {
          setPhotos(galData);
          setLocalData(STORAGE_KEYS.GALLERY, galData);
          if (galData.length > 0) hasAnyData = true;
        }
        if (!letErr && letData) {
          setLetters(letData);
          setLocalData(STORAGE_KEYS.LETTERS, letData);
          if (letData.length > 0) hasAnyData = true;
        }
        if (!rsnErr && rsnData) {
          setReasons(rsnData);
          setLocalData(STORAGE_KEYS.REASONS, rsnData);
          if (rsnData.length > 0) hasAnyData = true;
        }
        if (!gbErr && gbData) {
          setGuestbook(gbData);
          setLocalData(STORAGE_KEYS.GUESTBOOK, gbData);
          if (gbData.length > 0) hasAnyData = true;
        }

        if (hasAnyData) {
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase query error, continuing to fallback:', err);
      }
    }

    // 2. SECONDARY: Universal Portable Package from URL hash/param
    const pkg = decodeCelebrationPackageFromUrl();
    if (pkg) {
      if (pkg.timeline_events && pkg.timeline_events.length > 0) {
        setTimeline(pkg.timeline_events);
        setLocalData(STORAGE_KEYS.TIMELINE, pkg.timeline_events);
      }
      if (pkg.gallery_photos && pkg.gallery_photos.length > 0) {
        setPhotos(pkg.gallery_photos);
        setLocalData(STORAGE_KEYS.GALLERY, pkg.gallery_photos);
      }
      if (pkg.letters && pkg.letters.length > 0) {
        setLetters(pkg.letters);
        setLocalData(STORAGE_KEYS.LETTERS, pkg.letters);
      }
      if (pkg.love_reasons && pkg.love_reasons.length > 0) {
        setReasons(pkg.love_reasons);
        setLocalData(STORAGE_KEYS.REASONS, pkg.love_reasons);
      }
      if (pkg.guestbook && pkg.guestbook.length > 0) {
        setGuestbook(pkg.guestbook);
        setLocalData(STORAGE_KEYS.GUESTBOOK, pkg.guestbook);
      }
      setLoading(false);
      return;
    }

    // 3. TERTIARY: Fetch live data from backend server database
    try {
      const resp = await fetch('/api/anniversary/data', { cache: 'no-store' });
      if (resp.ok) {
        const json = await resp.json();
        if (json.success) {
          if (json.timeline_events && json.timeline_events.length > 0) {
            setTimeline(json.timeline_events);
            setLocalData(STORAGE_KEYS.TIMELINE, json.timeline_events);
          }
          if (json.gallery_photos && json.gallery_photos.length > 0) {
            setPhotos(json.gallery_photos);
            setLocalData(STORAGE_KEYS.GALLERY, json.gallery_photos);
          }
          if (json.letters && json.letters.length > 0) {
            setLetters(json.letters);
            setLocalData(STORAGE_KEYS.LETTERS, json.letters);
          }
          if (json.love_reasons && json.love_reasons.length > 0) {
            setReasons(json.love_reasons);
            setLocalData(STORAGE_KEYS.REASONS, json.love_reasons);
          }
          if (json.guestbook && json.guestbook.length > 0) {
            setGuestbook(json.guestbook);
            setLocalData(STORAGE_KEYS.GUESTBOOK, json.guestbook);
          }
        }
      }
    } catch {
      // offline fallback
    }

    setLoading(false);
  }, [onlyPublished]);

  useEffect(() => {
    refreshAll();

    // Set up Supabase Realtime listener to sync across all open devices in real time
    if (isSupabaseConfigured() && supabase && !realtimeSubRef.current) {
      realtimeSubRef.current = true;
      const channel = supabase
        .channel('anniversary_global_sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'timeline_events' }, () => refreshAll())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_photos' }, () => refreshAll())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'letters' }, () => refreshAll())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'love_reasons' }, () => refreshAll())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'guestbook' }, () => refreshAll())
        .subscribe();

      return () => {
        supabase?.removeChannel(channel);
        realtimeSubRef.current = false;
      };
    }
  }, [refreshAll]);

  // =========================================================================
  // GALLERY PHOTO ACTIONS (Full Cloud Sync)
  // =========================================================================
  const addPhoto = async (photo: Omit<GalleryPhoto, 'id'>) => {
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: `gal-${Date.now()}`
    };

    const updated = [...photos, newPhoto].sort((a, b) => a.display_order - b.display_order);
    setPhotos(updated);
    setLocalData(STORAGE_KEYS.GALLERY, updated);
    await saveToServer('gallery_photos', updated);

    // Save directly to Supabase Cloud Database
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('gallery_photos').insert([{
          title: photo.title,
          caption: photo.caption || null,
          photo_url: photo.photo_url,
          album: photo.album,
          date_taken: photo.date_taken || null,
          display_order: photo.display_order,
          is_published: photo.is_published
        }]).select().single();

        if (error) {
          console.warn('Supabase insert gallery error:', error.message);
        } else if (data) {
          // Update local state with real Supabase record
          setPhotos((prev) => prev.map((p) => (p.id === newPhoto.id ? data : p)));
          return data;
        }
      } catch (err) {
        console.warn('Supabase gallery insert exception:', err);
      }
    }

    return newPhoto;
  };

  const updatePhoto = async (id: string, updates: Partial<GalleryPhoto>) => {
    const updated = photos.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setPhotos(updated);
    setLocalData(STORAGE_KEYS.GALLERY, updated);
    await saveToServer('gallery_photos', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('gallery_photos').update(updates).eq('id', id);
        if (error) console.warn('Supabase update photo error:', error.message);
      } catch (err) {
        console.warn('Supabase photo update exception:', err);
      }
    }
  };

  const deletePhoto = async (id: string) => {
    const target = photos.find((p) => p.id === id);
    const updated = photos.filter((item) => item.id !== id);
    setPhotos(updated);
    setLocalData(STORAGE_KEYS.GALLERY, updated);
    await saveToServer('gallery_photos', updated);

    // 1. Delete from Supabase Storage if file_path exists
    if (target?.photo_url && target.photo_url.includes('/anniversary-photos/')) {
      const match = target.photo_url.match(/anniversary-photos\/(.+)$/);
      if (match && match[1]) {
        await deleteMediaFile('anniversary-photos', match[1]);
      }
    }

    // 2. Delete from Supabase Database
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('gallery_photos').delete().eq('id', id);
        if (error) console.warn('Supabase delete photo error:', error.message);
      } catch (err) {
        console.warn('Supabase photo delete exception:', err);
      }
    }
  };

  const togglePublishPhoto = async (id: string, currentlyPublished: boolean) => {
    await updatePhoto(id, { is_published: !currentlyPublished });
  };

  // =========================================================================
  // TIMELINE ACTIONS
  // =========================================================================
  const addTimelineEvent = async (event: Omit<TimelineEvent, 'id'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: `tl-${Date.now()}`
    };
    const updated = [...timeline, newEvent].sort((a, b) => a.display_order - b.display_order);
    setTimeline(updated);
    setLocalData(STORAGE_KEYS.TIMELINE, updated);
    await saveToServer('timeline_events', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('timeline_events').insert([{
          milestone_date: event.milestone_date,
          title: event.title,
          description: event.description,
          photo_url: event.photo_url || null,
          video_url: event.video_url || null,
          display_order: event.display_order,
          is_published: event.is_published
        }]).select().single();

        if (error) console.warn('Supabase insert timeline error:', error.message);
        else if (data) {
          setTimeline((prev) => prev.map((t) => (t.id === newEvent.id ? data : t)));
          return data;
        }
      } catch (err) {
        console.warn('Supabase timeline exception:', err);
      }
    }

    return newEvent;
  };

  const updateTimelineEvent = async (id: string, updates: Partial<TimelineEvent>) => {
    const updated = timeline.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setTimeline(updated);
    setLocalData(STORAGE_KEYS.TIMELINE, updated);
    await saveToServer('timeline_events', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('timeline_events').update(updates).eq('id', id);
        if (error) console.warn('Supabase update timeline error:', error.message);
      } catch (err) {
        console.warn('Supabase timeline update exception:', err);
      }
    }
  };

  const deleteTimelineEvent = async (id: string) => {
    const updated = timeline.filter((item) => item.id !== id);
    setTimeline(updated);
    setLocalData(STORAGE_KEYS.TIMELINE, updated);
    await saveToServer('timeline_events', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('timeline_events').delete().eq('id', id);
        if (error) console.warn('Supabase delete timeline error:', error.message);
      } catch (err) {
        console.warn('Supabase timeline delete exception:', err);
      }
    }
  };

  // =========================================================================
  // LETTERS ACTIONS
  // =========================================================================
  const addLetter = async (letter: Omit<Letter, 'id'>) => {
    const newLetter: Letter = {
      ...letter,
      id: `let-${Date.now()}`
    };
    const updated = [...letters, newLetter].sort((a, b) => a.display_order - b.display_order);
    setLetters(updated);
    setLocalData(STORAGE_KEYS.LETTERS, updated);
    await saveToServer('letters', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('letters').insert([{
          author: letter.author,
          relationship: letter.relationship,
          title: letter.title,
          message: letter.message,
          audio_recording_url: letter.audio_recording_url || null,
          display_order: letter.display_order,
          is_published: letter.is_published
        }]).select().single();

        if (error) console.warn('Supabase insert letter error:', error.message);
        else if (data) {
          setLetters((prev) => prev.map((l) => (l.id === newLetter.id ? data : l)));
          return data;
        }
      } catch (err) {
        console.warn('Supabase letter exception:', err);
      }
    }

    return newLetter;
  };

  const updateLetter = async (id: string, updates: Partial<Letter>) => {
    const updated = letters.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setLetters(updated);
    setLocalData(STORAGE_KEYS.LETTERS, updated);
    await saveToServer('letters', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('letters').update(updates).eq('id', id);
        if (error) console.warn('Supabase update letter error:', error.message);
      } catch (err) {
        console.warn('Supabase letter update exception:', err);
      }
    }
  };

  const deleteLetter = async (id: string) => {
    const updated = letters.filter((item) => item.id !== id);
    setLetters(updated);
    setLocalData(STORAGE_KEYS.LETTERS, updated);
    await saveToServer('letters', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('letters').delete().eq('id', id);
        if (error) console.warn('Supabase delete letter error:', error.message);
      } catch (err) {
        console.warn('Supabase letter delete exception:', err);
      }
    }
  };

  // =========================================================================
  // LOVE REASONS ACTIONS
  // =========================================================================
  const addLoveReason = async (reason: Omit<LoveReason, 'id'>) => {
    const newReason: LoveReason = {
      ...reason,
      id: `rsn-${Date.now()}`
    };
    const updated = [...reasons, newReason].sort((a, b) => a.display_order - b.display_order);
    setReasons(updated);
    setLocalData(STORAGE_KEYS.REASONS, updated);
    await saveToServer('love_reasons', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('love_reasons').insert([{
          title: reason.title,
          message: reason.message,
          icon_name: reason.icon_name,
          display_order: reason.display_order,
          is_published: reason.is_published
        }]).select().single();

        if (error) console.warn('Supabase insert reason error:', error.message);
        else if (data) {
          setReasons((prev) => prev.map((r) => (r.id === newReason.id ? data : r)));
          return data;
        }
      } catch (err) {
        console.warn('Supabase reason exception:', err);
      }
    }

    return newReason;
  };

  const updateLoveReason = async (id: string, updates: Partial<LoveReason>) => {
    const updated = reasons.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setReasons(updated);
    setLocalData(STORAGE_KEYS.REASONS, updated);
    await saveToServer('love_reasons', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('love_reasons').update(updates).eq('id', id);
        if (error) console.warn('Supabase update reason error:', error.message);
      } catch (err) {
        console.warn('Supabase reason update exception:', err);
      }
    }
  };

  const deleteLoveReason = async (id: string) => {
    const updated = reasons.filter((item) => item.id !== id);
    setReasons(updated);
    setLocalData(STORAGE_KEYS.REASONS, updated);
    await saveToServer('love_reasons', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('love_reasons').delete().eq('id', id);
        if (error) console.warn('Supabase delete reason error:', error.message);
      } catch (err) {
        console.warn('Supabase reason delete exception:', err);
      }
    }
  };

  // =========================================================================
  // GUESTBOOK ACTIONS
  // =========================================================================
  const submitGuestbookWish = async (wish: {
    visitor_name: string;
    relationship: string;
    message: string;
    photo_url?: string | null;
  }) => {
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      visitor_name: wish.visitor_name,
      relationship: wish.relationship,
      message: wish.message,
      photo_url: wish.photo_url || null,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const updated = [newEntry, ...guestbook];
    setGuestbook(updated);
    setLocalData(STORAGE_KEYS.GUESTBOOK, updated);
    await saveToServer('guestbook', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: supaErr } = await supabase.from('guestbook').insert([{
          visitor_name: wish.visitor_name,
          relationship: wish.relationship,
          message: wish.message,
          photo_url: wish.photo_url || null,
          status: 'pending'
        }]);
        if (supaErr) console.warn('Supabase insert wish warning:', supaErr.message);
      } catch (err) {
        console.warn('Supabase wish exception:', err);
      }
    }

    return { success: true };
  };

  const moderateGuestbookWish = async (id: string, status: 'approved' | 'rejected') => {
    const updated = guestbook.map((entry) => (entry.id === id ? { ...entry, status } : entry));
    setGuestbook(updated);
    setLocalData(STORAGE_KEYS.GUESTBOOK, updated);
    await saveToServer('guestbook', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('guestbook').update({ status }).eq('id', id);
        if (error) console.warn('Supabase moderate wish error:', error.message);
      } catch (err) {
        console.warn('Supabase wish moderation exception:', err);
      }
    }
  };

  const deleteGuestbookWish = async (id: string) => {
    const updated = guestbook.filter((entry) => entry.id !== id);
    setGuestbook(updated);
    setLocalData(STORAGE_KEYS.GUESTBOOK, updated);
    await saveToServer('guestbook', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('guestbook').delete().eq('id', id);
        if (error) console.warn('Supabase delete wish error:', error.message);
      } catch (err) {
        console.warn('Supabase wish delete exception:', err);
      }
    }
  };

  // Generate a dedicated shareable link
  const createShareableLink = async (options: {
    slug?: string;
    title?: string;
    note?: string;
    isParentViewOnly?: boolean;
    baseUrlOverride?: string;
  }): Promise<{
    success: boolean;
    shareUrl?: string;
    universalUrl?: string;
    slugUrl?: string;
    slug?: string;
    error?: string;
  }> => {
    try {
      let publicOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      try {
        const cfgResp = await fetch('/api/anniversary/config');
        if (cfgResp.ok) {
          const cfg = await cfgResp.json();
          if (cfg.appUrl && !publicOrigin.includes('localhost') && !publicOrigin.includes('127.0.0.1')) {
            publicOrigin = cfg.appUrl;
          } else if (cfg.sharedUrl) {
            publicOrigin = cfg.sharedUrl;
          }
        }
      } catch {
        // ignore
      }

      if (options.baseUrlOverride && options.baseUrlOverride.trim()) {
        publicOrigin = options.baseUrlOverride.trim().replace(/\/$/, '');
      }

      let currentSettings = undefined;
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('anniversary_site_settings');
          if (raw) currentSettings = JSON.parse(raw);
        } catch {
          // ignore
        }
      }

      const encodedPackage = encodeCelebrationPackage({
        site_settings: currentSettings,
        timeline_events: timeline,
        gallery_photos: photos,
        letters,
        love_reasons: reasons,
        guestbook
      });

      const universalUrl = `${publicOrigin}/?view=parents#gift=${encodedPackage}`;
      let serverSlugUrl = universalUrl;

      const resp = await fetch('/api/anniversary/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: options.slug,
          title: options.title,
          note: options.note,
          isParentViewOnly: options.isParentViewOnly,
          customSettings: {
            site_settings: currentSettings,
            timeline_events: timeline,
            gallery_photos: photos,
            letters,
            love_reasons: reasons,
            guestbook
          }
        })
      });

      const json = await resp.json();
      if (json.success) {
        serverSlugUrl = `${publicOrigin}${json.sharePath}`;
        return {
          success: true,
          slug: json.slug,
          shareUrl: universalUrl,
          universalUrl,
          slugUrl: serverSlugUrl
        };
      }

      return {
        success: true,
        shareUrl: universalUrl,
        universalUrl,
        slugUrl: universalUrl
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error generating share link';
      return { success: false, error: msg };
    }
  };

  const analytics: AdminAnalytics = {
    photoCount: photos.length,
    milestoneCount: timeline.length,
    letterCount: letters.length,
    pendingWishesCount: guestbook.filter((g) => g.status === 'pending').length,
    approvedWishesCount: guestbook.filter((g) => g.status === 'approved').length,
    publishedCount:
      timeline.filter((t) => t.is_published).length +
      photos.filter((p) => p.is_published).length +
      letters.filter((l) => l.is_published).length +
      reasons.filter((r) => r.is_published).length
  };

  return {
    timeline,
    photos,
    letters,
    reasons,
    guestbook,
    loading,
    analytics,
    // Operations
    addTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
    addPhoto,
    updatePhoto,
    deletePhoto,
    togglePublishPhoto,
    addLetter,
    updateLetter,
    deleteLetter,
    addLoveReason,
    updateLoveReason,
    deleteLoveReason,
    submitGuestbookWish,
    moderateGuestbookWish,
    deleteGuestbookWish,
    createShareableLink,
    refreshAll
  };
}
