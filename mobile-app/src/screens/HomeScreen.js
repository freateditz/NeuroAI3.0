import { useNavigation } from '@react-navigation/native';
import { useRef } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigation.navigate('Learning');
    } else {
      navigation.navigate('Auth');
    }
  };

  const scrollToFeatures = () => {
    scrollViewRef.current?.scrollTo({ y: 600, animated: true });
  };

  const features = [
    {
      title: 'Engaging Interfacing',
      description: 'Interactive sessions for an immersive learning experience.',
      bgColor: COLORS.primary,
      icon: '🎯',
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your improvement with detailed analytics.',
      bgColor: COLORS.white,
      icon: '📊',
      textColor: COLORS.black,
    },
    {
      title: 'Holistic Phonic Training',
      description: 'Comprehensive phoneme correction programs.',
      bgColor: COLORS.secondary,
      icon: '🎓',
    },
    {
      title: 'Motor-Based Learning',
      description: 'Physical activities to enhance speech patterns.',
      bgColor: COLORS.purple,
      icon: '🏃',
      textColor: COLORS.black,
    },
    {
      title: 'Visual Auditory Stimulation',
      description: 'Multi-sensory approach to learning.',
      bgColor: COLORS.primary,
      icon: '👁️',
    },
    {
      title: 'Multimodal Learning',
      description: 'Diverse methods for effective training.',
      bgColor: COLORS.white,
      icon: '📚',
      textColor: COLORS.black,
    },
    {
      title: 'Real-Time Feedback',
      description: 'Instant analysis of your pronunciation.',
      bgColor: COLORS.secondary,
      icon: '⚡',
    },
    {
      title: '3D Visualization',
      description: 'Interactive 3D models for better understanding.',
      bgColor: COLORS.purple,
      icon: '🎨',
      textColor: COLORS.black,
    },
  ];

  return (
    <ScrollView ref={scrollViewRef} style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Speak.{' '}
            <Text style={[styles.heroTitle, { color: COLORS.primary }]}>Learn</Text>. Thrive
          </Text>
          <Text style={styles.heroTitle}>Bridging the gap with</Text>
          <Text style={styles.heroTitle}>every word</Text>

          <View style={styles.micPlaceholder}>
            <Text style={styles.micIcon}>🎤</Text>
          </View>

          <Text style={styles.heroDescription}>
            Our goal is to empower individuals with speech challenges. Unlock your potential
            through personalized speech training.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {isAuthenticated ? 'Continue Learning' : 'Get Started'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={scrollToFeatures}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Browse Features</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <View style={styles.featuresHeader}>
          <Text style={styles.featuresTitle}>Features</Text>
        </View>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View
              key={index}
              style={[
                styles.featureCard,
                {
                  backgroundColor: feature.bgColor,
                },
              ]}
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text
                style={[
                  styles.featureTitle,
                  { color: feature.textColor || COLORS.white },
                ]}
              >
                {feature.title}
              </Text>
              <Text
                style={[
                  styles.featureDescription,
                  { color: feature.textColor || COLORS.white },
                ]}
              >
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Contact Section */}
      <View style={styles.contactSection}>
        <View style={styles.contactPlaceholder}>
          <Text style={styles.contactIcon}>📧</Text>
        </View>
        <Text style={styles.contactTitle}>Get in Touch</Text>
        <Text style={styles.contactDescription}>
          Have questions? We're here to help you on your learning journey.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.black,
    marginBottom: 8,
  },
  micPlaceholder: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 32,
  },
  micIcon: {
    fontSize: 120,
  },
  heroDescription: {
    fontSize: SIZES.body1,
    textAlign: 'center',
    color: COLORS.black,
    marginBottom: 32,
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: SIZES.smallRadius,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.black,
  },
  primaryButtonText: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.black,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.black,
  },
  secondaryButtonText: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.black,
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  featuresHeader: {
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderColor: COLORS.black,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: SIZES.largeRadius,
    marginBottom: 16,
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: SIZES.body3,
    lineHeight: 20,
  },
  contactSection: {
    padding: 40,
    alignItems: 'center',
    marginBottom: 40,
  },
  contactPlaceholder: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactIcon: {
    fontSize: 80,
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 12,
  },
  contactDescription: {
    fontSize: SIZES.body2,
    textAlign: 'center',
    color: COLORS.darkGray,
    lineHeight: 24,
  },
});

export default HomeScreen;
