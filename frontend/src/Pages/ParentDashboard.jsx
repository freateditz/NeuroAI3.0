import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../url/base';
import AuroraBackground from '../Components/AuroraBackground';
import { GlassFilter } from '../Components/ui/LiquidGlass';
import { ShinyButton } from '../Components/ui/ShinyButton';
import { motion } from 'framer-motion';

const gradientHeading = {
  background: 'linear-gradient(to bottom, #fecdd3, #bae6fd, #f1f5f9)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

function AccuracyBar({ value, max = 100 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const color = pct >= 80 ? '#34d399' : pct >= 60 ? '#fbbf24' : '#f87171';
  return (
    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

function ChildProgressCard({ child, onViewProgress }) {
  const student = child.student;
  const avatar = student.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'S')}&background=6366f1&color=fff&size=64`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/8 p-6 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top left, #6366f1, transparent 60%)' }} />
      <div className="relative">
        <div className="flex items-start gap-4 mb-5">
          <img src={avatar} alt={student.name} className="w-14 h-14 rounded-full ring-2 ring-indigo-500/30 object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-cormorant font-light text-xl text-white truncate">{student.name}</h3>
            <p className="text-white/30 font-inter text-xs">{student.email}</p>
            {student.childAge && (
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-inter text-xs">
                Age {student.childAge}
              </span>
            )}
          </div>
        </div>

        {student.problemDescription && (
          <div className="mb-4 px-3 py-2 rounded-xl border border-white/6" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <span className="text-white/20 font-inter text-xs">Focus: </span>
            <span className="text-white/50 font-inter text-xs capitalize">{student.problemDescription}</span>
          </div>
        )}

        <div className="mt-4">
          <ShinyButton onClick={() => onViewProgress(child.student._id)} className="w-full">
            View Progress
          </ShinyButton>
        </div>
      </div>
    </motion.div>
  );
}

function ChildProgressModal({ childId, onClose }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/parent/children/${childId}/progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch progress');
        const data = await res.json();
        setProgress(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [childId]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 relative overflow-hidden" style={{ background: 'rgba(10,10,20,0.97)' }}>
        <div className="absolute inset-0 opacity-8 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, #6366f1, transparent 60%)' }} />

        <div className="relative z-10 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-cormorant font-light text-2xl" style={gradientHeading}>Student Progress Report</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all font-inter text-sm"
            >
              ✕ Close
            </button>
          </div>

          {loading && (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-indigo-400 animate-spin" />
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/20 p-4 text-red-300 font-inter text-sm" style={{ background: 'rgba(239,68,68,0.06)' }}>
              {error}
            </div>
          )}

          {progress && !loading && (
            <div className="space-y-6">
              {/* Overview stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Tests Taken', value: progress.testResults?.length ?? 0 },
                  { label: 'Overall Accuracy', value: `${Math.round((progress.testResults || []).reduce((s, t) => s + (t.averageAccuracy || 0), 0) / Math.max(1, (progress.testResults || []).length))}%` },
                  { label: 'Courses Enrolled', value: progress.courseProgress?.length ?? progress.overallStats?.completedCourses ?? 0 },
                  { label: 'Learning Path', value: progress.learningPath ? 'Active' : 'None' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-white/6 p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="text-white/20 font-inter text-xs uppercase tracking-widest mb-1">{s.label}</div>
                    <div className="font-cormorant text-2xl text-white">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Per-phoneme test results */}
              {progress.testResults && progress.testResults.length > 0 && (
                <div>
                  <h3 className="font-inter text-xs uppercase tracking-[0.18em] text-white/30 mb-3">Phoneme Test Results</h3>
                  <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    {progress.testResults.map((test, i) => (
                      <div
                        key={test.letter}
                        className={`flex items-center gap-4 px-5 py-3.5 ${i < progress.testResults.length - 1 ? 'border-b border-white/5' : ''}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center font-cormorant text-indigo-300 text-lg font-light flex-shrink-0">
                          {test.letter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white/60 font-inter text-sm capitalize">{test.word || test.letter}</span>
                            <span className={`font-inter text-sm font-medium ${test.averageAccuracy >= 80 ? 'text-teal-400' : test.averageAccuracy >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                              {test.averageAccuracy?.toFixed(1)}%
                            </span>
                          </div>
                          <AccuracyBar value={test.averageAccuracy} />
                        </div>
                        <span className="text-white/25 font-inter text-xs">{test.attempts?.length ?? 0} tries</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active learning path */}
              {progress.learningPath && (
                <div>
                  <h3 className="font-inter text-xs uppercase tracking-[0.18em] text-white/30 mb-3">Active Learning Path</h3>
                  <div className="rounded-2xl border border-indigo-500/20 p-5" style={{ background: 'rgba(99,102,241,0.06)' }}>
                    <div className="text-indigo-400 font-inter text-xs uppercase tracking-widest mb-1">
                      {progress.learningPath.trackMode || 'Adaptive Track'}
                    </div>
                    <div className="font-cormorant font-light text-xl text-white mb-2">{progress.learningPath.title}</div>
                    <p className="text-white/35 font-inter text-sm leading-relaxed">{progress.learningPath.planSummary}</p>
                  </div>
                </div>
              )}

              {progress.testResults?.length === 0 && !progress.learningPath && (
                <div className="text-center py-10 text-white/30 font-inter text-sm">
                  No test data yet. The student hasn't taken any phoneme assessments.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ParentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [linking, setLinking] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState('');
  const [selectedChildId, setSelectedChildId] = useState(null);

  useEffect(() => { fetchChildren(); }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/parent/children`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch linked children');
      const data = await res.json();
      setChildren(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkChild = async () => {
    if (!inviteCode.trim()) return;
    try {
      setLinking(true);
      setError(null);
      setLinkSuccess('');
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/parent/link`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: inviteCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || 'Failed to link child');
      setInviteCode('');
      setLinkSuccess('Child account linked successfully!');
      await fetchChildren();
      setTimeout(() => setLinkSuccess(''), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLinking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-white/5 border-t-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden pt-20">
      <GlassFilter />
      <AuroraBackground />

      {selectedChildId && (
        <ChildProgressModal childId={selectedChildId} onClose={() => setSelectedChildId(null)} />
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-indigo-400 font-inter text-xs uppercase tracking-[0.2em] mb-2">Parent Portal</p>
          <h1 className="font-cormorant font-light leading-tight mb-2" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', ...gradientHeading }}>
            Parent Dashboard
          </h1>
          <p className="text-white/30 font-inter text-sm">Monitor your child's speech learning journey in real time.</p>
        </motion.div>

        {/* Link Child Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/8 p-6 mb-10 relative overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}
        >
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
          <div className="relative">
            <h2 className="font-cormorant font-light text-xl text-white mb-1">Link a Student Account</h2>
            <p className="text-white/25 font-inter text-sm mb-5">Ask your child to share their 6-character invite code from their profile settings.</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter code (e.g. A1B2C3)"
                maxLength={6}
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 font-inter text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all uppercase tracking-widest"
                style={{ background: 'rgba(255,255,255,0.05)' }}
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleLinkChild()}
              />
              <ShinyButton onClick={handleLinkChild} disabled={linking || !inviteCode.trim()}>
                {linking ? 'Linking…' : 'Link Child'}
              </ShinyButton>
            </div>

            {error && (
              <div className="mt-3 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-300 font-inter text-sm" style={{ background: 'rgba(239,68,68,0.06)' }}>
                {error}
              </div>
            )}
            {linkSuccess && (
              <div className="mt-3 px-4 py-2.5 rounded-xl border border-teal-400/20 text-teal-300 font-inter text-sm" style={{ background: 'rgba(52,211,153,0.06)' }}>
                ✓ {linkSuccess}
              </div>
            )}
          </div>
        </motion.div>

        {/* Linked Children */}
        <div>
          <p className="text-white/25 font-inter text-xs uppercase tracking-[0.18em] mb-5">
            {children.length > 0 ? `Linked Students (${children.length})` : 'No Students Linked'}
          </p>

          {children.length === 0 ? (
            <div className="rounded-2xl border border-white/6 p-12 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="text-4xl mb-4">👨‍👧</div>
              <p className="text-white/30 font-inter text-sm mb-2">No student accounts linked yet.</p>
              <p className="text-white/15 font-inter text-xs">Use the invite code above to connect with your child's account.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {children.map((child) => (
                <ChildProgressCard
                  key={child.student._id}
                  child={child}
                  onViewProgress={setSelectedChildId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
