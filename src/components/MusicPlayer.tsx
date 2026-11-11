import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

interface MusicPlayerProps {
  audioUrl?: string;
  trackTitle?: string;
  autoPlayTrigger?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  audioUrl = 'https://cdn.freesound.org/previews/612/612089_5674468-lq.mp3',
  trackTitle = 'A Thousand Years (Instrumental Romance)',
  autoPlayTrigger = false
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      audio.loop = true;
      audio.volume = volume;
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
    } else {
      audioRef.current.src = audioUrl;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioUrl]);

  // Handle triggered autoplay from welcome button click
  useEffect(() => {
    if (autoPlayTrigger && !hasInteracted && audioRef.current) {
      setHasInteracted(true);
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Autoplay deferred until further interaction:', err));
    }
  }, [autoPlayTrigger, hasInteracted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    setHasInteracted(true);
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <div className="flex items-center gap-2 bg-[#FFFDF9]/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#F8DCE5] shadow-lg shadow-[#D88CA5]/15 transition-all duration-300 hover:shadow-[#D88CA5]/25">
        {/* Animated equalizer or rotating music icon */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#FCEEF2] text-[#B75F7D] overflow-hidden">
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-3.5">
              <span className="w-0.5 bg-[#B75F7D] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
              <span className="w-0.5 bg-[#B75F7D] rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-2" />
              <span className="w-0.5 bg-[#B75F7D] rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-3.5" />
              <span className="w-0.5 bg-[#B75F7D] rounded-full animate-[pulse_1s_ease-in-out_infinite] h-1.5" />
            </div>
          ) : (
            <Music className="w-4 h-4 text-[#C99A9A]" />
          )}
        </div>

        {/* Track Title */}
        <div className="hidden sm:flex flex-col max-w-[130px] md:max-w-[180px] overflow-hidden text-left pl-1 pr-2">
          <span className="text-[10px] uppercase tracking-wider text-[#C99A9A] font-semibold">Background Melody</span>
          <span className="text-xs text-[#70515A] font-medium truncate" title={trackTitle}>
            {trackTitle}
          </span>
        </div>

        {/* Play / Pause Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause romantic background music' : 'Play romantic background music'}
          className="w-8 h-8 rounded-full bg-[#B75F7D] text-white flex items-center justify-center hover:bg-[#9E4B66] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B75F7D]"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Volume & Mute */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
            className="w-8 h-8 rounded-full text-[#70515A] hover:bg-[#FCEEF2] flex items-center justify-center transition-colors focus:outline-none"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-[#C99A9A]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#70515A]" />
            )}
          </button>

          {/* Volume slider popout */}
          {showVolumeSlider && (
            <div className="absolute bottom-10 right-0 bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3 py-2 shadow-md flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume level"
                className="w-20 h-1.5 accent-[#B75F7D] bg-[#F8DCE5] rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
