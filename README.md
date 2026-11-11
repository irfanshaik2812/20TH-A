# Forever Together ❤️ — Parents' Wedding Anniversary Website

A digital wedding anniversary gift created by their children to celebrate **Mom & Dad's 20th Wedding Anniversary** (12 November 2026, Asia/Kolkata).

---

## ✨ Features

- **Cinematic Welcome Screen**:
  - Full-screen romantic blush pink & ivory atmosphere
  - Framed centerpiece photograph of parents with glowing ambient rings and delicate floral flourishes
  - Floating rose petals & floating hearts background animations
  - "ENTER OUR LOVE STORY ❤️" button that seamlessly starts the romantic background melody and scrolls smoothly into the experience

- **Love Story Timeline**:
  - Alternating milestone cards on desktop and a vertical timeline on mobile
  - Date, milestone title, heartfelt story, photograph, and video links
  - Full CRUD management in the Admin Dashboard

- **Scrapbook Polaroid Photo Gallery**:
  - Authentic Polaroid photo cards with white frames, handwritten captions (`font-handwriting`), washi tape accents, and slight rotations
  - Album filtering: *Wedding Memories*, *Family Moments*, *Travel Adventures*, *Special Occasions*
  - Fullscreen Lightbox with slideshow playback, next/previous controls, keyboard navigation (Arrow keys / Esc)

- **Letters From Our Children**:
  - Interactive envelopes with wax seal stamp animation
  - Click to break the seal and unfold the handwritten letter on parchment paper
  - Personal voice note audio player attached to letters

- **Reasons Why We Love You ❤️**:
  - 6 animated cards: *Your Sacrifices*, *Your Unconditional Love*, *Your Guidance*, *Your Support*, *Your Beautiful Relationship*, and *Everything You Have Done For Us*
  - Editable through the admin portal

- **Interactive Anniversary Cake**:
  - Multi-tier pink and white cake with decorative roses and animated flickering candles
  - "BLOW OUT THE CANDLES ❤️" button: extinguishes flames with rising smoke curls, triggers colorful confetti cannons, plays celebratory synthetic chimes via Web Audio API, and reveals anniversary blessings
  - "Light The Candles Again" button for replayability

- **Grand Finale Surprise Reveal**:
  - Animated gift box with golden ribbons and glowing hearts
  - "OPEN YOUR SURPRISE ❤️" button releases confetti cannons and unveils the family tribute video and heartfelt letter of gratitude

- **Digital Guestbook & Moderation Wall**:
  - Public submission form with visitor name, relationship dropdown, message length validation (max 500 chars), and anti-spam honeypot
  - Messages automatically enter `pending` status until approved by the family in the Admin Portal

- **Background Music Player**:
  - Floating romantic music player with Play, Pause, Mute, Volume slider, and Track Title
  - Respects browser autoplay policies, activates on user welcome interaction, and persists state in session

- **Secure Admin Dashboard (`/admin`)**:
  - Dedicated modules: *Dashboard Overview & Analytics*, *Welcome & Homepage*, *Photo Gallery*, *Timeline Milestones*, *Letters*, *Reasons Cards*, *Music & Audio*, *Surprise & Video*, *Guestbook Moderation*, and *Website Settings*
  - Real CRUD functionality, photo/audio/video file upload, search, filtering, and delete confirmations
  - Supabase Auth + Family Passkey (`forever2026`) dual authentication

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti
- **Routing**: React Router v7
- **Backend / Database**: Supabase PostgreSQL, Supabase Storage (`anniversary-photos`, `anniversary-audio`, `anniversary-videos`), Supabase Auth, Row Level Security (RLS)
- **Fallback**: LocalStorage persistence mode when Supabase credentials are not yet configured

---

## 🚀 Quick Setup & Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Admin Login**:
   Navigate to `/admin/login`. You can log in instantly with the family passkey:
   - **Passkey**: `forever2026` (or `togetherforever`)

---

## 🗄️ Supabase Configuration & Migration

1. Create a project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run the migration script located at:
   ```
   /supabase/migrations/01_initial_schema.sql
   ```
3. In **Storage**, ensure the following public buckets are created:
   - `anniversary-photos`
   - `anniversary-audio`
   - `anniversary-videos`
4. Set your environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```
   *Alternatively*, you can configure them directly at runtime inside `/admin/settings`!
