import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudioPlayer } from 'expo-audio';
import { useTheme } from '../../contexts/ThemeContext';
import GlassCard from '../../components/GlassCard';
import WaveformBars from '../../components/WaveformBars';
import { useRecorder } from '../../components/AudioRecorder';
import { COURSES, LETTER_WORDS, analyzeAudio, playTTS } from '../../config/api';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48 - 12) / 2;

function PracticeModal({ visible, course, onClose, darkMode }) {
  const { isRecording, recordingDuration, startRecording, stopRecording } = useRecorder();
  const ttsPlayer = useAudioPlayer(null);
  const [phase, setPhase] = useState('idle');
  const [result, setResult] = useState(null);
  const [ttsLoading, setTtsLoading] = useState(false);

  const bg = darkMode ? '#050714' : '#f4efe8';
  const textPrimary = darkMode ? '#f8fafc' : '#1c1308';
  const textMuted = darkMode ? 'rgba(248,250,252,0.45)' : 'rgba(28,19,8,0.55)';
  const textFaint = darkMode ? 'rgba(248,250,252,0.3)' : 'rgba(28,19,8,0.4)';
  const accent = darkMode ? '#2dd4bf' : '#4338ca';
  const borderColor = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(180,165,145,0.4)';

  const wordData = course ? LETTER_WORDS[course.phoneme1] || LETTER_WORDS['A'] : null;

  useEffect(() => {
    if (!visible) {
      setPhase('idle');
      setResult(null);
    }
  }, [visible]);

  const handleRecord = async () => {
    if (phase === 'recording') return;
    try {
      setPhase('recording');
      await startRecording();
      setTimeout(async () => {
        const uri = await stopRecording();
        if (!uri) { setPhase('idle'); return; }
        setPhase('analyzing');
        try {
          const data = await analyzeAudio(uri, wordData.word, course.phoneme1, course.phoneme2);
          setResult(data);
          setPhase('result');
        } catch {
          Alert.alert('Analysis Error', 'Could not analyze audio. Please try again.');
          setPhase('idle');
        }
      }, 3000);
    } catch (e) {
      Alert.alert('Recording Error', e.message || 'Could not start recording.');
      setPhase('idle');
    }
  };

  const handleTTS = async () => {
    if (!wordData) return;
    setTtsLoading(true);
    try {
      const uri = await playTTS(`Say: ${wordData.word}. The phoneme is ${course.phoneme1}.`);
      ttsPlayer.replace({ uri });
    } catch {
      Alert.alert('Error', 'Could not play audio. Check your connection.');
    } finally {
      setTtsLoading(false);
    }
  };

  const getGrade = (pct) => {
    if (pct >= 90) return { grade: 'A+', color: '#22c55e', msg: 'Outstanding!' };
    if (pct >= 80) return { grade: 'A', color: '#4ade80', msg: 'Excellent!' };
    if (pct >= 70) return { grade: 'B', color: '#86efac', msg: 'Great job!' };
    if (pct >= 60) return { grade: 'C', color: '#fde68a', msg: 'Keep practicing!' };
    return { grade: 'D', color: '#f87171', msg: 'More practice needed' };
  };

  if (!course || !wordData) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={[styles.modalContainer, { backgroundColor: bg }]}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

        <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeBtn, { color: textMuted }]}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: textPrimary }]}>{course.title}</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
          {/* Word card */}
          <GlassCard darkMode={darkMode} style={styles.wordCard}>
            <Text style={styles.wordEmoji}>{wordData.emoji}</Text>
            <Text style={[styles.wordText, { color: textPrimary }]}>{wordData.word}</Text>
            <Text style={[styles.phoneticText, { color: accent }]}>{wordData.phonetic}</Text>
            <Text style={[styles.phonemeHint, { color: textFaint }]}>
              Focus on: {course.phoneme1} vs {course.phoneme2}
            </Text>
          </GlassCard>

          {/* TTS button */}
          <TouchableOpacity
            style={[styles.ttsBtn, { borderColor, backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : '#faf7f2' }]}
            onPress={handleTTS}
            disabled={ttsLoading}
          >
            {ttsLoading ? (
              <ActivityIndicator color={accent} size="small" />
            ) : (
              <Text style={[styles.ttsBtnText, { color: accent }]}>🔊  Hear it pronounced</Text>
            )}
          </TouchableOpacity>

          {/* Waveform */}
          <GlassCard darkMode={darkMode} style={styles.waveCard}>
            <WaveformBars color={course.color} count={28} height={56} active={phase === 'recording'} />
            <Text style={[styles.waveLabel, { color: textFaint }]}>
              {phase === 'idle' && 'Press record to start'}
              {phase === 'recording' && `Recording... ${recordingDuration}s`}
              {phase === 'analyzing' && 'Analyzing your speech...'}
              {phase === 'result' && 'Analysis complete'}
            </Text>
          </GlassCard>

          {/* Record button */}
          {(phase === 'idle' || phase === 'recording') && (
            <TouchableOpacity
              style={[styles.recordBtn, phase === 'recording' && styles.recordBtnActive]}
              onPress={handleRecord}
              disabled={phase === 'recording'}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={phase === 'recording' ? ['#ef4444', '#dc2626'] : ['#6366f1', '#4f46e5']}
                style={styles.recordGradient}
              >
                <Text style={styles.recordBtnText}>
                  {phase === 'recording' ? '⏺  Recording...' : '🎙️  Record Now'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Analyzing */}
          {phase === 'analyzing' && (
            <View style={styles.analyzingBox}>
              <ActivityIndicator color={accent} size="large" />
              <Text style={[styles.analyzingText, { color: textMuted }]}>AI is analyzing your speech...</Text>
            </View>
          )}

          {/* Results */}
          {phase === 'result' && result && (() => {
            const pct = result.percentage ?? result.accuracy ?? 0;
            const { grade, color, msg } = getGrade(pct);
            return (
              <View style={styles.resultSection}>
                <GlassCard darkMode={darkMode} style={styles.resultCard}>
                  <View style={styles.resultTop}>
                    <View>
                      <Text style={[styles.resultGrade, { color }]}>{grade}</Text>
                      <Text style={[styles.resultMsg, { color: textMuted }]}>{msg}</Text>
                    </View>
                    <Text style={[styles.resultPct, { color }]}>{pct}%</Text>
                  </View>
                  <View style={[styles.scoreBar, { backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(180,165,145,0.2)' }]}>
                    <View style={[styles.scoreBarFill, { width: `${pct}%`, backgroundColor: color }]} />
                  </View>
                  {result.feedback ? (
                    <Text style={[styles.feedbackText, { color: textMuted }]}>{result.feedback}</Text>
                  ) : null}
                  {result.transcription ? (
                    <Text style={[styles.transcriptionText, { color: textFaint }]}>
                      Heard: "{result.transcription}"
                    </Text>
                  ) : null}
                </GlassCard>

                <View style={styles.resultActions}>
                  <TouchableOpacity
                    style={[styles.retryBtn, { borderColor, backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : '#faf7f2' }]}
                    onPress={() => setPhase('idle')}
                  >
                    <Text style={[styles.retryBtnText, { color: textMuted }]}>↩  Try Again</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.nextBtn} onPress={onClose} activeOpacity={0.85}>
                    <LinearGradient colors={['#6366f1', '#4f46e5']} style={styles.nextGradient}>
                      <Text style={styles.nextBtnText}>Next →</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })()}
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function LearningScreen() {
  const { darkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [progress, setProgress] = useState({});

  const bg = darkMode ? '#050714' : '#f4efe8';
  const textPrimary = darkMode ? '#f8fafc' : '#1c1308';
  const textMuted = darkMode ? 'rgba(248,250,252,0.45)' : 'rgba(28,19,8,0.55)';
  const textFaint = darkMode ? 'rgba(248,250,252,0.3)' : 'rgba(28,19,8,0.4)';
  const accent = darkMode ? '#2dd4bf' : '#4338ca';
  const borderColor = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(180,165,145,0.4)';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: borderColor }]}>
        <Text style={[styles.screenTitle, { color: textPrimary }]}>Learning{'\n'}Modules</Text>
        <Text style={[styles.headerSub, { color: textFaint }]}>Select a module to practice</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: accent }]}>PHONEME PAIRS</Text>
        <View style={styles.courseGrid}>
          {COURSES.map((course) => {
            const prog = progress[course.id] || 0;
            return (
              <GlassCard key={course.id} darkMode={darkMode} style={styles.courseCard}>
                <View style={[styles.courseAccentBar, { backgroundColor: course.color }]} />
                <View style={styles.courseContent}>
                  <Text style={styles.courseEmoji}>
                    {LETTER_WORDS[course.phoneme1]?.emoji || '🔤'}
                  </Text>
                  <Text style={[styles.courseTitle, { color: course.color }]}>{course.title}</Text>
                  <Text style={[styles.courseSub, { color: textFaint }]}>
                    {LETTER_WORDS[course.phoneme1]?.word || 'Practice'}
                  </Text>

                  <View style={[styles.progressTrack, { backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(180,165,145,0.2)' }]}>
                    <View style={[styles.progressFill, { width: `${prog}%`, backgroundColor: course.color }]} />
                  </View>
                  <Text style={[styles.progressLabel, { color: textFaint }]}>{prog}% complete</Text>

                  <TouchableOpacity
                    style={[styles.startBtn, { borderColor: course.color + '55', backgroundColor: course.color + '15' }]}
                    onPress={() => setSelectedCourse(course)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.startBtnText, { color: course.color }]}>
                      {prog > 0 ? 'Continue →' : 'Start →'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </GlassCard>
            );
          })}
        </View>
      </ScrollView>

      <PracticeModal
        visible={!!selectedCourse}
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        darkMode={darkMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1 },
  screenTitle: { fontSize: 32, fontFamily: 'Georgia', fontWeight: '300', lineHeight: 38, letterSpacing: -0.3 },
  headerSub: { fontSize: 12, marginTop: 4, fontWeight: '300' },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  sectionLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 1.8, marginBottom: 14 },
  courseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  courseCard: { width: CARD_W, overflow: 'hidden' },
  courseAccentBar: { height: 3, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  courseContent: { padding: 14 },
  courseEmoji: { fontSize: 28, marginBottom: 8 },
  courseTitle: { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  courseSub: { fontSize: 11, marginBottom: 12, fontWeight: '300' },
  progressTrack: { height: 3, borderRadius: 2, marginBottom: 4 },
  progressFill: { height: 3, borderRadius: 2 },
  progressLabel: { fontSize: 10, marginBottom: 12 },
  startBtn: { borderWidth: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  startBtnText: { fontSize: 12, fontWeight: '600' },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  closeBtn: { fontSize: 18, width: 28 },
  modalTitle: { fontSize: 16, fontWeight: '600' },
  modalScroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 },
  wordCard: { padding: 24, alignItems: 'center', marginBottom: 14 },
  wordEmoji: { fontSize: 56, marginBottom: 12 },
  wordText: { fontSize: 32, fontFamily: 'Georgia', fontWeight: '300', marginBottom: 6 },
  phoneticText: { fontSize: 16, fontWeight: '400', marginBottom: 6 },
  phonemeHint: { fontSize: 12, fontWeight: '300' },
  ttsBtn: {
    borderWidth: 1, borderRadius: 12, paddingVertical: 12,
    alignItems: 'center', marginBottom: 14,
  },
  ttsBtnText: { fontSize: 14, fontWeight: '500' },
  waveCard: { padding: 16, marginBottom: 20 },
  waveLabel: { fontSize: 11, textAlign: 'center', marginTop: 10 },
  recordBtn: { borderRadius: 14, overflow: 'hidden', marginBottom: 20 },
  recordBtnActive: { opacity: 0.8 },
  recordGradient: { paddingVertical: 18, alignItems: 'center' },
  recordBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  analyzingBox: { alignItems: 'center', paddingVertical: 32, gap: 14 },
  analyzingText: { fontSize: 14, fontWeight: '300' },
  resultSection: { gap: 12 },
  resultCard: { padding: 20 },
  resultTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  resultGrade: { fontSize: 32, fontFamily: 'Georgia', fontWeight: '300' },
  resultMsg: { fontSize: 13, fontWeight: '300', marginTop: 2 },
  resultPct: { fontSize: 40, fontFamily: 'Georgia', fontWeight: '300' },
  scoreBar: { height: 4, borderRadius: 2, marginBottom: 14 },
  scoreBarFill: { height: 4, borderRadius: 2 },
  feedbackText: { fontSize: 13, lineHeight: 20, fontWeight: '300', marginBottom: 8 },
  transcriptionText: { fontSize: 12, fontStyle: 'italic' },
  resultActions: { flexDirection: 'row', gap: 10 },
  retryBtn: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  retryBtnText: { fontSize: 14, fontWeight: '500' },
  nextBtn: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  nextGradient: { paddingVertical: 14, alignItems: 'center' },
  nextBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
