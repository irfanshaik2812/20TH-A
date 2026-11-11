import React, { useState } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { uploadMediaFile } from '../../lib/storage';
import { Music, Upload, Save, Volume2, CheckCircle, AlertCircle, Play, Pause } from 'lucide-react';

export const MusicManager: React.FC = () => {
  const { settings, updateSettings } = useSiteSettings();

  const [musicTitle, setMusicTitle] = useState(settings.background_music_title);
  const [musicUrl, setMusicUrl] = useState(settings.background_music_url);
  const [musicEnabled, setMusicEnabled] = useState(settings.music_enabled);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setNotification(null);

    try {
      const res = await uploadMediaFile(file, 'anniversary-audio');
      if (res.success && res.fileUrl) {
        setMusicUrl(res.fileUrl);
        setNotification({
          type: 'success',
          text: res.isCloudStored
            ? 'Background music uploaded to Supabase Storage!'
            : 'Audio loaded! (Connect Supabase Storage in Settings for permanent cloud persistence).'
        });
      } else {
        setNotification({ type: 'error', text: res.error || 'Failed to upload audio.' });
      }
    } catch {
      setNotification({ type: 'error', text: 'Error uploading audio.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    const res = await updateSettings({
      background_music_title: musicTitle,
      background_music_url: musicUrl,
      music_enabled: musicEnabled
    });

    setSaving(false);
    if (res.success) {
      setNotification({ type: 'success', text: 'Music preferences saved successfully!' });
    } else {
      setNotification({ type: 'error', text: res.error || 'Failed to update music settings.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-4 border-b border-[#F8DCE5]">
        <h1 className="font-serif text-3xl font-bold text-[#70515A]">Background Music Manager</h1>
        <p className="text-xs text-[#70515A]/70 mt-1">
          Select or upload the romantic melody that plays during the parents' anniversary experience.
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

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#FCEEF2]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FCEEF2] text-[#B75F7D] flex items-center justify-center">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#70515A]">Melody Configuration</h3>
                <p className="text-xs text-[#70515A]/70">MP3, WAV, or OGG audio file</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={musicEnabled}
                onChange={(e) => setMusicEnabled(e.target.checked)}
                className="accent-[#B75F7D] w-4 h-4 rounded"
              />
              <span className="text-xs font-semibold text-[#70515A]">Enable Music Player</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#70515A] mb-1">
              Melody Track Title / Description
            </label>
            <input
              type="text"
              required
              value={musicTitle}
              onChange={(e) => setMusicTitle(e.target.value)}
              placeholder="e.g. A Thousand Years (Instrumental Romance)"
              className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
            />
          </div>

          {/* Upload or URL */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#70515A]">
              Upload New Audio File (MP3, WAV, OGG)
            </label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-[#B75F7D] bg-[#FCEEF2] hover:bg-[#F8DCE5] border border-[#F8DCE5] cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading audio...' : 'Select Audio File'}</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#70515A] mb-1">
                Or Audio URL Link
              </label>
              <input
                type="url"
                required
                value={musicUrl}
                onChange={(e) => setMusicUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-xs text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
              />
            </div>
          </div>

          {/* Live Preview Player */}
          {musicUrl && (
            <div className="bg-[#FCEEF2]/50 border border-[#F8DCE5] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#70515A] mb-2">
                <Volume2 className="w-4 h-4 text-[#B75F7D]" />
                <span>Audio Preview</span>
              </div>
              <audio controls className="w-full h-9" src={musicUrl} />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white text-xs font-semibold bg-[#B75F7D] hover:bg-[#9E4B66] shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Music Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
