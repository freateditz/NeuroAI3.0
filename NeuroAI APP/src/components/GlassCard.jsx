import { View, StyleSheet } from 'react-native';

export default function GlassCard({ children, style, darkMode = true }) {
  return (
    <View style={[darkMode ? styles.dark : styles.light, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  dark: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
  },
  light: {
    backgroundColor: '#faf7f2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.72)',
    shadowColor: '#a09482',
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
});
