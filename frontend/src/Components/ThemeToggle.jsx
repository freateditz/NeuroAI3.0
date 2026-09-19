import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={() => toggleTheme()}
      className={`relative flex-shrink-0 ${className}`}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Light mode" : "Dark mode"}
      style={{
        width: 52,
        height: 28,
        borderRadius: 14,
        border: darkMode
          ? '1px solid rgba(99,102,241,0.35)'
          : '1px solid rgba(180,165,145,0.6)',
        background: darkMode
          ? 'rgba(15,13,40,0.8)'
          : 'rgba(244,239,232,0.95)',
        backdropFilter: 'blur(8px)',
        cursor: 'pointer',
        padding: 0,
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.4s ease, border-color 0.4s ease',
        boxShadow: darkMode
          ? '0 0 12px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.04)'
          : '3px 3px 8px rgba(160,148,130,0.5), -2px -2px 6px rgba(255,255,255,0.92)',
      }}
    >
      {/* Sun icon (left side) */}
      <span
        style={{
          position: 'absolute',
          left: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 11,
          lineHeight: 1,
          opacity: darkMode ? 0.3 : 1,
          transition: 'opacity 0.3s ease',
          userSelect: 'none',
        }}
      >
        ☀️
      </span>

      {/* Moon icon (right side) */}
      <span
        style={{
          position: 'absolute',
          right: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 11,
          lineHeight: 1,
          opacity: darkMode ? 1 : 0.3,
          transition: 'opacity 0.3s ease',
          userSelect: 'none',
        }}
      >
        🌙
      </span>

      {/* Sliding pill */}
      <motion.div
        animate={{ x: darkMode ? 26 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.8 }}
        style={{
          position: 'absolute',
          top: 2,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: darkMode
            ? 'linear-gradient(135deg, #6366f1, #818cf8)'
            : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          boxShadow: darkMode
            ? '0 2px 8px rgba(99,102,241,0.5)'
            : '0 2px 8px rgba(251,191,36,0.5)',
        }}
      />
    </button>
  );
}
