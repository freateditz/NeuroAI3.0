import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const NavButton = ({ text, onPress, currLetter }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.sparkle}>✨</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 64,
    backgroundColor: '#0984E3',
    borderRadius: SIZES.smallRadius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 1,
    elevation: 3,
  },
  text: {
    color: COLORS.white,
    fontSize: SIZES.body2,
    fontWeight: '600',
    marginRight: 8,
  },
  sparkle: {
    fontSize: 16,
  },
});

export default NavButton;
