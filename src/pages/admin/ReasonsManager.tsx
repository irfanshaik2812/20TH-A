import React, { useState } from 'react';
import { useAnniversaryData } from '../../hooks/useAnniversaryData';
import { LoveReason } from '../../types/database';
import {
  Heart,
  Edit2,
  Trash2,
  Plus,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const ReasonsManager: React.FC = () => {
  const { reasons, updateLoveReason, addLoveReason, deleteLoveReason } = useAnniversaryData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReason, setEditingReason] = useState<LoveReason | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    icon_name: 'Heart',
    display_order: reasons.length + 1,
    is_published: true
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openAddModal = () => {
    setEditingReason(null);
    setFormData({
      title: '',
      message: '',
      icon_name: 'Heart',
      display_order: reasons.length + 1,
      is_published: true
    });
    setModalOpen(true);
  };

  const openEditModal = (reason: LoveReason) => {
    setEditingReason(reason);
    setFormData({
      title: reason.title,
      message: reason.message,
      icon_name: reason.icon_name,
      display_order: reason.display_order,
      is_published: reason.is_published
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      setNotification({ type: 'error', text: 'Title and message are required.' });
      return;
    }

    if (editingReason) {
      await updateLoveReason(editingReason.id, formData);
      setNotification({ type: 'success', text: 'Reason card updated successfully!' });
    } else {
      await addLoveReason(formData);
      setNotification({ type: 'success', text: 'New reason added!' });
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete reason card "${title}"?`)) {
      await deleteLoveReason(id);
      setNotification({ type: 'success', text: 'Reason card deleted.' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F8DCE5]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#70515A]">Reasons Why We Love You Manager</h1>
          <p className="text-xs text-[#70515A]/70 mt-1">
            Edit the 6 animated gratitude cards displayed on the anniversary website.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#B75F7D] hover:bg-[#9E4B66] shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reason Card</span>
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

      {/* Reasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reasons.map((reason, idx) => (
          <div
            key={reason.id}
            className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#B75F7D]">Card 0{idx + 1}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    reason.is_published
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {reason.is_published ? 'Published' : 'Hidden'}
                </span>
              </div>

              <h4 className="font-serif text-xl font-bold text-[#70515A] mb-2">{reason.title}</h4>
              <p className="font-serif italic text-sm text-[#70515A]/85 leading-relaxed bg-[#FCEEF2]/40 p-3 rounded-2xl">
                "{reason.message}"
              </p>
              <span className="text-[11px] text-[#C99A9A] block mt-2">Icon: {reason.icon_name}</span>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F8DCE5] flex items-center justify-between">
              <button
                onClick={() => updateLoveReason(reason.id, { is_published: !reason.is_published })}
                className="text-xs text-[#70515A] hover:text-[#B75F7D] font-medium"
              >
                {reason.is_published ? 'Hide' : 'Publish'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(reason)}
                  className="p-1.5 text-[#70515A] hover:text-[#B75F7D] rounded-lg hover:bg-[#FCEEF2]"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(reason.id, reason.title)}
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

      {/* Modal */}
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
              {editingReason ? 'Edit Reason Card' : 'Add Reason Card'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Card Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Your Unconditional Love"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Gratitude Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="For loving us through every moment without expecting anything in return..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl p-3 text-sm text-[#70515A] focus:outline-none focus:border-[#B75F7D] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Card Icon
                </label>
                <select
                  value={formData.icon_name}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl px-3 py-2 text-xs text-[#70515A] focus:outline-none"
                >
                  <option value="Heart">Heart (Love)</option>
                  <option value="HeartHandshake">HeartHandshake (Sacrifices)</option>
                  <option value="Compass">Compass (Guidance)</option>
                  <option value="ShieldCheck">ShieldCheck (Support)</option>
                  <option value="Sparkles">Sparkles (Relationship)</option>
                  <option value="Crown">Crown (Everything You Have Done)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="rsnPub"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="accent-[#B75F7D] rounded"
                />
                <label htmlFor="rsnPub" className="text-xs font-medium text-[#70515A]">
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
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
