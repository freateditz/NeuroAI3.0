import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useRunAnywhere } from '../../context/RunAnywhereContext';
import { MainStackParamList } from '../../navigation/MainNavigator';

const SettingsScreen: React.FC = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const { status } = useRunAnywhere();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scroll}>
        <Text style={[styles.header, { color: colors.text }]}>Settings</Text>

        {/* Profile Section */}
        <TouchableOpacity
          style={[styles.profileCard, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{user?.name?.[0] || 'U'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {user?.name || 'User'}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Appearance */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <Text style={[styles.rowText, { color: colors.text }]}>Dark Mode</Text>
          <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
        </View>

        {/* AI Status */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>AI Models</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {Object.entries(status).map(([key, ready]) => (
            <View key={key} style={styles.statusRow}>
              <Text style={[styles.rowText, { color: colors.text }]}>
                {key.toUpperCase()}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: ready ? colors.success : colors.error },
                ]}
              >
                <Text style={styles.statusText}>{ready ? 'Ready' : 'Not Loaded'}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error }]}
          onPress={logout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1, padding: 24 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  profileInfo: { flex: 1, marginLeft: 12 },
  profileName: { fontSize: 16, fontWeight: '600' },
  profileEmail: { fontSize: 14, marginTop: 2 },
  sectionTitle: { fontSize: 12, fontWeight: '600', marginBottom: 8, marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 8 },
  rowText: { fontSize: 16 },
  card: { padding: 16, borderRadius: 12, marginBottom: 24 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  logoutButton: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default SettingsScreen;
