import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import HomeScreen from '../screens/main/HomeScreen';
import LearningScreen from '../screens/main/LearningScreen';
import OverallTestScreen from '../screens/main/OverallTestScreen';
import ChatbotScreen from '../screens/main/ChatbotScreen';
import ArticlesScreen from '../screens/main/ArticlesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: '🏠',
  Learn: '🎓',
  Test: '📝',
  Chat: '💬',
  Articles: '📖',
  Profile: '👤',
};

export default function MainNavigator() {
  const { darkMode } = useTheme();

  const tabBarBg = darkMode ? '#0d0e1f' : '#f4efe8';
  const activeColor = darkMode ? '#2dd4bf' : '#4338ca';
  const inactiveColor = darkMode ? 'rgba(248,250,252,0.3)' : 'rgba(28,19,8,0.35)';
  const borderColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(180,165,145,0.4)';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopWidth: 1,
          borderTopColor: borderColor,
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
            {TAB_ICONS[route.name]}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Learn" component={LearningScreen} />
      <Tab.Screen name="Test" component={OverallTestScreen} />
      <Tab.Screen name="Chat" component={ChatbotScreen} />
      <Tab.Screen name="Articles" component={ArticlesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
