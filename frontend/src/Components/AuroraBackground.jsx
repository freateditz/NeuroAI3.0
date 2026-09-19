import { useTheme } from "../contexts/ThemeContext";

export default function AuroraBackground({ className = "" }) {
  const { darkMode } = useTheme();

  if (darkMode) {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div className="aurora-blob-1 absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)', filter: 'blur(80px)', top: '-10%', left: '-5%' }} />
        <div className="aurora-blob-2 absolute w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)', filter: 'blur(100px)', top: '20%', right: '-10%', opacity: 0.15 }} />
        <div className="aurora-blob-3 absolute w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, #22d3ee, transparent 70%)', filter: 'blur(60px)', bottom: '10%', left: '30%', opacity: 0.10 }} />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="aurora-blob-1 absolute w-[700px] h-[700px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.22), transparent 70%)', filter: 'blur(90px)', top: '-10%', left: '-5%' }} />
      <div className="aurora-blob-2 absolute w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.18), transparent 70%)', filter: 'blur(110px)', top: '20%', right: '-10%' }} />
      <div className="aurora-blob-3 absolute w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.14), transparent 70%)', filter: 'blur(70px)', bottom: '10%', left: '30%' }} />
    </div>
  );
}
