import { Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native';

const Mic = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.8}
    >
      <View style={styles.micContainer}>
        <Text style={styles.micIcon}>🎤</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  micContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2D8CFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  micIcon: {
    fontSize: 40,
  },
});

export default Mic;
