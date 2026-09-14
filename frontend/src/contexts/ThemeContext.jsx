import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    // Apply dark mode class to document element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = (newDarkMode) => {
    // If newDarkMode is provided, use it; otherwise toggle
    const nextMode = newDarkMode !== undefined ? newDarkMode : !darkMode;
    setDarkMode(nextMode);
    
    // Update localStorage
    localStorage.setItem("theme", nextMode ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
