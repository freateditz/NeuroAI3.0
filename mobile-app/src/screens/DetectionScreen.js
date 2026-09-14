import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { getRemedy } from '../utils/api';

const DetectionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [percentage, setPercentage] = useState(null);
  const [remedy, setRemedy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phoneme1, setPhoneme1] = useState('');
  const [phoneme2, setPhoneme2] = useState('');

  useEffect(() => {
    if (route.params) {
      setPercentage(parseInt(route.params.percentage || 0));
      setPhoneme1(route.params.phoneme1 || 'V');
      setPhoneme2(route.params.phoneme2 || 'B');
    }
  }, [route.params]);

  useEffect(() => {
    if (percentage !== null) {
      fetchAIRemedy();
    }
  }, [percentage]);

  const fetchAIRemedy = async () => {
    setLoading(true);
    try {
      console.log('Fetching remedy with:', { percentage, phoneme1, phoneme2 });
      const data = await getRemedy(percentage, phoneme1, phoneme2, []);
      console.log('Remedy received:', data);
      if (data && data.remedy) {
        setRemedy(data.remedy);
      }
    } catch (error) {
      console.error('Error fetching remedy:', error);
      // Set fallback remedy
      setRemedy(`Great effort on phonemes ${phoneme1} and ${phoneme2}! Keep practicing daily.`);
    } finally {
      setLoading(false);
    }
  };

  const backToLearning = () => {
    navigation.navigate('Learning');
  };

  const backToTryAgain = () => {
    navigation.goBack();
  };

  const getPerformanceEmoji = () => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 70) return '🌟';
    if (percentage >= 50) return '💪';
    return '🎯';
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return 'Excellent!';
    if (percentage >= 70) return 'Great Job!';
    if (percentage >= 50) return 'Good Effort!';
    return 'Keep Practicing!';
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Phoneme {phoneme1} and {phoneme2}
        </Text>
      </View>

      {/* Test Info */}
      <View style={styles.infoSection}>
        <Text style={styles.detailsTitle}>Test Results</Text>

        <View style={styles.detailsGrid}>
          <Text style={styles.detailText}>
            Phonemes tested: {phoneme1} and {phoneme2}
          </Text>
          <Text style={styles.detailText}>
            Average accuracy: {percentage}%
          </Text>
          <Text style={styles.detailText}>
            Status: {getPerformanceMessage()}
          </Text>
        </View>
      </View>

      {/* Analysis Result Header */}
      <View style={styles.analysisHeader}>
        <Text style={styles.analysisTitle}>Analysis Result</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBackground}>
          <Text style={styles.trophyIcon}>{getPerformanceEmoji()}</Text>
          <Text style={styles.performanceText}>{getPerformanceMessage()}</Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: percentage >= 70 ? '#4CAF50' : percentage >= 50 ? '#FF9800' : '#F44336'
              },
            ]}
          >
            <Text style={styles.percentageText}>{percentage}%</Text>
          </View>
        </View>
      </View>

      {/* AI-Powered Remedies Section */}
      <View style={styles.remedySection}>
        <View style={styles.remedyHeader}>
          <Text style={styles.remedyTitle}>
            {percentage >= 80 ? 'Keep It Up! 🎉' : 'AI-Powered Improvement Tips'}
          </Text>
        </View>

        <View style={styles.remedyContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>
                Generating personalized tips...
              </Text>
            </View>
          ) : remedy ? (
            <>
              <Text style={styles.remedySubtitle}>
                Suggested improvements for Phonemes {phoneme1} and {phoneme2}:
              </Text>
              <Text style={styles.remedyText}>{remedy}</Text>
            </>
          ) : (
            <Text style={styles.remedyText}>
              Great job! Keep practicing to maintain your skills.
            </Text>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={backToLearning}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Back to Learning</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={backToTryAgain}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderColor: COLORS.black,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.black,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  detailsTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 16,
  },
  detailsGrid: {
    gap: 12,
  },
  detailText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
  },
  analysisHeader: {
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderColor: COLORS.black,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginTop: 60,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  analysisTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.black,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  progressBackground: {
    height: 150,
    backgroundColor: '#F0E5FF',
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  trophyIcon: {
    fontSize: 60,
    marginBottom: 8,
  },
  performanceText: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  progressBarContainer: {
    height: 48,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.smallRadius,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  percentageText: {
    color: COLORS.white,
    fontSize: SIZES.body1,
    fontWeight: 'bold',
  },
  remedySection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  remedyHeader: {
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderColor: COLORS.black,
    paddingVertical: 8,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  remedyTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.black,
  },
  remedyContent: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: SIZES.radius,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: SIZES.body2,
    color: COLORS.black,
  },
  remedySubtitle: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  remedyText: {
    fontSize: SIZES.body2,
    color: COLORS.black,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: SIZES.smallRadius,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default DetectionScreen;
