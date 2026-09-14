import { useEffect, useState } from "react";
import RecordButton from "../Components/RecordButton";
import Mic from "../Components/Mic";
import NavButton from "../Components/NavButton";
import RecordingLoader from "../Components/RecordingLoader";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../url/base";

const baseUrl = API_URL;

// Exactly 10 distinct phoneme tests
const TEST_LETTERS = ['A', 'B', 'C', 'D', 'F', 'L', 'P', 'S', 'T', 'Z'];

const Overalltest = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const letter = TEST_LETTERS[currentTestIndex];

  const [attempts, setAttempts] = useState([]);
  const [word, setWord] = useState("Apple");
  const [pronounciation, setPronounciation] = useState("/ˈæp.əl/");
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [image, setImage] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userStats, setUserStats] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  // Latest voice analysis result
  const [lastAnalysis, setLastAnalysis] = useState(null);

  // Completion modal after submitting
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [submittedPath, setSubmittedPath] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Track which tests have been completed
  const [completedTestsMap, setCompletedTestsMap] = useState({});

  // Get user name for personalization
  useEffect(() => {
    if (isAuthenticated && user) {
      setUserName(user.name || "User");
      fetchUserStatistics();
    }
  }, [isAuthenticated, user]);

  // Fetch user statistics for personalization
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

  // Fetch letter data when current letter changes
  useEffect(() => {
    async function fetchLetterData() {
      setLoading(true);
      setAttempts([]);
      setAverageAccuracy(0);
      setLastAnalysis(null);

      try {
        // Fetch word from backend
        const wordResponse = await fetch(`${baseUrl}/api/test/word/${letter}`);
        const wordData = await wordResponse.json();

        if (wordData.success && wordData.data) {
          setImage(wordData.data.image_link || "");
          setWord(wordData.data.word1 || "");
          setPronounciation(wordData.data.pronunciation || "");
        }

        // If user is authenticated, fetch existing progress for this letter
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
                transcript: a.transcript || wordData.data.word1
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

  // Calculate average accuracy
  useEffect(() => {
    if (attempts.length === 0) {
      setAverageAccuracy(0);
    } else {
      const sum = attempts.reduce((acc, curr) => acc + curr.accuracy, 0);
      setAverageAccuracy((sum / attempts.length).toFixed(1));
    }
  }, [attempts]);

  // TTS: Listen to correct pronunciation
  const playTTS = (textToSpeak) => {
    if (!('speechSynthesis' in window)) {
      showNotification('TTS is not supported in this browser', 'error');
      return;
    }

    window.speechSynthesis.cancel(); // Stop any active audio
    const utterance = new SpeechSynthesisUtterance(textToSpeak || word);
    utterance.lang = 'en-US';
    utterance.rate = 0.65; // Slow for clear pronunciation modeling
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlayingTTS(true);
    utterance.onend = () => setIsPlayingTTS(false);
    utterance.onerror = () => setIsPlayingTTS(false);

    window.speechSynthesis.speak(utterance);
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
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

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
      let chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
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
      formData.append('targetWord', word);

      const response = await fetch(`${baseUrl}/api/test/record`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze recording');
      }

      const resData = await response.json();
      const analysis = resData.data || {};
      const accuracy = typeof analysis.accuracy === 'number' ? analysis.accuracy : 0;
      const transcript = analysis.transcript || (accuracy >= 80 ? word : 'Sound not clear');
      const isCorrect = analysis.isCorrect ?? (accuracy >= 70);

      // Store analysis result for visual feedback
      setLastAnalysis({
        accuracy,
        transcript,
        isCorrect,
        targetWord: word,
      });

      const newAttempt = {
        attemptNumber: attempts.length + 1,
        accuracy,
        transcript,
      };

      setAttempts(prev => [...prev, newAttempt]);
      setCompletedTestsMap(prev => ({ ...prev, [letter]: true }));

      // Save to database if user is authenticated
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        await fetch(`${baseUrl}/api/test/attempt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            letter,
            word,
            pronunciation: pronounciation,
            accuracy,
            transcript
          })
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
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit tests');
      }

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
    <div className="md:px-[9rem] pb-[4rem] font-spacegroteskmedium dark:bg-gray-900 dark:text-white min-h-screen">
      {/* Toast Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white font-spacegroteskmedium animate-bounce`}>
          {notification.message}
        </div>
      )}

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl border-4 border-blue-200 dark:border-gray-700 animate-scale-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Overall Test Submitted!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your 10-phoneme speech assessment has been analyzed and your personalized adaptive learning path is ready.
            </p>

            {submittedPath && (
              <div className="bg-blue-50 dark:bg-gray-700/50 p-4 rounded-2xl mb-6 text-left border border-blue-100 dark:border-gray-600">
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                  Generated Path
                </div>
                <div className="font-bold text-lg mb-1">{submittedPath.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{submittedPath.planSummary}</div>
                <div className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                  {submittedPath.trackMode}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/learning-path')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg text-lg"
              >
                🚀 Go to Adaptive Learning Path
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                📊 View Progress Report Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with Title and Progress */}
      <div className="mb-6 mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">Overall Speech Assessment</h1>
          <p className="text-gray-600 dark:text-gray-400">Complete 10 distinct phoneme tests to generate your adaptive learning plan.</p>
        </div>
        <NavButton
          text="Back to Dashboard"
          currLetter=""
          onClickHandler={() => navigate('/dashboard')}
        />
      </div>

      {/* Personalized Header */}
      {isAuthenticated && userName && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Hello, {userName}! 👋</h2>
              <p className="opacity-90">Phoneme Test {currentTestIndex + 1} of {TEST_LETTERS.length} • Sound: <span className="font-bold underline text-yellow-300">/{letter}/</span></p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-4 py-2 rounded-xl text-center">
                <div className="text-xs opacity-80 uppercase font-semibold">Completed</div>
                <div className="text-xl font-bold">{completedCount} / 10</div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-xl text-center">
                <div className="text-xs opacity-80 uppercase font-semibold">Average Score</div>
                <div className="text-xl font-bold">{averageAccuracy > 0 ? `${averageAccuracy}%` : '--'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10-Question Step Indicator Bar */}
      <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
            TEST PROGRESS: {completedCount} OF 10 COMPLETED
          </span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {Math.round((completedCount / 10) * 100)}%
          </span>
        </div>
        
        {/* Progress bar line */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden mb-4">
          <div
            className="bg-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(completedCount / 10) * 100}%` }}
          ></div>
        </div>

        {/* 10 Question Badges */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {TEST_LETTERS.map((itemLetter, idx) => {
            const isCurrent = idx === currentTestIndex;
            const isDone = completedTestsMap[itemLetter];
            return (
              <button
                key={itemLetter}
                onClick={() => setCurrentTestIndex(idx)}
                className={`py-2 rounded-xl font-bold text-sm transition-all flex flex-col items-center justify-center border-2 ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-500 text-white shadow-md transform scale-105'
                    : isDone
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300'
                }`}
              >
                <span>{idx + 1}</span>
                <span className="text-xs">{itemLetter} {isDone ? '✓' : ''}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center my-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 max-w-3xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-bold">
                <span>Letter {letter}</span>
                <span>•</span>
                <span>Question {currentTestIndex + 1} of 10</span>
              </div>
              <div className="text-sm font-bold text-gray-500 dark:text-gray-400">
                Avg: <span className="text-blue-600 dark:text-blue-400">{averageAccuracy}%</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-black mb-2 text-gray-900 dark:text-white capitalize">
                {word}
              </div>
              
              {/* Pronunciation with TTS Button */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-xl text-gray-500 dark:text-gray-400 font-mono">
                  {pronounciation}
                </span>
                <button
                  onClick={() => playTTS(word)}
                  title="Listen to pronunciation (TTS)"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
                    isPlayingTTS
                      ? 'bg-blue-600 text-white animate-pulse'
                      : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                  }`}
                >
                  <span>🔊</span>
                  <span>{isPlayingTTS ? 'Playing...' : 'Listen TTS'}</span>
                </button>
              </div>

              {image && (
                <div className="flex justify-center mb-6">
                  <img
                    src={image}
                    className="h-44 object-contain rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900"
                    alt={word}
                  />
                </div>
              )}

              {/* Microphone state */}
              <div className="my-6">
                {!recording ? <Mic /> : <RecordingLoader />}
              </div>

              {/* Real-time Voice Recognition & Accuracy Feedback */}
              {lastAnalysis && (
                <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700/60 dark:to-gray-700/30 border-2 border-blue-200 dark:border-blue-500/30 animate-fade-in text-left">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Speech Analysis Result
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      lastAnalysis.accuracy >= 70
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                    }`}>
                      {lastAnalysis.accuracy >= 80 ? '🌟 Excellent Match' : lastAnalysis.accuracy >= 60 ? '👍 Good Try' : '💪 Keep Practicing'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-600">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">You Spoke</div>
                      <div className="text-lg font-bold text-gray-800 dark:text-white capitalize">
                        "{lastAnalysis.transcript}"
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-600">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Target Word</div>
                      <div className="text-lg font-bold text-gray-800 dark:text-white capitalize">
                        "{word}"
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-600">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Accuracy</div>
                      <div className={`text-2xl font-black ${
                        lastAnalysis.accuracy >= 70 ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {lastAnalysis.accuracy}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {!recording ? (
                  <RecordButton
                    bgColor="#89D85D"
                    text="🎙️ Start Speaking"
                    onClickHandler={startRecording}
                  />
                ) : (
                  <RecordButton
                    bgColor="#E3E2E7"
                    textColor="black"
                    text="Listening..."
                  />
                )}
                <RecordButton
                  bgColor="#D86C5D"
                  text="⏹️ Stop Recording"
                  onClickHandler={stopRecording}
                />
                <RecordButton
                  bgColor="#0984E3"
                  text="🔄 Reset Tries"
                  onClickHandler={resetAttemptsHandler}
                />
              </div>
            </div>
          </div>

          {/* Attempts History */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
              Attempts on this sound (up to 3 tries):
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((idx) => {
                const att = attempts[idx];
                const hasAttempt = typeof att !== "undefined";
                const isPass = hasAttempt && att.accuracy >= 60;

                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl flex flex-col justify-center items-center text-center transition-all shadow-md ${
                      hasAttempt
                        ? isPass
                          ? 'bg-green-500 text-white'
                          : 'bg-rose-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">Attempt {idx + 1}</div>
                    {hasAttempt ? (
                      <>
                        <div className="text-3xl font-black mb-1">{att.accuracy}%</div>
                        <div className="text-xs opacity-90 truncate max-w-full">
                          Heard: "{att.transcript || word}"
                        </div>
                      </>
                    ) : (
                      <div className="text-sm opacity-70">Not attempted yet</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation and Final Submit Buttons */}
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pb-10">
            <div>
              {currentTestIndex > 0 && (
                <NavButton
                  text="← Previous Test"
                  currLetter=""
                  onClickHandler={previousLetter}
                />
              )}
            </div>

            <div className="flex gap-4">
              {currentTestIndex < TEST_LETTERS.length - 1 && (
                <NavButton
                  text="Next Test →"
                  currLetter=""
                  onClickHandler={nextLetter}
                />
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmitAll}
                disabled={submitting}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 text-lg flex items-center gap-2"
              >
                <span>{submitting ? 'Submitting & Generating...' : '✨ Submit Overall Assessment'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Overalltest;

