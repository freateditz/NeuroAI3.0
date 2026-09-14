import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>About NeuroAI</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.text}>
            We are dedicated to empowering individuals with speech challenges through
            innovative technology and personalized training programs. Our goal is to help
            every user unlock their full potential and communicate confidently.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What We Offer</Text>
          <Text style={styles.text}>
            • Personalized speech training programs{'\n'}
            • Real-time phoneme detection and correction{'\n'}
            • Interactive learning experiences{'\n'}
            • Progress tracking and analytics{'\n'}
            • Expert-designed curriculum
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Technology</Text>
          <Text style={styles.text}>
            Built with cutting-edge AI and machine learning algorithms, our platform
            provides accurate speech analysis and personalized feedback to help you
            improve faster and more effectively.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <Text style={styles.text}>
            Have questions or feedback? We'd love to hear from you!{'\n'}
            Email: support@neuroai.com{'\n'}
            Phone: +1 (555) 123-4567
          </Text>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  text: {
    fontSize: SIZES.body2,
    color: COLORS.black,
    lineHeight: 24,
  },
});

export default AboutScreen;
