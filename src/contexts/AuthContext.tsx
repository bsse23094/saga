import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
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

const isSignupVerificationRedirect = () => {
  const href = window.location.href.toLowerCase();
  return /(^|[?#&])type=signup([&#]|$)/.test(href);
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
    const cameFromSignupVerification = isSignupVerificationRedirect();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (cameFromSignupVerification && s?.user?.email_confirmed_at) {
        setEmailJustVerified(true);
      }
      if (s?.user) fetchProfile(s.user.id);
      setLoading(false);
    });

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

    return () => subscription.unsubscribe();
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
