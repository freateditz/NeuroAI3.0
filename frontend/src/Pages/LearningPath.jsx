import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../url/base';

const ACTIVITY_META = {
  drill:   { icon: '🎯', color: 'from-violet-500 to-purple-600',  badge: 'bg-violet-100 text-violet-700',  label: 'Drill'   },
  phonics: { icon: '🔤', color: 'from-blue-500 to-indigo-600',   badge: 'bg-blue-100 text-blue-700',     label: 'Phonics' },
  story:   { icon: '📖', color: 'from-amber-500 to-orange-600',  badge: 'bg-amber-100 text-amber-700',   label: 'Story'   },
  reading: { icon: '📝', color: 'from-green-500 to-emerald-600', badge: 'bg-green-100 text-green-700',   label: 'Reading' },
};

const WEEK_COLORS = [
  { bg: 'from-blue-600 to-indigo-700',   light: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700'   },
  { bg: 'from-purple-600 to-violet-700', light: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  { bg: 'from-amber-500 to-orange-600',  light: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700'  },
  { bg: 'from-green-600 to-emerald-700', light: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700'  },
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
        // Default to current active week
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

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
        </div>
        <p className="text-gray-500 font-medium animate-pulse">Loading your adaptive path…</p>
      </div>
    );
  }

  // ─── No path yet ──────────────────────────────────────────────────────────────
  if (!path) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white p-8">
        <div className="text-8xl mb-6 animate-bounce">🗺️</div>
        <h1 className="text-4xl font-black mb-3 text-center">No Learning Path Yet</h1>
        <p className="text-blue-200 text-lg text-center max-w-md mb-8">
          Complete at least one phoneme assessment to unlock your personalized adaptive learning journey.
        </p>
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-6 py-3 rounded-xl mb-6 text-sm max-w-md text-center">
            {error}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/overalltest')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transition-all transform hover:-translate-y-0.5 text-lg"
          >
            🎙️ Start Phoneme Assessment
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-4 px-8 rounded-2xl transition-all text-lg"
          >
            {generating ? '⏳ Generating…' : '✨ Generate Path Anyway'}
          </button>
        </div>
      </div>
    );
  }

  // ─── Compute stats ────────────────────────────────────────────────────────────
  const allDays = path.weeks?.flatMap(w => w.days || []) || [];
  const completedDays = allDays.filter(d => d.completed).length;
  const totalDays = allDays.length;
  const overallPct = totalDays ? Math.round((completedDays / totalDays) * 100) : 0;
  const currentWeek = path.weeks?.[activeWeek];
  const wColors = WEEK_COLORS[activeWeek % WEEK_COLORS.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-spacegroteskmedium">
      {/* ── Hero Header ── */}
      <div className={`bg-gradient-to-r ${wColors.bg} text-white px-6 md:px-16 py-10 shadow-xl`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">
                <span>🧠</span><span>Adaptive Learning Path</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full">Stage {path.stageNumber || 1}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-2">{path.title}</h1>
              <p className="text-white/80 max-w-xl text-sm md:text-base">{path.planSummary}</p>
            </div>
            <div className="flex gap-4 shrink-0">
              <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-[90px]">
                <div className="text-2xl font-black">{overallPct}%</div>
                <div className="text-xs text-white/70 uppercase font-semibold">Complete</div>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-[90px]">
                <div className="text-2xl font-black">{completedDays}/{totalDays}</div>
                <div className="text-xs text-white/70 uppercase font-semibold">Days Done</div>
              </div>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="mt-6">
            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-700"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── Left Sidebar ── */}
          <div className="lg:col-span-1 space-y-5">
            {/* Track Mode */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Adaptive Mode</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {path.trackMode?.includes('Accelerated') ? '🚀' : path.trackMode?.includes('High') ? '🤝' : '📈'}
                </span>
                <span className="font-bold text-gray-800 text-sm">{path.trackMode || 'Steady Mastery Track'}</span>
              </div>
            </div>

            {/* Week Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Weeks</div>
              <div className="space-y-2">
                {path.weeks?.map((week, idx) => {
                  const wc = WEEK_COLORS[idx % WEEK_COLORS.length];
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
                          ? `bg-gradient-to-r ${wc.bg} text-white shadow-md`
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div>
                        <div className={`text-xs font-bold uppercase mb-0.5 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                          Week {week.weekNumber} {isCurrent && !isActive ? '← Current' : ''}
                        </div>
                        <div className={`font-bold text-sm ${isActive ? 'text-white' : ''}`}>{week.focusArea}</div>
                      </div>
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {weekDone}/{weekDays.length}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
              <button
                onClick={() => navigate('/overalltest')}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all text-sm shadow-md hover:shadow-lg"
              >
                🎙️ Take New Assessment
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all text-sm border border-gray-200"
              >
                {generating ? '⏳ Regenerating…' : '🔄 Regenerate Path'}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all text-sm border border-gray-200"
              >
                📊 View Dashboard
              </button>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="lg:col-span-3">
            {currentWeek ? (
              <>
                {/* Week header */}
                <div className={`bg-gradient-to-r ${wColors.bg} rounded-3xl p-6 mb-6 text-white shadow-xl`}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-1">
                        Week {currentWeek.weekNumber} of {path.weeks.length}
                      </div>
                      <h2 className="text-3xl font-black mb-1">{currentWeek.focusArea}</h2>
                      <p className="text-white/80 text-sm max-w-lg">{currentWeek.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {currentWeek.completed ? (
                        <span className="bg-green-400 text-white font-bold px-4 py-2 rounded-full text-sm shadow-md">
                          ✅ Week Complete!
                        </span>
                      ) : (
                        <span className="bg-white/20 text-white font-bold px-4 py-2 rounded-full text-sm">
                          {(currentWeek.days || []).filter(d => d.completed).length}/{(currentWeek.days || []).length} Days Done
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Day cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {(currentWeek.days || []).map((day, dayIdx) => {
                    const meta = ACTIVITY_META[day.activityType] || ACTIVITY_META.drill;
                    const isCurrentWeekActive = currentWeek.weekNumber === path.currentWeek;
                    const isLocked = !isCurrentWeekActive && !currentWeek.completed;
                    return (
                      <div
                        key={day.dayNumber}
                        className={`bg-white rounded-2xl border-2 shadow-sm transition-all duration-200 overflow-hidden ${
                          day.completed
                            ? 'border-green-200 shadow-green-50'
                            : isLocked
                            ? 'border-gray-100 opacity-60'
                            : 'border-gray-100 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5'
                        }`}
                      >
                        {/* Card header gradient */}
                        <div className={`bg-gradient-to-r ${meta.color} p-4 text-white`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{meta.icon}</span>
                              <div>
                                <div className="text-xs font-bold text-white/70 uppercase">Day {day.dayNumber}</div>
                                <div className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/20`}>
                                  {meta.label}
                                </div>
                              </div>
                            </div>
                            {day.completed && (
                              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md">
                                ✓
                              </div>
                            )}
                            {isLocked && (
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                                🔒
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-2 text-sm leading-tight">{day.title}</h3>
                          <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">{day.description}</p>

                          {day.targetPhoneme && day.targetPhoneme !== 'FLUENCY' && day.targetPhoneme !== 'MASTERY' && (
                            <div className="flex items-center gap-2 mb-4">
                              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded-lg">
                                Focus: /{day.targetPhoneme}/
                              </span>
                              <span className="text-gray-400 text-xs">{day.estimatedMinutes} min</span>
                            </div>
                          )}

                          <button
                            disabled={isLocked}
                            onClick={() =>
                              navigate(`/learning-module?pathId=${path._id}&week=${currentWeek.weekNumber}&day=${day.dayNumber}`)
                            }
                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
                              day.completed
                                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                : isLocked
                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
                                : `bg-gradient-to-r ${meta.color} text-white shadow-md hover:shadow-lg hover:-translate-y-0.5`
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
              <div className="text-center py-20 text-gray-400">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-xl font-semibold">No weeks found in this path.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
