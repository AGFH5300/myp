'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useCallback } from 'react';
import type { PropsWithChildren } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Database } from '@/types/schema';
import { createClient } from '@/lib/supabase/browser';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId?: string) => {
    if (!userId) {
      setProfile(null);
      return;
    }

    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    setProfile(data ?? null);
  }, [supabase]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      await loadProfile(data.session?.user.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, next) => {
      setSession(next);
      await loadProfile(next?.user.id);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      loading,
      refreshProfile: async () => loadProfile(session?.user.id),
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, profile, loading, supabase, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
