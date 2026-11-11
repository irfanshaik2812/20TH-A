import React, { useState } from 'react';
import { useAnniversaryData } from '../../hooks/useAnniversaryData';
import { GalleryPhoto } from '../../types/database';
import { uploadMediaFile } from '../../lib/storage';
import { optimizeImageFile } from '../../lib/celebrationPackager';
import {
  Plus,
  Upload,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const GalleryManager: React.FC = () => {
  const { photos, addPhoto, updatePhoto, deletePhoto } = useAnniversaryData();

  const [search, setSearch] = useState('');
  const [albumFilter, setAlbumFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    photo_url: '',
    album: 'family' as 'wedding' | 'family' | 'travel' | 'special',
    date_taken: '',
    display_order: photos.length + 1,
    is_published: true
  });

  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openAddModal = () => {
    setEditingPhoto(null);
    setFormData({
      title: '',
      caption: '',
      photo_url: '',
      album: 'family',
      date_taken: '',
      display_order: photos.length + 1,
      is_published: true
    });
    setModalOpen(true);
  };

  const openEditModal = (photo: GalleryPhoto) => {
    setEditingPhoto(photo);
    setFormData({
      title: photo.title,
      caption: photo.caption || '',
      photo_url: photo.photo_url,
      album: photo.album,
      date_taken: photo.date_taken || '',
      display_order: photo.display_order,
      is_published: photo.is_published
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setNotification(null);

    try {
      // 1. Upload to Supabase Cloud Storage (or server fallback)
      const uploadRes = await uploadMediaFile(file, 'anniversary-photos');

      if (uploadRes.success && uploadRes.fileUrl) {
        setFormData((prev) => ({
          ...prev,
          photo_url: uploadRes.fileUrl!
        }));
        setNotification({
          type: 'success',
          text: uploadRes.isCloudStored
            ? 'Photo uploaded to Supabase Cloud Storage! Permanent URL generated for all devices.'
            : 'Photo uploaded to server! (Connect Supabase in Settings for global cloud sync).'
        });
      } else {
        // Fallback: optimize image locally to lightweight WebP
        const portableDataUrl = await optimizeImageFile(file, 1100, 0.82);
        setFormData((prev) => ({ ...prev, photo_url: portableDataUrl }));
        setNotification({
          type: 'success',
          text: 'Photo optimized locally for display.'
        });
      }
    } catch {
      setNotification({ type: 'error', text: 'Failed to process photo.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.photo_url.trim()) {
      setNotification({ type: 'error', text: 'Please upload or provide a photo URL.' });
      return;
    }

    if (editingPhoto) {
      await updatePhoto(editingPhoto.id, formData);
      setNotification({ type: 'success', text: 'Photo updated successfully!' });
    } else {
      await addPhoto(formData);
      setNotification({ type: 'success', text: 'Photo added to Scrapbook gallery!' });
    }

    setModalOpen(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deletePhoto(id);
      setNotification({ type: 'success', text: 'Photo removed from gallery.' });
    }
  };

  const filteredPhotos = photos.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.caption && p.caption.toLowerCase().includes(search.toLowerCase()));
    const matchesAlbum = albumFilter === 'all' || p.album === albumFilter;
    return matchesSearch && matchesAlbum;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F8DCE5]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#70515A]">Photo Gallery Manager</h1>
          <p className="text-xs text-[#70515A]/70 mt-1">
            Organize Polaroid scrapbook photos into albums with captions and dates.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#B75F7D] hover:bg-[#9E4B66] transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Photo</span>
        </button>
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

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FFFDF9] border border-[#F8DCE5] rounded-2xl p-4 shadow-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search photos by title or caption..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
          />
          <Search className="w-4 h-4 text-[#C99A9A] absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'wedding', 'family', 'travel', 'special'].map((alb) => (
            <button
              key={alb}
              onClick={() => setAlbumFilter(alb)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                albumFilter === alb
                  ? 'bg-[#B75F7D] text-white'
                  : 'bg-[#FCEEF2] text-[#70515A] hover:bg-[#F8DCE5]'
              }`}
            >
              {alb}
            </button>
          ))}
        </div>
      </div>

      {/* Photos Table / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-4/3 w-full bg-[#FCEEF2] overflow-hidden">
                <img
                  src={photo.photo_url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-[#B75F7D] px-2 py-0.5 rounded-md">
                  {photo.album}
                </span>
                <span
                  className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    photo.is_published
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {photo.is_published ? 'Published' : 'Hidden'}
                </span>
              </div>

              <div className="p-4">
                <h4 className="font-serif text-lg font-bold text-[#70515A] truncate">{photo.title}</h4>
                {photo.caption && (
                  <p className="text-xs text-[#70515A]/80 italic line-clamp-2 mt-1">
                    "{photo.caption}"
                  </p>
                )}
                {photo.date_taken && (
                  <span className="text-[11px] text-[#C99A9A] block mt-2">Date: {photo.date_taken}</span>
                )}
              </div>
            </div>

            <div className="p-3 bg-[#FCEEF2]/40 border-t border-[#F8DCE5] flex items-center justify-between">
              <button
                onClick={() => updatePhoto(photo.id, { is_published: !photo.is_published })}
                className="text-xs text-[#70515A] hover:text-[#B75F7D] flex items-center gap-1 font-medium"
              >
                {photo.is_published ? 'Hide' : 'Publish'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(photo)}
                  className="p-1.5 text-[#70515A] hover:text-[#B75F7D] rounded-lg hover:bg-white"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(photo.id, photo.title)}
                  className="p-1.5 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-white"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Photo Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#70515A]/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#70515A] hover:text-[#B75F7D]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#70515A] mb-4">
              {editingPhoto ? 'Edit Photo Memory' : 'Add New Scrapbook Memory'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Garland Ceremony"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Handwritten Caption
                </label>
                <input
                  type="text"
                  placeholder="e.g. Where our whole world began..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#70515A] mb-1">
                    Album *
                  </label>
                  <select
                    value={formData.album}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        album: e.target.value as 'wedding' | 'family' | 'travel' | 'special'
                      })
                    }
                    className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3 py-2 text-xs text-[#70515A] focus:outline-none"
                  >
                    <option value="wedding">Wedding Photos</option>
                    <option value="family">Family Moments</option>
                    <option value="travel">Travel Adventures</option>
                    <option value="special">Special Occasions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#70515A] mb-1">
                    Date / Year Taken
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 2006 or Spring 2014"
                    value={formData.date_taken}
                    onChange={(e) => setFormData({ ...formData, date_taken: e.target.value })}
                    className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3 py-2 text-xs text-[#70515A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Photo Upload or URL */}
              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Upload Photograph (or enter image URL)
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#B75F7D] bg-[#FCEEF2] hover:bg-[#F8DCE5] cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  required
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-xs text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
                />
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pubToggle"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="accent-[#B75F7D] rounded"
                />
                <label htmlFor="pubToggle" className="text-xs font-medium text-[#70515A]">
                  Published & visible on public anniversary website
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F8DCE5]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#70515A] hover:bg-[#FCEEF2] rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-semibold text-white bg-[#B75F7D] hover:bg-[#9E4B66] rounded-full shadow-xs"
                >
                  {editingPhoto ? 'Save Changes' : 'Add to Scrapbook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
