import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { useAI } from '../../hooks/useAI';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatScreen: React.FC = () => {
  const { colors } = useTheme();
  const { generateStream, isGenerating, error } = useAI();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: '',
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);

    await generateStream(
      userMessage.text,
      { maxTokens: 200, temperature: 0.7 },
      (token) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessage.id ? { ...msg, text: msg.text + token } : msg
          )
        );
      }
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.isUser
          ? { backgroundColor: colors.primary, alignSelf: 'flex-end' }
          : { backgroundColor: colors.surface, alignSelf: 'flex-start' },
      ]}
    >
      <Text style={[styles.messageText, { color: item.isUser ? '#fff' : colors.text }]}>
        {item.text || '...'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>AI Chat</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={sendMessage}
            disabled={isGenerating || !input.trim()}
          >
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  messageList: { padding: 16, gap: 12 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  messageText: { fontSize: 15, lineHeight: 22 },
  errorText: { padding: 8, textAlign: 'center', fontSize: 12 },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  input: { flex: 1, fontSize: 16, maxHeight: 100, paddingHorizontal: 12 },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
