import React, { useState } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { uploadMediaFile } from '../../lib/storage';
import { Upload, CheckCircle, AlertCircle, Save, Sparkles, Image as ImageIcon } from 'lucide-react';

export const HomepageManager: React.FC = () => {
  const { settings, updateSettings } = useSiteSettings();

  const [formData, setFormData] = useState({
    welcome_heading: settings.welcome_heading,
    welcome_subtitle: settings.welcome_subtitle,
    welcome_tagline: settings.welcome_tagline,
    parents_names: settings.parents_names,
    anniversary_date: settings.anniversary_date,
    welcome_photo_url: settings.welcome_photo_url
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(10);
    setNotification(null);

    try {
      const res = await uploadMediaFile(file, 'anniversary-photos', (p) => setUploadProgress(p));
      if (res.success && res.fileUrl) {
        setFormData((prev) => ({ ...prev, welcome_photo_url: res.fileUrl! }));
        setNotification({
          type: 'success',
          text: res.isCloudStored
            ? 'Photo uploaded to Supabase Storage successfully!'
            : 'Photo loaded for preview! (Connect Supabase Storage in Settings for permanent cloud persistence).'
        });
      } else {
        setNotification({ type: 'error', text: res.error || 'Failed to upload photo.' });
      }
    } catch {
      setNotification({ type: 'error', text: 'Error uploading image.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    const res = await updateSettings(formData);
    setSaving(false);

    if (res.success) {
      setNotification({ type: 'success', text: 'Homepage welcome screen updated successfully!' });
    } else {
      setNotification({ type: 'error', text: res.error || 'Failed to update settings.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#F8DCE5]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#70515A]">Welcome Screen Manager</h1>
          <p className="text-xs text-[#70515A]/70 mt-1">
            Customize the romantic opening screen, parents' names, and centerpiece photograph.
          </p>
        </div>
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
        {/* Photo Upload & Preview Section */}
        <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <h3 className="font-serif text-xl font-semibold text-[#70515A] mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#B75F7D]" />
            <span>Centerpiece Parents Photograph</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Live Circular Framed Preview */}
            <div className="w-44 h-44 rounded-full p-2 bg-gradient-to-tr from-[#C99A9A] via-[#FFFDF9] to-[#D88CA5] shadow-lg shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-[#FCEEF2]">
                <img
                  src={formData.welcome_photo_url}
                  alt="Parents Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
            </div>

            {/* Upload & URL Controls */}
            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Upload High-Resolution Photo (JPG, PNG, WebP)
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-[#B75F7D] bg-[#FCEEF2] hover:bg-[#F8DCE5] border border-[#F8DCE5] cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? `Uploading (${uploadProgress}%)` : 'Select File from Device'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {uploading && (
                    <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#B75F7D] h-2 transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Or Image Web URL
                </label>
                <input
                  type="url"
                  value={formData.welcome_photo_url}
                  onChange={(e) => setFormData({ ...formData, welcome_photo_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] focus:border-[#B75F7D] rounded-xl px-3.5 py-2 text-xs text-[#70515A] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text Details Section */}
        <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-serif text-xl font-semibold text-[#70515A] mb-4">
            Welcome Copy & Titles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#70515A] mb-1">
                Parents' Names / Salutation
              </label>
              <input
                type="text"
                value={formData.parents_names}
                onChange={(e) => setFormData({ ...formData, parents_names: e.target.value })}
                required
                className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#70515A] mb-1">
                Anniversary Date (ISO format or date)
              </label>
              <input
                type="text"
                value={formData.anniversary_date}
                onChange={(e) => setFormData({ ...formData, anniversary_date: e.target.value })}
                required
                className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#70515A] mb-1">
              Main Welcome Heading
            </label>
            <input
              type="text"
              value={formData.welcome_heading}
              onChange={(e) => setFormData({ ...formData, welcome_heading: e.target.value })}
              required
              className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#70515A] mb-1">
              Subtitle (in cursive font)
            </label>
            <input
              type="text"
              value={formData.welcome_subtitle}
              onChange={(e) => setFormData({ ...formData, welcome_subtitle: e.target.value })}
              required
              className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#70515A] mb-1">
              Subtle Tagline below button
            </label>
            <input
              type="text"
              value={formData.welcome_tagline}
              onChange={(e) => setFormData({ ...formData, welcome_tagline: e.target.value })}
              required
              className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white text-sm font-semibold bg-[#B75F7D] hover:bg-[#9E4B66] shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Welcome Screen'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
