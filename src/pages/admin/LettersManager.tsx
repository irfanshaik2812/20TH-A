import React, { useState } from 'react';
import { useAnniversaryData } from '../../hooks/useAnniversaryData';
import { Letter } from '../../types/database';
import { uploadMediaFile } from '../../lib/storage';
import {
  Plus,
  Mail,
  Edit2,
  Trash2,
  Upload,
  X,
  Volume2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const LettersManager: React.FC = () => {
  const { letters, addLetter, updateLetter, deleteLetter } = useAnniversaryData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);

  const [formData, setFormData] = useState({
    author: '',
    relationship: '',
    title: '',
    message: '',
    audio_recording_url: '',
    display_order: letters.length + 1,
    is_published: true
  });

  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openAddModal = () => {
    setEditingLetter(null);
    setFormData({
      author: '',
      relationship: 'Son / Daughter',
      title: '',
      message: '',
      audio_recording_url: '',
      display_order: letters.length + 1,
      is_published: true
    });
    setModalOpen(true);
  };

  const openEditModal = (letter: Letter) => {
    setEditingLetter(letter);
    setFormData({
      author: letter.author,
      relationship: letter.relationship,
      title: letter.title,
      message: letter.message,
      audio_recording_url: letter.audio_recording_url || '',
      display_order: letter.display_order,
      is_published: letter.is_published
    });
    setModalOpen(true);
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAudio(true);
    try {
      const res = await uploadMediaFile(file, 'anniversary-audio');
      if (res.success && res.fileUrl) {
        setFormData((prev) => ({ ...prev, audio_recording_url: res.fileUrl! }));
        setNotification({ type: 'success', text: 'Voice note uploaded successfully!' });
      } else {
        setNotification({ type: 'error', text: res.error || 'Audio upload failed.' });
      }
    } catch {
      setNotification({ type: 'error', text: 'Failed to upload audio.' });
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.message.trim()) {
      setNotification({ type: 'error', text: 'Author and message are required.' });
      return;
    }

    if (editingLetter) {
      await updateLetter(editingLetter.id, formData);
      setNotification({ type: 'success', text: 'Letter updated successfully!' });
    } else {
      await addLetter(formData);
      setNotification({ type: 'success', text: 'New letter added for Mom & Dad!' });
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string, author: string) => {
    if (window.confirm(`Delete letter from "${author}"?`)) {
      await deleteLetter(id);
      setNotification({ type: 'success', text: 'Letter deleted.' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F8DCE5]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#70515A]">Letters From Children Manager</h1>
          <p className="text-xs text-[#70515A]/70 mt-1">
            Manage interactive envelopes, handwritten messages, and optional voice notes.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#B75F7D] hover:bg-[#9E4B66] shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Letter</span>
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

      {/* Letters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {letters.map((letter) => (
          <div
            key={letter.id}
            className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B75F7D]">
                  {letter.relationship}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    letter.is_published
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {letter.is_published ? 'Published' : 'Hidden'}
                </span>
              </div>

              <h4 className="font-serif text-xl font-bold text-[#70515A] mb-1">{letter.title}</h4>
              <p className="text-xs text-[#C99A9A] mb-3">By {letter.author}</p>

              <p className="font-serif italic text-xs text-[#70515A]/85 line-clamp-4 leading-relaxed bg-[#FCEEF2]/30 p-3 rounded-xl border border-[#F8DCE5]/40">
                "{letter.message}"
              </p>

              {letter.audio_recording_url && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#B75F7D]">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Audio voice note attached</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-[#F8DCE5] flex items-center justify-between">
              <button
                onClick={() => updateLetter(letter.id, { is_published: !letter.is_published })}
                className="text-xs text-[#70515A] hover:text-[#B75F7D] font-medium"
              >
                {letter.is_published ? 'Hide' : 'Publish'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(letter)}
                  className="p-1.5 text-[#70515A] hover:text-[#B75F7D] rounded-lg hover:bg-[#FCEEF2]"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(letter.id, letter.author)}
                  className="p-1.5 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Letter Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#70515A]/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#70515A] hover:text-[#B75F7D]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#70515A] mb-4">
              {editingLetter ? 'Edit Child Letter' : 'Compose Child Letter'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#70515A] mb-1">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq (Eldest Son)"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#70515A] mb-1">
                    Relationship *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eldest Son or Daughter"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Letter Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. To My Greatest Teachers & Guiding Stars"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Message / Letter Body *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Pour your heartfelt words and memories here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl p-3 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D] resize-none"
                />
              </div>

              {/* Optional Voice Note */}
              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Optional Voice Note Recording (MP3, WAV, M4A)
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <label className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold text-[#B75F7D] bg-[#FCEEF2] hover:bg-[#F8DCE5] cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingAudio ? 'Uploading...' : 'Upload Audio Recording'}</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="url"
                  placeholder="Or audio link: https://..."
                  value={formData.audio_recording_url}
                  onChange={(e) => setFormData({ ...formData, audio_recording_url: e.target.value })}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3 py-1.5 text-xs text-[#70515A] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="letPub"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="accent-[#B75F7D] rounded"
                />
                <label htmlFor="letPub" className="text-xs font-medium text-[#70515A]">
                  Published on public anniversary website
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
                  {editingLetter ? 'Save Letter' : 'Publish Letter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
