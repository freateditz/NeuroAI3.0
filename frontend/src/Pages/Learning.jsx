import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { API_URL } from "../url/base";
import AuroraBackground from "../Components/AuroraBackground";
import { GlassFilter, GlassCard } from "../Components/ui/LiquidGlass";
import { ShinyButton } from "../Components/ui/ShinyButton";

const gradientHeading = {
  background: 'linear-gradient(to bottom, #fecdd3, #bae6fd, #f1f5f9)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export default function Learning() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todaysCourse, setTodaysCourse] = useState(null);
  const [articles, setArticles] = useState([]);
  const [streak, setStreak] = useState(0);
  const [weekActivity, setWeekActivity] = useState([false, false, false, false, false, false, false]);

  useEffect(() => {
    fetchCourses();
    fetchArticles();
    fetchStreak();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/courses`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data.data);
      const inProgressCourse = data.data.find(c => c.userProgress?.status === 'in-progress');
      const notStartedCourse = data.data.find(c => !c.userProgress || c.userProgress.status === 'not-started');
      setTodaysCourse(inProgressCourse || notStartedCourse || data.data[0]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchStreak = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/test/all`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      const tests = data.data || [];

      // Build set of unique activity dates from test attempts
      const activityDates = new Set();
      tests.forEach(t => {
        (t.attempts || []).forEach(a => {
          if (a.createdAt) activityDates.add(new Date(a.createdAt).toDateString());
        });
        if (t.updatedAt) activityDates.add(new Date(t.updatedAt).toDateString());
      });

      // Calculate this-week activity (Mon-Sun)
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0=Sun
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

      const weekAct = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return activityDates.has(d.toDateString());
      });
      setWeekActivity(weekAct);

      // Calculate current streak (consecutive days including today going backward)
      let s = 0;
      const check = new Date(today);
      while (activityDates.has(check.toDateString())) {
        s++;
        check.setDate(check.getDate() - 1);
      }
      setStreak(s);
    } catch {}
  };

  const fetchArticles = () => {
    setArticles([
      { title: "Understanding Phonological Disorders in Children", description: "How phonological awareness impacts speech development and learning outcomes.", url: "https://www.asha.org/public/speech/disorders/phonological-disorders/", source: { name: "ASHA" } },
      { title: "The Science Behind Phoneme Recognition", description: "Explore the neuroscience behind speech sound perception and production.", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3394606/", source: { name: "NIH Research" } },
      { title: "Speech Therapy Activities for Kids", description: "Evidence-based activities parents can practice with their children daily at home.", url: "https://www.speechandlanguagekids.com/speech-therapy-activities/", source: { name: "Speech & Language Kids" } },
      { title: "Dyslexia and Phonological Awareness", description: "The link between reading difficulties and phoneme processing — strategies for parents and educators.", url: "https://www.understood.org/articles/phonological-awareness-what-it-is-and-how-it-works", source: { name: "Understood.org" } },
      { title: "Articulation Disorders: A Guide for Families", description: "Practical tips for supporting a child with articulation difficulties at home and school.", url: "https://www.asha.org/public/speech/disorders/articulation/", source: { name: "ASHA" } },
      { title: "Building Phonemic Awareness in Early Childhood", description: "Research-backed techniques for developing strong phonemic awareness before age 7.", url: "https://www.readingrockets.org/topics/phonological-and-phonemic-awareness", source: { name: "Reading Rockets" } },
    ]);
  };

  const overalltest = () => navigate("/overall");
  const handleCourseClick = (courseId) => navigate(`/course/${courseId}`);

  const getStatusText = (userProgress) => {
    if (!userProgress) return "Start Learning";
    switch (userProgress.status) {
      case 'completed': return "Completed";
      case 'in-progress': return "Continue";
      default: return "Start";
    }
  };

  const getProgress = (userProgress) => {
    if (!userProgress) return 0;
    return userProgress.totalLessonsCompleted || 0;
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden text-white pt-20">
      <GlassFilter />
      <AuroraBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <p className="text-teal-400 font-inter text-xs font-medium uppercase tracking-[0.2em] mb-3">Learning Hub</p>
          <h1 className="font-cormorant font-light leading-tight" style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', ...gradientHeading }}>
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </h1>
        </div>

        {/* Hero row: CTA card + streak tracker */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">

          {/* Get started glassmorphism card */}
          <div className="flex-1 rounded-2xl border border-white/8 p-8 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)', filter: 'blur(40px)', transform: 'translate(-30%, -30%)' }} />
            <p className="text-teal-400 text-xs uppercase tracking-[0.2em] mb-3 font-inter">Speech Training</p>
            <h2 className="font-cormorant font-light text-4xl mb-3" style={gradientHeading}>
              Where would you <em>like to start?</em>
            </h2>
            <p className="text-white/35 font-inter text-sm mb-6 max-w-md">Take our phoneme detection test to discover your perfect learning path.</p>
            <ShinyButton onClick={overalltest}>Start Detection Test</ShinyButton>
          </div>

          {/* Week streak tracker */}
          <div className="rounded-2xl border border-white/8 p-6 w-full lg:w-80 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <p className="text-white/30 font-inter text-xs uppercase tracking-widest mb-5">This Week</p>
            <div className="grid grid-cols-7 gap-2 mb-5">
              {weekDays.map((day, i) => {
                const isActive = weekActivity[i];
                const today = new Date();
                const dayOfWeek = today.getDay();
                const monIdx = (dayOfWeek + 6) % 7;
                const isToday = i === monIdx;
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className={`font-inter text-xs ${isToday ? 'text-indigo-300' : 'text-white/20'}`}>{day.charAt(0)}</div>
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-teal-400/15 border-teal-400/40 text-teal-400'
                        : isToday
                        ? 'border-indigo-500/30 bg-indigo-500/10 text-transparent'
                        : 'border-white/8 bg-white/3 text-transparent'
                    }`}>
                      <span className="text-xs font-medium">{isActive ? '✓' : ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-white/5 pt-4">
              <div className="text-white/20 font-inter text-xs mb-1 uppercase tracking-widest">Current Streak</div>
              <div className="font-cormorant text-3xl text-teal-400">{streak > 0 ? `${streak} day${streak === 1 ? '' : 's'}` : 'Start Today!'}</div>
            </div>
          </div>
        </div>

        {/* Courses grid + sidebar */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Courses list */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <p className="text-teal-400 text-xs uppercase tracking-[0.2em] font-inter mb-1">Phoneme Catalog</p>
              <h3 className="font-cormorant font-light text-2xl text-white">Correct your speech</h3>
            </div>

            <div
              className="space-y-3 max-h-[400px] md:max-h-[600px] overflow-y-auto pr-1"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.3) transparent' }}
            >
              {loading ? (
                <div className="text-white/25 font-inter text-sm py-8 text-center">Loading courses…</div>
              ) : error ? (
                <div className="text-red-400/70 font-inter text-sm py-8 text-center">Error: {error}</div>
              ) : courses.length === 0 ? (
                <div className="text-white/25 font-inter text-sm py-8 text-center">No courses available</div>
              ) : courses.map((course) => {
                const progress = getProgress(course.userProgress);
                const total = course.totalLessons || 1;
                const pct = Math.round((progress / total) * 100);
                const statusText = getStatusText(course.userProgress);
                const isCompleted = statusText === 'Completed';
                return (
                  <div
                    key={course._id}
                    onClick={() => handleCourseClick(course._id)}
                    className="group rounded-xl border border-white/8 p-5 cursor-pointer transition-all hover:border-indigo-500/30 hover:bg-white/3"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                          <span className="font-cormorant text-indigo-300 text-lg font-light">{course.phoneme1}</span>
                        </div>
                        <div>
                          <div className="text-white/70 font-inter text-sm font-medium">
                            {course.phoneme1} / {course.phoneme2}
                          </div>
                          <div className="text-white/25 font-inter text-xs">{course.totalLessons} lessons</div>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-inter ${
                        isCompleted
                          ? 'bg-teal-400/10 text-teal-400 border border-teal-400/20'
                          : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                      }`}>
                        {statusText}
                      </span>
                    </div>
                    <div className="h-px bg-white/5 overflow-hidden rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's goal */}
            {todaysCourse && (
              <GlassCard className="text-white">
                <p className="text-teal-400 text-xs uppercase tracking-[0.2em] font-inter mb-3">Today's Goal</p>
                <h3 className="font-cormorant font-light text-2xl text-white mb-1">{todaysCourse.title}</h3>
                <div className="text-white/35 font-inter text-xs mb-4">
                  {getProgress(todaysCourse.userProgress)} / {todaysCourse.totalLessons} lessons · ~20 min
                </div>
                <div className="h-px bg-white/8 overflow-hidden rounded-full mb-4">
                  <div
                    className="h-full bg-teal-400/60 transition-all duration-700"
                    style={{ width: `${(getProgress(todaysCourse.userProgress) / (todaysCourse.totalLessons || 1)) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => handleCourseClick(todaysCourse._id)}
                  className="w-full py-2.5 rounded-xl bg-teal-400/10 border border-teal-400/20 text-teal-400 font-inter text-sm hover:bg-teal-400/15 transition-all"
                >
                  Continue →
                </button>
              </GlassCard>
            )}

            {/* Featured Articles */}
            <div>
              <p className="text-white/25 font-inter text-xs uppercase tracking-widest mb-3">Featured Articles</p>
              <div className="space-y-3">
                {articles.map((article, i) => (
                  <a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-white/6 p-4 transition-all hover:border-white/12 hover:bg-white/3"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="text-white/60 font-inter text-sm font-medium mb-1 line-clamp-2">{article.title}</div>
                    <div className="text-white/20 font-inter text-xs">{article.source?.name}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
