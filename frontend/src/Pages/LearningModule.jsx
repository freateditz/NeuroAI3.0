import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../url/base';

// ─── Activity step builders ───────────────────────────────────────────────────
function buildSteps(task) {
  const ph = task?.targetPhoneme || '?';
  const isPure = ph !== 'FLUENCY' && ph !== 'MASTERY';
  const desc = task?.description || 'Practice this activity.';

  switch (task?.activityType) {
    case 'drill':
      return [
        {
          id: 1,
          icon: '👂',
          title: 'Listen First',
          instruction: `Click "Listen" to hear the /${ph}/ sound, then mimic it perfectly.`,
          type: 'listen_then_speak',
          phoneme: ph,
        },
        {
          id: 2,
          icon: '🗣️',
          title: 'Phoneme Isolation',
          instruction: `Say the sound /${ph}/ clearly and hold it for 2 seconds.`,
          type: 'speech',
          phoneme: ph,
        },
        {
          id: 3,
          icon: '🎯',
          title: 'Word Challenge',
          instruction: isPure
            ? `Say a word that starts with the ${ph} sound. (e.g., "${EXAMPLE_WORDS[ph]?.[0] || ph + '-word'}")`
            : desc,
          type: 'speech',
          phoneme: ph,
        },
      ];
    case 'phonics':
      return [
        {
          id: 1,
          icon: '🔤',
          title: 'Blending Warm-Up',
          instruction: isPure
            ? `Blend the ${ph} sound with short vowels: "${ph}-a", "${ph}-e", "${ph}-i".`
            : desc,
          type: 'listen_then_speak',
          phoneme: ph,
        },
        {
          id: 2,
          icon: '🔊',
          title: 'Syllable Split',
          instruction: isPure
            ? `Say a two-syllable word containing /${ph}/. Break it into parts.`
            : desc,
          type: 'speech',
          phoneme: ph,
        },
        {
          id: 3,
          icon: '🎵',
          title: 'Rhyme Time',
          instruction: isPure
            ? `Say a word that rhymes with "${EXAMPLE_WORDS[ph]?.[0] || ph + '-at'}".`
            : desc,
          type: 'speech',
          phoneme: ph,
        },
      ];
    case 'story':
      return [
        {
          id: 1,
          icon: '📖',
          title: 'Read Aloud',
          instruction: `Read the following phrase aloud: "${STORY_PHRASES[ph] || desc}"`,
          type: 'speech',
          phoneme: ph,
        },
        {
          id: 2,
          icon: '🔁',
          title: 'Repeat & Match',
          instruction: `Listen to the AI model, then repeat the phrase with the same rhythm.`,
          type: 'listen_then_speak',
          phoneme: ph,
        },
      ];
    case 'reading':
      return [
        {
          id: 1,
          icon: '📝',
          title: 'Quick Check',
          instruction: `Read this test phrase aloud: "${STORY_PHRASES[ph] || desc}"`,
          type: 'speech',
          phoneme: ph,
        },
      ];
    default:
      return [
        { id: 1, icon: '🎤', title: 'Practice', instruction: desc, type: 'speech', phoneme: ph },
      ];
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

const ACTIVITY_COLORS = {
  drill:   { gradient: 'from-violet-600 to-purple-700', light: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', icon: '🎯' },
  phonics: { gradient: 'from-blue-600 to-indigo-700',   light: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   icon: '🔤' },
  story:   { gradient: 'from-amber-500 to-orange-600',  light: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  icon: '📖' },
  reading: { gradient: 'from-green-600 to-emerald-700', light: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  icon: '📝' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function LearningModule() {
  const navigate = useNavigate();
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
  const [feedback,    setFeedback]    = useState(null);   // { type, message, accuracy, transcript }
  const [ttsPlaying,  setTtsPlaying]  = useState(false);
  const [stepResults, setStepResults] = useState([]);     // per-step pass/fail
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
  const colors = ACTIVITY_COLORS[task?.activityType] || ACTIVITY_COLORS.drill;

  // ── TTS ──────────────────────────────────────────────────────────────────────
  const playTTS = (text, rate = 0.65) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    utt.rate = rate;        // Slowed to 0.65 for clear, easy-to-follow speech
    utt.pitch = 1.0;
    utt.volume = 1.0;
    utt.onstart = () => setTtsPlaying(true);
    utt.onend   = () => setTtsPlaying(false);
    utt.onerror = () => setTtsPlaying(false);
    window.speechSynthesis.speak(utt);
  };

  // Speak words one-by-one slowly so student can follow along
  const speakWordList = (words) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setTtsPlaying(true);
    let index = 0;
    const speakNext = () => {
      if (index >= words.length) { setTtsPlaying(false); return; }
      const utt = new SpeechSynthesisUtterance(words[index]);
      utt.lang = 'en-US';
      utt.rate = 0.65;
      utt.pitch = 1.0;
      utt.volume = 1.0;
      utt.onend = () => { index++; setTimeout(speakNext, 600); };
      utt.onerror = () => { index++; speakNext(); };
      window.speechSynthesis.speak(utt);
    };
    speakNext();
  };

  // ── Recording ─────────────────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      chunksRef.current = [];

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        }
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
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
      // Pick a target word for the phoneme
      let targetWord = ph;
      if (ph && ph !== 'FLUENCY' && ph !== 'MASTERY') {
        try {
          const wRes = await fetch(`${API_URL}/api/test/word/${ph}`);
          const wData = await wRes.json();
          if (wData.success) targetWord = wData.data.word1 || ph;
        } catch { /* use phoneme as fallback */ }
      } else if (ph === 'FLUENCY' || ph === 'MASTERY') {
        targetWord = STORY_PHRASES[ph]?.split(' ')[0] || 'practice';
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

  // ── Next Step ─────────────────────────────────────────────────────────────────
  const goNextStep = () => {
    if (stepIdx < steps.length - 1) {
      setStepIdx(s => s + 1);
      setFeedback(null);
    }
  };

  // ── Complete Module ───────────────────────────────────────────────────────────
  const completeModule = async () => {
    try {
      setCompleting(true);
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/learning/complete-task`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pathId, weekNumber: weekNum, dayNumber: dayNum }),
      });
      setCompleted(true);
    } catch {
      // Still mark locally even if API fails
      setCompleted(true);
    } finally {
      setCompleting(false);
    }
  };

  const currentStepPassed = stepResults.some(r => r.stepId === currentStep?.id);
  const allStepsDone = steps.length > 0 && stepResults.length >= steps.length;
  const progressPct = steps.length ? Math.round((stepIdx / steps.length) * 100) : 0;

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">📚</div>
        </div>
        <p className="text-gray-500 font-medium animate-pulse">Loading module…</p>
      </div>
    );
  }

  // ─── Completed Screen ────────────────────────────────────────────────────────
  if (completed) {
    const avgAcc = stepResults.length
      ? Math.round(stepResults.reduce((s, r) => s + r.accuracy, 0) / stepResults.length)
      : 0;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-green-100 p-8 text-center">
          <div className="text-7xl mb-4 animate-bounce">🏆</div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">Module Complete!</h1>
          <p className="text-gray-500 mb-6">You crushed Day {dayNum} of Week {weekNum}.</p>

          {stepResults.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
              <div className="text-4xl font-black text-green-600 mb-1">{avgAcc}%</div>
              <div className="text-sm text-green-700 font-semibold">Average Accuracy</div>
              <div className="mt-2 text-xs text-green-600">{stepResults.length} steps completed ✓</div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/learning-path')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg text-lg"
            >
              🗺️ Back to Learning Path
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-2xl transition-all border border-gray-200"
            >
              📊 View Progress Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Module UI ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-spacegroteskmedium">
      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.gradient} text-white px-6 py-5 shadow-xl`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/learning-path')}
              className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
            >
              ←
            </button>
            <div>
              <div className="text-white/70 text-xs font-bold uppercase tracking-wider">
                Week {weekNum} · Day {dayNum}
              </div>
              <div className="font-black text-lg">{task?.title}</div>
            </div>
          </div>
          <div className={`${ACTIVITY_COLORS[task?.activityType]?.icon ? '' : ''} bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full`}>
            {colors.icon} {task?.activityType?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Step progress bar */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <div className="flex items-center gap-2 mb-6">
          {steps.map((s, i) => {
            const isDone = stepResults.some(r => r.stepId === s.id);
            const isCurr = i === stepIdx;
            return (
              <React.Fragment key={s.id}>
                <div className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm transition-all ${
                  isDone ? 'bg-green-500 text-white shadow-md'
                  : isCurr ? `bg-gradient-to-br ${colors.gradient} text-white shadow-md scale-110`
                  : 'bg-gray-200 text-gray-400'
                }`}>
                  {isDone ? '✓' : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-1 rounded-full transition-all ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          {/* Step header */}
          <div className={`${colors.light} ${colors.border} border-b px-6 py-4 flex items-center gap-3`}>
            <span className="text-3xl">{currentStep?.icon}</span>
            <div>
              <div className={`text-xs font-bold ${colors.text} uppercase tracking-wider mb-0.5`}>
                Step {stepIdx + 1} of {steps.length}
              </div>
              <h2 className="text-xl font-black text-gray-800">{currentStep?.title}</h2>
            </div>
          </div>

          {/* Instruction */}
          <div className="px-6 py-6">
            <div className="bg-gray-50 rounded-2xl p-5 mb-5 border border-gray-100">
              <p className="text-gray-700 text-base leading-relaxed">{currentStep?.instruction}</p>
            </div>

            {/* ── Word display panel: always show target words for the phoneme ── */}
            {currentStep?.phoneme && currentStep.phoneme !== 'FLUENCY' && currentStep.phoneme !== 'MASTERY' && (
              <div className={`mb-5 rounded-2xl p-4 border ${colors.border} ${colors.light}`}>
                <div className={`text-xs font-bold uppercase tracking-wider ${colors.text} mb-3 flex items-center gap-1.5`}>
                  📝 Words to Practice — read these aloud:
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(EXAMPLE_WORDS[currentStep.phoneme] || []).map((w, i) => (
                    <button
                      key={i}
                      onClick={() => playTTS(w)}
                      className={`px-4 py-2 rounded-xl font-bold text-base transition-all hover:scale-105 shadow-sm ${colors.light} ${colors.text} border ${colors.border}`}
                      title={`Click to hear "${w}"`}
                    >
                      🔊 {w}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => speakWordList(EXAMPLE_WORDS[currentStep.phoneme] || [])}
                    disabled={ttsPlaying}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                      ttsPlaying ? 'opacity-60 cursor-not-allowed bg-gray-100 text-gray-400' : `${colors.light} ${colors.text} hover:opacity-80`
                    }`}
                  >
                    {ttsPlaying ? '🔊 Playing…' : '▶️ Play all words'}
                  </button>
                </div>
              </div>
            )}

            {/* Story / fluency phrase display */}
            {currentStep?.phoneme && (currentStep.phoneme === 'FLUENCY' || currentStep.phoneme === 'MASTERY') && (
              <div className={`mb-5 rounded-2xl p-4 border ${colors.border} ${colors.light}`}>
                <div className={`text-xs font-bold uppercase tracking-wider ${colors.text} mb-2`}>📖 Read this phrase:</div>
                <p className={`font-bold text-lg ${colors.text} leading-relaxed`}>
                  "{STORY_PHRASES[currentStep.phoneme]}"
                </p>
                <button
                  onClick={() => playTTS(STORY_PHRASES[currentStep.phoneme] || '', 0.6)}
                  disabled={ttsPlaying}
                  className={`mt-3 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                    ttsPlaying ? 'opacity-60 cursor-not-allowed' : `${colors.light} ${colors.text} hover:opacity-80`
                  }`}
                >
                  {ttsPlaying ? '🔊 Playing…' : '🔊 Listen to phrase'}
                </button>
              </div>
            )}

            {/* TTS listen button (shown for listen_then_speak steps) */}
            {currentStep?.type === 'listen_then_speak' && (
              <div className="mb-5 flex justify-center">
                <button
                  onClick={() => {
                    const ph = currentStep.phoneme;
                    const words = EXAMPLE_WORDS[ph];
                    if (words && words.length > 0) {
                      speakWordList(words);
                    } else {
                      const text = STORY_PHRASES[ph] || ph;
                      playTTS(text);
                    }
                  }}
                  disabled={ttsPlaying}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-md ${
                    ttsPlaying
                      ? 'bg-blue-600 text-white animate-pulse'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  <span className="text-xl">🔊</span>
                  <span>{ttsPlaying ? 'Playing…' : 'Listen to Example'}</span>
                </button>
              </div>
            )}

            {/* Microphone area */}
            <div className="flex flex-col items-center gap-4">
              {/* Mic visual */}
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all shadow-xl ${
                recording
                  ? 'bg-red-500 animate-pulse shadow-red-200'
                  : analyzing
                  ? 'bg-amber-400 shadow-amber-200'
                  : currentStepPassed
                  ? 'bg-green-500 shadow-green-200'
                  : `bg-gradient-to-br ${colors.gradient} shadow-blue-200`
              }`}>
                {recording ? '🎙️' : analyzing ? '⚙️' : currentStepPassed ? '✅' : '🎤'}
              </div>

              {/* Status text */}
              <div className="text-sm font-semibold text-gray-500 text-center">
                {recording ? '🔴 Recording… speak now!' : analyzing ? '⏳ Analyzing your speech…' : currentStepPassed ? '✅ Step passed!' : 'Ready to record'}
              </div>

              {/* Control buttons */}
              <div className="flex gap-3 flex-wrap justify-center">
                {!recording && !analyzing && (
                  <button
                    onClick={startRecording}
                    className={`bg-gradient-to-r ${colors.gradient} text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5`}
                  >
                    🎙️ {currentStepPassed ? 'Try Again' : 'Start Speaking'}
                  </button>
                )}
                {recording && (
                  <button
                    onClick={stopRecording}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    ⏹️ Stop & Analyze
                  </button>
                )}
                {analyzing && (
                  <button disabled className="bg-amber-100 text-amber-700 font-bold py-3 px-6 rounded-2xl animate-pulse">
                    ⚙️ Analyzing…
                  </button>
                )}
              </div>
            </div>

            {/* Feedback card */}
            {feedback && (
              <div className={`mt-6 rounded-2xl p-5 border-2 ${
                feedback.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm uppercase tracking-wider text-gray-600">Speech Result</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    feedback.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {feedback.type === 'success' ? '✅ Passed!' : '❌ Try Again'}
                  </span>
                </div>
                {feedback.accuracy !== undefined && (
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <div className="text-xs text-gray-400 mb-1">You Said</div>
                      <div className="font-bold text-sm text-gray-800 capitalize">"{feedback.transcript}"</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <div className="text-xs text-gray-400 mb-1">Target</div>
                      <div className="font-bold text-sm text-gray-800 capitalize">"{feedback.targetWord}"</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <div className="text-xs text-gray-400 mb-1">Accuracy</div>
                      <div className={`text-2xl font-black ${
                        feedback.accuracy >= 70 ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {feedback.accuracy}%
                      </div>
                    </div>
                  </div>
                )}
                {feedback.message && (
                  <p className={`text-sm font-medium mt-2 ${feedback.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
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
            className="bg-white hover:bg-gray-50 text-gray-600 font-semibold py-3 px-5 rounded-2xl transition-all border border-gray-200 shadow-sm"
          >
            ← Exit
          </button>

          <div className="flex gap-3">
            {currentStepPassed && stepIdx < steps.length - 1 && (
              <button
                onClick={goNextStep}
                className={`bg-gradient-to-r ${colors.gradient} text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5`}
              >
                Next Step →
              </button>
            )}

            {(allStepsDone || (currentStepPassed && stepIdx === steps.length - 1)) && (
              <button
                onClick={completeModule}
                disabled={completing}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                {completing ? '💾 Saving…' : '🏁 Finish Module'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
