import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session, EmailOtpType } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/database.types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  emailJustVerified: boolean;
  signUp: (email: string, password: string, username: string, displayName: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearEmailVerifiedFlash: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_PRODUCTION_REDIRECT = 'https://bsse23094.github.io/saga/';

const getEmailRedirectTo = () => {
  const configuredRedirect = import.meta.env.VITE_SUPABASE_EMAIL_REDIRECT_URL?.trim();
  if (configuredRedirect) return configuredRedirect;

  if (import.meta.env.PROD) return DEFAULT_PRODUCTION_REDIRECT;

  return window.location.origin;
};

const getAuthParamsFromUrl = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  const hash = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash;
  if (!hash) return params;

  if (hash.includes('?')) {
    const hashQuery = hash.slice(hash.indexOf('?') + 1);
    const hashParams = new URLSearchParams(hashQuery);
    hashParams.forEach((value, key) => params.set(key, value));
  } else {
    const hashParams = new URLSearchParams(hash);
    hashParams.forEach((value, key) => params.set(key, value));
  }

  return params;
};

const stripAuthParamsFromUrl = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const keysToRemove = ['code', 'token_hash', 'type', 'access_token', 'refresh_token', 'expires_in', 'expires_at'];
  keysToRemove.forEach((key) => params.delete(key));
  url.search = params.toString() ? `?${params.toString()}` : '';

  const hash = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash;
  if (hash) {
    if (hash.includes('?')) {
      const [hashPath, hashQuery] = hash.split('?');
      const hashParams = new URLSearchParams(hashQuery);
      keysToRemove.forEach((key) => hashParams.delete(key));
      const nextHashQuery = hashParams.toString();
      url.hash = nextHashQuery ? `#${hashPath}?${nextHashQuery}` : `#${hashPath}`;
    } else {
      const hashParams = new URLSearchParams(hash);
      keysToRemove.forEach((key) => hashParams.delete(key));
      const nextHash = hashParams.toString();
      url.hash = nextHash ? `#${nextHash}` : '';
    }
  }

  window.history.replaceState({}, document.title, url.toString());
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailJustVerified, setEmailJustVerified] = useState(false);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const authParams = getAuthParamsFromUrl();
      const code = authParams.get('code');
      const tokenHash = authParams.get('token_hash');
      const otpType = authParams.get('type');
      let verifiedInCallback = false;

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && (otpType === 'signup' || otpType === 'email')) {
          verifiedInCallback = true;
        }
      } else if (tokenHash && otpType) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType as EmailOtpType,
        });
        if (!error && (otpType === 'signup' || otpType === 'email')) {
          verifiedInCallback = true;
        }
      }

      // Get initial session
      const { data: { session: s } } = await supabase.auth.getSession();
      if (!isMounted) return;

      setSession(s);
      setUser(s?.user ?? null);
      if ((verifiedInCallback || otpType === 'signup') && s?.user?.email_confirmed_at) {
        setEmailJustVerified(true);
      }
      if (s?.user) fetchProfile(s.user.id);
      setLoading(false);
      stripAuthParamsFromUrl();
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          fetchProfile(s.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string, displayName: string) => {
    // Check if username is taken
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username.toLowerCase())
      .single();

    if (existing) return { error: 'Username is already taken.', needsConfirmation: false };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getEmailRedirectTo(),
        data: {
          username: username.toLowerCase(),
          display_name: displayName,
        },
      },
    });
    if (error) return { error: error.message, needsConfirmation: false };

    // Profile is auto-created by the database trigger (handle_new_user)
    // If email confirmation is disabled, user gets a session immediately
    const needsConfirmation = !data.session;
    return { error: null, needsConfirmation };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const clearEmailVerifiedFlash = () => {
    setEmailJustVerified(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        emailJustVerified,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        clearEmailVerifiedFlash,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
