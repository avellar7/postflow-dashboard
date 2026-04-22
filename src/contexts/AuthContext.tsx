import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'member' | 'viewer';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

async function fetchProfile(userId: string): Promise<AppUser | null> {
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (!profile) return null;

  const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', userId).single();

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name || profile.email,
    role: (roleData?.role as UserRole) || 'member',
    avatar_url: profile.avatar_url,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Use setTimeout to avoid deadlock with Supabase client
        setTimeout(async () => {
          const appUser = await fetchProfile(session.user.id);
          setUser(appUser);
          setLoading(false);
        }, 0);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const appUser = await fetchProfile(session.user.id);
        setUser(appUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  }, []);

  const signup = useCallback(async (email: string, password: string, name?: string): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name || '' }, emailRedirectTo: window.location.origin },
    });
    return !error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
