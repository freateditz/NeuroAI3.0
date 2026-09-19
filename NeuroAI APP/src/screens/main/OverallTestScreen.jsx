import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import GlassCard from '../../components/GlassCard';
import WaveformBars from '../../components/WaveformBars';
import { useRecorder } from '../../components/AudioRecorder';
import { COURSES, LETTER_WORDS, analyzeAudio, getRemedy } from '../../config/api';

export default function OverallTestScreen() {
  const { darkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { isRecording, recordingDuration, startRecording, stopRecording } = useRecorder();

  const [step, setStep] = useState('intro'); // intro | question | result | summary
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState([]);
  const [phase, setPhase] = useState('idle'); // idle | recording | analyzing
  const [remedy, setRemedy] = useState(null);
  const [remedyLoading, setRemedyLoading] = useState(false);

  const bg = darkMode ? '#050714' : '#f4efe8';
  const textPrimary = darkMode ? '#f8fafc' : '#1c1308';
  const textMuted = darkMode ? 'rgba(248,250,252,0.45)' : 'rgba(28,19,8,0.55)';
  const textFaint = darkMode ? 'rgba(248,250,252,0.3)' : 'rgba(28,19,8,0.4)';
  const accent = darkMode ? '#2dd4bf' : '#4338ca';
  const borderColor = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(180,165,145,0.4)';

  const currentCourse = COURSES[currentIndex];
  const wordData = currentCourse ? LETTER_WORDS[currentCourse.phoneme1] : null;
  const overallScore = scores.length ? Math.round(scores.reduce((a, b) => a + b.pct, 0) / scores.length) : 0;

  const getGrade = (pct) => {
    if (pct >= 90) return { grade: 'A+', color: '#22c55e' };
    if (pct >= 80) return { grade: 'A', color: '#4ade80' };
    if (pct >= 70) return { grade: 'B', color: '#86efac' };
    if (pct >= 60) return { grade: 'C', color: '#fde68a' };
    return { grade: 'D', color: '#f87171' };
  };

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
          const data = await analyzeAudio(uri, wordData.word, currentCourse.phoneme1, currentCourse.phoneme2);
          const pct = data.percentage ?? data.accuracy ?? 0;
          setScores((prev) => [
            ...prev,
            { course: currentCourse, pct, feedback: data.feedback, transcription: data.transcription },
          ]);
          setPhase('idle');
          setStep('result');
        } catch {
          Alert.alert('Error', 'Could not analyze. Try again.');
          setPhase('idle');
        }
      }, 3000);
    } catch (e) {
      Alert.alert('Permission Error', e.message || 'Cannot access microphone.');
      setPhase('idle');
    }
  };

  const handleNext = () => {
    if (currentIndex < COURSES.length - 1) {
      setCurrentIndex((i) => i + 1);
      setStep('question');
    } else {
      setStep('summary');
    }
  };

  const handleGetRemedy = async () => {
    setRemedyLoading(true);
    try {
      const worst = scores.reduce((a, b) => (a.pct < b.pct ? a : b));
      const data = await getRemedy(overallScore, worst.course.phoneme1, worst.course.phoneme2);
      setRemedy(data.remedy || data.message || 'Keep practicing every day!');
    } catch {
      setRemedy('Great effort! Focus on consistent daily practice for 5–10 minutes to see steady improvement.');
    } finally {
      setRemedyLoading(false);
    }
  };

  const resetTest = () => {
    setStep('intro');
    setCurrentIndex(0);
    setScores([]);
    setPhase('idle');
    setRemedy(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: borderColor }]}>
        <Text style={[styles.screenTitle, { color: textPrimary }]}>Overall{'\n'}Assessment</Text>
        <Text style={[styles.headerSub, { color: textFaint }]}>Test all 6 phoneme pairs</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress bar */}
        {(step === 'question' || step === 'result') && (
          <View style={styles.progressSection}>
            <View style={styles.progressMeta}>
              <Text style={[styles.progressText, { color: textFaint }]}>
                Question {currentIndex + 1} of {COURSES.length}
              </Text>
              <Text style={[styles.progressText, { color: textFaint }]}>
                {Math.round(((currentIndex) / COURSES.length) * 100)}% done
              </Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(180,165,145,0.2)' }]}>
              <View style={[styles.progressFill, { width: `${((currentIndex) / COURSES.length) * 100}%`, backgroundColor: accent }]} />
            </View>
          </View>
        )}

        {/* Intro */}
        {step === 'intro' && (
          <View style={styles.section}>
            <GlassCard darkMode={darkMode} style={styles.introCard}>
              <Text style={styles.introIcon}>📝</Text>
              <Text style={[styles.introTitle, { color: textPrimary }]}>Ready to Test?</Text>
              <Text style={[styles.introDesc, { color: textMuted }]}>
                You'll practice 6 phoneme pairs. Record yourself saying each word clearly. Our AI will
                score your pronunciation and give personalized feedback.
              </Text>
              <View style={styles.courseChips}>
                {COURSES.map((c) => (
                  <View key={c.id} style={[styles.chip, { backgroundColor: c.color + '20', borderColor: c.color + '55' }]}>
                    <Text style={[styles.chipText, { color: c.color }]}>{c.title}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setStep('question')}
              activeOpacity={0.85}
            >
              <LinearGradient colors={['#6366f1', '#4f46e5']} style={styles.primaryGradient}>
                <Text style={styles.primaryBtnText}>Begin Assessment →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Question */}
        {step === 'question' && wordData && (
          <View style={styles.section}>
            <GlassCard darkMode={darkMode} style={styles.wordCard}>
              <Text style={styles.wordEmoji}>{wordData.emoji}</Text>
              <Text style={[styles.wordText, { color: textPrimary }]}>{wordData.word}</Text>
              <Text style={[styles.phonetic, { color: accent }]}>{wordData.phonetic}</Text>
              <Text style={[styles.phonemeHint, { color: textFaint }]}>
                Focus: {currentCourse.phoneme1} vs {currentCourse.phoneme2}
              </Text>
            </GlassCard>

            <GlassCard darkMode={darkMode} style={styles.waveCard}>
              <WaveformBars color={currentCourse.color} count={28} height={52} active={phase === 'recording'} />
              <Text style={[styles.waveLabel, { color: textFaint }]}>
                {phase === 'idle' && 'Press to record your pronunciation'}
                {phase === 'recording' && `Recording... ${recordingDuration}s`}
                {phase === 'analyzing' && 'Analyzing...'}
              </Text>
            </GlassCard>

            {phase === 'analyzing' ? (
              <View style={styles.analyzingBox}>
                <ActivityIndicator color={accent} size="large" />
                <Text style={[styles.analyzingText, { color: textMuted }]}>AI analyzing your speech...</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.recordBtn}
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
          </View>
        )}

        {/* Result for current question */}
        {step === 'result' && scores[currentIndex] && (() => {
          const s = scores[currentIndex];
          const { grade, color } = getGrade(s.pct);
          return (
            <View style={styles.section}>
              <GlassCard darkMode={darkMode} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View>
                    <Text style={[styles.gradeText, { color }]}>{grade}</Text>
                    <Text style={[styles.courseLabel, { color: textMuted }]}>{s.course.title}</Text>
                  </View>
                  <Text style={[styles.pctText, { color }]}>{s.pct}%</Text>
                </View>
                <View style={[styles.scoreBar, { backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(180,165,145,0.2)' }]}>
                  <View style={[styles.scoreBarFill, { width: `${s.pct}%`, backgroundColor: color }]} />
                </View>
                {s.feedback ? <Text style={[styles.feedbackText, { color: textMuted }]}>{s.feedback}</Text> : null}
              </GlassCard>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleNext} activeOpacity={0.85}>
                <LinearGradient colors={['#6366f1', '#4f46e5']} style={styles.primaryGradient}>
                  <Text style={styles.primaryBtnText}>
                    {currentIndex < COURSES.length - 1 ? 'Next Question →' : 'See Results →'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          );
        })()}

        {/* Summary */}
        {step === 'summary' && (
          <View style={styles.section}>
            <GlassCard darkMode={darkMode} style={styles.summaryHero}>
              {(() => {
                const { grade, color } = getGrade(overallScore);
                return (
                  <>
                    <Text style={[styles.overallGrade, { color }]}>{grade}</Text>
                    <Text style={[styles.overallScore, { color }]}>{overallScore}%</Text>
                    <Text style={[styles.overallLabel, { color: textMuted }]}>Overall Score</Text>
                    <View style={[styles.scoreBar, { backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(180,165,145,0.2)', marginTop: 12 }]}>
                      <View style={[styles.scoreBarFill, { width: `${overallScore}%`, backgroundColor: color }]} />
                    </View>
                  </>
                );
              })()}
            </GlassCard>

            <Text style={[styles.sectionLabel, { color: accent }]}>BREAKDOWN</Text>
            {scores.map((s, i) => {
              const { color } = getGrade(s.pct);
              return (
                <GlassCard key={i} darkMode={darkMode} style={styles.scoreRow}>
                  <View style={styles.scoreRowInner}>
                    <Text style={[styles.scoreRowTitle, { color: s.course.color }]}>{s.course.title}</Text>
                    <View style={{ flex: 1, marginHorizontal: 12 }}>
                      <View style={[styles.scoreBar, { backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(180,165,145,0.2)' }]}>
                        <View style={[styles.scoreBarFill, { width: `${s.pct}%`, backgroundColor: color }]} />
                      </View>
                    </View>
                    <Text style={[styles.scoreRowPct, { color }]}>{s.pct}%</Text>
                  </View>
                </GlassCard>
              );
            })}

            {!remedy && (
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleGetRemedy}
                disabled={remedyLoading}
                activeOpacity={0.85}
              >
                <LinearGradient colors={['#6366f1', '#4f46e5']} style={styles.primaryGradient}>
                  {remedyLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>🧠 Get AI Remedy</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}

            {remedy && (
              <GlassCard darkMode={darkMode} style={styles.remedyCard}>
                <Text style={[styles.remedyTitle, { color: accent }]}>AI Recommendation</Text>
                <Text style={[styles.remedyText, { color: textMuted }]}>{remedy}</Text>
              </GlassCard>
            )}

            <TouchableOpacity
              style={[styles.resetBtn, { borderColor, backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : '#faf7f2' }]}
              onPress={resetTest}
            >
              <Text style={[styles.resetBtnText, { color: textMuted }]}>↩  Retake Assessment</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1 },
  screenTitle: { fontSize: 32, fontFamily: 'Georgia', fontWeight: '300', lineHeight: 38, letterSpacing: -0.3 },
  headerSub: { fontSize: 12, marginTop: 4, fontWeight: '300' },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  progressSection: { marginBottom: 20 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressText: { fontSize: 11 },
  progressTrack: { height: 4, borderRadius: 2 },
  progressFill: { height: 4, borderRadius: 2 },
  section: { gap: 14 },
  introCard: { padding: 24, alignItems: 'center' },
  introIcon: { fontSize: 48, marginBottom: 14 },
  introTitle: { fontSize: 24, fontFamily: 'Georgia', fontWeight: '300', marginBottom: 10 },
  introDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, fontWeight: '300', marginBottom: 20 },
  courseChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  chip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  chipText: { fontSize: 11, fontWeight: '600' },
  wordCard: { padding: 24, alignItems: 'center' },
  wordEmoji: { fontSize: 56, marginBottom: 10 },
  wordText: { fontSize: 32, fontFamily: 'Georgia', fontWeight: '300', marginBottom: 6 },
  phonetic: { fontSize: 16, marginBottom: 6 },
  phonemeHint: { fontSize: 12, fontWeight: '300' },
  waveCard: { padding: 16 },
  waveLabel: { fontSize: 11, textAlign: 'center', marginTop: 8 },
  analyzingBox: { alignItems: 'center', paddingVertical: 28, gap: 12 },
  analyzingText: { fontSize: 14, fontWeight: '300' },
  recordBtn: { borderRadius: 14, overflow: 'hidden' },
  recordGradient: { paddingVertical: 18, alignItems: 'center' },
  recordBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  primaryBtn: { borderRadius: 14, overflow: 'hidden' },
  primaryGradient: { paddingVertical: 16, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  resultCard: { padding: 20 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  gradeText: { fontSize: 32, fontFamily: 'Georgia', fontWeight: '300' },
  courseLabel: { fontSize: 13, fontWeight: '300', marginTop: 2 },
  pctText: { fontSize: 40, fontFamily: 'Georgia', fontWeight: '300' },
  scoreBar: { height: 4, borderRadius: 2 },
  scoreBarFill: { height: 4, borderRadius: 2 },
  feedbackText: { fontSize: 13, lineHeight: 20, fontWeight: '300', marginTop: 12 },
  summaryHero: { padding: 28, alignItems: 'center' },
  overallGrade: { fontSize: 40, fontFamily: 'Georgia', fontWeight: '300', marginBottom: 4 },
  overallScore: { fontSize: 64, fontFamily: 'Georgia', fontWeight: '300', lineHeight: 68 },
  overallLabel: { fontSize: 14, fontWeight: '300', marginTop: 4 },
  sectionLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 1.8, marginTop: 8 },
  scoreRow: { padding: 14 },
  scoreRowInner: { flexDirection: 'row', alignItems: 'center' },
  scoreRowTitle: { width: 70, fontSize: 12, fontWeight: '600' },
  scoreRowPct: { width: 40, textAlign: 'right', fontSize: 14, fontWeight: '600' },
  remedyCard: { padding: 20 },
  remedyTitle: { fontSize: 13, fontWeight: '600', letterSpacing: 0.3, marginBottom: 8 },
  remedyText: { fontSize: 14, lineHeight: 22, fontWeight: '300' },
  resetBtn: { borderWidth: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  resetBtnText: { fontSize: 14, fontWeight: '500' },
});
