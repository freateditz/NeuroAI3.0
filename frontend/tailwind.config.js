/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'cormorant': ['"Cormorant Garamond"', 'serif'],
        'dm-serif': ['"DM Serif Display"', 'serif'],
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        spacegroteskbold: "Space Grotesk Bold",
        spacegrotesklight: "Space Grotesk Light",
        spacegroteskmedium: "Space Grotesk Medium",
        spacegroteskregular: "Space Grotesk Regular",
        spacegrotesksemibold: "Space Grotesk Semibold",
      },
      colors: {
        neuro: {
          bg: '#050714',
          surface: 'rgba(255,255,255,0.04)',
          border: 'rgba(255,255,255,0.08)',
          indigo: '#6366f1',
          violet: '#a855f7',
          cyan: '#22d3ee',
          green: '#4ade80',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out both',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        glowPulse: {
          'from': { boxShadow: '0 0 20px rgba(99,102,241,0.2), 0 0 40px rgba(99,102,241,0.1)' },
          'to': { boxShadow: '0 0 40px rgba(99,102,241,0.5), 0 0 80px rgba(99,102,241,0.2)' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateY(-8px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(24px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glow-indigo': '0 0 40px rgba(99,102,241,0.4)',
        'glow-violet': '0 0 40px rgba(168,85,247,0.4)',
        'glow-cyan': '0 0 40px rgba(34,211,238,0.4)',
      }
    },
  },
  plugins: [],
};
