// src/Context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setUser(null); setLoading(false); return; }
    try {
      const res = await axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refresh: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

