import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { RunAnywhereProvider } from './src/context/RunAnywhereContext';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <RunAnywhereProvider>
              <NavigationContainer>
                <StatusBar barStyle="light-content" backgroundColor="#000" />
                <RootNavigator />
              </NavigationContainer>
            </RunAnywhereProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
