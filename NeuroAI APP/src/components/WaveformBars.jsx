import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function WaveformBars({ color = '#2dd4bf', count = 20, height = 48, active = true }) {
  const bars = useRef(
    Array.from({ length: count }, () => new Animated.Value(Math.random() * 0.6 + 0.15))
  ).current;

  useEffect(() => {
    if (!active) {
      bars.forEach((bar) => Animated.spring(bar, { toValue: 0.15, useNativeDriver: false }).start());
      return;
    }

    const animations = bars.map((bar, i) => {
      const animate = () => {
        const toValue = Math.random() * 0.75 + 0.15;
        Animated.timing(bar, {
          toValue,
          duration: 120 + Math.random() * 100,
          useNativeDriver: false,
        }).start(() => animate());
      };
      return setTimeout(() => animate(), i * 30);
    });

    return () => animations.forEach(clearTimeout);
  }, [active]);

  return (
    <View style={[styles.container, { height }]}>
      {bars.map((bar, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
              backgroundColor: color,
              height: bar.interpolate({
                inputRange: [0, 1],
                outputRange: [2, height],
              }),
              opacity: bar.interpolate({
                inputRange: [0.15, 1],
                outputRange: [0.3, 0.9],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bar: {
    flex: 1,
    borderRadius: 2,
    minWidth: 3,
  },
});
