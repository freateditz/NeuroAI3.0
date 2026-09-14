import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const RecordButton = ({ bgColor, text, textColor, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor || COLORS.primary }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: textColor || COLORS.white }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.smallRadius,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 1,
    elevation: 3,
    minWidth: 150,
    alignItems: 'center',
  },
  text: {
    fontSize: SIZES.body2,
    fontWeight: '600',
  },
});

export default RecordButton;
