import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../url/base';
import AuroraBackground from '../Components/AuroraBackground';
import { GlassFilter } from '../Components/ui/LiquidGlass';
import { ShinyButton } from '../Components/ui/ShinyButton';

const gradientHeading = {
  background: 'linear-gradient(to bottom, #fecdd3, #bae6fd, #f1f5f9)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const ACTIVITY_META = {
  drill:   { icon: '🎯', accent: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.25)',  label: 'Drill'   },
  phonics: { icon: '🔤', accent: 'rgba(99,102,241,0.15)',  border: 'rgba(99,102,241,0.25)',  label: 'Phonics' },
  story:   { icon: '📖', accent: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.25)',  label: 'Story'   },
  reading: { icon: '📝', accent: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.25)',  label: 'Reading' },
};

const WEEK_ACCENTS = [
  { active: 'bg-gradient-to-r from-indigo-600 to-blue-600', text: 'text-indigo-400' },
  { active: 'bg-gradient-to-r from-violet-600 to-purple-600', text: 'text-violet-400' },
  { active: 'bg-gradient-to-r from-amber-600 to-orange-600', text: 'text-amber-400' },
  { active: 'bg-gradient-to-r from-emerald-600 to-teal-600', text: 'text-emerald-400' },
];

export default function LearningPath() {
  const navigate = useNavigate();
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [activeWeek, setActiveWeek] = useState(0);

  useEffect(() => { fetchPath(); }, []);

  const fetchPath = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/learning/path`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch learning path');
      setPath(data.data);
      if (data.data?.weeks?.length) {
        const currentWeekIdx = (data.data.currentWeek || 1) - 1;
        setActiveWeek(Math.min(currentWeekIdx, data.data.weeks.length - 1));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/learning/generate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate path');
      await fetchPath();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 relative overflow-hidden pt-20">
        <AuroraBackground />
        <div className="relative z-10 text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="w-20 h-20 rounded-full border-2 border-white/8 border-t-teal-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
          </div>
          <p className="font-cormorant text-2xl font-light text-white/50 animate-pulse">Loading your adaptive path…</p>
        </div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-8 relative overflow-hidden pt-20">
        <GlassFilter />
        <AuroraBackground />
        <div className="relative z-10 max-w-lg text-center">
          <div className="text-7xl mb-6">🗺️</div>
          <p className="text-teal-400 font-inter text-xs uppercase tracking-[0.2em] mb-4">Adaptive Learning</p>
          <h1 className="font-cormorant font-light mb-3" style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', ...gradientHeading }}>
            No Learning Path Yet
          </h1>
          <p className="text-white/35 font-inter text-base mb-8">
            Complete at least one phoneme assessment to unlock your personalized adaptive learning journey.
          </p>
          {error && (
            <div className="bg-red-500/10 border border-red-400/20 text-red-300 px-6 py-3 rounded-xl mb-6 text-sm font-inter">
              {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ShinyButton onClick={() => navigate('/overalltest')}>Start Phoneme Assessment</ShinyButton>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-3 rounded-xl border border-white/10 text-white/50 font-inter text-sm hover:border-white/20 hover:text-white/70 transition-all"
            >
              {generating ? '⏳ Generating…' : '✨ Generate Path Anyway'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allDays = path.weeks?.flatMap(w => w.days || []) || [];
  const completedDays = allDays.filter(d => d.completed).length;
  const totalDays = allDays.length;
  const overallPct = totalDays ? Math.round((completedDays / totalDays) * 100) : 0;
  const currentWeek = path.weeks?.[activeWeek];
  const wAccent = WEEK_ACCENTS[activeWeek % WEEK_ACCENTS.length];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden text-white pt-20">
      <GlassFilter />
      <AuroraBackground />

      {/* Header */}
      <div className="relative z-10 border-b border-white/5 px-6 md:px-12 py-10" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-teal-400 font-inter text-xs font-medium uppercase tracking-[0.2em]">Adaptive Learning Path</p>
                <span className="bg-teal-400/10 text-teal-400 border border-teal-400/20 px-2 py-0.5 rounded-full text-xs font-inter">
                  Stage {path.stageNumber || 1}
                </span>
              </div>
              <h1 className="font-cormorant font-light leading-tight mb-2" style={{ fontSize: 'clamp(2rem,4vw,3rem)', ...gradientHeading }}>
                {path.title}
              </h1>
              <p className="text-white/35 font-inter font-light text-sm max-w-xl">{path.planSummary}</p>
            </div>
            <div className="flex gap-4 flex-wrap">
              <div className="rounded-2xl border border-white/8 px-5 py-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="font-cormorant text-3xl text-teal-400">{overallPct}%</div>
                <div className="text-white/25 font-inter text-xs uppercase tracking-wider">Complete</div>
              </div>
              <div className="rounded-2xl border border-white/8 px-5 py-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="font-cormorant text-3xl text-white/70">{completedDays}/{totalDays}</div>
                <div className="text-white/25 font-inter text-xs uppercase tracking-wider">Days Done</div>
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-6">
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-indigo-400 transition-all duration-700"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Track mode */}
            <div className="rounded-2xl border border-white/8 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="text-white/25 font-inter text-xs uppercase tracking-widest mb-3">Adaptive Mode</div>
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {path.trackMode?.includes('Accelerated') ? '🚀' : path.trackMode?.includes('High') ? '🤝' : '📈'}
                </span>
                <span className="text-white/60 font-inter text-sm">{path.trackMode || 'Steady Mastery Track'}</span>
              </div>
            </div>

            {/* Week selector */}
            <div className="rounded-2xl border border-white/8 p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="text-white/25 font-inter text-xs uppercase tracking-widest mb-3">Weeks</div>
              <div className="space-y-2">
                {path.weeks?.map((week, idx) => {
                  const wa = WEEK_ACCENTS[idx % WEEK_ACCENTS.length];
                  const weekDays = week.days || [];
                  const weekDone = weekDays.filter(d => d.completed).length;
                  const isActive = idx === activeWeek;
                  const isCurrent = week.weekNumber === path.currentWeek;
                  return (
                    <button
                      key={week._id || idx}
                      onClick={() => setActiveWeek(idx)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                        isActive
                          ? `${wa.active} text-white shadow-lg`
                          : 'border border-white/6 hover:border-white/12 hover:bg-white/3 text-white/50'
                      }`}
                      style={isActive ? {} : { background: 'rgba(255,255,255,0.02)' }}
                    >
                      <div>
                        <div className={`text-xs uppercase font-inter mb-0.5 ${isActive ? 'text-white/70' : 'text-white/25'}`}>
                          Week {week.weekNumber} {isCurrent && !isActive ? '← Now' : ''}
                        </div>
                        <div className={`font-inter text-sm font-medium ${isActive ? 'text-white' : 'text-white/50'}`}>
                          {week.focusArea}
                        </div>
                      </div>
                      <span className={`text-xs font-inter px-2 py-1 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-white/30'
                      }`}>
                        {weekDone}/{weekDays.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-2xl border border-white/8 p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <ShinyButton onClick={() => navigate('/overalltest')} className="w-full text-sm">
                Take New Assessment
              </ShinyButton>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full rounded-xl border border-white/8 text-white/40 font-inter text-sm py-2.5 hover:border-white/15 hover:text-white/60 transition-all disabled:opacity-40"
              >
                {generating ? '⏳ Regenerating…' : '🔄 Regenerate Path'}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full rounded-xl border border-white/8 text-white/40 font-inter text-sm py-2.5 hover:border-white/15 hover:text-white/60 transition-all"
              >
                📊 View Dashboard
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {currentWeek ? (
              <>
                {/* Week header */}
                <div className="rounded-2xl border border-white/8 p-6 mb-6 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className={`absolute inset-0 opacity-10 ${wAccent.active}`} />
                  <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="text-white/30 font-inter text-xs uppercase tracking-widest mb-1">
                        Week {currentWeek.weekNumber} of {path.weeks.length}
                      </div>
                      <h2 className="font-cormorant font-light text-3xl text-white mb-1">{currentWeek.focusArea}</h2>
                      <p className="text-white/35 font-inter text-sm max-w-lg">{currentWeek.description}</p>
                    </div>
                    {currentWeek.completed ? (
                      <span className="bg-teal-400/10 text-teal-400 border border-teal-400/20 font-inter text-xs px-4 py-2 rounded-full">
                        ✅ Week Complete
                      </span>
                    ) : (
                      <span className="bg-white/5 text-white/40 border border-white/8 font-inter text-xs px-4 py-2 rounded-full">
                        {(currentWeek.days || []).filter(d => d.completed).length}/{(currentWeek.days || []).length} Days Done
                      </span>
                    )}
                  </div>
                </div>

                {/* Day cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {(currentWeek.days || []).map((day) => {
                    const meta = ACTIVITY_META[day.activityType] || ACTIVITY_META.drill;
                    const isCurrentWeekActive = currentWeek.weekNumber === path.currentWeek;
                    const isLocked = !isCurrentWeekActive && !currentWeek.completed;
                    return (
                      <div
                        key={day.dayNumber}
                        className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                          day.completed
                            ? 'border-teal-400/20'
                            : isLocked
                            ? 'border-white/4 opacity-40'
                            : 'border-white/8 hover:border-white/15 hover:-translate-y-0.5'
                        }`}
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                      >
                        {/* Card top strip */}
                        <div
                          className="p-4"
                          style={{ background: meta.accent, borderBottom: `1px solid ${meta.border}` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{meta.icon}</span>
                              <div>
                                <div className="text-white/40 font-inter text-xs uppercase">Day {day.dayNumber}</div>
                                <div className="text-white/70 font-inter text-xs">{meta.label}</div>
                              </div>
                            </div>
                            {day.completed && (
                              <div className="w-7 h-7 bg-teal-400/20 border border-teal-400/30 rounded-full flex items-center justify-center">
                                <span className="text-teal-400 text-xs">✓</span>
                              </div>
                            )}
                            {isLocked && (
                              <div className="w-7 h-7 bg-white/5 rounded-full flex items-center justify-center text-xs">🔒</div>
                            )}
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="p-4">
                          <h3 className="text-white/70 font-inter text-sm font-medium mb-2 leading-tight">{day.title}</h3>
                          <p className="text-white/25 font-inter text-xs mb-4 line-clamp-2 leading-relaxed">{day.description}</p>

                          {day.targetPhoneme && day.targetPhoneme !== 'FLUENCY' && day.targetPhoneme !== 'MASTERY' && (
                            <div className="flex items-center gap-2 mb-4">
                              <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-inter px-2 py-1 rounded-lg">
                                /{day.targetPhoneme}/
                              </span>
                              <span className="text-white/20 font-inter text-xs">{day.estimatedMinutes} min</span>
                            </div>
                          )}

                          <button
                            disabled={isLocked}
                            onClick={() =>
                              navigate(`/learning-module?pathId=${path._id}&week=${currentWeek.weekNumber}&day=${day.dayNumber}`)
                            }
                            className={`w-full py-2.5 px-4 rounded-xl font-inter text-sm transition-all ${
                              day.completed
                                ? 'bg-teal-400/10 text-teal-400 border border-teal-400/20 hover:bg-teal-400/15'
                                : isLocked
                                ? 'bg-white/3 text-white/20 cursor-not-allowed border border-white/5'
                                : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 hover:bg-indigo-500/20'
                            }`}
                          >
                            {day.completed ? '✅ Review' : isLocked ? '🔒 Locked' : `▶ ${day.actionLabel}`}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-white/25">
                <div className="text-5xl mb-4">📭</div>
                <p className="font-cormorant text-2xl font-light">No weeks found in this path.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
