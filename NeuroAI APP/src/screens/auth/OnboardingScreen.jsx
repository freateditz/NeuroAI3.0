import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

function FloatingCircle({ size, color, initialX, initialY, delay }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 4000 + Math.random() * 2000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 4000 + Math.random() * 2000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -30] });
  const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.1, 0.2, 0.1] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: initialX,
        top: initialY,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        transform: [{ translateY }],
        opacity,
      }}
    />
  );
}

export default function OnboardingScreen({ navigation }) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 1000, delay: 200, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 900, delay: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#050714', '#0d0e2e', '#050714']} style={StyleSheet.absoluteFill} />

      <FloatingCircle size={280} color="#6366f1" initialX={-80} initialY={height * 0.05} delay={0} />
      <FloatingCircle size={200} color="#a855f7" initialX={width * 0.6} initialY={height * 0.1} delay={800} />
      <FloatingCircle size={150} color="#2dd4bf" initialX={width * 0.2} initialY={height * 0.65} delay={400} />
      <FloatingCircle size={120} color="#6366f1" initialX={width * 0.75} initialY={height * 0.55} delay={1200} />

      <Animated.View
        style={[styles.content, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🎙️  AI-Powered Speech Learning</Text>
        </View>

        <Text style={styles.heading}>Speak.{'\n'}Learn.{'\n'}Thrive.</Text>

        <Text style={styles.subtext}>
          Personalized speech therapy for neurodiverse children — real-time AI analysis and adaptive
          learning paths.
        </Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Signup')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#6366f1', '#4f46e5']}
            style={styles.primaryBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.primaryBtnText}>Get Started Free →</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryBtnText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerDot}>✦</Text>
        <Text style={styles.footerText}>Empowering Every Unique Mind</Text>
        <Text style={styles.footerDot}>✦</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050714' },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 32,
  },
  badgeText: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '500', letterSpacing: 1 },
  heading: {
    fontSize: 68,
    fontFamily: 'Georgia',
    fontWeight: '300',
    color: '#e0e7ff',
    lineHeight: 72,
    marginBottom: 24,
    letterSpacing: -1,
  },
  subtext: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 24,
    fontWeight: '300',
    marginBottom: 48,
    maxWidth: 300,
  },
  primaryBtn: { borderRadius: 14, marginBottom: 16, overflow: 'hidden' },
  primaryBtnGradient: { paddingVertical: 16, paddingHorizontal: 28, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },
  secondaryBtn: { alignItems: 'center', paddingVertical: 12 },
  secondaryBtnText: { color: 'rgba(255,255,255,0.35)', fontSize: 14, fontWeight: '400' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 40,
  },
  footerText: { color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: 1 },
  footerDot: { color: 'rgba(255,255,255,0.15)', fontSize: 10 },
});
