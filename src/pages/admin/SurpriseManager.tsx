import React, { useState } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { uploadMediaFile } from '../../lib/storage';
import { Gift, Film, Upload, Save, CheckCircle, AlertCircle, Heart } from 'lucide-react';

export const SurpriseManager: React.FC = () => {
  const { settings, updateSettings } = useSiteSettings();

  const [surpriseHeading, setSurpriseHeading] = useState(settings.surprise_heading);
  const [surpriseButtonText, setSurpriseButtonText] = useState(settings.surprise_button_text);
  const [surpriseVideoUrl, setSurpriseVideoUrl] = useState(settings.surprise_video_url);
  const [surpriseMessage, setSurpriseMessage] = useState(settings.surprise_message);

  const [cakeTitle, setCakeTitle] = useState(settings.cake_message_title);
  const [cakeSubtitle, setCakeSubtitle] = useState(settings.cake_message_subtitle);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setNotification(null);

    try {
      const res = await uploadMediaFile(file, 'anniversary-videos');
      if (res.success && res.fileUrl) {
        setSurpriseVideoUrl(res.fileUrl);
        setNotification({
          type: 'success',
          text: res.isCloudStored
            ? 'Video uploaded to Supabase Storage!'
            : 'Video loaded for preview! (Supabase Storage persistent storage recommended).'
        });
      } else {
        setNotification({ type: 'error', text: res.error || 'Video upload failed.' });
      }
    } catch {
      setNotification({ type: 'error', text: 'Error uploading video.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    const res = await updateSettings({
      surprise_heading: surpriseHeading,
      surprise_button_text: surpriseButtonText,
      surprise_video_url: surpriseVideoUrl,
      surprise_message: surpriseMessage,
      cake_message_title: cakeTitle,
      cake_message_subtitle: cakeSubtitle
    });

    setSaving(false);
    if (res.success) {
      setNotification({ type: 'success', text: 'Surprise & Cake reveal settings updated!' });
    } else {
      setNotification({ type: 'error', text: res.error || 'Failed to update settings.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-4 border-b border-[#F8DCE5]">
        <h1 className="font-serif text-3xl font-bold text-[#70515A]">Surprise Reveal & Cake Manager</h1>
        <p className="text-xs text-[#70515A]/70 mt-1">
          Customize the emotional grand finale tribute video, surprise letter, and cake cutting message.
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
        {/* Surprise Box & Video Section */}
        <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#FCEEF2]">
            <div className="w-10 h-10 rounded-2xl bg-[#FCEEF2] text-[#B75F7D] flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#70515A]">Gift Box & Tribute Video</h3>
              <p className="text-xs text-[#70515A]/70">The cinematic surprise reveal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#70515A] mb-1">
                Surprise Heading
              </label>
              <input
                type="text"
                required
                value={surpriseHeading}
                onChange={(e) => setSurpriseHeading(e.target.value)}
                className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#70515A] mb-1">
                Button Text
              </label>
              <input
                type="text"
                required
                value={surpriseButtonText}
                onChange={(e) => setSurpriseButtonText(e.target.value)}
                className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#70515A] mb-1">
              Tribute Video Embed URL (YouTube/Vimeo or Supabase Video URL)
            </label>
            <div className="flex items-center gap-3 mb-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#B75F7D] bg-[#FCEEF2] hover:bg-[#F8DCE5] cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload Video File (MP4, WebM)'}</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleVideoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            <input
              type="url"
              value={surpriseVideoUrl}
              onChange={(e) => setSurpriseVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-xs text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#70515A] mb-1">
              Heartfelt Message From Children
            </label>
            <textarea
              rows={7}
              required
              value={surpriseMessage}
              onChange={(e) => setSurpriseMessage(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl p-3 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D] font-serif resize-none"
            />
          </div>
        </div>

        {/* Interactive Cake Celebration Messages */}
        <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#FCEEF2]">
            <div className="w-10 h-10 rounded-2xl bg-[#FCEEF2] text-[#B75F7D] flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#70515A]">Cake Cutting Revealed Wishes</h3>
              <p className="text-xs text-[#70515A]/70">Displayed when parents blow out the candles</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#70515A] mb-1">
              Celebration Heading
            </label>
            <input
              type="text"
              required
              value={cakeTitle}
              onChange={(e) => setCakeTitle(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#70515A] mb-1">
              Celebration Wish Subtitle
            </label>
            <input
              type="text"
              required
              value={cakeSubtitle}
              onChange={(e) => setCakeSubtitle(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white text-xs font-semibold bg-[#B75F7D] hover:bg-[#9E4B66] shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Surprise & Cake Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
