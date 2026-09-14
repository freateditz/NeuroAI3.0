import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

// UPDATED: Use production backend URL
const API_URL = 'https://neuro-ai-3ipn.onrender.com/api';

console.log('AuthContext initialized with API_URL:', API_URL);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load stored auth data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        // Simple token validation - check if it exists and has JWT format
        if (isValidTokenFormat(storedToken)) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Invalid token format, clear auth
          await clearAuth();
        }
      }
    } catch (err) {
      console.error('Error loading auth:', err);
      await clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  // Basic JWT format validation
  const isValidTokenFormat = (token) => {
    if (!token || typeof token !== 'string') return false;
    
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      // Check if payload can be decoded
      const payload = JSON.parse(atob(parts[1]));
      
      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  };

  const login = async (email, password) => {
    console.log('=== LOGIN ATTEMPT (Context) ===');
    console.log('Email:', email);
    console.log('URL:', `${API_URL}/auth/login`);
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // FIXED: Backend returns 'access_token' not 'token'
      const token = data.access_token || data.token;
      
      if (!token) {
        throw new Error('No token received from server');
      }

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      
      setToken(token);
      setUser(data.user);

      console.log('✅ LOGIN SUCCESSFUL (Context)');
      return { success: true };
    } catch (err) {
      const message = err.message || 'Login failed. Please try again.';
      console.error('❌ LOGIN FAILED (Context):', message);
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name, email, password, phoneNumber, childAge, region, problemDescription) => {
    console.log('=== SIGNUP ATTEMPT (Context) ===');
    console.log('URL:', `${API_URL}/auth/register`);
    console.log('Data:', { name, email, phoneNumber, childAge, region, problemDescription });
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          phoneNumber,
          childAge,
          region,
          problemDescription
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // FIXED: Backend returns 'access_token' not 'token'
      const token = data.access_token || data.token;
      
      if (!token) {
        throw new Error('No token received from server');
      }

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      
      setToken(token);
      setUser(data.user);

      console.log('✅ SIGNUP SUCCESSFUL (Context)');
      return { success: true };
    } catch (err) {
      const message = err.message || 'Signup failed. Please try again.';
      console.error('❌ SIGNUP FAILED (Context):', message);
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      // Optionally call logout endpoint if it exists
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(() => {
          // Ignore logout API errors
        });
      }
    } finally {
      await clearAuth();
      setIsLoading(false);
    }
  };

  const clearAuth = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      const updatedUser = { ...user, ...data.user };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true };
    } catch (err) {
      const message = err.message || 'Update failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }

      return { success: true };
    } catch (err) {
      const message = err.message || 'Password change failed. Please try again.';
      return { success: false, error: message };
    }
  };

  // Helper function for authenticated API requests
  const authFetch = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // If unauthorized, clear auth and throw
    if (response.status === 401) {
      await clearAuth();
      throw new Error('Session expired. Please login again.');
    }

    return response;
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!token && !!user && isValidTokenFormat(token),
    login,
    signup,
    logout,
    updateUser,
    changePassword,
    authFetch,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
