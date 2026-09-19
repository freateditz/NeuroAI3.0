import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic2 } from 'lucide-react';
import { BubbleText } from './ui/BubbleText';
import { ShinyButton } from './ui/ShinyButton';
import { useTheme } from '../contexts/ThemeContext';

export const SonicWaveformCanvas = () => {
  const canvasRef = useRef(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.fillStyle = darkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(244, 239, 232, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const lineCount = 60;
      const segmentCount = 80;
      const height = canvas.height / 2;
      for (let i = 0; i < lineCount; i++) {
        ctx.beginPath();
        const progress = i / lineCount;
        const colorIntensity = Math.sin(progress * Math.PI);
        ctx.strokeStyle = darkMode
          ? `rgba(0, 255, 192, ${colorIntensity * 0.5})`
          : `rgba(99, 102, 241, ${colorIntensity * 0.45})`;
        ctx.lineWidth = 1.5;
        for (let j = 0; j < segmentCount + 1; j++) {
          const x = (j / segmentCount) * canvas.width;
          const distToMouse = Math.hypot(x - mouse.x, height - mouse.y);
          const mouseEffect = Math.max(0, 1 - distToMouse / 400);
          const noise = Math.sin(j * 0.1 + time + i * 0.2) * 20;
          const spike = Math.cos(j * 0.2 + time + i * 0.1) * Math.sin(j * 0.05 + time) * 50;
          const y = height + noise + spike * (1 + mouseEffect * 2);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      time += 0.02;
      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    resizeCanvas();
    draw();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [darkMode]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" style={{ background: darkMode ? '#000' : '#f4efe8' }} />;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.18 + 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function SonicWaveformHero({ onGetStarted, onExplore }) {
  const { darkMode } = useTheme();

  const overlayGradient = darkMode
    ? 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
    : 'linear-gradient(to top, #f4efe8 0%, rgba(244,239,232,0.15) 50%, transparent 100%)';
  const badgeBg = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.08)';
  const badgeBorder = darkMode ? 'rgba(255,255,255,0.10)' : 'rgba(99,102,241,0.2)';
  const badgeText = darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(28,19,8,0.55)';
  const headingColor = darkMode ? 'text-indigo-300' : 'text-indigo-800';
  const bodyText = darkMode ? 'rgba(255,255,255,0.40)' : 'rgba(28,19,8,0.55)';
  const exploreText = darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(28,19,8,0.4)';
  const exploreHover = darkMode ? 'rgba(255,255,255,0.60)' : 'rgba(28,19,8,0.7)';
  const blurBg = darkMode ? 'rgb(54,157,253)' : 'rgba(99,102,241,0.25)';
  const blurOpacity = darkMode ? 0.5 : 0.6;

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <SonicWaveformCanvas />

      <div
        className="absolute left-0 top-0 h-[500px] w-[85%] pointer-events-none z-10"
        style={{
          background: blurBg,
          filter: 'blur(337px)',
          transform: 'rotate(-30deg)',
          transformOrigin: 'top left',
          opacity: blurOpacity,
        }}
      />

      <div className="absolute inset-0 z-10" style={{ background: overlayGradient }} />

      <div className="relative z-20 text-center px-6 max-w-6xl mx-auto">
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm"
          style={{ background: badgeBg, border: `1px solid ${badgeBorder}` }}
        >
          <Mic2 className="h-3 w-3 text-teal-400" />
          <span className="text-xs font-inter font-medium tracking-[0.18em] uppercase" style={{ color: badgeText }}>
            AI-Powered Speech Learning
          </span>
        </motion.div>

        <motion.div
          custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="mb-8 whitespace-nowrap"
        >
          <BubbleText
            text="Speak. Learn. Thrive."
            headingClassName={`font-cormorant font-light tracking-tight whitespace-nowrap ${headingColor}`}
            style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', lineHeight: 0.95 }}
          />
        </motion.div>

        <motion.p
          custom={2} variants={fadeUp} initial="hidden" animate="visible"
          className="font-inter font-light text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
          style={{ color: bodyText }}
        >
          Personalized speech training for neurodiverse children — real-time AI analysis,
          3D articulation modeling, and adaptive learning paths.
        </motion.p>

        <motion.div
          custom={3} variants={fadeUp} initial="hidden" animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <ShinyButton onClick={onGetStarted}>Start Learning Free</ShinyButton>
          <button
            onClick={onExplore}
            className="px-7 py-3.5 font-inter font-light text-sm transition-colors"
            style={{ color: exploreText }}
            onMouseEnter={e => e.currentTarget.style.color = exploreHover}
            onMouseLeave={e => e.currentTarget.style.color = exploreText}
          >
            Explore Features ↓
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className={`h-px bg-gradient-to-r from-transparent ${darkMode ? 'via-teal-400/30' : 'via-indigo-400/25'} to-transparent`} />
        <div className="h-8 mx-[15%]" style={{ boxShadow: darkMode ? '0 0 30px 8px rgba(0,255,192,0.06)' : 'none' }} />
      </div>
    </div>
  );
}
