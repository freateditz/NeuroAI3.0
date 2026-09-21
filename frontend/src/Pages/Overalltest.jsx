import { useEffect, useState } from "react";
import Mic from "../Components/Mic";
import RecordingLoader from "../Components/RecordingLoader";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../url/base";
import AuroraBackground from "../Components/AuroraBackground";
import { GlassFilter } from "../Components/ui/LiquidGlass";
import { ShinyButton } from "../Components/ui/ShinyButton";
import { useTheme } from "../contexts/ThemeContext";

const baseUrl = API_URL;

const TEST_LETTERS = ['A', 'B', 'C', 'D', 'F', 'L', 'P', 'S', 'T', 'Z'];

const Overalltest = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const gradientHeading = darkMode
    ? { background: 'linear-gradient(to bottom, #fecdd3, #bae6fd, #f1f5f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
    : { background: 'linear-gradient(135deg, #312e81, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };

  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const letter = TEST_LETTERS[currentTestIndex];

  const [attempts, setAttempts] = useState([]);
  const [word, setWord] = useState("Apple");
  const [phrase, setPhrase] = useState("An apple a day");
  const [phrasePronounciation, setPhrasePronounciation] = useState("");
  const [pronounciation, setPronounciation] = useState("/ˈæp.əl/");
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [image, setImage] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userStats, setUserStats] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [submittedPath, setSubmittedPath] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [completedTestsMap, setCompletedTestsMap] = useState({});

  useEffect(() => {
    if (isAuthenticated && user) {
      setUserName(user.name || "User");
      fetchUserStatistics();
    }
  }, [isAuthenticated, user]);

  const fetchUserStatistics = async () => {
    if (!isAuthenticated) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/api/test/statistics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    async function fetchLetterData() {
      setLoading(true);
      setAttempts([]);
      setAverageAccuracy(0);
      setLastAnalysis(null);

      try {
        const wordResponse = await fetch(`${baseUrl}/api/test/word/${letter}`);
        const wordData = await wordResponse.json();

        if (wordData.success && wordData.data) {
          setImage(wordData.data.image_link || "");
          setWord(wordData.data.word1 || "");
          setPronounciation(wordData.data.pronunciation || "");
          setPhrase(wordData.data.phrase || wordData.data.word1 || "");
          setPhrasePronounciation(wordData.data.phrase_pronunciation || "");
        }

        if (isAuthenticated) {
          const token = localStorage.getItem('token');
          const progressResponse = await fetch(`${baseUrl}/api/test/progress/${letter}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            if (progressData.success && progressData.data.attempts && progressData.data.attempts.length > 0) {
              const loadedAttempts = progressData.data.attempts.map((a, i) => ({
                attemptNumber: a.attemptNumber || i + 1,
                accuracy: a.accuracy,
                transcript: a.transcript || wordData.data?.word1 || ""
              }));
              setAttempts(loadedAttempts);
              setCompletedTestsMap(prev => ({ ...prev, [letter]: true }));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching letter data:', error);
        showNotification('Failed to load test data', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchLetterData();
  }, [letter, isAuthenticated]);

  useEffect(() => {
    if (attempts.length === 0) {
      setAverageAccuracy(0);
    } else {
      const sum = attempts.reduce((acc, curr) => acc + curr.accuracy, 0);
      setAverageAccuracy((sum / attempts.length).toFixed(1));
    }
  }, [attempts]);

  const playTTS = async (textToSpeak) => {
    const text = textToSpeak || phrase || word;
    if (!text) return;
    setIsPlayingTTS(true);
    try {
      const response = await fetch(`${baseUrl}/api/test/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error('TTS request failed');
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => { setIsPlayingTTS(false); URL.revokeObjectURL(audioUrl); };
      audio.onerror = () => { setIsPlayingTTS(false); URL.revokeObjectURL(audioUrl); };
      await audio.play();
    } catch (err) {
      console.warn('ElevenLabs TTS failed, falling back to browser TTS:', err);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.75;
        utterance.onend = () => setIsPlayingTTS(false);
        utterance.onerror = () => setIsPlayingTTS(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingTTS(false);
      }
    }
  };

  const nextLetter = () => {
    if (currentTestIndex < TEST_LETTERS.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
    }
  };

  const previousLetter = () => {
    if (currentTestIndex > 0) {
      setCurrentTestIndex(prev => prev - 1);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3500);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mimeType = 'audio/webm;codecs=opus';
        else if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm';
        else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      let chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const actualMime = recorder.mimeType || mimeType || 'audio/webm';
        const ext = actualMime.includes('mp4') ? 'mp4' : 'webm';
        const audioBlob = new Blob(chunks, { type: actualMime });
        chunks = [];
        uploadRecording(audioBlob, ext);
      };

      recorder.start(100);
      setMediaRecorder(recorder);
      setRecording(true);
      setLastAnalysis(null);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      showNotification('Could not access microphone', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const uploadRecording = async (audioBlob, ext = 'webm') => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, `recording.${ext}`);
      formData.append('targetWord', phrase || word);

      const response = await fetch(`${baseUrl}/api/test/record`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to analyze recording');

      const resData = await response.json();
      const analysis = resData.data || {};
      const accuracy = typeof analysis.accuracy === 'number' ? analysis.accuracy : 0;
      const transcript = analysis.transcript || (accuracy >= 80 ? word : 'Sound not clear');
      const isCorrect = analysis.isCorrect ?? (accuracy >= 70);

      setLastAnalysis({ accuracy, transcript, isCorrect, targetWord: word });

      const newAttempt = { attemptNumber: attempts.length + 1, accuracy, transcript };
      setAttempts(prev => [...prev, newAttempt]);
      setCompletedTestsMap(prev => ({ ...prev, [letter]: true }));

      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        await fetch(`${baseUrl}/api/test/attempt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ letter, word: phrase || word, pronunciation: phrasePronounciation || pronounciation, accuracy, transcript })
        });
        fetchUserStatistics();
        showNotification(`Recognized "${transcript}" • Accuracy: ${accuracy}%`, accuracy >= 70 ? 'success' : 'error');
      } else {
        showNotification(`Accuracy: ${accuracy}% (${transcript})`, accuracy >= 70 ? 'success' : 'error');
      }
    } catch (err) {
      console.error('Error uploading recording:', err);
      showNotification('Failed to process speech. Please try again.', 'error');
    }
  };

  const resetAttemptsHandler = async () => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${baseUrl}/api/test/reset/${letter}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        showNotification('Test reset for letter ' + letter, 'success');
      } catch (error) {
        console.error('Error resetting test:', error);
      }
    }
    setAttempts([]);
    setAverageAccuracy(0);
    setLastAnalysis(null);
  };

  const handleSubmitAll = async () => {
    if (!isAuthenticated) {
      showNotification('Please sign in to submit your overall test', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/api/test/submit-all`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit tests');
      setSubmittedPath(data.data);
      setShowCompletionModal(true);
      showNotification('Assessment completed! Adaptive learning path generated.', 'success');
    } catch (err) {
      console.error('Error submitting test:', err);
      showNotification(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount = Object.keys(completedTestsMap).length;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden pt-20">
      <GlassFilter />
      <AuroraBackground />

      {/* Toast */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl font-inter text-sm border ${
          notification.type === 'success'
            ? 'bg-teal-400/10 border-teal-400/30 text-teal-300'
            : 'bg-red-500/10 border-red-500/30 text-red-300'
        } backdrop-blur-xl`}>
          {notification.message}
        </div>
      )}

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(28,19,8,0.45)', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-lg w-full rounded-3xl border p-8 text-center relative overflow-hidden"
            style={{ background: darkMode ? 'rgba(15,15,25,0.95)' : '#faf7f2', borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(180,165,145,0.5)', boxShadow: darkMode ? 'none' : '10px 10px 24px rgba(160,148,130,0.45), -5px -5px 16px rgba(255,255,255,0.95)' }}>
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, #6366f1, transparent 60%)' }} />
            <div className="relative z-10">
              <div className="text-5xl mb-5">🎉</div>
              <h2 className="font-cormorant font-light text-3xl mb-3" style={gradientHeading}>Overall Test Submitted!</h2>
              <p className="text-white/35 font-inter text-sm mb-6 leading-relaxed">
                Your 10-phoneme speech assessment has been analyzed and your personalized adaptive learning path is ready.
              </p>

              {submittedPath && (
                <div className="rounded-2xl border border-indigo-500/20 p-5 mb-6 text-left" style={{ background: 'rgba(99,102,241,0.06)' }}>
                  <div className="text-indigo-400 font-inter text-xs uppercase tracking-widest mb-2">Generated Path</div>
                  <div className="font-inter font-medium text-white/80 text-base mb-1">{submittedPath.title}</div>
                  <div className="text-white/35 font-inter text-sm mb-3">{submittedPath.planSummary}</div>
                  <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 font-inter">
                    {submittedPath.trackMode}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <ShinyButton onClick={() => navigate('/learning-path')}>Go to Learning Path</ShinyButton>
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
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <p className="text-teal-400 font-inter text-xs uppercase tracking-[0.2em] mb-2">Phoneme Assessment</p>
            <h1 className="font-cormorant font-light leading-tight" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', ...gradientHeading }}>
              Overall Speech Assessment
            </h1>
            <p className="text-white/25 font-inter text-sm mt-1">Complete 10 distinct phoneme tests to generate your adaptive learning plan.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 rounded-xl border border-white/8 text-white/40 font-inter text-sm hover:bg-white/5 hover:text-white/60 transition-all shrink-0"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Personalized banner */}
        {isAuthenticated && userName && (
          <div className="rounded-2xl border border-indigo-500/20 p-6 mb-8 relative overflow-hidden" style={{ background: 'rgba(99,102,241,0.08)' }}>
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
            <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-cormorant font-light text-2xl text-white mb-1">Hello, {userName}!</h2>
                <p className="text-white/35 font-inter text-sm">
                  Phoneme Test {currentTestIndex + 1} of {TEST_LETTERS.length} · Sound: <span className="text-indigo-300 font-medium">/{letter}/</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-white/20 font-inter text-xs uppercase tracking-widest mb-1">Completed</div>
                  <div className="font-cormorant text-3xl text-white">{completedCount} / 10</div>
                </div>
                <div className="text-center">
                  <div className="text-white/20 font-inter text-xs uppercase tracking-widest mb-1">Avg Score</div>
                  <div className="font-cormorant text-3xl text-teal-400">{averageAccuracy > 0 ? `${averageAccuracy}%` : '--'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress bar + test badges */}
        <div className="rounded-2xl border border-white/8 p-5 mb-8" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-white/25 font-inter text-xs uppercase tracking-widest">
              Test Progress: {completedCount} of 10
            </span>
            <span className="text-teal-400 font-inter text-xs font-medium">
              {Math.round((completedCount / 10) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${(completedCount / 10) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {TEST_LETTERS.map((itemLetter, idx) => {
              const isCurrent = idx === currentTestIndex;
              const isDone = completedTestsMap[itemLetter];
              return (
                <button
                  key={itemLetter}
                  onClick={() => setCurrentTestIndex(idx)}
                  className={`py-2 rounded-xl font-inter text-xs transition-all flex flex-col items-center justify-center border ${
                    isCurrent
                      ? 'border-indigo-500/60 bg-indigo-500/20 text-indigo-300 scale-105'
                      : isDone
                      ? 'border-teal-400/40 bg-teal-400/10 text-teal-400'
                      : 'border-white/8 text-white/25 hover:border-white/20 hover:text-white/50'
                  }`}
                >
                  <span className="font-medium">{idx + 1}</span>
                  <span>{itemLetter} {isDone ? '✓' : ''}</span>
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-16 h-16 rounded-full border-2 border-white/5 border-t-indigo-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Main card */}
            <div className="rounded-2xl border border-white/8 p-8 mb-8" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs px-4 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 text-indigo-300 font-inter">
                  Letter {letter} · Question {currentTestIndex + 1} of 10
                </span>
                <span className="text-white/25 font-inter text-xs">
                  Avg: <span className="text-teal-400">{averageAccuracy}%</span>
                </span>
              </div>

              <div className="text-center">
                {/* Phoneme badge */}
                <div className="text-white/25 font-inter text-xs uppercase tracking-[0.2em] mb-5">Featured Sound · /{letter}/</div>

                {/* Phrase to say */}
                <div className="rounded-2xl border border-indigo-500/20 p-5 mb-6 text-center" style={{ background: 'rgba(99,102,241,0.06)' }}>
                  <div className="text-indigo-300/70 font-inter text-xs uppercase tracking-[0.18em] mb-2">Say this phrase</div>
                  <div className="font-cormorant font-light text-white text-3xl md:text-4xl mb-2">
                    "{phrase}"
                  </div>
                  {phrasePronounciation && (
                    <div className="text-white/25 font-mono text-sm mb-3">{phrasePronounciation}</div>
                  )}
                  <button
                    onClick={() => playTTS(phrase)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-inter text-xs transition-all border ${
                      isPlayingTTS
                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 animate-pulse'
                        : 'border-white/10 text-white/35 hover:border-indigo-500/30 hover:text-indigo-300'
                    }`}
                  >
                    <span>🔊</span>
                    <span>{isPlayingTTS ? 'Playing...' : 'Listen to Phrase'}</span>
                  </button>
                </div>

                {image && (
                  <div className="flex justify-center mb-6">
                    <img
                      src={image}
                      className="h-36 object-contain rounded-2xl border border-white/8 p-2"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                      alt={word}
                    />
                  </div>
                )}

                {/* Mic state */}
                <div className="my-6">
                  {!recording ? <Mic /> : <RecordingLoader />}
                </div>

                {/* Analysis feedback */}
                {lastAnalysis && (
                  <div className="mb-6 rounded-2xl border border-white/8 p-5 text-left" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white/25 font-inter text-xs uppercase tracking-widest">Speech Analysis</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-inter ${
                        lastAnalysis.accuracy >= 70
                          ? 'bg-teal-400/10 text-teal-400 border border-teal-400/25'
                          : 'bg-amber-400/10 text-amber-400 border border-amber-400/25'
                      }`}>
                        {lastAnalysis.accuracy >= 80 ? 'Excellent' : lastAnalysis.accuracy >= 60 ? 'Good Try' : 'Keep Practicing'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                      {[
                        { label: 'You Spoke', value: `"${lastAnalysis.transcript}"` },
                        { label: 'Target Phrase', value: `"${phrase || word}"` },
                        { label: 'Accuracy', value: `${lastAnalysis.accuracy}%`, accent: lastAnalysis.accuracy >= 70 ? 'text-teal-400' : 'text-red-400' },
                      ].map(item => (
                        <div key={item.label} className="rounded-xl border border-white/6 p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <div className="text-white/20 font-inter text-xs mb-1">{item.label}</div>
                          <div className={`font-cormorant text-xl capitalize ${item.accent || 'text-white/70'}`}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  {!recording ? (
                    <button
                      onClick={startRecording}
                      className="px-6 py-3 rounded-xl bg-teal-400/10 border border-teal-400/30 text-teal-300 font-inter text-sm hover:bg-teal-400/20 transition-all"
                    >
                      🎙️ Start Speaking
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/30 font-inter text-sm animate-pulse"
                    >
                      🎙️ Listening…
                    </button>
                  )}
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 font-inter text-sm hover:bg-red-500/20 transition-all"
                  >
                    ⏹️ Stop
                  </button>
                  <button
                    onClick={resetAttemptsHandler}
                    className="px-6 py-3 rounded-xl border border-white/10 text-white/35 font-inter text-sm hover:bg-white/5 hover:text-white/60 transition-all"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Attempts */}
            <div className="mb-10">
              <p className="text-teal-400 font-inter text-xs uppercase tracking-[0.2em] mb-4">Attempts on this sound (up to 3 tries)</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => {
                  const att = attempts[idx];
                  const hasAttempt = typeof att !== "undefined";
                  const isPass = hasAttempt && att.accuracy >= 60;

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border p-5 flex flex-col items-center justify-center text-center transition-all ${
                        hasAttempt
                          ? isPass
                            ? 'border-teal-400/30 bg-teal-400/8'
                            : 'border-red-500/25 bg-red-500/8'
                          : 'border-white/6'
                      }`}
                      style={!hasAttempt ? { background: 'rgba(255,255,255,0.03)' } : {}}
                    >
                      <div className="text-white/25 font-inter text-xs uppercase tracking-widest mb-2">Attempt {idx + 1}</div>
                      {hasAttempt ? (
                        <>
                          <div className={`font-cormorant font-light text-4xl mb-1 ${isPass ? 'text-teal-400' : 'text-red-400'}`}>
                            {att.accuracy}%
                          </div>
                          <div className="text-white/30 font-inter text-xs truncate max-w-full">"{att.transcript || word}"</div>
                        </>
                      ) : (
                        <div className="text-white/20 font-inter text-sm">Not attempted</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-10">
              <div>
                {currentTestIndex > 0 && (
                  <button
                    onClick={previousLetter}
                    className="px-5 py-2.5 rounded-xl border border-white/8 text-white/40 font-inter text-sm hover:bg-white/5 hover:text-white/60 transition-all"
                  >
                    ← Previous Test
                  </button>
                )}
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                {currentTestIndex < TEST_LETTERS.length - 1 && (
                  <button
                    onClick={nextLetter}
                    className="px-5 py-2.5 rounded-xl border border-white/8 text-white/40 font-inter text-sm hover:bg-white/5 hover:text-white/60 transition-all"
                  >
                    Next Test →
                  </button>
                )}
                <ShinyButton onClick={handleSubmitAll} disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Assessment'}
                </ShinyButton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Overalltest;
