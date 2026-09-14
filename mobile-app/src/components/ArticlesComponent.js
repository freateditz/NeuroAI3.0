import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');

const ArticlesComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>📰</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.description}>
          Ipsum odio et integer aliquet lorem a, sem suscipit varius.
        </Text>
        <View style={styles.authorContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.authorName}>Shams Tabrez</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
    borderRadius: SIZES.radius,
    maxWidth: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: COLORS.white,
    marginVertical: 8,
  },
  imageContainer: {
    marginRight: 16,
  },
  placeholder: {
    width: 80,
    height: 80,
    backgroundColor: '#F0F0F0',
    borderRadius: SIZES.smallRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  description: {
    fontSize: SIZES.body3,
    color: COLORS.black,
    marginBottom: 12,
    lineHeight: 20,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 16,
  },
  authorName: {
    fontSize: SIZES.body3,
    color: COLORS.black,
  },
});

export default ArticlesComponent;
