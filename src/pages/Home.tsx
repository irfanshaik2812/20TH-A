import React, { useState } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useAnniversaryData } from '../hooks/useAnniversaryData';
import { Navbar } from '../components/Navbar';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { Countdown } from '../components/Countdown';
import { Timeline } from '../components/Timeline';
import { Gallery } from '../components/Gallery';
import { LetterEnvelope } from '../components/LetterEnvelope';
import { ReasonsCards } from '../components/ReasonsCards';
import { AnniversaryCake } from '../components/AnniversaryCake';
import { SurpriseReveal } from '../components/SurpriseReveal';
import { Guestbook } from '../components/Guestbook';
import { MusicPlayer } from '../components/MusicPlayer';
import { Footer } from '../components/Footer';

export const Home: React.FC = () => {
  const { settings } = useSiteSettings();
  const { timeline, photos, letters, reasons, guestbook, submitGuestbookWish } = useAnniversaryData();
  const [triggerMusic, setTriggerMusic] = useState(false);

  const handleEnterStory = () => {
    // 1. Trigger background music to start playing
    setTriggerMusic(true);

    // 2. Smoothly scroll down to the Love Story section
    const storySection = document.querySelector('#timeline');
    if (storySection) {
      storySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#70515A] relative selection:bg-[#F8DCE5] selection:text-[#B75F7D]">
      {/* Floating Music Player */}
      {settings.music_enabled && (
        <MusicPlayer
          audioUrl={settings.background_music_url}
          trackTitle={settings.background_music_title}
          autoPlayTrigger={triggerMusic}
        />
      )}

      {/* Fixed Navigation Bar */}
      <Navbar />

      <main>
        {/* 1. Cinematic Welcome Screen */}
        <WelcomeScreen
          heading={settings.welcome_heading}
          subtitle={settings.welcome_subtitle}
          tagline={settings.welcome_tagline}
          photoUrl={settings.welcome_photo_url}
          onEnterStory={handleEnterStory}
        />

        {/* 2. Milestone Anniversary Countdown & Days of Love */}
        <Countdown targetDate={settings.anniversary_date} />

        {/* 3. Love Story Relationship Timeline */}
        <Timeline events={timeline} />

        {/* 4. Scrapbook Polaroid Photo Gallery */}
        <Gallery photos={photos} />

        {/* 5. Letters From Our Children */}
        <LetterEnvelope letters={letters} />

        {/* 6. Reasons Why We Love You */}
        <ReasonsCards reasons={reasons} />

        {/* 7. Interactive Multi-tier Anniversary Cake */}
        <AnniversaryCake
          messageTitle={settings.cake_message_title}
          messageSubtitle={settings.cake_message_subtitle}
        />

        {/* 8. Grand Surprise Reveal */}
        <SurpriseReveal
          heading={settings.surprise_heading}
          buttonText={settings.surprise_button_text}
          videoUrl={settings.surprise_video_url}
          message={settings.surprise_message}
          photos={settings.surprise_photos}
        />

        {/* 9. Digital Guestbook Wall & Form */}
        <Guestbook entries={guestbook} onSubmitWish={submitGuestbookWish} />
      </main>

      {/* 10. Footer with Love */}
      <Footer />
    </div>
  );
};
