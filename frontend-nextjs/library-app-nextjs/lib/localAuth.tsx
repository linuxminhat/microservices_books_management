'use client';
import { createContext, useContext, useEffect, useState } from "react";

type AuthUser = {
  email: string;
  name?: string;
  roles?: string[];
  sub?: string;
};
type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        const userObj = {
          email: data.email,
          name: data.fullName || data.name,
          roles: data.role ? [data.role] : Array.isArray(data.roles) ? data.roles : [],
          sub: String(data.userId || data.id)
        };
        setUser(userObj);
        sessionStorage.setItem('authUser', JSON.stringify(userObj));

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
      credentials: 'include',
    });
    if (res.ok) {
      const { user: userResp } = await res.json();
      console.log("DEBUG login BACKEND response:", userResp);
      try {
        const tokenRes = await fetch('/api/auth/token', { credentials: 'include' });
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          const jwt = tokenData.accessToken || tokenData.idToken || '';
          if (jwt) {
            localStorage.setItem('access_token', jwt);
            sessionStorage.setItem('access_token', jwt);
          }
        }
      } catch { }

      const userObj = {
        email: userResp.email,
        name: userResp.name,
        roles: Array.isArray(userResp.roles) ? userResp.roles : [],
        sub: String(userResp.sub || ''),
      };
      setUser(userObj);
      sessionStorage.setItem('authUser', JSON.stringify(userObj));
      return true;
    } else {
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
      return false;
    }
  };

  const logout = async () => {
    await fetch('/api/auth/local/logout', { method: 'POST' });
    setUser(null);
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
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

export function getToken(): string {
  return (
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token') ||
    ""
  );
}