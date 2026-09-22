import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      const serverMsg = e?.response?.data?.detail || e?.response?.data?.message;
      const isNetworkError = !e?.response;
      if (isNetworkError) {
        setError('Cannot reach server. Please check your internet connection and try again.');
      } else {
        setError(serverMsg || e?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#050714', '#0d0e2e', '#050714']} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Welcome{'\n'}Back</Text>
          <Text style={styles.subtext}>Sign in to continue your journey</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="rgba(255,255,255,0.2)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="rgba(255,255,255,0.2)"
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#6366f1', '#4f46e5']}
                style={styles.primaryBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Sign In →</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.linkText}>
                Don't have an account?{' '}
                <Text style={styles.linkAccent}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050714' },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 40 },
  backBtn: { marginBottom: 32 },
  backText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  heading: {
    fontSize: 52,
    fontFamily: 'Georgia',
    fontWeight: '300',
    color: '#e0e7ff',
    lineHeight: 58,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtext: { color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 32, fontWeight: '300' },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  errorText: { color: '#f87171', fontSize: 13 },
  form: { gap: 4 },
  label: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.5,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
    color: '#f8fafc',
    fontSize: 15,
  },
  primaryBtn: { borderRadius: 14, marginTop: 28, overflow: 'hidden' },
  primaryBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },
  linkBtn: { alignItems: 'center', paddingVertical: 16 },
  linkText: { color: 'rgba(255,255,255,0.35)', fontSize: 14 },
  linkAccent: { color: '#818cf8', fontWeight: '500' },
});
