import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArticlesComponent from '../components/ArticlesComponent';
import CourseModal from '../components/CourseModal';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

const LearningScreen = () => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      id: 1,
      phoneme1: 'V',
      phoneme2: 'B',
      status: 'Continue Learning',
      progress: 1,
      color: COLORS.primary
    },
    {
      id: 2,
      phoneme1: 'P',
      phoneme2: 'F',
      status: 'Completed',
      progress: 4,
      color: COLORS.secondary
    },
    {
      id: 3,
      phoneme1: 'T',
      phoneme2: 'D',
      status: 'Continue Learning',
      progress: 1,
      color: COLORS.primary
    },
    {
      id: 4,
      phoneme1: 'S',
      phoneme2: 'Sh',
      status: 'Continue Learning',
      progress: 1,
      color: COLORS.primary
    },
    {
      id: 5,
      phoneme1: 'F',
      phoneme2: 'Th',
      status: 'Continue Learning',
      progress: 1,
      color: COLORS.primary
    },
    {
      id: 6,
      phoneme1: 'L',
      phoneme2: 'T',
      status: 'Continue Learning',
      progress: 1,
      color: COLORS.primary
    },
  ];

  const handleOverallTest = () => {
    navigation.navigate('OverallTest');
  };

  const handleCoursePress = (course) => {
    // Navigate to CourseTest with course data
    navigation.navigate('CourseTest', {
      phoneme1: course.phoneme1,
      phoneme2: course.phoneme2,
      courseData: course
    });
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.unauthContainer}>
        <Text style={styles.unauthText}>Please log in to access Learning features</Text>
        <TouchableOpacity
          style={styles.unauthButton}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.unauthButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: insets.bottom + 30 } // Add safe area padding
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Detection Test Banner */}
      <View style={styles.bannerContainer}>
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>
              Confused on how to get started?
            </Text>
            <Text style={styles.bannerSubtitle}>
              Don't worry take our detection of phoneme error test
            </Text>
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={handleOverallTest}
              activeOpacity={0.8}
            >
              <Text style={styles.bannerButtonText}>Start Test →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerImagePlaceholder}>
            <Text style={styles.bannerIcon}>🎯</Text>
          </View>
        </View>
      </View>

      {/* Calendar Section */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={new Date().toISOString().split('T')[0]}
          markedDates={{
            [new Date().toISOString().split('T')[0]]: {
              selected: true,
              selectedColor: COLORS.primary,
            },
          }}
          theme={{
            todayTextColor: COLORS.primary,
            selectedDayBackgroundColor: COLORS.primary,
            selectedDayTextColor: COLORS.white,
            arrowColor: COLORS.primary,
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 12,
          }}
        />
      </View>

      {/* Phonemes Catalog Section */}
      <View style={styles.catalogSection}>
        <View style={styles.catalogHeader}>
          <Text style={styles.catalogTitle}>
            Correct your speech with Phonemes catalog
          </Text>
        </View>

        <View style={styles.coursesList}>
          {courses.map((course) => (
            <CourseModal
              key={course.id}
              Phoneme1={course.phoneme1}
              Phoneme2={course.phoneme2}
              Status={course.status}
              Progress={course.progress}
              Color={course.color}
              onPress={() => handleCoursePress(course)}
            />
          ))}
        </View>
      </View>

      {/* Articles Section */}
      <View style={styles.articlesSection}>
        <View style={styles.articlesHeader}>
          <Text style={styles.articlesTitle}>Recent Articles</Text>
        </View>

        <View style={styles.articlesContainer}>
          <ArticlesComponent />
          <ArticlesComponent />
          <ArticlesComponent />
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
  scrollContent: {
    flexGrow: 1,
  },
  unauthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  unauthText: {
    fontSize: SIZES.body1,
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  unauthButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.smallRadius,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  unauthButtonText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#B3E5FC',
    borderRadius: SIZES.radius,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 140,
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  bannerTitle: {
    fontSize: Math.min(SIZES.h4, width * 0.045),
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  bannerSubtitle: {
    fontSize: Math.min(SIZES.body2, width * 0.035),
    color: COLORS.black,
    marginBottom: 16,
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  bannerButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: SIZES.smallRadius,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerButtonText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
  },
  bannerImagePlaceholder: {
    width: width * 0.15,
    minWidth: 60,
    maxWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerIcon: {
    fontSize: width * 0.12,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: SIZES.radius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  catalogSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  catalogHeader: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.black,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  catalogTitle: {
    fontSize: Math.min(SIZES.h4, width * 0.045),
    fontWeight: '600',
    color: COLORS.black,
  },
  coursesList: {
    // Remove ScrollView nesting - just render all items
  },
  articlesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  articlesHeader: {
    marginBottom: 16,
  },
  articlesTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  articlesContainer: {
    gap: 16,
  },
});

export default LearningScreen;
