import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useRunAnywhere } from '../context/RunAnywhereContext';

const LoadingScreen: React.FC = () => {
  const { colors } = useTheme();
  const { currentStep, progress, error } = useRunAnywhere();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Neuro AI</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      <Text style={[styles.step, { color: colors.textSecondary }]}>{currentStep}</Text>
      {progress > 0 && (
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: colors.primary, width: `${progress * 100}%` },
            ]}
          />
        </View>
      )}
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  spinner: {
    marginBottom: 16,
  },
  step: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  progressContainer: {
    width: '80%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  error: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LoadingScreen;
