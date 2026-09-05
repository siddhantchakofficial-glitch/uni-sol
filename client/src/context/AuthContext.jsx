import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cms_token'));
  const [loading, setLoading] = useState(true);

  const [serverOnline, setServerOnline] = useState(null);

  const checkServerHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const data = await res.json();
        setServerOnline(data.status === 'online');
        return true;
      }
      setServerOnline(false);
      return false;
    } catch {
      setServerOnline(false);
      return false;
    }
  }, []);

  // Verify token & check server health on mount
  useEffect(() => {
    checkServerHealth();

    const verifyToken = async () => {
      const stored = localStorage.getItem('cms_token');
      if (!stored) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${stored}` },
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
            setToken(stored);
            setServerOnline(true);
          } else {
            localStorage.removeItem('cms_token');
            setToken(null);
          }
        } else {
          localStorage.removeItem('cms_token');
          setToken(null);
        }
      } catch {
        // Server offline – keep token for retry
        setServerOnline(false);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [checkServerHealth]);

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed.');
    }
    localStorage.setItem('cms_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
    } catch { /* silent */ }
    localStorage.removeItem('cms_token');
    setToken(null);
    setUser(null);
  }, [token]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, serverOnline, checkServerHealth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
