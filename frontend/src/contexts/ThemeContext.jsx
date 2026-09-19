import { createContext, useContext, useEffect, useRef, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme !== "light";
  });
  const [transitioning, setTransitioning] = useState(false);
  const [nextIsDark, setNextIsDark] = useState(null);
  const timerA = useRef(null);
  const timerB = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    clearTimeout(timerA.current);
    clearTimeout(timerB.current);

    setNextIsDark(nextMode);
    setTransitioning(true);

    // Switch theme at 45% of animation so user sees the wipe reveal the new theme
    timerA.current = setTimeout(() => {
      setDarkMode(nextMode);
      localStorage.setItem("theme", nextMode ? "dark" : "light");
    }, 430);

    // Remove overlay after full animation (expand 0.65s + fade 0.4s = 1.05s)
    timerB.current = setTimeout(() => {
      setTransitioning(false);
      setNextIsDark(null);
    }, 1080);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, setDarkMode, transitioning, nextIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
