import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { useVAD } from '../../hooks/useVAD';
import { useAI } from '../../hooks/useAI';

const VoiceScreen: React.FC = () => {
  const { colors } = useTheme();
  const { isRecording, isTranscribing, transcription, startRecording, stopRecording } =
    useVoiceRecorder({ language: 'en' });
  const { isSpeaking, confidence, isListening, startListening, stopListening } = useVAD();
  const { chat, isGenerating } = useAI();
  const [response, setResponse] = useState('');

  const handleRecordPress = async () => {
    if (isRecording) {
      const text = await stopRecording();
      if (text) {
        const aiResponse = await chat(text);
        setResponse(aiResponse);
      }
    } else {
      setResponse('');
      await startRecording();
    }
  };

  const toggleVAD = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Voice Assistant</Text>

        {/* VAD Status */}
        <View style={styles.vadContainer}>
          <TouchableOpacity
            style={[styles.vadButton, { backgroundColor: colors.surface }]}
            onPress={toggleVAD}
          >
            <Text style={[styles.vadText, { color: colors.text }]}>
              VAD: {isListening ? 'On' : 'Off'}
            </Text>
          </TouchableOpacity>
          {isListening && (
            <View style={styles.vadStatus}>
              <View
                style={[
                  styles.vadIndicator,
                  { backgroundColor: isSpeaking ? colors.success : colors.surfaceLight },
                ]}
              />
              <Text style={[styles.vadLabel, { color: colors.textSecondary }]}>
                {isSpeaking ? `Speaking (${(confidence * 100).toFixed(0)}%)` : 'Listening...'}
              </Text>
            </View>
          )}
        </View>

        {/* Main Record Button */}
        <TouchableOpacity
          style={[
            styles.recordButton,
            {
              backgroundColor: isRecording ? colors.error : colors.primary,
            },
          ]}
          onPress={handleRecordPress}
          disabled={isTranscribing || isGenerating}
        >
          {isTranscribing || isGenerating ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Icon name={isRecording ? 'stop' : 'mic'} size={48} color="#fff" />
          )}
        </TouchableOpacity>

        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
        </Text>

        {/* Transcription */}
        {transcription ? (
          <View style={[styles.resultBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>You said:</Text>
            <Text style={[styles.resultText, { color: colors.text }]}>{transcription}</Text>
          </View>
        ) : null}

        {/* AI Response */}
        {response ? (
          <View style={[styles.resultBox, { backgroundColor: colors.surfaceLight }]}>
            <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>AI Response:</Text>
            <Text style={[styles.resultText, { color: colors.text }]}>{response}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 24, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32 },
  vadContainer: { marginBottom: 48, alignItems: 'center' },
  vadButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  vadText: { fontSize: 14, fontWeight: '600' },
  vadStatus: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  vadIndicator: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  vadLabel: { fontSize: 14 },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  hint: { fontSize: 14, marginBottom: 32 },
  resultBox: { width: '100%', padding: 16, borderRadius: 12, marginTop: 16 },
  resultLabel: { fontSize: 12, marginBottom: 4 },
  resultText: { fontSize: 16, lineHeight: 24 },
});

export default VoiceScreen;
