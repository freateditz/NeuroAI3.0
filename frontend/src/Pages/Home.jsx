import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import AuthModal from "../Components/AuthModal";
import SonicWaveformHero from "../Components/SonicWaveform";
import { TiltCard } from "../Components/TiltCard";
import { ShinyButton } from "../Components/ui/ShinyButton";
import { API_URL } from "../url/base";

const features = [
  { icon: "🎙️", title: "Real-Time Speech Analysis", desc: "AI analyzes pronunciation in real-time, giving instant and precise feedback on every sound.", accent: "#6366f1" },
  { icon: "🧠", title: "Adaptive Learning Paths", desc: "Pathways that evolve with each child's progress — no fixed curriculum, just the right challenge.", accent: "#7dd3fc" },
  { icon: "🫦", title: "3D Mouth Modeling", desc: "See exactly how sounds are formed. Interactive 3D articulation guides to correct mouth positions.", accent: "#c4b5fd" },
  { icon: "💬", title: "AI Confidence Chatbot", desc: "Practice conversation safely. Build fluency and confidence through real AI dialogue.", accent: "#86efac" },
  { icon: "📊", title: "Progress Tracking", desc: "Detailed weekly analysis helps parents and therapists understand progress and celebrate milestones.", accent: "#fde68a" },
  { icon: "👨‍👩‍👧", title: "Parent Dashboard", desc: "Stay connected with session summaries, progress charts, and actionable insights.", accent: "#fca5a5" },
];

function SectionGlow({ dark }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
      <div className="h-px bg-gradient-to-r from-transparent via-teal-400/25 to-transparent" />
      <div className="h-6 mx-[10%]" style={{ boxShadow: dark ? '0 0 28px 8px rgba(0,255,192,0.07)' : 'none' }} />
    </div>
  );
}

/* ── Animated waveform bars ── */
function EQBars({ count = 20, color, height = 64 }) {
  const { darkMode } = useTheme();
  const barColor = color || (darkMode ? "#00ffc0" : "#6366f1");
  const [bars, setBars] = useState(() => Array.from({ length: count }, () => Math.random() * 0.6 + 0.2));
  useEffect(() => {
    const id = setInterval(() => {
      setBars(Array.from({ length: count }, () => Math.random() * 0.85 + 0.1));
    }, 120);
    return () => clearInterval(id);
  }, [count]);
  return (
    <div className="flex items-end gap-0.5" style={{ height }}>
      {bars.map((h, i) => (
        <div key={i} className="flex-1 rounded-sm"
          style={{ height: `${h * 100}%`, background: barColor, opacity: 0.3 + h * 0.6, transition: 'height 0.12s ease-out' }} />
      ))}
    </div>
  );
}

