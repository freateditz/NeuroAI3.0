import { useNavigation } from '@react-navigation/native';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');

const CourseModal = ({ Phoneme1, Phoneme2, Status, Color, Progress, onPress }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // If onPress is provided, use it, otherwise navigate directly
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('CourseTest', {
        phoneme1: Phoneme1,
        phoneme2: Phoneme2,
        progress: Progress,
        status: Status,
        color: Color,
      });
    }
  };

  // Calculate completion percentage
  const completionPercentage = (Progress / 4) * 100;

  // Determine status color
  const statusColor = Status === 'Completed' ? '#4CAF50' : Color;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.container}>
        <View style={[styles.imageContainer, { backgroundColor: Color || COLORS.purple }]}>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>📚</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.infoSection}>
            <View style={styles.textSection}>
              <Text style={styles.phonemeText} numberOfLines={2}>
                Phoneme {Phoneme1} and {Phoneme2}
              </Text>
              <View style={styles.progressSection}>
                <Text style={styles.progressLabel}>Progress</Text>
                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${completionPercentage}%`,
                        backgroundColor: statusColor
                      }
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.statsSection}>
              <Text style={styles.testText}>{Progress}/4</Text>
              <Text style={styles.testsLabel}>tests</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: statusColor }]}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText} numberOfLines={1}>
              {Status === 'Completed' ? '✓ Done' : 'Continue'} →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: width < 375 ? 12 : 16,
    borderRadius: SIZES.radius,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageContainer: {
    padding: width < 375 ? 10 : 12,
    borderRadius: SIZES.radius,
    marginRight: width < 375 ? 10 : 16,
  },
  placeholder: {
    width: width < 375 ? 45 : 60,
    height: width < 375 ? 45 : 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: width < 375 ? 30 : 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  textSection: {
    flex: 1,
    marginRight: 8,
  },
  phonemeText: {
    fontSize: width < 375 ? SIZES.body2 : SIZES.body1,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  progressSection: {
    marginTop: 4,
  },
  progressLabel: {
    fontSize: SIZES.body3,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  testText: {
    fontSize: width < 375 ? SIZES.body1 : SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  testsLabel: {
    fontSize: SIZES.body3,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  button: {
    paddingHorizontal: width < 375 ? 12 : 16,
    paddingVertical: width < 375 ? 8 : 10,
    borderRadius: SIZES.smallRadius,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: width < 375 ? SIZES.body3 : SIZES.body2,
    fontWeight: '600',
  },
});

export default CourseModal;
