import React, { createContext, useContext, useState, ReactNode } from 'react';

export const colors = {
  dark: {
    background: '#000000',
    surface: '#1a1a1a',
    surfaceLight: '#2a2a2a',
    primary: '#6366f1',
    primaryLight: '#818cf8',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#333333',
    error: '#ef4444',
    success: '#22c55e',
  },
  light: {
    background: '#ffffff',
    surface: '#f5f5f5',
    surfaceLight: '#e5e5e5',
    primary: '#6366f1',
    primaryLight: '#818cf8',
    text: '#000000',
    textSecondary: '#666666',
    border: '#dddddd',
    error: '#ef4444',
    success: '#22c55e',
  },
};

type ThemeType = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof colors.dark;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, colors: colors[theme], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