/* ── Animated counter ── */
function Counter({ target, duration = 1800 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start = Math.min(start + step, target);
      setValue(Math.round(start));
      if (start >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return <>{value}</>;
}

/* ── Animated dashboard ── */
function AnimatedDashboard() {
  const { darkMode } = useTheme();
  const phonemes = [
    { label: '/s/', pct: 88, color: darkMode ? '#00ffc0' : '#6366f1' },
    { label: '/th/', pct: 64, color: '#7dd3fc' },
    { label: '/r/', pct: 72, color: '#c4b5fd' },
    { label: '/sh/', pct: 91, color: darkMode ? '#86efac' : '#4ade80' },
    { label: '/ch/', pct: 55, color: darkMode ? '#fde68a' : '#f59e0b' },
  ];

  const cardBg = darkMode
    ? 'rgba(255,255,255,0.03)'
    : 'linear-gradient(145deg, #faf7f2, #ede8de)';
  const cardShadow = darkMode
    ? '0 0 80px rgba(0,255,192,0.08), 0 40px 80px rgba(0,0,0,0.8)'
    : '8px 8px 24px rgba(160,148,130,0.45), -4px -4px 14px rgba(255,255,255,0.95)';
  const headerBg = darkMode ? 'rgba(0,255,192,0.04)' : 'rgba(99,102,241,0.05)';
  const tileBg = darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(255,253,250,0.85)';
  const tileBorder = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(180,165,145,0.4)';
  const trackBg = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(180,165,145,0.2)';
  const textMuted = darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(28,19,8,0.4)';
  const textFaint = darkMode ? 'rgba(255,255,255,0.20)' : 'rgba(28,19,8,0.3)';
  const textLabel = darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(28,19,8,0.5)';
  const headerText = darkMode ? 'rgba(255,255,255,0.60)' : 'rgba(28,19,8,0.65)';
  const dividerColor = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(180,165,145,0.25)';

  return (
    <div className="relative w-full rounded-2xl overflow-hidden"
      style={{ background: cardBg, boxShadow: cardShadow, border: `1px solid ${tileBorder}` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3"
        style={{ background: headerBg, borderBottom: `1px solid ${dividerColor}` }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="font-inter text-xs font-medium tracking-wider uppercase" style={{ color: headerText }}>NeuroAI Live Analysis</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className="font-inter text-xs" style={{ color: textFaint }}>Recording...</span>
        </div>
      </div>

      {/* Metric tiles */}
      <div className="grid grid-cols-3 gap-3 p-5">
        {[
          { label: 'Session Score', value: 94, suffix: '%', color: darkMode ? '#00ffc0' : '#4338ca' },
          { label: 'Phonemes Detected', value: 247, suffix: '', color: '#7dd3fc' },
          { label: 'Day Streak', value: 7, suffix: 'd', color: '#c4b5fd' },
        ].map((m) => (
          <div key={m.label} className="rounded-xl p-3 text-center"
            style={{ background: tileBg, border: `1px solid ${tileBorder}` }}>
            <div className="font-cormorant font-light text-2xl" style={{ color: m.color }}>
              <Counter target={m.value} />{m.suffix}
            </div>
            <div className="font-inter text-xs mt-0.5" style={{ color: textMuted }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* EQ */}
      <div className="px-5 pb-4">
        <div className="font-inter text-xs mb-2 uppercase tracking-widest" style={{ color: textFaint }}>Live Waveform</div>
        <EQBars count={30} height={56} />
      </div>

      {/* Phoneme breakdown */}
      <div className="px-5 pb-5 pt-4" style={{ borderTop: `1px solid ${dividerColor}` }}>
        <div className="font-inter text-xs uppercase tracking-widest mb-3" style={{ color: textMuted }}>Today's Phonemes</div>
        <div className="space-y-2">
          {phonemes.map((p) => (
            <div key={p.label} className="flex items-center gap-3">
              <span className="font-inter text-xs w-8 shrink-0" style={{ color: textLabel }}>{p.label}</span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: trackBg }}>
                <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color, transition: 'width 1.2s ease-out' }} />
              </div>
              <span className="font-inter text-xs w-8 text-right" style={{ color: textMuted }}>{p.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Oscilloscope ── */
function OscilloscopePanel() {
  const { darkMode } = useTheme();
  const canvasRef = useRef(null);

  const waveColors = darkMode
    ? [
        { color: '#00ffc0', freq: 1.8, amp: 22, phase: 0, alpha: 0.8 },
        { color: '#7dd3fc', freq: 2.6, amp: 14, phase: 1.2, alpha: 0.6 },
        { color: '#c4b5fd', freq: 1.2, amp: 18, phase: 2.5, alpha: 0.5 },
      ]
    : [
        { color: '#6366f1', freq: 1.8, amp: 22, phase: 0, alpha: 0.7 },
        { color: '#7dd3fc', freq: 2.6, amp: 14, phase: 1.2, alpha: 0.6 },
        { color: '#a855f7', freq: 1.2, amp: 18, phase: 2.5, alpha: 0.5 },
      ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame;
    let t = 0;
    const draw = () => {
      canvas.width = canvas.offsetWidth || 300;
      canvas.height = 80;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      waveColors.forEach(({ color, freq, amp, phase, alpha }) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1.5;
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = canvas.height / 2 + Math.sin((x / canvas.width) * Math.PI * 2 * freq + t + phase) * amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      t += 0.04;
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [darkMode]);

  const panelBg = darkMode ? 'rgba(255,255,255,0.015)' : 'linear-gradient(145deg, #faf7f2, #ede8de)';
  const panelShadow = darkMode ? 'none' : '7px 7px 18px rgba(160,148,130,0.45), -4px -4px 12px rgba(255,255,255,0.92)';
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.72)';
  const textFaint = darkMode ? 'rgba(255,255,255,0.30)' : 'rgba(28,19,8,0.45)';
  const textVfaint = darkMode ? 'rgba(255,255,255,0.20)' : 'rgba(28,19,8,0.35)';
  const tileBg = darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(255,253,250,0.85)';
  const tileBorder = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(180,165,145,0.35)';

  const metricColors = darkMode
    ? [{ label: "Accuracy", value: "94%", color: "#00ffc0" }, { label: "Fluency", value: "87%", color: "#7dd3fc" }, { label: "Clarity", value: "91%", color: "#c4b5fd" }]
    : [{ label: "Accuracy", value: "94%", color: "#4338ca" }, { label: "Fluency", value: "87%", color: "#0891b2" }, { label: "Clarity", value: "91%", color: "#7c3aed" }];

  return (
    <div className="rounded-2xl p-8" style={{ background: panelBg, boxShadow: panelShadow, border: `1px solid ${borderColor}` }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="font-inter text-xs uppercase tracking-widest" style={{ color: textFaint }}>Live analysis</span>
        </div>
        <div className="flex items-center gap-3 font-inter text-xs" style={{ color: textVfaint }}>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 inline-block rounded" style={{ background: darkMode ? '#00ffc0' : '#6366f1' }} />Accuracy</span>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 inline-block rounded bg-sky-300" />Fluency</span>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 inline-block rounded" style={{ background: '#c4b5fd' }} />Rhythm</span>
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full" style={{ height: 80 }} />
      <div className="grid grid-cols-3 gap-3 mt-6">
        {metricColors.map((m) => (
          <div key={m.label} className="text-center p-3 rounded-xl"
            style={{ background: tileBg, border: `1px solid ${tileBorder}` }}>
            <div className="font-cormorant font-light text-2xl" style={{ color: m.color }}>{m.value}</div>
            <div className="font-inter text-xs mt-0.5" style={{ color: textFaint }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Circle progress rings ── */
function CircleRing({ pct, color, label, size = 90, darkMode }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  const trackStroke = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(180,165,145,0.3)';
  const textColor = darkMode ? 'rgba(255,255,255,0.30)' : 'rgba(28,19,8,0.55)';
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackStroke} strokeWidth={5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s ease-out' }} />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
          style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fill: color, fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
          {pct}%
        </text>
      </svg>
      <span className="font-inter text-xs text-center" style={{ color: textColor }}>{label}</span>
    </div>
  );
}

function CircleProgressPanel() {
  const { darkMode } = useTheme();
  const metrics = darkMode
    ? [
        { label: "Phoneme Recognition", pct: 92, color: "#00ffc0" },
        { label: "Articulation Clarity", pct: 78, color: "#7dd3fc" },
        { label: "Fluency & Rhythm", pct: 65, color: "#c4b5fd" },
        { label: "Confidence", pct: 85, color: "#86efac" },
      ]
    : [
        { label: "Phoneme Recognition", pct: 92, color: "#4338ca" },
        { label: "Articulation Clarity", pct: 78, color: "#0891b2" },
        { label: "Fluency & Rhythm", pct: 65, color: "#7c3aed" },
        { label: "Confidence", pct: 85, color: "#16a34a" },
      ];

  const panelBg = darkMode ? 'rgba(255,255,255,0.015)' : 'linear-gradient(145deg, #faf7f2, #ede8de)';
  const panelShadow = darkMode ? 'none' : '7px 7px 18px rgba(160,148,130,0.45), -4px -4px 12px rgba(255,255,255,0.92)';
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.72)';
  const textFaint = darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(28,19,8,0.4)';
  const tipBg = darkMode ? 'rgba(0,255,192,0.04)' : 'rgba(99,102,241,0.06)';
  const tipBorder = darkMode ? 'rgba(0,255,192,0.15)' : 'rgba(99,102,241,0.2)';
  const tipText = darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(28,19,8,0.55)';

  return (
    <div className="rounded-2xl p-8" style={{ background: panelBg, boxShadow: panelShadow, border: `1px solid ${borderColor}` }}>
      <p className="font-inter text-xs uppercase tracking-widest mb-6" style={{ color: textFaint }}>Learning Progress</p>
      <div className="grid grid-cols-2 gap-6 justify-items-center">
        {metrics.map((m) => <CircleRing key={m.label} pct={m.pct} color={m.color} label={m.label} size={100} darkMode={darkMode} />)}
      </div>
      <div className="mt-6 p-4 rounded-xl" style={{ background: tipBg, border: `1px solid ${tipBorder}` }}>
        <div className={`${darkMode ? 'text-teal-400' : 'text-indigo-600'} font-inter text-xs font-medium mb-1`}>AI Recommendation</div>
        <div className="font-inter font-light text-sm" style={{ color: tipText }}>Focus on Fluency exercises today — you're close to a breakthrough.</div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { darkMode } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const featuresRef = useRef(null);

  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const getStarted = () => { if (isAuthenticated) navigate("/learning"); else setIsAuthModalOpen(true); };
  const scrollToFeatures = () => featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  const handleInputChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      setNotification({ show: true, message: data.success ? "Message sent!" : (data.message || "Failed"), type: data.success ? "success" : "error" });
      if (data.success) setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "", message: "" });
    } catch { setNotification({ show: true, message: "An error occurred.", type: "error" }); }
    finally { setIsSubmitting(false); setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000); }
  };

  /* ── Theme tokens ── */
  const bg = darkMode ? '#000' : '#f4efe8';
  const bgAlt = darkMode ? '#030303' : '#ede7dd';
  const gradientHeading = darkMode
    ? { background: 'linear-gradient(to bottom, #fecdd3, #bae6fd, #f1f5f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
    : { background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #6d28d9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
  const textBody = darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(28,19,8,0.55)';
  const textFaint = darkMode ? 'rgba(255,255,255,0.30)' : 'rgba(28,19,8,0.45)';
  const cardBorder = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(180,165,145,0.45)';
  const cardBg = darkMode ? 'rgba(255,255,255,0.015)' : 'linear-gradient(145deg, #faf7f2, #ede8de)';
  const cardShadow = darkMode ? 'none' : '7px 7px 18px rgba(160,148,130,0.4), -4px -4px 12px rgba(255,255,255,0.9)';
  const featureGridBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(180,165,145,0.25)';
  const inputBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,253,250,0.9)';
  const inputBorder = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(180,165,145,0.5)';
  const inputText = darkMode ? '#fff' : '#1c1308';
  const inputPlaceholder = darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(28,19,8,0.32)';
  const labelColor = darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(28,19,8,0.45)';

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    background: inputBg, border: `1px solid ${inputBorder}`, color: inputText,
    fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none',
    boxShadow: darkMode ? 'none' : 'inset 2px 2px 5px rgba(160,148,130,0.25), inset -1px -1px 4px rgba(255,255,255,0.9)',
  };

  return (
    <div style={{ background: bg, color: darkMode ? '#f8fafc' : '#1c1308' }} className="overflow-x-hidden">
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl font-inter text-sm border ${notification.type === "success" ? "bg-teal-500/10 border-teal-500/25 text-teal-300" : "bg-red-500/10 border-red-500/25 text-red-300"}`}>
          {notification.message}
        </div>
      )}

      {/* HERO */}
      <SonicWaveformHero onGetStarted={getStarted} onExplore={scrollToFeatures} />

      {/* STATS */}
      <section className="relative py-28 overflow-hidden glow-border-bottom" style={{ background: bg }}>
        <div className="absolute left-0 w-[80%] h-64 pointer-events-none"
          style={{ background: darkMode ? 'rgb(54,157,253)' : 'rgba(99,102,241,0.12)', filter: 'blur(337px)', transform: 'translateY(-50%) rotate(-25deg)', top: '50%', opacity: darkMode ? 0.4 : 0.7 }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {[
              { value: '8+', label: 'Speech Disorders', sub: 'Supported' },
              { value: '3D', label: 'Mouth', sub: 'Articulation Model' },
              { value: 'AI', label: 'Adaptive', sub: 'Learning System' },
              { value: '500+', label: 'Families', sub: 'Helped Worldwide' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-cormorant leading-none tracking-tight mb-2"
                  style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', fontWeight: darkMode ? 300 : 400, ...gradientHeading }}>
                  {s.value}
                </div>
                <div className="font-inter font-medium text-sm" style={{ color: darkMode ? 'rgba(255,255,255,0.60)' : 'rgba(28,19,8,0.65)' }}>{s.label}</div>
                <div className="font-inter text-xs mt-0.5" style={{ color: textFaint }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="relative">
            <div className="absolute inset-x-[5%] top-6 h-32 pointer-events-none"
              style={{ background: darkMode ? 'rgba(0,255,192,0.08)' : 'rgba(99,102,241,0.06)', filter: 'blur(60px)' }} />
            <AnimatedDashboard />
          </div>
        </div>
        <SectionGlow dark={darkMode} />
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} id="features" className="relative py-32 overflow-hidden glow-border-bottom" style={{ background: bg }}>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <p className={`${darkMode ? 'text-teal-400' : 'text-indigo-600'} font-inter text-xs font-medium uppercase tracking-[0.2em] mb-5`}>What we offer</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="font-cormorant leading-[0.95] tracking-tight max-w-lg"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: darkMode ? 300 : 400, ...gradientHeading }}>
                Built for<br /><em>every mind</em>
              </h2>
              <p className="font-inter font-light text-sm max-w-xs leading-relaxed" style={{ color: textBody }}>
                Six tools that work together to create a complete, personalized learning journey.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px rounded-3xl overflow-hidden"
            style={{ background: featureGridBg, border: `1px solid ${cardBorder}` }}>
            {features.map((f) => (
              <TiltCard key={f.title} effect="gravitate" tiltLimit={8} style={{ background: bg }}>
                <div className="p-8 h-full transition-colors duration-300"
                  style={{ background: 'transparent' }}>
                  <div className="text-3xl mb-5">{f.icon}</div>
                  <h3 className="font-inter font-semibold text-sm mb-3"
                    style={{ color: darkMode ? f.accent : '#3730a3' }}>{f.title}</h3>
                  <p className="font-inter font-light text-sm leading-relaxed" style={{ color: textBody }}>{f.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
        <SectionGlow dark={darkMode} />
      </section>

      {/* STRENGTHS */}
      <section id="strengths" className="relative py-32 overflow-hidden glow-border-bottom" style={{ background: bgAlt }}>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center mb-32">
            <div>
              <p className={`${darkMode ? 'text-teal-400' : 'text-indigo-600'} font-inter text-xs font-medium uppercase tracking-[0.2em] mb-6`}>Speech Intelligence</p>
              <h3 className="font-cormorant leading-[0.95] tracking-tight mb-6"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: darkMode ? 300 : 400, ...gradientHeading }}>
                Real-Time Detection<br /><em>&amp; Weekly Analysis</em>
              </h3>
              <p className="font-inter font-light text-base leading-relaxed mb-8 max-w-md" style={{ color: textBody }}>
                Our platform doesn't just hear words — it analyzes every phoneme and guides children toward clarity and confidence.
              </p>
              <div className="flex items-center gap-6 font-inter text-xs" style={{ color: textBody }}>
                <div className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${darkMode ? 'bg-teal-400' : 'bg-indigo-500'}`} />Phoneme-level accuracy</div>
                <div className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${darkMode ? 'bg-teal-400' : 'bg-indigo-500'}`} />Weekly reports</div>
              </div>
            </div>
            <OscilloscopePanel />
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <CircleProgressPanel />
            <div className="lg:order-2 order-1">
              <p className={`${darkMode ? 'text-teal-400' : 'text-indigo-600'} font-inter text-xs font-medium uppercase tracking-[0.2em] mb-6`}>Adaptive AI</p>
              <h3 className="font-cormorant leading-[0.95] tracking-tight mb-6"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: darkMode ? 300 : 400, ...gradientHeading }}>
                Personalized<br /><em>Adaptive Learning</em>
              </h3>
              <p className="font-inter font-light text-base leading-relaxed mb-8 max-w-md" style={{ color: textBody }}>
                NeuroAI adjusts difficulty and content based on each child's performance — a custom path instead of a fixed curriculum.
              </p>
              <div className="space-y-3">
                {["Adjusts to individual performance in real-time", "No fixed curriculum — fully dynamic", "Tracks and celebrates every milestone"].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className={`w-1 h-1 rounded-full mt-2 flex-shrink-0 ${darkMode ? 'bg-teal-400' : 'bg-indigo-500'}`} />
                    <span className="font-inter font-light text-sm" style={{ color: textBody }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <SectionGlow dark={darkMode} />
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative py-32 overflow-hidden glow-border-bottom" style={{ background: bg }}>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className={`${darkMode ? 'text-teal-400' : 'text-indigo-600'} font-inter text-xs font-medium uppercase tracking-[0.2em] mb-5`}>Pricing</p>
            <h2 className="font-cormorant leading-[0.95] tracking-tight mb-5"
              style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: darkMode ? 300 : 400, ...gradientHeading }}>
              Simple &amp; <em>transparent</em>
            </h2>
            <p className="font-inter font-light text-base max-w-sm mx-auto" style={{ color: textFaint }}>Start free. Upgrade when you're ready.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <TiltCard effect="gravitate" tiltLimit={8} className="rounded-2xl">
              <div className="h-full p-8 rounded-2xl transition-colors" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}>
                <h3 className="font-inter font-semibold text-lg mb-1" style={{ color: darkMode ? '#fff' : '#1c1308' }}>Freemium</h3>
                <p className="font-inter text-xs mb-7" style={{ color: textFaint }}>Perfect for getting started</p>
                <div className="mb-8">
                  <span className="font-cormorant font-light text-6xl" style={{ color: darkMode ? '#fff' : '#1c1308' }}>₹0</span>
                  <span className="font-inter text-sm ml-2" style={{ color: textFaint }}>/forever</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {["5 practice sessions / week", "Basic phonics training", "Progress tracking", "Community articles"].map((f) => (
                    <li key={f} className="flex items-center gap-3 font-inter text-sm" style={{ color: textBody }}>
                      <div className={`w-1 h-1 rounded-full flex-shrink-0 ${darkMode ? 'bg-teal-400/50' : 'bg-indigo-400/70'}`} />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={getStarted} className="w-full py-3 rounded-xl font-inter text-sm transition-all"
                  style={{ border: `1px solid ${cardBorder}`, color: textBody, background: 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(99,102,241,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = cardBorder}>
                  Get Started Free
                </button>
              </div>
            </TiltCard>

            <TiltCard effect="gravitate" tiltLimit={8} className="rounded-2xl">
              <div className="relative h-full p-8 rounded-2xl overflow-hidden"
                style={{ background: darkMode ? 'rgba(0,255,192,0.03)' : 'linear-gradient(145deg, #f0eeff, #e4dfff)', border: `1px solid ${darkMode ? 'rgba(0,255,192,0.15)' : 'rgba(99,102,241,0.3)'}`, boxShadow: darkMode ? 'none' : '7px 7px 18px rgba(160,148,130,0.4), -4px -4px 12px rgba(255,255,255,0.9)' }}>
                <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full font-inter text-xs"
                  style={{ color: darkMode ? '#2dd4bf' : '#4338ca', background: darkMode ? 'rgba(0,255,192,0.06)' : 'rgba(99,102,241,0.1)', border: `1px solid ${darkMode ? 'rgba(0,255,192,0.2)' : 'rgba(99,102,241,0.3)'}` }}>Popular</div>
                <h3 className="font-inter font-semibold text-lg mb-1" style={{ color: darkMode ? '#fff' : '#1c1308' }}>Premium</h3>
                <p className="font-inter text-xs mb-7" style={{ color: textFaint }}>Unlock your full potential</p>
                <div className="mb-8">
                  <span className="font-cormorant font-light text-6xl" style={{ color: darkMode ? '#fff' : '#1c1308' }}>₹499</span>
                  <span className="font-inter text-sm ml-2" style={{ color: textFaint }}>/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {["Unlimited practice sessions", "Advanced 3D animations", "Real-time speech analysis", "Personalized learning paths", "Weekly reports & certificates", "Priority support"].map((f) => (
                    <li key={f} className="flex items-center gap-3 font-inter text-sm" style={{ color: darkMode ? 'rgba(255,255,255,0.55)' : 'rgba(28,19,8,0.7)' }}>
                      <div className={`w-1 h-1 rounded-full flex-shrink-0 ${darkMode ? 'bg-teal-400' : 'bg-indigo-500'}`} />{f}
                    </li>
                  ))}
                </ul>
                <ShinyButton onClick={getStarted} className="w-full text-sm py-3">Upgrade to Premium</ShinyButton>
              </div>
            </TiltCard>
          </div>
        </div>
        <SectionGlow dark={darkMode} />
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6 overflow-hidden glow-border-bottom" style={{ background: bgAlt }}>
        <div className="relative z-10 max-w-3xl mx-auto rounded-2xl p-6 sm:p-12 text-center"
          style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}>
          <h2 className="font-cormorant leading-[0.95] tracking-tight mb-5"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: darkMode ? 300 : 400, ...gradientHeading }}>
            Let's make<br /><em>things happen.</em>
          </h2>
          <p className="font-inter font-light text-base mb-8 max-w-sm mx-auto" style={{ color: textFaint }}>
            Expert articles on speech disorders, learning strategies, and supporting neurodiverse children.
          </p>
          <button onClick={() => navigate('/articles')}
            className="px-7 py-3 rounded-xl font-inter text-sm transition-all"
            style={{ border: `1px solid ${darkMode ? 'rgba(0,255,192,0.2)' : 'rgba(99,102,241,0.3)'}`, color: darkMode ? '#2dd4bf' : '#4338ca', background: 'transparent' }}>
            Read Articles →
          </button>
        </div>
        <SectionGlow dark={darkMode} />
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-32 px-6 overflow-hidden" style={{ background: bg }}>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="mb-16">
            <p className={`${darkMode ? 'text-teal-400' : 'text-indigo-600'} font-inter text-xs font-medium uppercase tracking-[0.2em] mb-5`}>Contact</p>
            <h2 className="font-cormorant leading-[0.95] tracking-tight mb-4"
              style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: darkMode ? 300 : 400, ...gradientHeading }}>
              Connect with <em>us</em>
            </h2>
            <p className="font-inter font-light text-base" style={{ color: textFaint }}>Questions, feedback, or partnership inquiries.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-inter text-xs uppercase tracking-widest mb-2" style={{ color: labelColor }}>First Name</label>
                <input name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} required placeholder="John" style={inputStyle} />
              </div>
              <div>
                <label className="block font-inter text-xs uppercase tracking-widest mb-2" style={{ color: labelColor }}>Last Name</label>
                <input name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} required placeholder="Doe" style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="block font-inter text-xs uppercase tracking-widest mb-2" style={{ color: labelColor }}>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="you@example.com" style={inputStyle} />
            </div>
            <div>
              <label className="block font-inter text-xs uppercase tracking-widest mb-2" style={{ color: labelColor }}>Phone</label>
              <input name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleInputChange} required placeholder="+91 98765 43210" style={inputStyle} />
            </div>
            <div>
              <label className="block font-inter text-xs uppercase tracking-widest mb-2" style={{ color: labelColor }}>Message</label>
              <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={4} placeholder="How can we help?" style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <ShinyButton type="submit" className="w-full text-sm">
              {isSubmitting ? "Sending..." : "Send Message →"}
            </ShinyButton>
          </form>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} mode="signup" />
    </div>
  );
}
