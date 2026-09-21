import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../url/base';
import AuroraBackground from '../Components/AuroraBackground';
import { GlassFilter } from '../Components/ui/LiquidGlass';
import { ShinyButton } from '../Components/ui/ShinyButton';
import { useTheme } from '../contexts/ThemeContext';

// ─── Activity step builders ───────────────────────────────────────────────────
function buildSteps(task) {
  const ph = task?.targetPhoneme || '?';
  const isPure = ph !== 'FLUENCY' && ph !== 'MASTERY';
  const desc = task?.description || 'Practice this activity.';

  switch (task?.activityType) {
    case 'drill':
      return [
        { id: 1, icon: '👂', title: 'Listen First', instruction: `Click "Listen" to hear the /${ph}/ sound, then mimic it perfectly.`, type: 'listen_then_speak', phoneme: ph },
        { id: 2, icon: '🗣️', title: 'Phoneme Isolation', instruction: `Say the sound /${ph}/ clearly and hold it for 2 seconds.`, type: 'speech', phoneme: ph },
        { id: 3, icon: '🎯', title: 'Word Challenge', instruction: isPure ? `Say a word that starts with the ${ph} sound. (e.g., "${EXAMPLE_WORDS[ph]?.[0] || ph + '-word'}")` : desc, type: 'speech', phoneme: ph },
      ];
    case 'phonics':
      return [
        { id: 1, icon: '🔤', title: 'Blending Warm-Up', instruction: isPure ? `Blend the ${ph} sound with short vowels: "${ph}-a", "${ph}-e", "${ph}-i".` : desc, type: 'listen_then_speak', phoneme: ph },
        { id: 2, icon: '🔊', title: 'Syllable Split', instruction: isPure ? `Say a two-syllable word containing /${ph}/. Break it into parts.` : desc, type: 'speech', phoneme: ph },
        { id: 3, icon: '🎵', title: 'Rhyme Time', instruction: isPure ? `Say a word that rhymes with "${EXAMPLE_WORDS[ph]?.[0] || ph + '-at'}".` : desc, type: 'speech', phoneme: ph },
      ];
    case 'story':
      return [
        { id: 1, icon: '📖', title: 'Read Aloud', instruction: `Read the following phrase aloud: "${STORY_PHRASES[ph] || desc}"`, type: 'speech', phoneme: ph },
        { id: 2, icon: '🔁', title: 'Repeat & Match', instruction: `Listen to the AI model, then repeat the phrase with the same rhythm.`, type: 'listen_then_speak', phoneme: ph },
      ];
    case 'reading':
      return [
        { id: 1, icon: '📝', title: 'Quick Check', instruction: `Read this test phrase aloud: "${STORY_PHRASES[ph] || desc}"`, type: 'speech', phoneme: ph },
      ];
    default:
      return [{ id: 1, icon: '🎤', title: 'Practice', instruction: desc, type: 'speech', phoneme: ph }];
  }
}

const EXAMPLE_WORDS = {
  A: ['Apple', 'Ant', 'Axe'],
  B: ['Ball', 'Bear', 'Bat'],
  C: ['Cat', 'Cup', 'Cake'],
  D: ['Dog', 'Duck', 'Door'],
  F: ['Fish', 'Frog', 'Fan'],
  L: ['Lion', 'Lamp', 'Leaf'],
  P: ['Pig', 'Pen', 'Pan'],
  S: ['Sun', 'Snake', 'Star'],
  T: ['Tiger', 'Tent', 'Top'],
  Z: ['Zebra', 'Zoo', 'Zip'],
};

