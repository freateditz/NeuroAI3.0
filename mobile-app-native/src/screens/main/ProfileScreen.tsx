import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{user?.name?.[0] || 'U'}</Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  content: { flex: 1, alignItems: 'center', paddingTop: 48 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 16 },
});

export default ProfileScreen;
