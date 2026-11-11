import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, KeyRound, Heart, ArrowLeft, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { signIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await signIn(email, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#FCEEF2] to-[#F8DCE5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFFDF9] border border-[#F8DCE5] rounded-3xl p-8 sm:p-10 shadow-2xl shadow-[#B75F7D]/20 text-center relative overflow-hidden">
        {/* Decorative corner blossom */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D88CA5]/20 to-transparent rounded-bl-full pointer-events-none" />

        {/* Back Link */}
        <div className="flex justify-start mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#70515A] hover:text-[#B75F7D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Anniversary Site</span>
          </Link>
        </div>

        {/* Logo / Badge */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#B75F7D] to-[#D88CA5] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#B75F7D]/25">
          <Lock className="w-6 h-6" />
        </div>

        <h1 className="font-serif text-3xl font-bold text-[#70515A] mb-1">
          Admin Portal
        </h1>
        <p className="text-xs text-[#70515A]/70 mb-6">
          Manage Forever Together content, media, letters & guestbook
        </p>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-[#70515A] mb-1.5">
              Admin Email / Account
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@forevertogether.love"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FFFDF9] border border-[#F8DCE5] focus:border-[#B75F7D] rounded-xl px-3.5 py-2.5 text-sm text-[#70515A] placeholder-[#C99A9A] focus:outline-none focus:ring-1 focus:ring-[#B75F7D]"
              />
              <Mail className="w-4 h-4 text-[#C99A9A] absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#70515A] mb-1.5">
              Password or Master Passkey *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Enter password or passkey"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FFFDF9] border border-[#F8DCE5] focus:border-[#B75F7D] rounded-xl px-3.5 py-2.5 text-sm text-[#70515A] placeholder-[#C99A9A] focus:outline-none focus:ring-1 focus:ring-[#B75F7D]"
              />
              <KeyRound className="w-4 h-4 text-[#C99A9A] absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-[#D88CA5] via-[#B75F7D] to-[#9E4B66] shadow-lg shadow-[#B75F7D]/25 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying authorization...</span>
            ) : (
              <>
                <Heart className="w-4 h-4 fill-white" />
                <span>Enter Administration Panel</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#F8DCE5] text-left">
          <p className="text-[11px] text-[#70515A]/70 leading-relaxed">
            <strong className="text-[#B75F7D] block mb-1">Quick Family Passkey:</strong>
            Use your family passkey <code className="bg-[#FCEEF2] px-1.5 py-0.5 rounded text-[#B75F7D] font-mono">forever2026</code> to log in right away, or use your registered Supabase Admin user credentials.
          </p>
        </div>
      </div>
    </div>
  );
};
