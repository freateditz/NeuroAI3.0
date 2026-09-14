import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';
import {
  Mic,
  NavButton,
  RecordButton,
  RecordingLoader
} from '../components';
import { COLORS, SIZES } from '../constants/theme';
import { generateWord, recordAudio } from '../utils/api';

const CourseTestScreen = () => {
  const navigation = useNavigation();
  const [letter, setLetter] = useState('B');
  const [attempts, setAttempts] = useState([]);
  const [word, setWord] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [image, setImage] = useState('');
  const [recording, setRecording] = useState(false);

  let averageAccuracy = 0;
  for (let i = 0; i < attempts.length; i++) {
    averageAccuracy += attempts[i];
  }

  const improvisationNeeded = () => {
    let average = Math.round(averageAccuracy / attempts.length);
    navigation.navigate('Detection', { percentage: average });
  };

  useEffect(() => {
    const fetchWord = async () => {
      try {
        console.log('Fetching word for letter:', letter);
        const data = await generateWord(letter);
        console.log('Word data:', data);
        setImage(data.image_link || '📝');
        setWord(data.word1 || 'Apple');
        setPronunciation(data.pronunciation || '/ˈæp.əl/');
      } catch (error) {
        console.error('Error fetching word:', error);
        setWord('Apple');
        setPronunciation('/ˈæp.əl/');
        setImage('🍎');
      }
    };

    fetchWord();
  }, [letter]);

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
    try {
      console.log('=== STARTING COURSE TEST FOR:', word, '===');
      const data = await recordAudio(word, [letter]);
      console.log('✅ Test complete:', data);
      setAttempts((prev) => [...prev, data.percentage]);
    } catch (error) {
      console.error('❌ Recording error:', error);
      Alert.alert(
        'Recording Failed',
        'Could not process your recording. Please try again.',
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header Info */}
        <Text style={styles.letterText}>Letter: {letter}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            Word to be spelled: {word ? word.charAt(0).toUpperCase() + word.slice(1) : 'Loading...'}

          </Text>
          <Text style={styles.infoText}>
            Average Correct Percentage -{' '}
            {attempts.length !== 0
              ? (averageAccuracy / attempts.length).toFixed(2)
              : 0}
            %
          </Text>
        </View>

        {/* Word Display */}
        <View style={styles.wordSection}>
          <Text style={styles.wordText}>{word}</Text>
          <Text style={styles.pronunciationText}>{pronunciation}</Text>
        </View>

        {/* Mic/Loader */}
        <View style={styles.micSection}>
          {!recording ? (
            <Mic onPress={recordButtonHandler} />
          ) : (
            <RecordingLoader />
          )}
        </View>

        {/* Attempts Display */}
        <View style={styles.attemptsSection}>
          <Text style={styles.attemptsTitle}>Attempts:</Text>
          <View style={styles.attemptsList}>
            {attempts.map((attempt, index) => (
              <View key={index} style={styles.attemptItem}>
                <Text style={styles.attemptText}>
                  Attempt {index + 1}: {attempt}%
                </Text>
              </View>
            ))}
          </View>
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
              text="Stop Recording"
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

          {attempts.length > 0 && (
            <RecordButton
              bgColor={COLORS.primary}
              text="View Results"
              textColor={COLORS.white}
              onPress={improvisationNeeded}
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
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  pronunciationText: {
    fontSize: SIZES.h4,
    color: COLORS.darkGray,
  },
  micSection: {
    alignItems: 'center',
    marginVertical: 32,
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
  attemptsList: {
    gap: 8,
  },
  attemptItem: {
    backgroundColor: COLORS.gray,
    padding: 12,
    borderRadius: SIZES.smallRadius,
  },
  attemptText: {
    fontSize: SIZES.body2,
    color: COLORS.black,
    fontWeight: '500',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 24,
  },
  actionButtons: {
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
});

export default CourseTestScreen;
