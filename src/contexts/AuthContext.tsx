import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MockUser, MOCK_USERS } from '@/types/auth';

interface AuthContextType {
  user: MockUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const STORAGE_KEY = 'postflow_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    const found = MOCK_USERS.find((u) => u.email === email);
    if (!found) return false;
    setUser(found);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
