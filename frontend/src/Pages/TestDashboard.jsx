import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import RecommendationsPanel from "../Components/RecommendationsPanel";
import { API_URL } from "../url/base";
import AuroraBackground from "../Components/AuroraBackground";
import { GlassFilter, GlassCard } from "../Components/ui/LiquidGlass";
import { ShinyButton } from "../Components/ui/ShinyButton";
import { ChevronDown } from "lucide-react";

const gradientHeading = {
  background: 'linear-gradient(to bottom, #fecdd3, #bae6fd, #f1f5f9)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export default function TestDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [allTests, setAllTests] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [inviteCode, setInviteCode] = useState(null);
  const [inviteCopied, setInviteCopied] = useState(false);
  const isPremium = false;

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    fetchData();
    fetchInviteCode();
  }, [isAuthenticated]);

  const fetchInviteCode = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/parent/invite`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setInviteCode(d.data?.inviteCode || null); }
    } catch {}
  };

  const copyInviteCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode).then(() => {
        setInviteCopied(true);
        setTimeout(() => setInviteCopied(false), 2500);
      });
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, testsRes, recsRes] = await Promise.all([
        fetch(`${API_URL}/api/test/statistics`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/test/all`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/test/recommendations`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      if (statsRes.ok) { const d = await statsRes.json(); setStatistics(d.data); }
      if (testsRes.ok) { const d = await testsRes.json(); setAllTests(d.data); }
      if (recsRes.ok) { const d = await recsRes.json(); setRecommendations(d.data); }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden pt-20">
        <AuroraBackground />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-teal-400 animate-spin mx-auto mb-4" />
          <p className="font-cormorant text-2xl font-light text-white/50">Loading your progress…</p>
        </div>
      </div>
    );
  }

  const statCards = statistics ? [
    { label: 'Total Tests', value: statistics.totalTests, color: 'text-indigo-400' },
    { label: 'Completed', value: statistics.completedTests, color: 'text-teal-400' },
    { label: 'Total Attempts', value: statistics.totalAttempts, color: 'text-violet-400' },
    { label: 'Avg Accuracy', value: `${statistics.averageOverallAccuracy}%`, color: 'text-cyan-400' },
  ] : [];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden text-white pt-20">
      <GlassFilter />
      <AuroraBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-12">
          <p className="text-teal-400 font-inter text-xs font-medium uppercase tracking-[0.2em] mb-3">Progress Dashboard</p>
          <h1
            className="font-cormorant font-light leading-tight mb-3"
            style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', ...gradientHeading }}
          >
            Your Journey, <em>{user?.name}</em>
          </h1>
          <p className="text-white/35 font-inter text-sm">Track your speech improvement and celebrate milestones.</p>
        </div>

        {/* Invite Code Banner */}
        {inviteCode && (
          <div className="rounded-2xl border border-teal-500/20 p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: 'rgba(20,184,166,0.05)' }}>
            <div>
              <p className="text-teal-400 font-inter text-xs uppercase tracking-[0.18em] mb-1">Your Parent Link Code</p>
              <p className="text-white/30 font-inter text-sm">Share this code with a parent to link your account.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-semibold text-teal-300 tracking-[0.3em] select-all">{inviteCode}</span>
              <button
                onClick={copyInviteCode}
                className="px-4 py-2 rounded-xl border border-teal-500/25 text-teal-300 font-inter text-xs hover:bg-teal-400/10 transition-all"
              >
                {inviteCopied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Stat cards */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {statCards.map((s) => (
              <GlassCard key={s.label}>
                <div className="text-white/30 font-inter text-xs uppercase tracking-widest mb-2">{s.label}</div>
                <div className={`font-cormorant font-light text-4xl ${s.color}`}>{s.value}</div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Learning Path CTA */}
        <div className="relative rounded-2xl p-8 mb-10 border border-indigo-500/20 overflow-hidden" style={{ background: 'rgba(99,102,241,0.06)' }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-indigo-400 font-inter text-xs uppercase tracking-widest mb-2">AI-Powered</p>
              <h2 className="font-cormorant font-light text-3xl text-white mb-1">Your Adaptive <em>Learning Path</em></h2>
              <p className="text-white/35 font-inter text-sm max-w-md">Personalized plan based on your phoneme assessment results.</p>
            </div>
            <ShinyButton onClick={() => navigate('/learning-path')}>View My Plan</ShinyButton>
          </div>
        </div>

        {/* Phoneme Accuracy Chart */}
        {allTests.length > 0 && (
          <div className="rounded-2xl border border-white/8 p-6 mb-10" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-white/25 font-inter text-xs uppercase tracking-widest mb-1">Assessment Overview</p>
            <h2 className="font-cormorant font-light text-2xl text-white mb-6">Phoneme Accuracy</h2>
            <div className="overflow-x-auto">
              <svg width="100%" viewBox={`0 0 ${Math.max(allTests.length * 52, 400)} 180`} preserveAspectRatio="xMinYMin meet">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(v => (
                  <g key={v}>
                    <line
                      x1="0" y1={140 - v * 1.2}
                      x2={Math.max(allTests.length * 52, 400)} y2={140 - v * 1.2}
                      stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                    />
                    <text x="4" y={138 - v * 1.2} fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="Inter, sans-serif">{v}%</text>
                  </g>
                ))}
                {/* Bars */}
                {allTests.map((test, i) => {
                  const acc = test.averageAccuracy || 0;
                  const barH = acc * 1.2;
                  const x = i * 52 + 28;
                  const color = acc >= 70 ? '#2dd4bf' : acc >= 50 ? '#facc15' : '#f87171';
                  return (
                    <g key={test._id}>
                      <rect x={x - 14} y={140 - barH} width="28" height={barH} rx="4"
                        fill={color} fillOpacity="0.25" />
                      <rect x={x - 14} y={140 - barH} width="28" height="3" rx="2" fill={color} />
                      <text x={x} y={158} textAnchor="middle" fill="rgba(255,255,255,0.5)"
                        fontSize="11" fontFamily="Inter, sans-serif" fontWeight="500">
                        {test.letter}
                      </text>
                      <text x={x} y={140 - barH - 5} textAnchor="middle" fill={color}
                        fontSize="9" fontFamily="Inter, sans-serif">
                        {acc}%
                      </text>
                    </g>
                  );
                })}
                {/* 70% threshold line */}
                <line
                  x1="0" y1={140 - 70 * 1.2}
                  x2={Math.max(allTests.length * 52, 400)} y2={140 - 70 * 1.2}
                  stroke="rgba(99,102,241,0.4)" strokeWidth="1" strokeDasharray="4,3"
                />
                <text x="4" y={134 - 70 * 1.2} fill="rgba(99,102,241,0.6)" fontSize="8" fontFamily="Inter, sans-serif">Pass</text>
              </svg>
            </div>
          </div>
        )}

        {/* Best / Worst performance */}
        {statistics && (statistics.bestLetter || statistics.worstLetter) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {statistics.bestLetter && (
              <GlassCard className="border border-teal-400/15">
                <div className="text-teal-400 font-inter text-xs uppercase tracking-widest mb-3">Best Performance</div>
                <div className="font-cormorant font-light text-5xl text-teal-300 mb-1">
                  Letter {statistics.bestLetter.letter}
                </div>
                <div className="text-white/50 font-inter text-lg">{statistics.bestLetter.accuracy}% accuracy</div>
              </GlassCard>
            )}
            {statistics.worstLetter && (
              <GlassCard className="border border-violet-400/15">
                <div className="text-violet-400 font-inter text-xs uppercase tracking-widest mb-3">Needs Improvement</div>
                <div className="font-cormorant font-light text-5xl text-violet-300 mb-1">
                  Letter {statistics.worstLetter.letter}
                </div>
                <div className="text-white/50 font-inter text-lg">{statistics.worstLetter.accuracy}% accuracy</div>
              </GlassCard>
            )}
          </div>
        )}

        {/* Recommendations toggle */}
        {recommendations?.keyAreasForImprovement?.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="w-full rounded-2xl border border-white/8 p-5 text-left transition-all hover:border-indigo-500/30 hover:bg-white/3 flex items-center justify-between"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg">🎯</div>
                <div>
                  <div className="text-white/70 font-inter text-sm font-medium">Personalized Recommendations</div>
                  <div className="text-white/25 font-inter text-xs">AI-powered insights to improve faster</div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${showRecommendations ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}

        {showRecommendations && recommendations && (
          <div className="mb-10 rounded-2xl border border-white/8 overflow-hidden">
            <RecommendationsPanel recommendations={recommendations} isPremium={isPremium} />
          </div>
        )}

        {/* Tests table */}
        <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <p className="text-white/25 font-inter text-xs uppercase tracking-widest mb-1">History</p>
            <h2 className="font-cormorant font-light text-2xl text-white">All Test Results</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Letter', 'Word', 'Attempts', 'Avg Accuracy', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-3 sm:px-6 py-3 text-left text-white/25 font-inter text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allTests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-white/25 font-inter text-sm">
                      No tests taken yet. Start your first assessment!
                    </td>
                  </tr>
                ) : allTests.map((test) => (
                  <tr key={test._id} className="border-t border-white/4 transition-colors hover:bg-white/3">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className="font-cormorant text-2xl text-white/70">{test.letter}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="text-white/60 font-inter text-sm whitespace-nowrap">{test.word}</div>
                      <div className="text-white/25 font-inter text-xs hidden sm:block">{test.pronunciation}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className="text-white/50 font-inter text-sm">{test.attempts.length}/3</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`font-inter text-sm font-medium ${
                        test.averageAccuracy >= 70 ? 'text-teal-400' :
                        test.averageAccuracy >= 50 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {test.averageAccuracy}%
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full font-inter text-xs whitespace-nowrap ${
                        test.completed
                          ? 'bg-teal-400/10 text-teal-400 border border-teal-400/20'
                          : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                      }`}>
                        {test.completed ? 'Done' : 'In Progress'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <button
                        onClick={() => navigate('/overalltest')}
                        className="text-indigo-400 font-inter text-sm hover:text-indigo-300 transition-colors whitespace-nowrap"
                      >
                        {test.completed ? 'Review' : 'Go'} →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <ShinyButton onClick={() => navigate('/overalltest')}>Continue Testing</ShinyButton>
        </div>
      </div>
    </div>
  );
}