const STORY_PHRASES = {
  A: 'An ant ate an apple all afternoon.',
  B: 'Big brown bears blow bright bubbles.',
  C: 'Cute cats catch cold, colorful cakes.',
  D: 'Dogs dash down dusty dirt roads.',
  F: 'Five frogs found fresh fish.',
  L: 'Lions love licking lovely lemon leaves.',
  P: 'Pretty pink pigs play piano perfectly.',
  S: 'Seven slippery snakes slide silently south.',
  T: 'Two tiny turtles trot through tall trees.',
  Z: 'Zebras zoom past zesty zoo zookeepers.',
  FLUENCY: 'The quick brown fox jumps over the lazy dog.',
  MASTERY: 'She sells seashells by the seashore on sunny days.',
};

const ACTIVITY_ACCENT = {
  drill:   { color: 'indigo', border: 'border-indigo-500/25', bg: 'rgba(99,102,241,0.08)', text: 'text-indigo-300', label: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25' },
  phonics: { color: 'blue',   border: 'border-blue-500/25',   bg: 'rgba(59,130,246,0.08)',  text: 'text-blue-300',   label: 'bg-blue-500/15 text-blue-300 border-blue-500/25' },
  story:   { color: 'amber',  border: 'border-amber-400/25',  bg: 'rgba(251,191,36,0.06)',  text: 'text-amber-300',  label: 'bg-amber-400/15 text-amber-300 border-amber-400/25' },
  reading: { color: 'teal',   border: 'border-teal-400/25',   bg: 'rgba(20,184,166,0.08)',  text: 'text-teal-300',   label: 'bg-teal-400/15 text-teal-300 border-teal-400/25' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function LearningModule() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const gradientHeading = darkMode
    ? { background: 'linear-gradient(to bottom, #fecdd3, #bae6fd, #f1f5f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
    : { background: 'linear-gradient(135deg, #312e81, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
  const [searchParams] = useSearchParams();
  const weekNum  = parseInt(searchParams.get('week') || '1', 10);
  const dayNum   = parseInt(searchParams.get('day')  || '1', 10);
  const pathId   = searchParams.get('pathId') || '';

  const [task,        setTask]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [stepIdx,     setStepIdx]     = useState(0);
  const [completed,   setCompleted]   = useState(false);
  const [recording,   setRecording]   = useState(false);
  const [analyzing,   setAnalyzing]   = useState(false);
  const [feedback,    setFeedback]    = useState(null);
  const [ttsPlaying,  setTtsPlaying]  = useState(false);
  const [stepResults, setStepResults] = useState([]);
  const [completing,  setCompleting]  = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);

  useEffect(() => { fetchTask(); }, []);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/learning/path`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load path');
      const week = data.data?.weeks?.find(w => w.weekNumber === weekNum);
      const day  = week?.days?.find(d => d.dayNumber === dayNum);
      if (!day) throw new Error('Module not found. Please return to Learning Path.');
      setTask(day);
    } catch (err) {
      alert(err.message);
      navigate('/learning-path');
    } finally {
      setLoading(false);
    }
  };

  const steps = task ? buildSteps(task) : [];
  const currentStep = steps[stepIdx];
  const accent = ACTIVITY_ACCENT[task?.activityType] || ACTIVITY_ACCENT.drill;

  // ── TTS ──────────────────────────────────────────────────────────────────────
  const browserFallbackTTS = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US'; utt.rate = 0.75;
    utt.onend = () => setTtsPlaying(false);
    utt.onerror = () => setTtsPlaying(false);
    window.speechSynthesis.speak(utt);
  };

  const playTTS = async (text) => {
    if (!text) return;
    setTtsPlaying(true);
    try {
      const response = await fetch(`${API_URL}/api/test/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error('TTS failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => { setTtsPlaying(false); URL.revokeObjectURL(url); };
      audio.onerror = () => { setTtsPlaying(false); URL.revokeObjectURL(url); };
      await audio.play();
    } catch (err) {
      console.warn('ElevenLabs TTS failed, falling back:', err);
      browserFallbackTTS(text);
    }
  };

  const speakWordList = async (words) => {
    if (!words || words.length === 0) return;
    setTtsPlaying(true);
    for (const word of words) {
      try {
        const response = await fetch(`${API_URL}/api/test/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: word })
        });
        if (!response.ok) throw new Error('TTS failed');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        await new Promise((resolve, reject) => {
          const audio = new Audio(url);
          audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
          audio.onerror = () => { URL.revokeObjectURL(url); reject(); };
          audio.play();
        });
        await new Promise(r => setTimeout(r, 400));
      } catch {
        await new Promise(resolve => {
          if (!('speechSynthesis' in window)) { resolve(); return; }
          const utt = new SpeechSynthesisUtterance(word);
          utt.lang = 'en-US'; utt.rate = 0.75;
          utt.onend = resolve; utt.onerror = resolve;
          window.speechSynthesis.speak(utt);
        });
        await new Promise(r => setTimeout(r, 600));
      }
    }
    setTtsPlaying(false);
  };

  // ── Recording ─────────────────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      chunksRef.current = [];

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mimeType = 'audio/webm;codecs=opus';
        else if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm';
        else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorder.ondataavailable = e => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        const actualMime = recorder.mimeType || mimeType || 'audio/webm';
        const ext = actualMime.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(chunksRef.current, { type: actualMime });
        stream.getTracks().forEach(t => t.stop());
        await analyzeRecording(blob, ext);
      };
      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setFeedback(null);
    } catch {
      alert('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setAnalyzing(true);
    }
  };

  const analyzeRecording = async (blob, ext = 'webm') => {
    try {
      const ph = currentStep?.phoneme;
      const activityType = task?.activityType;
      let targetWord = ph;

      if (ph === 'FLUENCY' || ph === 'MASTERY') {
        // Full phrase target for fluency/mastery activities
        targetWord = STORY_PHRASES[ph] || 'practice';
      } else if (ph) {
        try {
          const wRes = await fetch(`${API_URL}/api/test/word/${ph}`);
          const wData = await wRes.json();
          if (wData.success) {
            // For story/reading steps, use the full phrase; for drill/phonics, use the word
            if (activityType === 'story' || activityType === 'reading') {
              targetWord = wData.data.phrase || wData.data.word1 || ph;
            } else {
              targetWord = wData.data.word1 || ph;
            }
          }
        } catch { /* use phoneme as fallback */ }
      }

      const form = new FormData();
      form.append('audio', blob, `recording.${ext}`);
      form.append('targetWord', targetWord);

      const res  = await fetch(`${API_URL}/api/test/record`, { method: 'POST', body: form });
      const data = await res.json();
      const acc  = data?.data?.accuracy ?? 0;
      const transcript = data?.data?.transcript || '(not recognized)';
      const passed = acc >= 65;

      setFeedback({ type: passed ? 'success' : 'error', accuracy: acc, transcript, targetWord });

      if (passed) {
        const newResults = [...stepResults, { stepId: currentStep.id, passed: true, accuracy: acc }];
        setStepResults(newResults);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Could not analyze speech. Try again.' });
    } finally {
      setAnalyzing(false);
    }
  };

  const goNextStep = () => {
    if (stepIdx < steps.length - 1) { setStepIdx(s => s + 1); setFeedback(null); }
  };

  const completeModule = async () => {
    try {
      setCompleting(true);
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/learning/complete-task`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathId, weekNumber: weekNum, dayNumber: dayNum }),
      });
      setCompleted(true);
    } catch {
      setCompleted(true);
    } finally {
      setCompleting(false);
    }
  };

  const currentStepPassed = stepResults.some(r => r.stepId === currentStep?.id);
  const allStepsDone = steps.length > 0 && stepResults.length >= steps.length;

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-black relative">
        <GlassFilter />
        <AuroraBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-white/5 border-t-indigo-400 animate-spin" />
          <p className="text-white/30 font-inter text-sm animate-pulse">Loading module…</p>
        </div>
      </div>
    );
  }

  // ─── Completed Screen ────────────────────────────────────────────────────────
  if (completed) {
    const avgAcc = stepResults.length
      ? Math.round(stepResults.reduce((s, r) => s + r.accuracy, 0) / stepResults.length)
      : 0;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black relative">
        <GlassFilter />
        <AuroraBackground />
        <div className="relative z-10 max-w-md w-full rounded-3xl border p-8 text-center"
        style={{ background: darkMode ? 'rgba(15,15,25,0.95)' : '#faf7f2', borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(180,165,145,0.5)', boxShadow: darkMode ? 'none' : '8px 8px 20px rgba(160,148,130,0.4), -4px -4px 12px rgba(255,255,255,0.95)' }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none rounded-3xl" style={{ background: 'radial-gradient(ellipse at top, #6366f1, transparent 60%)' }} />
          <div className="relative z-10">
            <div className="text-6xl mb-5 animate-bounce">🏆</div>
            <h1 className="font-cormorant font-light text-4xl mb-2" style={gradientHeading}>Module Complete!</h1>
            <p className="text-white/30 font-inter text-sm mb-6">You crushed Day {dayNum} of Week {weekNum}.</p>

            {stepResults.length > 0 && (
              <div className="rounded-2xl border border-teal-400/20 p-5 mb-6" style={{ background: 'rgba(20,184,166,0.06)' }}>
                <div className="font-cormorant font-light text-5xl text-teal-400 mb-1">{avgAcc}%</div>
                <div className="text-teal-400 font-inter text-xs uppercase tracking-widest mb-1">Average Accuracy</div>
                <div className="text-white/25 font-inter text-xs">{stepResults.length} steps completed ✓</div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <ShinyButton onClick={() => navigate('/learning-path')}>Back to Learning Path</ShinyButton>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full px-6 py-3 rounded-xl border border-white/10 text-white/40 font-inter text-sm hover:bg-white/5 hover:text-white/60 transition-all"
              >
                View Progress Dashboard →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Module UI ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden pt-20">
      <GlassFilter />
      <AuroraBackground />

      {/* Header strip */}
      <div className="sticky top-16 z-20 border-b px-6 py-4 backdrop-blur-xl"
        style={{ background: darkMode ? 'rgba(5,7,20,0.85)' : 'rgba(244,239,232,0.95)', borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(180,165,145,0.4)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/learning-path')}
              className="w-9 h-9 rounded-xl border border-white/8 flex items-center justify-center text-white/40 hover:bg-white/5 hover:text-white/60 transition-all"
            >
              ←
            </button>
            <div>
              <div className="text-white/25 font-inter text-xs uppercase tracking-widest">Week {weekNum} · Day {dayNum}</div>
              <div className="font-inter font-medium text-white/70 text-sm">{task?.title}</div>
            </div>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full border font-inter ${accent.label}`}>
            {task?.activityType?.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-8">

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => {
            const isDone = stepResults.some(r => r.stepId === s.id);
            const isCurr = i === stepIdx;
            return (
              <React.Fragment key={s.id}>
                <div className={`flex items-center justify-center w-9 h-9 rounded-full font-inter text-sm transition-all border ${
                  isDone
                    ? 'border-teal-400/40 bg-teal-400/15 text-teal-400'
                    : isCurr
                    ? `${accent.border} bg-indigo-500/20 ${accent.text} scale-110`
                    : 'border-white/8 text-white/20'
                }`}>
                  {isDone ? '✓' : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px transition-all ${isDone ? 'bg-teal-400/40' : 'bg-white/8'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Main card */}
        <div className="rounded-2xl border border-white/8 overflow-hidden mb-6" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
          {/* Step header */}
          <div className={`border-b border-white/6 px-6 py-4 flex items-center gap-3`} style={{ background: accent.bg }}>
            <span className="text-3xl">{currentStep?.icon}</span>
            <div>
              <div className={`text-xs font-inter uppercase tracking-widest mb-0.5 ${accent.text}`}>
                Step {stepIdx + 1} of {steps.length}
              </div>
              <h2 className="font-cormorant font-light text-2xl text-white">{currentStep?.title}</h2>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Instruction */}
            <div className="rounded-xl border border-white/6 p-4 mb-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-white/50 font-inter text-sm leading-relaxed">{currentStep?.instruction}</p>
            </div>

            {/* Word practice panel */}
            {currentStep?.phoneme && currentStep.phoneme !== 'FLUENCY' && currentStep.phoneme !== 'MASTERY' && (
              <div className={`mb-5 rounded-xl border p-4 ${accent.border}`} style={{ background: accent.bg }}>
                <div className={`text-xs font-inter uppercase tracking-widest mb-3 ${accent.text}`}>Words to Practice — click to hear:</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(EXAMPLE_WORDS[currentStep.phoneme] || []).map((w, i) => (
                    <button
                      key={i}
                      onClick={() => playTTS(w)}
                      className={`px-4 py-2 rounded-xl font-inter text-sm border transition-all hover:scale-105 ${accent.border} ${accent.text}`}
                      style={{ background: accent.bg }}
                    >
                      🔊 {w}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => speakWordList(EXAMPLE_WORDS[currentStep.phoneme] || [])}
                  disabled={ttsPlaying}
                  className={`flex items-center gap-1.5 text-xs font-inter px-3 py-1.5 rounded-lg border transition-all ${
                    ttsPlaying ? 'opacity-50 cursor-not-allowed border-white/8 text-white/25' : `${accent.border} ${accent.text} hover:opacity-80`
                  }`}
                >
                  {ttsPlaying ? '🔊 Playing…' : '▶️ Play all words'}
                </button>
              </div>
            )}

            {/* Story / fluency phrase */}
            {currentStep?.phoneme && (currentStep.phoneme === 'FLUENCY' || currentStep.phoneme === 'MASTERY') && (
              <div className={`mb-5 rounded-xl border p-4 ${accent.border}`} style={{ background: accent.bg }}>
                <div className={`text-xs font-inter uppercase tracking-widest mb-2 ${accent.text}`}>Read this phrase:</div>
                <p className={`font-cormorant font-light text-xl ${accent.text} leading-relaxed mb-3`}>
                  "{STORY_PHRASES[currentStep.phoneme]}"
                </p>
                <button
                  onClick={() => playTTS(STORY_PHRASES[currentStep.phoneme] || '', 0.6)}
                  disabled={ttsPlaying}
                  className={`flex items-center gap-1.5 text-xs font-inter px-3 py-1.5 rounded-lg border transition-all ${
                    ttsPlaying ? 'opacity-50 cursor-not-allowed border-white/8 text-white/25' : `${accent.border} ${accent.text} hover:opacity-80`
                  }`}
                >
                  {ttsPlaying ? '🔊 Playing…' : '🔊 Listen to phrase'}
                </button>
              </div>
            )}

            {/* Listen button for listen_then_speak steps */}
            {currentStep?.type === 'listen_then_speak' && (
              <div className="mb-5 flex justify-center">
                <button
                  onClick={() => {
                    const ph = currentStep.phoneme;
                    const words = EXAMPLE_WORDS[ph];
                    if (words && words.length > 0) speakWordList(words);
                    else playTTS(STORY_PHRASES[ph] || ph);
                  }}
                  disabled={ttsPlaying}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-inter text-sm border transition-all ${
                    ttsPlaying
                      ? `${accent.border} ${accent.text} animate-pulse opacity-70`
                      : `${accent.border} ${accent.text} hover:opacity-80`
                  }`}
                  style={{ background: accent.bg }}
                >
                  <span className="text-xl">🔊</span>
                  <span>{ttsPlaying ? 'Playing…' : 'Listen to Example'}</span>
                </button>
              </div>
            )}

            {/* Microphone area */}
            <div className="flex flex-col items-center gap-5">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all border ${
                recording
                  ? 'border-red-500/40 bg-red-500/15 animate-pulse'
                  : analyzing
                  ? 'border-amber-400/40 bg-amber-400/10'
                  : currentStepPassed
                  ? 'border-teal-400/40 bg-teal-400/15'
                  : `${accent.border}`
              }`} style={!recording && !analyzing && !currentStepPassed ? { background: accent.bg } : {}}>
                {recording ? '🎙️' : analyzing ? '⚙️' : currentStepPassed ? '✅' : '🎤'}
              </div>

              <div className="text-white/30 font-inter text-sm text-center">
                {recording ? '🔴 Recording… speak now!' : analyzing ? '⏳ Analyzing your speech…' : currentStepPassed ? '✅ Step passed!' : 'Ready to record'}
              </div>

              <div className="flex gap-3 flex-wrap justify-center">
                {!recording && !analyzing && (
                  <button
                    onClick={startRecording}
                    className={`px-6 py-3 rounded-xl font-inter text-sm border transition-all ${accent.border} ${accent.text} hover:opacity-80`}
                    style={{ background: accent.bg }}
                  >
                    🎙️ {currentStepPassed ? 'Try Again' : 'Start Speaking'}
                  </button>
                )}
                {recording && (
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-inter text-sm hover:bg-red-500/20 transition-all"
                  >
                    ⏹️ Stop & Analyze
                  </button>
                )}
                {analyzing && (
                  <button disabled className="px-6 py-3 rounded-xl border border-amber-400/25 bg-amber-400/8 text-amber-300 font-inter text-sm animate-pulse">
                    ⚙️ Analyzing…
                  </button>
                )}
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`mt-6 rounded-2xl border p-5 ${
                feedback.type === 'success'
                  ? 'border-teal-400/25'
                  : 'border-red-500/20'
              }`} style={{ background: feedback.type === 'success' ? 'rgba(20,184,166,0.06)' : 'rgba(239,68,68,0.06)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/25 font-inter text-xs uppercase tracking-widest">Speech Result</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-inter border ${
                    feedback.type === 'success'
                      ? 'bg-teal-400/10 text-teal-400 border-teal-400/25'
                      : 'bg-red-500/10 text-red-300 border-red-500/20'
                  }`}>
                    {feedback.type === 'success' ? '✅ Passed!' : '❌ Try Again'}
                  </span>
                </div>
                {feedback.accuracy !== undefined && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    {[
                      { label: 'You Said', value: `"${feedback.transcript}"` },
                      { label: 'Target', value: `"${feedback.targetWord}"` },
                      { label: 'Accuracy', value: `${feedback.accuracy}%`, accent: feedback.accuracy >= 70 ? 'text-teal-400' : 'text-red-400' },
                    ].map(item => (
                      <div key={item.label} className="rounded-xl border border-white/6 p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <div className="text-white/20 font-inter text-xs mb-1">{item.label}</div>
                        <div className={`font-cormorant text-xl capitalize ${item.accent || 'text-white/60'}`}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}
                {feedback.message && (
                  <p className={`text-sm font-inter mt-3 ${feedback.type === 'success' ? 'text-teal-300' : 'text-red-300'}`}>
                    {feedback.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pb-10">
          <button
            onClick={() => navigate('/learning-path')}
            className="px-5 py-2.5 rounded-xl border border-white/8 text-white/40 font-inter text-sm hover:bg-white/5 hover:text-white/60 transition-all"
          >
            ← Exit
          </button>

          <div className="flex gap-3">
            {currentStepPassed && stepIdx < steps.length - 1 && (
              <button
                onClick={goNextStep}
                className={`px-6 py-3 rounded-xl border font-inter text-sm transition-all ${accent.border} ${accent.text} hover:opacity-80`}
                style={{ background: accent.bg }}
              >
                Next Step →
              </button>
            )}

            {(allStepsDone || (currentStepPassed && stepIdx === steps.length - 1)) && (
              <ShinyButton onClick={completeModule} disabled={completing}>
                {completing ? 'Saving…' : 'Finish Module'}
              </ShinyButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
