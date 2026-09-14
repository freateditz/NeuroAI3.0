import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import ArticlesComponent from '../components/ArticlesComponent';
import { COLORS, SIZES } from '../constants/theme';

const ArticlesScreen = () => {
  const articles = [
    {
      id: 1,
      title: 'Understanding Speech Disorders',
      description: 'Learn about common speech disorders and how to address them.',
      author: 'Dr. Sarah Johnson',
      date: 'Jan 15, 2025',
    },
    {
      id: 2,
      title: 'Phoneme Training Techniques',
      description: 'Effective techniques for improving phoneme pronunciation.',
      author: 'Michael Chen',
      date: 'Jan 10, 2025',
    },
    {
      id: 3,
      title: 'The Science of Speech',
      description: 'Exploring the neurological basis of speech production.',
      author: 'Dr. Emily Rodriguez',
      date: 'Jan 5, 2025',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Articles & Resources</Text>
        
        <Text style={styles.subtitle}>
          Explore our collection of articles, guides, and resources to help you on
          your speech training journey.
        </Text>

        <View style={styles.articlesContainer}>
          {articles.map((article) => (
            <TouchableOpacity key={article.id} style={styles.articleCard}>
              <View style={styles.articleHeader}>
                <Text style={styles.articleIcon}>📄</Text>
              </View>
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleDescription}>
                  {article.description}
                </Text>
                <View style={styles.articleFooter}>
                  <Text style={styles.articleAuthor}>{article.author}</Text>
                  <Text style={styles.articleDate}>{article.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Resources</Text>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: SIZES.body2,
    color: COLORS.darkGray,
    lineHeight: 24,
    marginBottom: 32,
  },
  articlesContainer: {
    marginBottom: 40,
  },
  articleCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  articleIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: SIZES.body3,
    color: COLORS.darkGray,
    lineHeight: 20,
    marginBottom: 12,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  articleAuthor: {
    fontSize: SIZES.body4,
    color: COLORS.primary,
    fontWeight: '500',
  },
  articleDate: {
    fontSize: SIZES.body4,
    color: COLORS.darkGray,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 16,
  },
});

export default ArticlesScreen;
