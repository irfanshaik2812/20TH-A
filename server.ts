import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Increase payload limit to support media base64 uploads (photos, audio, video)
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Ensure persistent data directory and uploads directory exist
const dataDir = path.resolve(__dirname, 'data');
const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
const storeFilePath = path.join(dataDir, 'anniversary_store.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded media statically
app.use('/uploads', express.static(uploadsDir));

// Initial default data provider
const defaultSiteSettings = {
  site_title: 'Forever Together',
  parents_names: 'Mom & Dad',
  anniversary_date: '2026-11-12T00:00:00+05:30',
  welcome_heading: 'To The Two People Who Mean The World To Us',
  welcome_subtitle: 'Happy Wedding Anniversary ❤️',
  welcome_tagline: 'A little surprise awaits you...',
  welcome_photo_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
  background_music_url: 'https://cdn.freesound.org/previews/612/612089_5674468-lq.mp3',
  background_music_title: 'A Thousand Years (Instrumental Romance)',
  music_enabled: true,
  cake_message_title: 'Happy Anniversary, Mom & Dad!',
  cake_message_subtitle: 'May your love continue to grow stronger with every passing year.',
  surprise_heading: 'One Last Surprise Awaits You...',
  surprise_button_text: 'OPEN YOUR SURPRISE ❤️',
  surprise_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  surprise_message: `Dear Mom and Dad,\n\nEverything we are today is because of everything you have done for us.\nYour sacrifices, guidance, patience and unconditional love have made our lives beautiful.\nYou are our greatest blessing and our forever heroes.\nThank you for being our parents.\nWe love you endlessly.\n\nHAPPY WEDDING ANNIVERSARY! ❤️`,
  surprise_photos: [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80'
  ]
};

const defaultTimelineEvents = [
  {
    id: 'tl-1',
    milestone_date: 'November 12, 2006',
    title: 'The Sacred Vows',
    description: 'The blessed day two souls united with sacred rituals, bright smiles, blessings from family, and the beginning of a lifelong promise to walk hand in hand through every joy and sorrow.',
    photo_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    video_url: null,
    display_order: 1,
    is_published: true
  },
  {
    id: 'tl-2',
    milestone_date: 'August 2008',
    title: 'Welcoming Our First Miracle',
    description: 'Their first journey into parenthood began. Sleepless nights turned into tender lullabies, and their home filled with the sound of laughter and little footsteps.',
    photo_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
    video_url: null,
    display_order: 2,
    is_published: true
  },
  {
    id: 'tl-3',
    milestone_date: 'June 2013',
    title: 'Building Our Family Nest',
    description: 'Through tireless hard work, perseverance and sacrifices, they built our warm family home—a sanctuary where unconditional love was always present at the dining table.',
    photo_url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
    video_url: null,
    display_order: 3,
    is_published: true
  },
  {
    id: 'tl-4',
    milestone_date: 'December 2018',
    title: 'Unforgettable Family Journeys',
    description: 'Traveling across misty mountains and peaceful shorelines. What mattered was never the destination, but the warm comfort of being together as one tight-knit family.',
    photo_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    video_url: null,
    display_order: 4,
    is_published: true
  },
  {
    id: 'tl-5',
    milestone_date: 'November 12, 2021',
    title: 'Fifteen Crystal Years',
    description: 'Fifteen magnificent years of unwavering devotion, patience, and companionship celebrated surrounded by cherished relatives and proud children.',
    photo_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
    video_url: null,
    display_order: 5,
    is_published: true
  },
  {
    id: 'tl-6',
    milestone_date: 'November 12, 2026',
    title: 'Twenty Years: Today, Tomorrow, Always',
    description: 'Today we celebrate two full decades of your boundless devotion. Twenty years of love that remains our compass, our inspiration, and our greatest blessing.',
    photo_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    video_url: null,
    display_order: 6,
    is_published: true
  }
];

const defaultGalleryPhotos = [
  {
    id: 'gal-1',
    title: 'The Wedding Garland Exchange',
    caption: 'Where our entire world first began with two beating hearts.',
    photo_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    album: 'wedding',
    date_taken: 'November 12, 2006',
    display_order: 1,
    is_published: true
  },
  {
    id: 'gal-2',
    title: 'A Stroll in the Rose Garden',
    caption: 'Your smiles have always been the sunshine in our days.',
    photo_url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    album: 'travel',
    date_taken: 'Spring 2011',
    display_order: 2,
    is_published: true
  },
  {
    id: 'gal-3',
    title: 'Festival of Lights at Home',
    caption: 'No lantern shines brighter than the warmth of Mom and Dad.',
    photo_url: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=800&q=80',
    album: 'family',
    date_taken: 'Autumn 2018',
    display_order: 3,
    is_published: true
  },
  {
    id: 'gal-4',
    title: 'Mountain Retreat in Himachal',
    caption: 'Bundled up in woolens, sharing hot tea and endless stories.',
    photo_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    album: 'travel',
    date_taken: 'Winter 2019',
    display_order: 4,
    is_published: true
  },
  {
    id: 'gal-5',
    title: 'Celebration of Togetherness',
    caption: 'Sweet promises renewed with pure grace and joyful laughter.',
    photo_url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    album: 'special',
    date_taken: 'November 2021',
    display_order: 5,
    is_published: true
  },
  {
    id: 'gal-6',
    title: 'Sunday Morning Laughter',
    caption: 'The everyday quiet moments that make home feel like heaven.',
    photo_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    album: 'family',
    date_taken: 'Summer 2023',
    display_order: 6,
    is_published: true
  }
];

const defaultLetters = [
  {
    id: 'let-1',
    author: 'From Your Eldest Son',
    relationship: 'Eldest Son',
    title: 'To My Greatest Teachers & Guiding Stars',
    message: `Dear Amma & Abba,\n\nGrowing up, I watched how you handled every trial with dignity and gentleness. Dad, your calm resilience taught me how to stand firm in this world. Mom, your silent sacrifices and soothing prayers shielded us from every storm.\n\nWhenever I feel uncertain, I simply look at the life you two built from the ground up with mutual respect and unwavering faith. Thank you for never giving up on our dreams, even when it meant putting yours on pause. May Allah grant you endless good health and joy together. Happy 20th Anniversary!`,
    audio_recording_url: null,
    display_order: 1,
    is_published: true
  },
  {
    id: 'let-2',
    author: 'From Your Daughter',
    relationship: 'Daughter',
    title: 'To The Best Mom & Dad in the Entire World',
    message: `My darling Mom and Dad,\n\nWhen people ask me what true love looks like, I always describe the two of you. The way Dad still brings Mom her favorite flowers, the way Mom knows what Dad needs before he even speaks a word.\n\nYou gave us not just a roof over our heads, but wings to fly and a sanctuary of unconditional tenderness to return to whenever life is heavy. Today is a celebration of your magical 20-year bond. We promise to cherish and protect the legacy of love you gifted us every single day. I love you both beyond words! ❤️`,
    audio_recording_url: null,
    display_order: 2,
    is_published: true
  },
  {
    id: 'let-3',
    author: 'From Your Youngest',
    relationship: 'Youngest Child',
    title: 'Our Forever Superheroes',
    message: `Dearest Mom & Dad,\n\nThank you for every bedtime hug, every encouraging word before big exams, and every warm cup of chai shared on the balcony. You made our childhood feel like a fairytale.\n\nSeeing your smile today is the greatest gift we could ever ask for. Happy 20th Wedding Anniversary to the coolest, most loving parents in the universe! Here's to many more decades of love, travel, and laughter!`,
    audio_recording_url: null,
    display_order: 3,
    is_published: true
  }
];

const defaultLoveReasons = [
  {
    id: 'reason-1',
    title: 'Your Sacrifices',
    message: 'For everything you gave up to make our lives better.',
    icon_name: 'HeartHandshake',
    display_order: 1,
    is_published: true
  },
  {
    id: 'reason-2',
    title: 'Your Unconditional Love',
    message: 'For loving us through every moment without expecting anything in return.',
    icon_name: 'Heart',
    display_order: 2,
    is_published: true
  },
  {
    id: 'reason-3',
    title: 'Your Guidance',
    message: 'For showing us the right path and teaching us how to become better people.',
    icon_name: 'Compass',
    display_order: 3,
    is_published: true
  },
  {
    id: 'reason-4',
    title: 'Your Support',
    message: 'For always standing beside us, even during difficult times.',
    icon_name: 'ShieldCheck',
    display_order: 4,
    is_published: true
  },
  {
    id: 'reason-5',
    title: 'Your Beautiful Relationship',
    message: 'For showing us what true love, patience and togetherness look like.',
    icon_name: 'Sparkles',
    display_order: 5,
    is_published: true
  },
  {
    id: 'reason-6',
    title: 'Everything You Have Done For Us',
    message: 'For making our world beautiful through your endless love and care.',
    icon_name: 'Crown',
    display_order: 6,
    is_published: true
  }
];

const defaultGuestbookEntries = [
  {
    id: 'gb-1',
    visitor_name: 'Uncle Tariq & Family',
    relationship: 'Brother & Sister-in-law',
    message: 'Heartiest congratulations on your 20th Anniversary! Watching your bond blossom over these two decades has been a true joy. May God shower you with barakah and happiness!',
    photo_url: null,
    status: 'approved',
    created_at: '2026-11-10T14:20:00Z'
  },
  {
    id: 'gb-2',
    visitor_name: 'Aunty Yasmin',
    relationship: 'Cousin',
    message: 'Happy 20th Anniversary to the most graceful couple! Your kindness touches everyone who knows you. Wishing you both a lifetime of good health and togetherness.',
    photo_url: null,
    status: 'approved',
    created_at: '2026-11-10T18:45:00Z'
  },
  {
    id: 'gb-3',
    visitor_name: 'Zameer & Ayesha',
    relationship: 'Family Friends',
    message: 'Happy 20th wedding anniversary! You two set the golden standard for what marriage should be. Love and prayers from all of us!',
    photo_url: null,
    status: 'approved',
    created_at: '2026-11-11T09:15:00Z'
  }
];

function getStore() {
  if (!fs.existsSync(storeFilePath)) {
    const initial = {
      site_settings: defaultSiteSettings,
      timeline_events: defaultTimelineEvents,
      gallery_photos: defaultGalleryPhotos,
      letters: defaultLetters,
      love_reasons: defaultLoveReasons,
      guestbook: defaultGuestbookEntries,
      snapshots: {}
    };
    fs.writeFileSync(storeFilePath, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(storeFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading store file, resetting:', err);
    return {
      site_settings: defaultSiteSettings,
      timeline_events: defaultTimelineEvents,
      gallery_photos: defaultGalleryPhotos,
      letters: defaultLetters,
      love_reasons: defaultLoveReasons,
      guestbook: defaultGuestbookEntries,
      snapshots: {}
    };
  }
}

function saveStore(data: Record<string, unknown>) {
  fs.writeFileSync(storeFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ---------------------------------------------------------------------------
// API ROUTES
// ---------------------------------------------------------------------------

// 0. Provide public configuration (APP_URL and Supabase credentials for multi-device sync)
app.get('/api/anniversary/config', (req, res) => {
  const store = getStore();
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || store.supabase_url || '';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || store.supabase_anon_key || '';

  res.json({
    success: true,
    appUrl: process.env.APP_URL || '',
    sharedUrl: 'https://ais-pre-i4j2m4o4xkzfxvq7ngcata-114217711761.asia-southeast1.run.app',
    supabaseUrl,
    supabaseAnonKey,
    hasSupabase: Boolean(supabaseUrl && supabaseAnonKey)
  });
});

// Endpoint to store and broadcast Supabase credentials globally across all devices
app.post('/api/anniversary/config/supabase', (req, res) => {
  try {
    const { url, anonKey } = req.body;
    const store = getStore();
    store.supabase_url = url ? url.trim() : '';
    store.supabase_anon_key = anonKey ? anonKey.trim() : '';
    saveStore(store);

    res.json({
      success: true,
      message: 'Supabase credentials saved globally. All visitor links now synchronize with Supabase Cloud.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save Supabase config' });
  }
});

// 1. Fetch entire active database state for all visitors
app.get('/api/anniversary/data', (req, res) => {
  try {
    const store = getStore();
    res.json({
      success: true,
      site_settings: store.site_settings || defaultSiteSettings,
      timeline_events: store.timeline_events || defaultTimelineEvents,
      gallery_photos: store.gallery_photos || defaultGalleryPhotos,
      letters: store.letters || defaultLetters,
      love_reasons: store.love_reasons || defaultLoveReasons,
      guestbook: store.guestbook || defaultGuestbookEntries,
      snapshots: store.snapshots || {}
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to read data' });
  }
});

// 2. Persist update to any section (settings, timeline, gallery, letters, reasons, guestbook)
app.post('/api/anniversary/save', (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) {
      return res.status(400).json({ success: false, error: 'Key is required' });
    }
    const store = getStore();
    store[key] = value;
    saveStore(store);
    res.json({ success: true, message: `Successfully updated ${key}` });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save data' });
  }
});

// 3. Media upload endpoint (photos, audio, videos) - writes directly to server disk
app.post('/api/anniversary/upload', async (req, res) => {
  try {
    const { filename, base64Data, filetype } = req.body;
    if (!filename || !base64Data) {
      return res.status(400).json({ success: false, error: 'Filename and base64Data required' });
    }

    // Strip data prefix if present (e.g. data:image/jpeg;base64,...)
    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${Date.now()}_${cleanName}`;
    const targetFilePath = path.join(uploadsDir, uniqueFileName);

    await fs.promises.writeFile(targetFilePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    res.json({
      success: true,
      fileUrl: publicUrl,
      fileName: uniqueFileName,
      isServerStored: true
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    res.status(500).json({ success: false, error: msg });
  }
});

// 4. Create and register a dedicated Shareable Link / Snapshot
app.post('/api/anniversary/share', (req, res) => {
  try {
    const { slug, title, note, customSettings, isParentViewOnly } = req.body;
    const store = getStore();

    const cleanSlug = (slug || `celebration-${Date.now().toString(36)}`).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const snapshotId = `share-${Date.now().toString(36)}`;

    const snapshotData = {
      id: snapshotId,
      slug: cleanSlug,
      title: title || 'Forever Together - 20th Anniversary',
      note: note || 'A digital gift from children',
      createdAt: new Date().toISOString(),
      isParentViewOnly: Boolean(isParentViewOnly),
      site_settings: customSettings?.site_settings || store.site_settings || defaultSiteSettings,
      timeline_events: customSettings?.timeline_events || store.timeline_events || defaultTimelineEvents,
      gallery_photos: customSettings?.gallery_photos || store.gallery_photos || defaultGalleryPhotos,
      letters: customSettings?.letters || store.letters || defaultLetters,
      love_reasons: customSettings?.love_reasons || store.love_reasons || defaultLoveReasons,
      guestbook: store.guestbook || defaultGuestbookEntries
    };

    if (!store.snapshots) {
      store.snapshots = {};
    }
    store.snapshots[cleanSlug] = snapshotData;
    store.snapshots[snapshotId] = snapshotData;

    saveStore(store);

    res.json({
      success: true,
      slug: cleanSlug,
      snapshotId,
      sharePath: `/?celebrate=${cleanSlug}${isParentViewOnly ? '&view=parents' : ''}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create shareable link' });
  }
});

// 5. Fetch specific shareable snapshot
app.get('/api/anniversary/share/:id', (req, res) => {
  try {
    const { id } = req.params;
    const store = getStore();
    const snapshot = store.snapshots?.[id];
    if (snapshot) {
      return res.json({ success: true, snapshot });
    }
    // Return live store if not found as specific snapshot
    res.json({
      success: true,
      snapshot: {
        site_settings: store.site_settings || defaultSiteSettings,
        timeline_events: store.timeline_events || defaultTimelineEvents,
        gallery_photos: store.gallery_photos || defaultGalleryPhotos,
        letters: store.letters || defaultLetters,
        love_reasons: store.love_reasons || defaultLoveReasons,
        guestbook: store.guestbook || defaultGuestbookEntries
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load snapshot' });
  }
});

// ---------------------------------------------------------------------------
// VITE SETUP & STATIC SERVING
// ---------------------------------------------------------------------------
async function startServer() {
  if (!isProd) {
    // Mount Vite dev middleware in development mode
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built static files from dist/
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Forever Together Anniversary Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
