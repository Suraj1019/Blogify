import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { readStoredUser, writeStoredUser } from './storage';

interface AuthContextValue {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(readStoredUser);

  const setUser = useCallback((next: User) => {
    writeStoredUser(next);
    setUserState(next);
  }, []);

  const logout = useCallback(() => {
    writeStoredUser(null);
    setUserState(null);
  }, []);

  const value = useMemo(() => ({ user, setUser, logout }), [user, setUser, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
