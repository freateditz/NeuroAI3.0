import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useRunAnywhere } from '../../context/RunAnywhereContext';

const DashboardScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { status } = useRunAnywhere();

  const features = [
    { icon: 'chatbubble', title: 'Chat', desc: 'AI conversations', ready: status.llm },
    { icon: 'mic', title: 'Voice', desc: 'Speech recognition', ready: status.stt },
    { icon: 'volume-high', title: 'TTS', desc: 'Text to speech', ready: false },
    { icon: 'pulse', title: 'VAD', desc: 'Voice detection', ready: status.vad },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          Hello, {user?.name || 'User'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your AI is ready to assist
        </Text>

        <View style={styles.grid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: feature.ready ? colors.primary : colors.surfaceLight },
                ]}
              >
                <Icon
                  name={feature.icon}
                  size={24}
                  color={feature.ready ? '#fff' : colors.textSecondary}
                />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{feature.title}</Text>
              <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                {feature.desc}
              </Text>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: feature.ready ? colors.success : colors.textSecondary },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 24 },
  greeting: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 4, marginBottom: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    position: 'relative',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardDesc: { fontSize: 12, marginTop: 4 },
  statusDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default DashboardScreen;
