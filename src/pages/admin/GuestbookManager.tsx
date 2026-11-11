import React, { useState } from 'react';
import { useAnniversaryData } from '../../hooks/useAnniversaryData';
import {
  MessageCircleHeart,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

export const GuestbookManager: React.FC = () => {
  const { guestbook, moderateGuestbookWish, deleteGuestbookWish } = useAnniversaryData();

  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const pendingCount = guestbook.filter((g) => g.status === 'pending').length;
  const approvedCount = guestbook.filter((g) => g.status === 'approved').length;
  const rejectedCount = guestbook.filter((g) => g.status === 'rejected').length;

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    await moderateGuestbookWish(id, status);
    setNotification({
      type: 'success',
      text: status === 'approved' ? 'Wish approved for public wall!' : 'Wish rejected.'
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Permanently delete wish from "${name}"?`)) {
      await deleteGuestbookWish(id);
      setNotification({ type: 'success', text: 'Wish removed permanently.' });
    }
  };

  const filteredEntries = guestbook.filter((entry) => {
    const matchesStatus = filter === 'all' || entry.status === filter;
    const matchesSearch =
      entry.visitor_name.toLowerCase().includes(search.toLowerCase()) ||
      entry.message.toLowerCase().includes(search.toLowerCase()) ||
      entry.relationship.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="pb-4 border-b border-[#F8DCE5]">
        <h1 className="font-serif text-3xl font-bold text-[#70515A]">Guestbook Moderation</h1>
        <p className="text-xs text-[#70515A]/70 mt-1">
          Review, approve, or reject anniversary blessings submitted by relatives and friends.
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
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{notification.text}</span>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FFFDF9] border border-[#F8DCE5] rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              filter === 'pending'
                ? 'bg-orange-500 text-white'
                : 'bg-[#FCEEF2] text-[#70515A] hover:bg-[#F8DCE5]'
            }`}
          >
            <span>Pending Review</span>
            {pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-orange-600 text-[10px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilter('approved')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              filter === 'approved'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FCEEF2] text-[#70515A] hover:bg-[#F8DCE5]'
            }`}
          >
            <span>Approved ({approvedCount})</span>
          </button>

          <button
            onClick={() => setFilter('rejected')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              filter === 'rejected'
                ? 'bg-rose-600 text-white'
                : 'bg-[#FCEEF2] text-[#70515A] hover:bg-[#F8DCE5]'
            }`}
          >
            <span>Rejected ({rejectedCount})</span>
          </button>

          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-[#B75F7D] text-white'
                : 'bg-[#FCEEF2] text-[#70515A] hover:bg-[#F8DCE5]'
            }`}
          >
            All ({guestbook.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by name or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FFFDF9] border border-[#F8DCE5] rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-[#70515A] focus:outline-none focus:border-[#B75F7D]"
          />
          <Search className="w-3.5 h-3.5 text-[#C99A9A] absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-12 text-center text-[#C99A9A]">
            <MessageCircleHeart className="w-10 h-10 mx-auto mb-2 opacity-50 text-[#B75F7D]" />
            <p className="font-serif text-lg text-[#70515A]">No messages found in this category.</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1.5">
                  <h4 className="font-serif text-lg font-bold text-[#70515A]">
                    {entry.visitor_name}
                  </h4>
                  <span className="text-[11px] font-semibold text-[#B75F7D] uppercase tracking-wider">
                    {entry.relationship}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      entry.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : entry.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-orange-100 text-orange-800 animate-pulse'
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>

                <p className="font-serif italic text-sm text-[#70515A]/90 bg-[#FCEEF2]/30 p-3 rounded-xl border border-[#F8DCE5]/40 leading-relaxed">
                  "{entry.message}"
                </p>

                <div className="mt-2 text-[10px] text-[#C99A9A]">
                  Submitted: {new Date(entry.created_at).toLocaleString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {entry.status !== 'approved' && (
                  <button
                    onClick={() => handleModerate(entry.id, 'approved')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                    title="Approve for public view"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                {entry.status !== 'rejected' && (
                  <button
                    onClick={() => handleModerate(entry.id, 'rejected')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#70515A] hover:bg-rose-50 hover:text-rose-600 border border-[#F8DCE5] transition-colors"
                    title="Reject wish"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(entry.id, entry.visitor_name)}
                  className="p-1.5 text-[#C99A9A] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Permanently Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
