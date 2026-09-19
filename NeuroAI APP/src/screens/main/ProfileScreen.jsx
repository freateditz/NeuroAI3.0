import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import GlassCard from '../../components/GlassCard';
import ThemeToggle from '../../components/ThemeToggle';

const SETTINGS_ROWS = [
  { icon: '🔔', label: 'Notifications', sub: 'Daily practice reminders' },
  { icon: '🔒', label: 'Privacy', sub: 'Data & permissions' },
  { icon: 'ℹ️', label: 'About NeuroAI', sub: 'Version 1.0.0' },
  { icon: '📖', label: 'Help & Support', sub: 'FAQs and contact' },
];

export default function ProfileScreen() {
  const { darkMode } = useTheme();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const bg = darkMode ? '#050714' : '#f4efe8';
  const textPrimary = darkMode ? '#f8fafc' : '#1c1308';
  const textMuted = darkMode ? 'rgba(248,250,252,0.45)' : 'rgba(28,19,8,0.55)';
  const textFaint = darkMode ? 'rgba(248,250,252,0.3)' : 'rgba(28,19,8,0.4)';
  const accent = darkMode ? '#2dd4bf' : '#4338ca';
  const borderColor = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(180,165,145,0.4)';

  const name = user?.name || 'User';
  const email = user?.email || '';
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: borderColor }]}>
        <Text style={[styles.screenTitle, { color: textPrimary }]}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + name */}
        <GlassCard darkMode={darkMode} style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: darkMode ? '#1e1b4b' : '#ddd6fe' }]}>
            <Text style={[styles.avatarText, { color: darkMode ? '#818cf8' : '#4338ca' }]}>{initials}</Text>
          </View>
          <Text style={[styles.profileName, { color: textPrimary }]}>{name}</Text>
          <Text style={[styles.profileEmail, { color: textFaint }]}>{email}</Text>
          <View style={[styles.profileDivider, { backgroundColor: borderColor }]} />
          <View style={styles.profileStats}>
            {[
              { label: 'Sessions', value: user?.totalSessions || '0' },
              { label: 'Avg Score', value: user?.avgScore ? `${user.avgScore}%` : '—' },
              { label: 'Streak', value: user?.streak ? `${user.streak}d` : '0d' },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={[styles.statValue, { color: textPrimary }]}>{s.value}</Text>
                <Text style={[styles.statLabel, { color: textFaint }]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Theme toggle */}
        <GlassCard darkMode={darkMode} style={styles.themeCard}>
          <Text style={[styles.themeLabel, { color: textMuted }]}>Appearance</Text>
          <View style={styles.themeRow}>
            <View>
              <Text style={[styles.themeRowTitle, { color: textPrimary }]}>
                {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </Text>
              <Text style={[styles.themeRowSub, { color: textFaint }]}>
                {darkMode ? 'Classic deep space theme' : 'Warm paper theme'}
              </Text>
            </View>
            <ThemeToggle />
          </View>
        </GlassCard>

        {/* Settings rows */}
        <Text style={[styles.sectionLabel, { color: accent }]}>SETTINGS</Text>
        <GlassCard darkMode={darkMode} style={styles.settingsCard}>
          {SETTINGS_ROWS.map((row, i) => (
            <View key={row.label}>
              <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
                <Text style={styles.settingsIcon}>{row.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.settingsLabel, { color: textPrimary }]}>{row.label}</Text>
                  <Text style={[styles.settingsSub, { color: textFaint }]}>{row.sub}</Text>
                </View>
                <Text style={[styles.chevron, { color: textFaint }]}>›</Text>
              </TouchableOpacity>
              {i < SETTINGS_ROWS.length - 1 && (
                <View style={[styles.rowDivider, { backgroundColor: borderColor }]} />
              )}
            </View>
          ))}
        </GlassCard>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.06)' }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>🚪  Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: textFaint }]}>NeuroAI v1.0.0 · Empowering Every Unique Mind</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1 },
  screenTitle: { fontSize: 32, fontFamily: 'Georgia', fontWeight: '300', letterSpacing: -0.3 },
  scroll: { paddingHorizontal: 20, paddingTop: 20, gap: 16 },
  profileCard: { padding: 24, alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: { fontSize: 26, fontWeight: '700' },
  profileName: { fontSize: 20, fontWeight: '600', marginBottom: 4 },
  profileEmail: { fontSize: 13, fontWeight: '300', marginBottom: 16 },
  profileDivider: { width: '100%', height: 1, marginBottom: 16 },
  profileStats: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '600', marginBottom: 3 },
  statLabel: { fontSize: 11 },
  themeCard: { padding: 18 },
  themeLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 1.5, marginBottom: 12 },
  themeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  themeRowTitle: { fontSize: 15, fontWeight: '500', marginBottom: 3 },
  themeRowSub: { fontSize: 12, fontWeight: '300' },
  sectionLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 1.8, marginBottom: 2 },
  settingsCard: { overflow: 'hidden' },
  settingsRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  settingsIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  settingsLabel: { fontSize: 14, fontWeight: '500', marginBottom: 2 },
  settingsSub: { fontSize: 11, fontWeight: '300' },
  chevron: { fontSize: 22, fontWeight: '300' },
  rowDivider: { height: 1, marginLeft: 52 },
  logoutBtn: { borderWidth: 1, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  logoutText: { color: '#f87171', fontSize: 15, fontWeight: '500' },
  versionText: { fontSize: 11, textAlign: 'center', paddingTop: 4, paddingBottom: 8 },
});
