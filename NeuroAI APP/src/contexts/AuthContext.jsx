import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const [storedUser, storedToken] = await Promise.all([
          AsyncStorage.getItem('neuroai-user'),
          AsyncStorage.getItem('neuroai-token'),
        ]);
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch {}
      setLoading(false);
    };
    restore();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    const u = data.user;
    const t = data.access_token;
    if (!t) throw new Error('No token returned from server');
    setUser(u);
    setToken(t);
    await AsyncStorage.setItem('neuroai-user', JSON.stringify(u));
    await AsyncStorage.setItem('neuroai-token', t);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    const u = data.user;
    const t = data.access_token;
    if (!t) throw new Error('No token returned from server');
    setUser(u);
    setToken(t);
    await AsyncStorage.setItem('neuroai-user', JSON.stringify(u));
    await AsyncStorage.setItem('neuroai-token', t);
    return data;
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.multiRemove(['neuroai-user', 'neuroai-token']);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, loading, login, register, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
