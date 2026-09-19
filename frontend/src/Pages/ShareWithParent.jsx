import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../url/base';
import AuroraBackground from '../Components/AuroraBackground';
import { GlassFilter, GlassCard } from '../Components/ui/LiquidGlass';
import { ShinyButton } from '../Components/ui/ShinyButton';
import { Check, Copy, Users, Link2 } from 'lucide-react';

const gradientHeading = {
  background: 'linear-gradient(to bottom, #fecdd3, #bae6fd, #f1f5f9)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export default function ShareWithParent() {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState('');
  const [linkedParents, setLinkedParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInviteData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/parent/invite`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch invite data');
        const data = await res.json();
        setInviteCode(data.data.inviteCode || '');
        setLinkedParents(data.data.linkedParents || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInviteData();
  }, []);

  const copyToClipboard = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden pt-20">
        <AuroraBackground />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-teal-400 animate-spin mx-auto mb-4" />
          <p className="font-cormorant text-2xl font-light text-white/50">Loading…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden pt-20">
        <AuroraBackground />
        <div className="relative z-10 text-center">
          <p className="text-red-400 font-inter text-lg">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="mt-4 text-white/40 hover:text-white font-inter text-sm">← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden text-white pt-20">
      <GlassFilter />
      <AuroraBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-teal-400 font-inter text-xs font-medium uppercase tracking-[0.2em] mb-3">Parent Connection</p>
          <h1
            className="font-cormorant font-light leading-tight mb-3"
            style={{ fontSize: 'clamp(2.5rem,5vw,3.5rem)', ...gradientHeading }}
          >
            Share With a <em>Parent</em>
          </h1>
          <p className="text-white/35 font-inter text-sm max-w-sm mx-auto">
            Connect your account so a parent can monitor your progress and celebrate your milestones.
          </p>
        </div>

        {linkedParents.length > 0 ? (
          /* Already linked */
          <GlassCard className="border border-teal-400/20 text-center py-10">
            <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-5">
              <Check className="w-7 h-7 text-teal-400" />
            </div>
            <p className="text-teal-400 font-inter text-xs uppercase tracking-widest mb-2">Connected</p>
            <h2 className="font-cormorant font-light text-3xl text-white mb-4">Parent Account Linked</h2>
            <div className="flex flex-col gap-2 mb-8">
              {linkedParents.map((p, i) => (
                <div key={i} className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4 text-white/30" />
                  <span className="font-inter text-white/60 text-sm">{p.name}</span>
                </div>
              ))}
            </div>
            <ShinyButton onClick={() => navigate('/dashboard')}>Back to Dashboard</ShinyButton>
          </GlassCard>
        ) : (
          /* Show invite code */
          <GlassCard className="text-center py-10">
            <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center mx-auto mb-5">
              <Link2 className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-white/30 font-inter text-xs uppercase tracking-widest mb-2">Your Unique Code</p>
            <h2 className="font-cormorant font-light text-3xl text-white mb-8">Invite Code</h2>

            {/* Code display */}
            <div
              className="rounded-2xl border border-white/8 p-8 mb-3 mx-4"
              style={{ background: 'rgba(99,102,241,0.06)' }}
            >
              <span className="font-mono text-5xl font-bold tracking-[0.35em] text-indigo-300 select-all">
                {inviteCode}
              </span>
            </div>

            <p className="text-white/25 font-inter text-xs mb-8 px-4">
              Ask your parent to enter this code in their NeuroAI account under "Link a Student."
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/60 font-inter text-sm hover:bg-white/5 hover:text-white transition-all"
              >
                {copied ? (
                  <><Check className="w-4 h-4 text-teal-400" /><span className="text-teal-400">Copied!</span></>
                ) : (
                  <><Copy className="w-4 h-4" /><span>Copy Code</span></>
                )}
              </button>
              <ShinyButton onClick={() => navigate('/dashboard')}>Back to Dashboard</ShinyButton>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
