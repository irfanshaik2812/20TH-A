import React, { useState } from 'react';
import { useAnniversaryData } from '../../hooks/useAnniversaryData';
import { TimelineEvent } from '../../types/database';
import { uploadMediaFile } from '../../lib/storage';
import { optimizeImageFile } from '../../lib/celebrationPackager';
import {
  Plus,
  Clock,
  Edit2,
  Trash2,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Film
} from 'lucide-react';

export const TimelineManager: React.FC = () => {
  const { timeline, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent } = useAnniversaryData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<TimelineEvent | null>(null);

  const [formData, setFormData] = useState({
    milestone_date: '',
    title: '',
    description: '',
    photo_url: '',
    video_url: '',
    display_order: timeline.length + 1,
    is_published: true
  });

  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openAddModal = () => {
    setEditingMilestone(null);
    setFormData({
      milestone_date: '',
      title: '',
      description: '',
      photo_url: '',
      video_url: '',
      display_order: timeline.length + 1,
      is_published: true
    });
    setModalOpen(true);
  };

  const openEditModal = (event: TimelineEvent) => {
    setEditingMilestone(event);
    setFormData({
      milestone_date: event.milestone_date,
      title: event.title,
      description: event.description,
      photo_url: event.photo_url || '',
      video_url: event.video_url || '',
      display_order: event.display_order,
      is_published: event.is_published
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
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
            ? 'Milestone photo uploaded to Supabase Storage!'
            : 'Milestone photo uploaded to server!'
        });
      } else {
        const portableDataUrl = await optimizeImageFile(file, 1100, 0.82);
        setFormData((prev) => ({ ...prev, photo_url: portableDataUrl }));
        setNotification({ type: 'success', text: 'Milestone photo optimized and ready!' });
      }
    } catch {
      setNotification({ type: 'error', text: 'Failed to process photo.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.milestone_date.trim()) {
      setNotification({ type: 'error', text: 'Title and milestone date are required.' });
      return;
    }

    if (editingMilestone) {
      await updateTimelineEvent(editingMilestone.id, formData);
      setNotification({ type: 'success', text: 'Timeline milestone updated!' });
    } else {
      await addTimelineEvent(formData);
      setNotification({ type: 'success', text: 'New milestone added to Love Story!' });
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete milestone "${title}"?`)) {
      await deleteTimelineEvent(id);
      setNotification({ type: 'success', text: 'Milestone deleted.' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F8DCE5]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#70515A]">Love Story Timeline Manager</h1>
          <p className="text-xs text-[#70515A]/70 mt-1">
            Manage alternating relationship milestones, wedding events, and family achievements.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#B75F7D] hover:bg-[#9E4B66] shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
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

      {/* Milestones List */}
      <div className="space-y-4">
        {timeline.map((event, idx) => (
          <div
            key={event.id}
            className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FCEEF2] text-[#B75F7D] font-serif font-bold text-lg flex items-center justify-center shrink-0">
                {idx + 1}
              </div>

              {event.photo_url && (
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FCEEF2] shrink-0 border border-[#F8DCE5]">
                  <img src={event.photo_url} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-lg font-bold text-[#70515A]">{event.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    event.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {event.is_published ? 'Published' : 'Hidden'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#B75F7D]">{event.milestone_date}</p>
                <p className="text-xs text-[#70515A]/80 line-clamp-2 mt-1">{event.description}</p>
                {event.video_url && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#C99A9A] mt-1">
                    <Film className="w-3 h-3" />
                    <span>Includes Video</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => updateTimelineEvent(event.id, { is_published: !event.is_published })}
                className="text-xs px-3 py-1 rounded-full border border-[#F8DCE5] text-[#70515A] hover:bg-[#FCEEF2]"
              >
                {event.is_published ? 'Hide' : 'Publish'}
              </button>
              <button
                onClick={() => openEditModal(event)}
                className="p-2 text-[#70515A] hover:text-[#B75F7D] rounded-lg hover:bg-[#FCEEF2]"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(event.id, event.title)}
                className="p-2 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Milestone Modal */}
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
              {editingMilestone ? 'Edit Love Story Milestone' : 'Add Love Story Milestone'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Milestone Date / Year *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. November 12, 2006 or August 2008"
                  value={formData.milestone_date}
                  onChange={(e) => setFormData({ ...formData, milestone_date: e.target.value })}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Sacred Vows"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Description / Story *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share what made this milestone special..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl p-3 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Photograph (Optional)
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <label className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold text-[#B75F7D] bg-[#FCEEF2] hover:bg-[#F8DCE5] cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
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
                  placeholder="https://..."
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-xs text-[#70515A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Optional Video Embed URL (YouTube/Vimeo)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/embed/..."
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-xs text-[#70515A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#70515A] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3 py-1.5 text-xs text-[#70515A] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="tlPub"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="accent-[#B75F7D] rounded"
                  />
                  <label htmlFor="tlPub" className="text-xs font-medium text-[#70515A]">
                    Published
                  </label>
                </div>
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
                  {editingMilestone ? 'Save Milestone' : 'Create Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
