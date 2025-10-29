'use client';
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from 'react';
import { useContext } from 'react';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthUser = {
  email: string;
  name?: string;
  roles?: string[];
  sub?: string;
}
type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const cached = sessionStorage.getItem('authUser');
    if (cached) {
      setUser(JSON.parse(cached));
    }
    const load = async () => {
      const res = await fetch('/api/auth/local/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        sessionStorage.setItem('authUser', JSON.stringify(data));
      } else {
        setUser(null);
        sessionStorage.removeItem('authUser');
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/local/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      return true;
    } else {
      return false;
    }
  }

  const logout = async () => {
    await fetch('/api/auth/local/logout', {
      method: 'POST',
    })
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </ AuthContext.Provider>
  )
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  } else {
    return ctx;
  }
}
export function useUser() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useUser must be used within AuthProvider');
  const { user, isLoading } = ctx;
  return { user, isLoading };
}