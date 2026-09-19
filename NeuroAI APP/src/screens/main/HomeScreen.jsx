import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';
import WaveformBars from '../../components/WaveformBars';
import GlassCard from '../../components/GlassCard';

const { width } = Dimensions.get('window');

const FEATURES = [
  { icon: '🎙️', title: 'Real-Time Analysis', desc: 'AI analyzes every sound instantly', accent: '#6366f1' },
  { icon: '🧠', title: 'Adaptive Learning', desc: 'Paths that evolve with progress', accent: '#7dd3fc' },
  { icon: '🫦', title: '3D Mouth Model', desc: 'See how sounds are formed', accent: '#c4b5fd' },
  { icon: '💬', title: 'AI Chatbot', desc: 'Practice confidence through dialogue', accent: '#86efac' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Weekly analysis and milestones', accent: '#fde68a' },
  { icon: '👨‍👩‍👧', title: 'Parent Dashboard', desc: 'Stay connected with insights', accent: '#fca5a5' },
];

const STATS = [
  { value: '8+', label: 'Speech Disorders', sub: 'Supported' },
  { value: '3D', label: 'Articulation', sub: 'Modeling' },
  { value: 'AI', label: 'Adaptive', sub: 'Learning' },
  { value: '500+', label: 'Families', sub: 'Helped' },
];

function AnimatedCounter({ target, duration = 1600 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (typeof target !== 'number') return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start = Math.min(start + step, target);
      setValue(Math.round(start));
      if (start >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target]);
  return <>{typeof target === 'number' ? value : target}</>;
}

export default function HomeScreen({ navigation }) {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const bg = darkMode ? '#050714' : '#f4efe8';
  const bgAlt = darkMode ? '#030303' : '#ede7dd';
  const textPrimary = darkMode ? '#f8fafc' : '#1c1308';
  const textMuted = darkMode ? 'rgba(248,250,252,0.45)' : 'rgba(28,19,8,0.55)';
  const textFaint = darkMode ? 'rgba(248,250,252,0.3)' : 'rgba(28,19,8,0.4)';
  const accent = darkMode ? '#2dd4bf' : '#4338ca';
  const borderColor = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(180,165,145,0.4)';

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Friend';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: borderColor, backgroundColor: bg }]}>
        <View>
          <Text style={[styles.logoText, { color: textPrimary }]}>
            Neuro<Text style={{ color: accent }}>AI</Text>
          </Text>
          <Text style={[styles.greetText, { color: textFaint }]}>Hello, {firstName} 👋</Text>
        </View>
        <ThemeToggle />
      </View>

      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <GlassCard darkMode={darkMode} style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroTitle, { color: textPrimary }]}>
                Your speech{'\n'}journey awaits
              </Text>
              <Text style={[styles.heroSub, { color: textMuted }]}>
                AI-powered practice for every unique mind
              </Text>
            </View>
            <View style={styles.heroPulse}>
              <View style={[styles.pulseRing, { borderColor: accent }]} />
              <Text style={{ fontSize: 28 }}>🎙️</Text>
            </View>
          </View>
          <WaveformBars color={accent} count={24} height={44} active />
          <View style={[styles.heroStats, { borderTopColor: borderColor }]}>
            {[
              { label: 'Day Streak', value: '7d', color: accent },
              { label: 'Today Score', value: '94%', color: '#a855f7' },
              { label: 'Sessions', value: '32', color: '#7dd3fc' },
            ].map((s) => (
              <View key={s.label} style={styles.heroStatItem}>
                <Text style={[styles.heroStatValue, { color: s.color }]}>{s.value}</Text>
                <Text style={[styles.heroStatLabel, { color: textFaint }]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionPrimary]}
            onPress={() => navigation.navigate('Learn')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#6366f1', '#4f46e5']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.actionTextPrimary}>🎓 Start Learning</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : '#faf7f2', borderWidth: 1, borderColor }]}
            onPress={() => navigation.navigate('Test')}
            activeOpacity={0.85}
          >
            <Text style={[styles.actionTextSecondary, { color: textMuted }]}>📝 Take Test</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <Text style={[styles.sectionLabel, { color: accent }]}>PLATFORM STATS</Text>
        <View style={styles.statsGrid}>
          {STATS.map((s) => (
            <GlassCard key={s.label} darkMode={darkMode} style={styles.statCard}>
              <Text style={[styles.statValue, { color: darkMode ? '#e0e7ff' : '#3730a3' }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: textMuted }]}>{s.label}</Text>
              <Text style={[styles.statSub, { color: textFaint }]}>{s.sub}</Text>
            </GlassCard>
          ))}
        </View>

        {/* Features */}
        <Text style={[styles.sectionLabel, { color: accent }]}>FEATURES</Text>
        <View style={styles.featureGrid}>
          {FEATURES.map((f) => (
            <GlassCard key={f.title} darkMode={darkMode} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={[styles.featureTitle, { color: f.accent }]}>{f.title}</Text>
              <Text style={[styles.featureDesc, { color: textFaint }]}>{f.desc}</Text>
            </GlassCard>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const CARD_W = (width - 48 - 12) / 2;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  logoText: { fontSize: 22, fontFamily: 'Georgia', fontWeight: '300', letterSpacing: -0.3 },
  greetText: { fontSize: 12, marginTop: 2, fontWeight: '300' },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  heroCard: { padding: 20, marginBottom: 16 },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  heroTitle: { fontSize: 22, fontFamily: 'Georgia', fontWeight: '300', lineHeight: 30, marginBottom: 6 },
  heroSub: { fontSize: 13, fontWeight: '300', lineHeight: 18 },
  heroPulse: { position: 'relative', alignItems: 'center', justifyContent: 'center', width: 56, height: 56 },
  pulseRing: { position: 'absolute', width: 52, height: 52, borderRadius: 26, borderWidth: 1.5, opacity: 0.4 },
  heroStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
  heroStatItem: { alignItems: 'center' },
  heroStatValue: { fontSize: 18, fontWeight: '600', marginBottom: 3 },
  heroStatLabel: { fontSize: 11 },
  quickActions: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  actionBtn: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  actionPrimary: {},
  actionGradient: { paddingVertical: 14, alignItems: 'center' },
  actionTextPrimary: { color: '#fff', fontSize: 14, fontWeight: '600' },
  actionTextSecondary: { fontSize: 14, fontWeight: '500', textAlign: 'center', paddingVertical: 14 },
  sectionLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 1.8, marginBottom: 12, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  statCard: { width: CARD_W, padding: 16, alignItems: 'center' },
  statValue: { fontSize: 30, fontFamily: 'Georgia', fontWeight: '300', marginBottom: 4 },
  statLabel: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  statSub: { fontSize: 11 },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  featureCard: { width: CARD_W, padding: 16 },
  featureIcon: { fontSize: 26, marginBottom: 10 },
  featureTitle: { fontSize: 13, fontWeight: '600', marginBottom: 5 },
  featureDesc: { fontSize: 11, lineHeight: 16, fontWeight: '300' },
});
