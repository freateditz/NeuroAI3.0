import { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();
  const pillX = useRef(new Animated.Value(darkMode ? 26 : 2)).current;

  useEffect(() => {
    Animated.spring(pillX, {
      toValue: darkMode ? 26 : 2,
      stiffness: 500,
      damping: 32,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [darkMode]);

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.85}
      style={[
        styles.track,
        {
          backgroundColor: darkMode ? 'rgba(15,13,40,0.9)' : 'rgba(244,239,232,0.95)',
          borderColor: darkMode ? 'rgba(99,102,241,0.35)' : 'rgba(180,165,145,0.6)',
          shadowColor: darkMode ? '#6366f1' : '#a09482',
          shadowOpacity: darkMode ? 0.3 : 0.5,
        },
      ]}
    >
      <Text style={[styles.icon, { left: 6, opacity: darkMode ? 0.3 : 1 }]}>☀️</Text>
      <Text style={[styles.icon, { right: 6, opacity: darkMode ? 1 : 0.3 }]}>🌙</Text>
      <Animated.View
        style={[
          styles.pill,
          {
            transform: [{ translateX: pillX }],
            backgroundColor: darkMode ? '#6366f1' : '#f59e0b',
            shadowColor: darkMode ? '#6366f1' : '#f59e0b',
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 52,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  icon: {
    position: 'absolute',
    fontSize: 11,
    lineHeight: 14,
    top: 7,
  },
  pill: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    top: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
});
