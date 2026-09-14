import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

// Screens
import AboutScreen from '../screens/AboutScreen';
import ArticlesScreen from '../screens/ArticlesScreen';
import AuthScreen from '../screens/AuthScreen';
import CourseTestScreen from '../screens/CourseTestScreen';
import DetectionScreen from '../screens/DetectionScreen';
import HomeScreen from '../screens/HomeScreen';
import LearningScreen from '../screens/LearningScreen';
import OverallTestScreen from '../screens/OverallTestScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const MainTabNavigator = () => {
  const { isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();

  const tabBarStyleWithInsets = {
    paddingBottom: insets.bottom + 5,
    paddingTop: 5,
    height: 60 + insets.bottom,
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'About') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          } else if (route.name === 'Articles') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Learning') {
            iconName = focused ? 'school' : 'school-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: tabBarStyleWithInsets,
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerTintColor: COLORS.black,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'NeuroAI',
          headerShown: true,
          tabBarStyle: tabBarStyleWithInsets,
        }}
      />

      <Tab.Screen
        name="Learning"
        component={LearningScreen}
        options={{
          title: 'Learning',
          // Hide from tab bar if not authenticated
          tabBarButton: isAuthenticated ? undefined : () => null,
          tabBarStyle: isAuthenticated ? tabBarStyleWithInsets : { display: 'none' },
        }}
      />

      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About Us',
          tabBarStyle: tabBarStyleWithInsets,
        }}
      />

      <Tab.Screen
        name="Articles"
        component={ArticlesScreen}
        options={{
          title: 'Articles',
          tabBarStyle: tabBarStyleWithInsets,
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerTintColor: COLORS.black,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{
          title: 'Sign In',
          headerBackTitle: 'Back',
        }}
      />

      <Stack.Screen
        name="Detection"
        component={DetectionScreen}
        options={{
          title: 'Test Results',
          headerBackTitle: 'Back',
        }}
      />

      <Stack.Screen
        name="OverallTest"
        component={OverallTestScreen}
        options={{
          title: 'Overall Test',
          headerBackTitle: 'Back',
        }}
      />

      <Stack.Screen
        name="CourseTest"
        component={CourseTestScreen}
        options={{
          title: 'Course Test',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
