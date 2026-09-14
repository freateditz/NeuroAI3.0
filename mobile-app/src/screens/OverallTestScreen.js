import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import pronunciationPlayer from '../ai/pronunciationPlayer';
import { Mic, NavButton, RecordButton, RecordingLoader } from '../components';
import { COLORS, SIZES } from '../constants/theme';
import { recordAudio, testWord } from '../utils/api';

const OverallTestScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [letter, setLetter] = useState('A');
  const [attempts, setAttempts] = useState([]);
  const [word, setWord] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [image, setImage] = useState('');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchWord = async () => {
      try {
        setLoading(true);
        setAttempts([]);
        setAverageAccuracy(0);
        setFeedback('');

        const data = await testWord(letter);
        console.log('Fetched word data:', data); // Debug log
        setImage(data.image_link || '📝');
        setWord(data.word1 || 'Apple');
        setPronunciation(data.pronunciation || '/ˈæp.əl/');
      } catch (error) {
        console.error('Error fetching word:', error);
        setWord('Apple');
        setPronunciation('/ˈæp.əl/');
        setImage('🍎');
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [letter]);

  useEffect(() => {
    if (attempts.length === 0) {
      setAverageAccuracy(0);
    } else {
      const sum = attempts.reduce((acc, curr) => acc + curr.percentage, 0);
      setAverageAccuracy((sum / attempts.length).toFixed(2));
    }
  }, [attempts]);

  const nextLetter = () => {
    setLetter((prevLetter) => {
      if (prevLetter === 'A') return 'B';
      if (prevLetter === 'B') return 'Z';
      return 'A';
    });
  };

  const previousLetter = () => {
    setLetter((prevLetter) => {
      if (prevLetter === 'A') return 'Z';
      if (prevLetter === 'Z') return 'B';
      return 'A';
    });
  };

  const recordButtonHandler = async () => {
    if (!word) {
      Alert.alert('Error', 'No word loaded. Please try again.');
      return;
    }

    setRecording(true);
    setFeedback('');

    try {
      console.log('=== STARTING TEST FOR WORD:', word, '===');
      const data = await recordAudio(word, [letter]);

      console.log('✅ Recording complete:', data);
      
      // Check if there was a transcription error
      if (data.error) {
        setFeedback(data.feedback);
        // Don't add to attempts if transcription failed
        Alert.alert(
          'Recording Issue',
          'We couldn\'t process your audio. Please try again.',
          [{ text: 'OK' }]
        );
      } else {
        setAttempts((prev) => [...prev, data]);
        setFeedback(data.feedback);
      }
    } catch (error) {
      console.error('❌ Recording error:', error);
      Alert.alert(
        'Recording Failed',
        `Could not process your recording: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setTimeout(() => {
        setRecording(false);
      }, 500);
    }
  };

  const stopRecordHandler = () => {
    setRecording(false);
  };

  const playPronunciation = async () => {
    try {
      await pronunciationPlayer.playWord(word);
    } catch (error) {
      console.error('Error playing pronunciation:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading test...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Header Info */}
        <Text style={styles.letterText}>Letter: {letter}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            Word to be spelled: {word.charAt(0).toUpperCase() + word.slice(1)}
          </Text>
          <Text style={styles.infoText}>
            Average Correct Percentage - {averageAccuracy}%
          </Text>
        </View>

        {/* Word Display */}
        <View style={styles.wordSection}>
          <Text style={styles.emojiIcon}>{image}</Text>
          <Text style={styles.wordText}>{word}</Text>
          <Text style={styles.pronunciationText}>{pronunciation}</Text>

          <TouchableOpacity
            style={styles.playButton}
            onPress={playPronunciation}
            activeOpacity={0.8}
          >
            <Text style={styles.playButtonText}>🔊 Listen</Text>
          </TouchableOpacity>
        </View>

        {/* AI Feedback */}
        {feedback ? (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackTitle}>AI Feedback:</Text>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        ) : null}

        {/* Mic/Loader */}
        <View style={styles.micSection}>
          {!recording ? (
            <Mic onPress={recordButtonHandler} />
          ) : (
            <RecordingLoader />
          )}
          <Text style={styles.micHint}>
            {recording ? 'Speak now...' : 'Tap to record'}
          </Text>
        </View>

        {/* Attempts Display */}
        <View style={styles.attemptsSection}>
          <Text style={styles.attemptsTitle}>Attempts:</Text>
          {attempts.length === 0 ? (
            <Text style={styles.noAttemptsText}>No attempts yet. Start recording!</Text>
          ) : (
            <View style={styles.attemptsList}>
              {attempts.map((attempt, index) => (
                <View key={index} style={styles.attemptItem}>
                  <View style={styles.attemptHeader}>
                    <Text style={styles.attemptText}>
                      Attempt {index + 1}: {attempt.percentage}%
                    </Text>
                    <Text style={styles.attemptTranscription}>
                      "{attempt.transcription}"
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.accuracyBar,
                      { width: `${attempt.percentage}%` }
                    ]}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Control Buttons */}
        <View style={styles.controlButtons}>
          <NavButton text="Previous" onPress={previousLetter} />
          <NavButton text="Next" onPress={nextLetter} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {recording ? (
            <RecordButton
              bgColor={COLORS.red}
              text="Recording... (3s)"
              textColor={COLORS.white}
              onPress={stopRecordHandler}
            />
          ) : (
            <RecordButton
              bgColor={COLORS.secondary}
              text="Start Recording"
              textColor={COLORS.black}
              onPress={recordButtonHandler}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: SIZES.body1,
    color: COLORS.black,
    marginTop: 12,
  },
  letterText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    marginBottom: 16,
    color: COLORS.black,
  },
  infoRow: {
    marginBottom: 20,
    gap: 8,
  },
  infoText: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.black,
  },
  wordSection: {
    alignItems: 'center',
    marginVertical: 24,
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: SIZES.radius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emojiIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  wordText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  pronunciationText: {
    fontSize: SIZES.h4,
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.smallRadius,
  },
  playButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body2,
    fontWeight: '600',
  },
  feedbackContainer: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: SIZES.smallRadius,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  feedbackTitle: {
    fontSize: SIZES.body2,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: SIZES.body3,
    color: COLORS.black,
    lineHeight: 20,
  },
  micSection: {
    alignItems: 'center',
    marginVertical: 32,
  },
  micHint: {
    fontSize: SIZES.body3,
    color: COLORS.darkGray,
    marginTop: 12,
  },
  attemptsSection: {
    marginVertical: 20,
  },
  attemptsTitle: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  noAttemptsText: {
    fontSize: SIZES.body2,
    color: COLORS.darkGray,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  attemptsList: {
    gap: 12,
  },
  attemptItem: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: SIZES.smallRadius,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  attemptHeader: {
    marginBottom: 8,
  },
  attemptText: {
    fontSize: SIZES.body2,
    color: COLORS.black,
    fontWeight: '600',
  },
  attemptTranscription: {
    fontSize: SIZES.body3,
    color: COLORS.darkGray,
    fontStyle: 'italic',
    marginTop: 4,
  },
  accuracyBar: {
    height: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 24,
  },
  actionButtons: {
    alignItems: 'center',
    marginTop: 16,
  },
});


export default OverallTestScreen;
