import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const RecordingLoader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    marginBottom: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  dot1: {
    // Animation would be added with Animated API if needed
  },
  dot2: {
    // Animation delay
  },
  dot3: {
    // Animation delay
  },
});

export default RecordingLoader;
