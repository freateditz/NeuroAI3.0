import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import DashboardScreen from '../screens/main/DashboardScreen';
import ChatScreen from '../screens/main/ChatScreen';
import VoiceScreen from '../screens/main/VoiceScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

export type MainTabParamList = {
  Dashboard: undefined;
  Chat: undefined;
  Voice: undefined;
  Settings: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

const TabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          switch (route.name) {
            case 'Dashboard':
              iconName = 'grid-outline';
              break;
            case 'Chat':
              iconName = 'chatbubble-outline';
              break;
            case 'Voice':
              iconName = 'mic-outline';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              break;
            default:
              iconName = 'circle-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Voice" component={VoiceScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
