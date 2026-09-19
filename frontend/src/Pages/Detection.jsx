import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PHONEME_URL } from "../url/base";
import AuroraBackground from "../Components/AuroraBackground";
import { GlassFilter } from "../Components/ui/LiquidGlass";
import { ShinyButton } from "../Components/ui/ShinyButton";

const gradientHeading = {
  background: 'linear-gradient(to bottom, #fecdd3, #bae6fd, #f1f5f9)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export default function Detection() {
  const [percentage, setPercentage] = useState(null);
  const [remedy, setRemedy] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const url = window.location.href;
    const match = url.match(/\/detect\/(\d+)/);
    if (match) setPercentage(parseInt(match[1]));
  }, []);

  useEffect(() => {
    if (percentage !== null) {
      fetch(`${PHONEME_URL}/remedy/${percentage}`)
        .then(r => r.json())
        .then(data => { if (data?.remedy) setRemedy(data.remedy); })
        .catch(err => console.error("Error fetching remedy:", err));
    }
  }, [percentage]);

  const pct = percentage ?? 0;
  const scoreColor = pct >= 70 ? 'text-teal-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400';
  const scoreBg = pct >= 70 ? 'rgba(20,184,166,0.1)' : pct >= 50 ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)';
  const scoreBorder = pct >= 70 ? 'rgba(20,184,166,0.25)' : pct >= 50 ? 'rgba(234,179,8,0.25)' : 'rgba(239,68,68,0.25)';

  return (
    <div className="min-h-screen bg-black relative overflow-hidden text-white pt-20">
      <GlassFilter />
      <AuroraBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* Phoneme header */}
        <div className="mb-10">
          <p className="text-teal-400 font-inter text-xs font-medium uppercase tracking-[0.2em] mb-3">Assessment Result</p>
          <h1 className="font-cormorant font-light leading-tight mb-2" style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', ...gradientHeading }}>
            Phoneme V and B
          </h1>
          <p className="text-white/30 font-inter text-sm">Test Number: 2</p>
        </div>

        {/* Test details card */}
        <div className="rounded-2xl border border-white/8 p-6 mb-8" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <p className="text-white/25 font-inter text-xs uppercase tracking-widest mb-4">Test Details</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Word to Spell', value: 'Boat' },
              { label: 'Phoneme Word', value: 'Voat' },
              { label: 'Avg Correct', value: `${percentage ?? '—'}%` },
            ].map(item => (
              <div key={item.label} className="rounded-xl border border-white/6 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="text-white/25 font-inter text-xs uppercase tracking-wider mb-1">{item.label}</div>
                <div className="font-cormorant text-2xl text-white/70">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Result */}
        <div className="rounded-2xl border border-white/8 p-8 mb-8" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <p className="text-white/25 font-inter text-xs uppercase tracking-widest mb-6">Analysis Result</p>

          {/* Score display */}
          <div className="flex items-center gap-6 mb-8">
            <div
              className="w-28 h-28 rounded-2xl border flex flex-col items-center justify-center"
              style={{ background: scoreBg, borderColor: scoreBorder }}
            >
              <div className={`font-cormorant font-light text-4xl ${scoreColor}`}>{pct}%</div>
              <div className="text-white/25 font-inter text-xs mt-1">Score</div>
            </div>
            <div className="flex-1">
              <p className="text-white/50 font-inter text-sm mb-3">
                {pct >= 70
                  ? 'Excellent! Your pronunciation is clear and accurate.'
                  : pct >= 50
                  ? 'Good progress! A little more practice will get you there.'
                  : 'Keep going! With focused practice you\'ll improve quickly.'}
              </p>
              {/* Progress bar */}
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: pct >= 70
                      ? 'linear-gradient(90deg, #14b8a6, #22d3ee)'
                      : pct >= 50
                      ? 'linear-gradient(90deg, #eab308, #f59e0b)'
                      : 'linear-gradient(90deg, #ef4444, #f97316)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-white/15 font-inter text-xs">0%</span>
                <span className="text-white/15 font-inter text-xs">100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Remedies (shown when score <= 50) */}
        {pct <= 50 && (
          <div className="rounded-2xl border border-white/8 p-8 mb-8" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <p className="text-white/25 font-inter text-xs uppercase tracking-widest mb-4">Model &amp; Remedies</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video placeholder */}
              <div className="rounded-xl border border-white/8 overflow-hidden aspect-square flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <video width="100%" autoPlay muted loop className="rounded-xl">
                  <source src="cloudinary link here" type="video/mp4" />
                </video>
              </div>

              {/* Instructions card */}
              <div className="rounded-xl border border-indigo-500/20 p-6" style={{ background: 'rgba(99,102,241,0.06)' }}>
                <p className="text-indigo-400 font-inter text-xs uppercase tracking-widest mb-3">Instructions</p>
                <div className="text-white/60 font-inter text-sm leading-relaxed">
                  {remedy ? remedy[0] : 'Loading remedy…'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ShinyButton onClick={() => navigate('/course')}>Test Again</ShinyButton>
          <button
            onClick={() => navigate('/learning')}
            className="px-7 py-3.5 rounded-xl border border-white/10 text-white/50 font-inter text-sm hover:border-white/20 hover:text-white/70 transition-all"
          >
            Back to Learning →
          </button>
        </div>
      </div>
    </div>
  );
}
