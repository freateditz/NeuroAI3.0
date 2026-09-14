import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useRunAnywhere } from '../context/RunAnywhereContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LoadingScreen from '../screens/LoadingScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Loading: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isReady, isLoading: sdkLoading } = useRunAnywhere();

  if (authLoading || sdkLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated && isReady ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
