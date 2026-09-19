import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useRecorder } from '../../components/AudioRecorder';
import { sendChatMessage, transcribeAudio } from '../../config/api';

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm NeuroAI 🧠 I'm here to help you practice speech and build confidence. What would you like to work on today?",
};

export default function ChatbotScreen() {
  const { darkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const { isRecording, recordingDuration, startRecording, stopRecording } = useRecorder();
  const [voiceLoading, setVoiceLoading] = useState(false);

  const bg = darkMode ? '#050714' : '#f4efe8';
  const textPrimary = darkMode ? '#f8fafc' : '#1c1308';
  const textMuted = darkMode ? 'rgba(248,250,252,0.45)' : 'rgba(28,19,8,0.55)';
  const textFaint = darkMode ? 'rgba(248,250,252,0.3)' : 'rgba(28,19,8,0.4)';
  const accent = darkMode ? '#2dd4bf' : '#4338ca';
  const borderColor = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(180,165,145,0.4)';
  const inputBg = darkMode ? 'rgba(255,255,255,0.04)' : '#faf7f2';

  const scrollToBottom = () => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const userMsg = { id: Date.now().toString(), role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setSending(true);
    scrollToBottom();
    try {
      const apiMessages = updated
        .filter((m) => m.id !== 'welcome')
        .map(({ role, content }) => ({ role, content }));
      const data = await sendChatMessage(apiMessages);
      const aiMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply || data.message || 'I understand. Keep practicing!' };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, I had trouble connecting. Please check your connection and try again.' };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      setVoiceLoading(true);
      try {
        const uri = await stopRecording();
        if (!uri) return;
        const data = await transcribeAudio(uri);
        const text = data.transcription || data.text || '';
        if (text) setInput(text);
      } catch {
        Alert.alert('Error', 'Could not transcribe audio.');
      } finally {
        setVoiceLoading(false);
      }
    } else {
      try {
        await startRecording();
      } catch (e) {
        Alert.alert('Permission Error', e.message || 'Cannot access microphone.');
      }
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: darkMode ? '#1e1b4b' : '#ede8de' }]}>
            <Text style={{ fontSize: 14 }}>🧠</Text>
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI, !isUser && { backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : '#faf7f2', borderColor }]}>
          {isUser ? (
            <LinearGradient
              colors={darkMode ? ['#6366f1', '#4f46e5'] : ['#4338ca', '#3730a3']}
              style={styles.userBubbleGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.userBubbleText}>{item.content}</Text>
            </LinearGradient>
          ) : (
            <Text style={[styles.aiBubbleText, { color: textPrimary }]}>{item.content}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: borderColor, backgroundColor: bg }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.aiAvatar, { backgroundColor: darkMode ? '#1e1b4b' : '#ede8de' }]}>
            <Text style={{ fontSize: 16 }}>🧠</Text>
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: textPrimary }]}>NeuroAI Chat</Text>
            <Text style={[styles.headerSub, { color: accent }]}>● Online</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.bottom + 80}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={[styles.messageList, { paddingBottom: 16 }]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        />

        {sending && (
          <View style={[styles.typingRow, { paddingHorizontal: 16 }]}>
            <View style={[styles.avatar, { backgroundColor: darkMode ? '#1e1b4b' : '#ede8de' }]}>
              <Text style={{ fontSize: 14 }}>🧠</Text>
            </View>
            <View style={[styles.typingBubble, { backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : '#faf7f2', borderColor }]}>
              <ActivityIndicator color={accent} size="small" />
            </View>
          </View>
        )}

        <View style={[styles.inputBar, { backgroundColor: darkMode ? 'rgba(5,7,20,0.95)' : 'rgba(244,239,232,0.95)', borderTopColor: borderColor }]}>
          <TouchableOpacity
            style={[styles.micBtn, { backgroundColor: isRecording ? '#ef4444' : (darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(180,165,145,0.2)') }]}
            onPress={handleVoiceInput}
            disabled={voiceLoading}
          >
            {voiceLoading ? (
              <ActivityIndicator color={accent} size="small" />
            ) : (
              <Text style={{ fontSize: 16 }}>{isRecording ? '⏹' : '🎙️'}</Text>
            )}
          </TouchableOpacity>
          <TextInput
            style={[styles.textInput, { backgroundColor: inputBg, borderColor, color: textPrimary }]}
            value={input}
            onChangeText={setInput}
            placeholder={isRecording ? `Recording... ${recordingDuration}s` : 'Type a message...'}
            placeholderTextColor={textFaint}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { opacity: input.trim() ? 1 : 0.4 }]}
            onPress={handleSend}
            disabled={!input.trim() || sending}
          >
            <LinearGradient colors={['#6366f1', '#4f46e5']} style={styles.sendGradient}>
              <Text style={{ color: '#fff', fontSize: 16 }}>↑</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={{ height: insets.bottom + 60 }} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiAvatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '600' },
  headerSub: { fontSize: 11, marginTop: 1 },
  messageList: { paddingHorizontal: 16, paddingTop: 16 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12, gap: 8 },
  msgRowUser: { flexDirection: 'row-reverse' },
  avatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble: { maxWidth: '75%', borderRadius: 16, overflow: 'hidden' },
  bubbleUser: {},
  bubbleAI: { borderWidth: 1 },
  userBubbleGradient: { paddingHorizontal: 14, paddingVertical: 10 },
  userBubbleText: { color: '#fff', fontSize: 14, lineHeight: 20 },
  aiBubbleText: { paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, lineHeight: 20 },
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  typingBubble: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderTopWidth: 1,
  },
  micBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: { flexShrink: 0, borderRadius: 19, overflow: 'hidden' },
  sendGradient: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
});
