import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Slot, Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RunAnywhere, SDKEnvironment } from '@runanywhere/core';
import { LlamaCPP } from '@runanywhere/llamacpp';
import { ONNX } from '@runanywhere/onnx';

// Ensure StyleSheet is used correctly
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initSDK() {
      try {
        // Initialize RunAnywhere SDK
        await RunAnywhere.initialize({
          environment: SDKEnvironment.Development,
        });

        // Register backends
        LlamaCPP.register();
        ONNX.register();

        setIsReady(true);
      } catch (err) {
        console.error('SDK init error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }

    initSDK();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {error ? `Error: ${error}` : 'Initializing AI...'}
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
