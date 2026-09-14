import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;
};

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome to Neuro AI</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your personal AI assistant powered by on-device intelligence
        </Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: colors.border }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
            I already have an account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  buttons: { padding: 24 },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: { fontSize: 16, fontWeight: '600' },
});

export default OnboardingScreen;
