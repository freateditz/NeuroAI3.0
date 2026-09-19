import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import MainNavigator from './MainNavigator';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();
  const { darkMode } = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          ...(darkMode ? DarkTheme : DefaultTheme),
          colors: {
            ...(darkMode ? DarkTheme.colors : DefaultTheme.colors),
            primary: darkMode ? '#6366f1' : '#4338ca',
            background: darkMode ? '#050714' : '#f4efe8',
            card: darkMode ? '#0d0e1f' : '#f4efe8',
            text: darkMode ? '#f8fafc' : '#1c1308',
            border: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(180,165,145,0.4)',
            notification: '#ef4444',
          },
        }}
      >
        {isAuthenticated ? <MainNavigator /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
