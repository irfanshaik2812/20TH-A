import React, { useState } from 'react';
import { GuestbookEntry } from '../types/database';
import { Heart, Send, CheckCircle, AlertCircle, MessageCircleHeart, User, Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface GuestbookProps {
  entries: GuestbookEntry[];
  onSubmitWish: (data: {
    visitor_name: string;
    relationship: string;
    message: string;
    photo_url?: string | null;
  }) => Promise<{ success: boolean; error?: string }>;
}

export const Guestbook: React.FC<GuestbookProps> = ({ entries, onSubmitWish }) => {
  const [visitorName, setVisitorName] = useState('');
  const [relationship, setRelationship] = useState('Relative');
  const [customRelationship, setCustomRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam hidden field

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const approvedEntries = entries.filter((e) => e.status === 'approved');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // Spam trap check
    if (honeypot) {
      return;
    }

    const finalRelationship = relationship === 'Other' ? customRelationship.trim() : relationship;

    if (!visitorName.trim()) {
      setFeedback({ type: 'error', text: 'Please enter your name.' });
      return;
    }

    if (!finalRelationship) {
      setFeedback({ type: 'error', text: 'Please choose or specify your relationship with our parents.' });
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      setFeedback({ type: 'error', text: 'Please write a blessing with at least 5 characters.' });
      return;
    }

    if (message.length > 500) {
      setFeedback({ type: 'error', text: 'Message must be under 500 characters.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await onSubmitWish({
        visitor_name: visitorName,
        relationship: finalRelationship,
        message,
        photo_url: photoUrl || null
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          text: 'Thank you for your warm wishes! Your message has been safely received and will appear on the wall once reviewed by the family.'
        });
        setVisitorName('');
        setMessage('');
        setPhotoUrl('');
        setCustomRelationship('');
      } else {
        setFeedback({ type: 'error', text: res.error || 'Failed to submit wish. Please try again.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FFFDF9] relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header with IntersectionObserver Fade-in */}
        <ScrollReveal direction="up" distance={32} duration={850}>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#B75F7D] mb-2">
              <MessageCircleHeart className="w-3.5 h-3.5" />
              <span>Digital Guestbook & Blessings</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#70515A] font-normal mb-3">
              Leave Your Heartfelt Wishes
            </h2>
            <p className="font-cursive text-3xl sm:text-4xl text-[#D88CA5]">
              Blessings from family, dear friends and well-wishers
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D88CA5] to-transparent mx-auto mt-4" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Submission Form Column */}
          <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-6 sm:p-8 shadow-md shadow-[#D88CA5]/10">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#FCEEF2]">
              <Sparkles className="w-4 h-4 text-[#B75F7D]" />
              <h3 className="font-serif text-xl font-semibold text-[#70515A]">Write An Anniversary Wish</h3>
            </div>

            {feedback && (
              <div
                className={`p-4 rounded-2xl mb-5 flex items-start gap-2.5 text-xs leading-relaxed ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Anti-spam trap invisible field */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website_verify_bot"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  autoComplete="off"
                />
              </div>

              {/* Visitor Name */}
              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Your Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={60}
                    placeholder="e.g. Uncle Farooq, Shazia & Kids"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full bg-[#FFFDF9] border border-[#F8DCE5] focus:border-[#B75F7D] rounded-xl px-3.5 py-2.5 text-sm text-[#70515A] placeholder-[#C99A9A] focus:outline-none focus:ring-1 focus:ring-[#B75F7D]"
                  />
                  <User className="w-4 h-4 text-[#C99A9A] absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Relationship with Mom & Dad *
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] focus:border-[#B75F7D] rounded-xl px-3.5 py-2.5 text-sm text-[#70515A] focus:outline-none focus:ring-1 focus:ring-[#B75F7D]"
                >
                  <option value="Brother / Sister">Brother / Sister</option>
                  <option value="Relative / Family">Relative / Family</option>
                  <option value="Close Friend">Close Friend</option>
                  <option value="Son / Daughter">Son / Daughter</option>
                  <option value="Niece / Nephew">Niece / Nephew</option>
                  <option value="Grandchild">Grandchild</option>
                  <option value="Well-wisher">Well-wisher</option>
                  <option value="Other">Other (Specify below)</option>
                </select>

                {relationship === 'Other' && (
                  <input
                    type="text"
                    placeholder="Specify your relation..."
                    value={customRelationship}
                    onChange={(e) => setCustomRelationship(e.target.value)}
                    className="w-full mt-2 bg-[#FFFDF9] border border-[#F8DCE5] focus:border-[#B75F7D] rounded-xl px-3.5 py-2 text-sm text-[#70515A] focus:outline-none"
                  />
                )}
              </div>

              {/* Message */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#70515A]">
                    Anniversary Blessing / Message *
                  </label>
                  <span className="text-[10px] text-[#C99A9A] tabular-nums">
                    {message.length} / 500
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  maxLength={500}
                  placeholder="Share a sweet memory, prayer or anniversary wish for the happy couple..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] focus:border-[#B75F7D] rounded-xl p-3 text-sm text-[#70515A] placeholder-[#C99A9A] focus:outline-none focus:ring-1 focus:ring-[#B75F7D] resize-none"
                />
              </div>

              {/* Optional Photo URL */}
              <div>
                <label className="block text-xs font-semibold text-[#70515A] mb-1">
                  Optional Photo Link (with the couple)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full bg-[#FFFDF9] border border-[#F8DCE5] focus:border-[#B75F7D] rounded-xl px-3.5 py-2.5 text-sm text-[#70515A] placeholder-[#C99A9A] focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-white font-medium text-sm bg-gradient-to-r from-[#D88CA5] via-[#B75F7D] to-[#9E4B66] shadow-md shadow-[#B75F7D]/25 hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Blessing...' : 'Send Your Blessing ❤️'}</span>
              </button>

              <p className="text-[11px] text-center text-[#C99A9A] italic">
                Wishes appear on the wall after a quick family review to keep this space warm and spam-free.
              </p>
            </form>
          </div>

          {/* Approved Wishes Display Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F8DCE5]">
              <span className="font-serif text-lg text-[#70515A] font-semibold">
                Approved Blessings ({approvedEntries.length})
              </span>
              <span className="text-xs text-[#B75F7D] font-medium flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-[#B75F7D]" />
                All With Love
              </span>
            </div>

            {approvedEntries.length === 0 ? (
              <div className="bg-[#FCEEF2]/40 rounded-3xl p-10 text-center border border-[#F8DCE5] text-[#C99A9A]">
                <MessageCircleHeart className="w-10 h-10 mx-auto mb-2 opacity-50 text-[#B75F7D]" />
                <p className="font-serif text-lg text-[#70515A]">Be the first to leave an anniversary wish!</p>
                <p className="text-xs mt-1">Your loving words will bring a huge smile to Mom and Dad.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[560px] overflow-y-auto pr-2">
                {approvedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-[#FFFDF9] border border-[#F8DCE5] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow relative text-left"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-serif text-base sm:text-lg font-bold text-[#70515A]">
                          {entry.visitor_name}
                        </h4>
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-[#B75F7D]">
                          {entry.relationship}
                        </span>
                      </div>
                      <Heart className="w-4 h-4 text-[#D88CA5] fill-[#F8DCE5]" />
                    </div>

                    <p className="font-serif text-sm sm:text-base text-[#70515A]/90 italic leading-relaxed">
                      "{entry.message}"
                    </p>

                    {entry.photo_url && (
                      <div className="mt-3 w-20 h-20 rounded-xl overflow-hidden border border-[#F8DCE5]">
                        <img
                          src={entry.photo_url}
                          alt={entry.visitor_name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
