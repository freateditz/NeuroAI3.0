import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../Components/AuroraBackground';
import { GlassFilter, GlassCard } from '../Components/ui/LiquidGlass';
import { ShinyButton } from '../Components/ui/ShinyButton';

const gradientHeading = {
  background: 'linear-gradient(to bottom, #fecdd3, #bae6fd, #f1f5f9)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const BAR_HEIGHTS = [55, 80, 42, 95, 65, 78, 48];

export default function About() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mission");

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden pt-20">
      <GlassFilter />
      <AuroraBackground />

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <p className="text-teal-400 font-inter text-xs font-medium uppercase tracking-[0.2em] mb-5">About NeuroAI</p>
            <h1
              className="font-cormorant font-light leading-[0.92] tracking-tight mb-6"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', ...gradientHeading }}
            >
              Find Your Voice,<br /><em>Share Your Story.</em>
            </h1>
            <p className="text-white/35 font-inter font-light text-base leading-relaxed mb-8 max-w-lg">
              We bridge the gap between technology and human connection. A new era of speech therapy — accessible, intelligent, and designed entirely around <span className="text-white/60">you</span>.
            </p>
            <ShinyButton onClick={() => navigate("/learning")}>Start Your Journey</ShinyButton>
          </div>

          {/* Right: animated visual card */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-sm mx-auto">
              <div className="relative rounded-3xl border border-white/8 p-8 overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top left, #6366f1, transparent 60%)' }} />
                {/* Speech bars */}
                <div className="flex items-end justify-center gap-2 h-28 mb-8">
                  {BAR_HEIGHTS.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm animate-pulse"
                      style={{
                        height: `${h}%`,
                        background: `rgba(${i % 2 === 0 ? '99,102,241' : '34,211,238'},${0.4 + h / 200})`,
                        animationDelay: `${i * 0.12}s`,
                      }}
                    />
                  ))}
                </div>
                {/* Stats inside card */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="w-10 h-10 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-400 text-lg">🎙️</div>
                    <div className="flex-1">
                      <div className="text-white/25 font-inter text-xs mb-1">Fluency Score</div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-400 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                    <span className="text-teal-400 font-inter text-xs font-medium">92%</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 text-lg">🧠</div>
                    <div className="flex-1">
                      <div className="text-white/25 font-inter text-xs mb-1">AI Accuracy</div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: '97%' }} />
                      </div>
                    </div>
                    <span className="text-indigo-300 font-inter text-xs font-medium">97%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 py-16 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '95%', label: 'Success Rate' },
              { value: '500K+', label: 'Sessions Done' },
              { value: '24/7', label: 'Support' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="font-cormorant font-light leading-none mb-2"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', ...gradientHeading }}
                >
                  {s.value}
                </div>
                <div className="text-white/35 font-inter text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="relative z-10 py-20 max-w-5xl mx-auto px-6">
        <div className="mb-14 text-center">
          <p className="text-teal-400 font-inter text-xs uppercase tracking-[0.2em] mb-4">History</p>
          <h2 className="font-cormorant font-light" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', ...gradientHeading }}>Our Story</h2>
        </div>
        <div className="space-y-5">
          {[
            { num: '01', title: 'The Beginning', body: 'Founded with a vision to make quality speech therapy accessible to everyone. Millions of individuals with speech disorders lack access to effective, engaging, and affordable training solutions — we set out to change that.' },
            { num: '02', title: 'Innovation & Research', body: 'Through extensive research and collaboration with speech therapists, educators, and AI experts, we built a platform combining real-time phoneme analysis, 3D articulation modeling, and adaptive learning.' },
            { num: '03', title: 'Today & Beyond', body: "Today we're proud to serve thousands of families, helping children build confidence and achieve their speech goals. The journey has just begun — we're expanding to mobile, new languages, and deeper AI personalization." },
          ].map((item) => (
            <div key={item.num} className="flex items-start gap-6 rounded-2xl border border-white/6 p-6 transition-all hover:border-white/12" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="font-cormorant text-4xl text-white/10 leading-none shrink-0">{item.num}</div>
              <div>
                <h3 className="font-inter font-medium text-white/70 text-base mb-2">{item.title}</h3>
                <p className="text-white/30 font-inter font-light text-sm leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION / VISION / VALUES TABS */}
      <section className="relative z-10 py-20" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-teal-400 font-inter text-xs uppercase tracking-[0.2em] mb-4">Purpose</p>
            <h2 className="font-cormorant font-light" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', ...gradientHeading }}>What Drives Us</h2>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-10 flex-wrap">
            {['mission', 'vision', 'values'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl font-inter text-sm transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                    : 'border border-white/6 text-white/30 hover:border-white/15 hover:text-white/50'
                }`}
              >
                Our {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="rounded-3xl border border-white/8 p-10 min-h-[280px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)' }}>
            {activeTab === 'mission' && (
              <div className="text-center max-w-2xl">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6 text-2xl">⚡</div>
                <h3 className="font-cormorant font-light text-3xl text-white mb-4">Our Mission</h3>
                <p className="text-white/35 font-inter font-light text-base leading-relaxed">
                  To empower individuals with speech challenges through innovative, accessible, and personalized training solutions that foster confidence and effective communication. Every voice deserves to be heard.
                </p>
              </div>
            )}
            {activeTab === 'vision' && (
              <div className="text-center max-w-2xl">
                <div className="w-16 h-16 rounded-2xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-6 text-2xl">👁️</div>
                <h3 className="font-cormorant font-light text-3xl text-white mb-4">Our Vision</h3>
                <p className="text-white/35 font-inter font-light text-base leading-relaxed">
                  A world where every individual with speech disorders has access to world-class therapy tools, enabling them to communicate confidently and participate fully in society. Speech challenges should never be barriers.
                </p>
              </div>
            )}
            {activeTab === 'values' && (
              <div className="max-w-2xl w-full">
                <h3 className="font-cormorant font-light text-3xl text-white mb-6 text-center">Our Values</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'Innovation', desc: 'Pushing boundaries in speech therapy' },
                    { name: 'Accessibility', desc: 'Making therapy available to all' },
                    { name: 'Empathy', desc: "Understanding every user's journey" },
                    { name: 'Excellence', desc: 'Delivering the highest quality' },
                    { name: 'Inclusivity', desc: "Welcoming everyone's needs" },
                    { name: 'Impact', desc: 'Creating meaningful change' },
                  ].map((v) => (
                    <div key={v.name} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
                      <div>
                        <div className="text-white/60 font-inter text-sm font-medium">{v.name}</div>
                        <div className="text-white/25 font-inter text-xs">{v.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="relative z-10 py-20 max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-teal-400 font-inter text-xs uppercase tracking-[0.2em] mb-4">Differentiation</p>
          <h2 className="font-cormorant font-light" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', ...gradientHeading }}>What Makes Us <em>Different</em></h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: '🎯', title: 'Evidence-Based Approach', desc: 'Methods grounded in scientific research and developed in collaboration with certified speech-language pathologists.' },
            { icon: '🧠', title: 'AI-Powered Personalization', desc: "Our platform adapts to each user's unique needs, progress, and learning style to deliver optimal results." },
            { icon: '🎮', title: 'Engaging Technology', desc: '3D animations, gamification, and interactive exercises make learning enjoyable and clinically effective.' },
            { icon: '👨‍👩‍👧', title: 'Community Support', desc: 'Join a supportive community of learners and access expert guidance throughout your journey.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/6 p-6 transition-all hover:border-white/12 hover:bg-white/3" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="text-2xl mb-4">{item.icon}</div>
              <h3 className="font-inter font-medium text-white/70 text-base mb-2">{item.title}</h3>
              <p className="text-white/30 font-inter font-light text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 py-20" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-teal-400 font-inter text-xs uppercase tracking-[0.2em] mb-4">Community</p>
            <h2 className="font-cormorant font-light" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', ...gradientHeading }}>What Parents <em>Say</em></h2>
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
            {[
              { name: 'Priya Sharma', role: 'Mother of 7-year-old', initials: 'PS', quote: "My son has shown incredible progress in just 3 months. The 3D animations make learning fun — he actually looks forward to his practice sessions." },
              { name: 'Rajesh Kumar', role: 'Father of 5-year-old', initials: 'RK', quote: "The real-time feedback feature is amazing! We can track progress weekly and the personalized learning path adapts perfectly to my daughter's needs." },
              { name: 'Anita Mehta', role: 'Mother of 9-year-old', initials: 'AM', quote: "As a working mother, I appreciate the flexibility. My daughter can practice anytime — we've seen tremendous improvement in her confidence." },
              { name: 'Vikram Gupta', role: 'Father of 6-year-old', initials: 'VG', quote: "The holistic phonics training has made such a difference. My son can now pronounce sounds correctly that he struggled with for years." },
              { name: 'Sneha Desai', role: 'Mother of 8-year-old', initials: 'SD', quote: "Worth every penny! The weekly reports help us understand exactly where our daughter stands and what areas need more focus." },
              { name: 'Manoj Reddy', role: 'Father of 10-year-old', initials: 'MR', quote: "The gamified approach made it feel like playing rather than learning. Six months in and he's a completely different, confident child!" },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border border-white/6 p-6 transition-all hover:border-white/12" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-teal-400 text-sm">★</span>)}
                </div>
                <p className="text-white/35 font-inter font-light text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-inter text-xs font-medium">{t.initials}</div>
                  <div>
                    <div className="text-white/60 font-inter text-sm font-medium">{t.name}</div>
                    <div className="text-white/20 font-inter text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/8 p-12 text-center relative overflow-hidden" style={{ background: 'rgba(99,102,241,0.06)' }}>
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
          <div className="relative z-10">
            <p className="text-indigo-400 font-inter text-xs uppercase tracking-[0.2em] mb-5">Get Started</p>
            <h2
              className="font-cormorant font-light leading-[0.95] tracking-tight mb-5"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', ...gradientHeading }}
            >
              Ready to <em>Transform</em><br />Your Speech Journey?
            </h2>
            <p className="text-white/30 font-inter font-light text-base mb-8 max-w-md mx-auto">
              Join thousands of families already experiencing life-changing results.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <ShinyButton onClick={() => navigate("/learning")}>Start Free Trial</ShinyButton>
              <button
                onClick={() => navigate("/")}
                className="px-7 py-3 rounded-xl border border-white/10 text-white/40 font-inter text-sm hover:bg-white/5 hover:text-white/60 transition-all"
              >
                Explore Features →
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/20 font-inter text-xs">
              <span>✓ No credit card required</span>
              <span>✓ Cancel anytime</span>
              <span>✓ 24/7 support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
