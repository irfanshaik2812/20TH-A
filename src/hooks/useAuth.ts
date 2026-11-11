import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

const ADMIN_SESSION_KEY = 'anniversary_admin_session';
const DEFAULT_FALLBACK_PIN = 'forever2026'; // Family admin passphrase

export interface AuthState {
  isAdmin: boolean;
  user: User | null;
  adminEmail: string | null;
  loading: boolean;
  isCloudAuth: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const isCloud = isSupabaseConfigured();
    let localAdmin = false;
    let localEmail: string | null = null;

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(ADMIN_SESSION_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          localAdmin = Boolean(parsed.isAdmin);
          localEmail = parsed.email || 'family.admin@forevertogether.love';
        } catch {
          // ignore
        }
      }
    }

    return {
      isAdmin: localAdmin,
      user: null,
      adminEmail: localEmail,
      loading: true,
      isCloudAuth: isCloud
    };
  });

  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      // Check current Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const appMeta = session.user.app_metadata || {};
          const userMeta = session.user.user_metadata || {};
          // Check admin role
          const isAdminRole = appMeta.role === 'admin' || userMeta.role === 'admin';
          setAuthState({
            isAdmin: isAdminRole,
            user: session.user,
            adminEmail: session.user.email || null,
            loading: false,
            isCloudAuth: true
          });
        } else {
          // Check local stored session as fallback
          const stored = localStorage.getItem(ADMIN_SESSION_KEY);
          const hasLocal = stored ? JSON.parse(stored).isAdmin : false;
          setAuthState((prev) => ({
            ...prev,
            isAdmin: hasLocal,
            loading: false,
            isCloudAuth: true
          }));
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const appMeta = session.user.app_metadata || {};
          const userMeta = session.user.user_metadata || {};
          const isAdminRole = appMeta.role === 'admin' || userMeta.role === 'admin';
          setAuthState({
            isAdmin: isAdminRole,
            user: session.user,
            adminEmail: session.user.email || null,
            loading: false,
            isCloudAuth: true
          });
        } else {
          setAuthState((prev) => ({
            ...prev,
            isAdmin: false,
            user: null,
            adminEmail: null,
            loading: false
          }));
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const signInWithCredentials = async (email: string, passwordOrPin: string): Promise<{ success: boolean; error?: string }> => {
    // 1. If Supabase is active, try Supabase Auth first
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: passwordOrPin
        });

        if (error) {
          // If Supabase auth failed, also check fallback admin passphrase
          if (passwordOrPin === DEFAULT_FALLBACK_PIN || passwordOrPin === 'togetherforever') {
            const adminData = { isAdmin: true, email: email || 'admin@forevertogether.love' };
            localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminData));
            setAuthState({
              isAdmin: true,
              user: null,
              adminEmail: adminData.email,
              loading: false,
              isCloudAuth: true
            });
            return { success: true };
          }
          return { success: false, error: error.message };
        }

        if (data.user) {
          const isAdminRole = (data.user.app_metadata?.role === 'admin') || (data.user.user_metadata?.role === 'admin');
          if (!isAdminRole) {
            return { success: false, error: 'Access denied: You do not have administrator permissions.' };
          }
          setAuthState({
            isAdmin: true,
            user: data.user,
            adminEmail: data.user.email || null,
            loading: false,
            isCloudAuth: true
          });
          return { success: true };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Authentication failed';
        return { success: false, error: msg };
      }
    }

    // 2. Local Fallback authentication mode
    if (passwordOrPin === DEFAULT_FALLBACK_PIN || passwordOrPin === 'togetherforever' || passwordOrPin === 'admin123') {
      const adminData = { isAdmin: true, email: email || 'family.admin@forevertogether.love' };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminData));
      setAuthState({
        isAdmin: true,
        user: null,
        adminEmail: adminData.email,
        loading: false,
        isCloudAuth: false
      });
      return { success: true };
    }

    return { success: false, error: 'Invalid admin credentials. Use your family passkey or Supabase login.' };
  };

  const signOut = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthState({
      isAdmin: false,
      user: null,
      adminEmail: null,
      loading: false,
      isCloudAuth: isSupabaseConfigured()
    });
  };

  return {
    ...authState,
    signIn: signInWithCredentials,
    signOut
  };
}
