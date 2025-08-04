// App.tsx - UPDATED WITH DARK MODE THEME PROVIDER
import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Platform, Alert } from 'react-native';

// Context Providers
import { AppDataProvider } from './src/context/AppDataContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Error Boundary
import ErrorBoundary from './src/components/ErrorBoundary';

// Advanced Services
import IntelligentNotificationService from './src/services/NotificationService';
import SocialService from './src/services/SocialService';
import OfflineService from './src/services/OfflineService';

// Screens (all your existing screens)
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import BodyScreen from './src/screens/BodyScreen';
import MindScreen from './src/screens/MindScreen';
import HeartScreen from './src/screens/HeartScreen';
import SpiritScreen from './src/screens/SpiritScreen';
import DietScreen from './src/screens/DietScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import QuickSessionScreen from './src/screens/QuickSessionScreen';
import DailyCheckInScreen from './src/screens/DailyCheckInScreen';
import AICoachScreen from './src/screens/AICoachScreen';
import AdvancedAnalyticsScreen from './src/screens/AdvancedAnalyticsScreen';
import AIInsightDetailScreen from './src/screens/AIInsightDetailScreen';
import CommunityScreen from './src/screens/CommunityScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { theme } = useTheme();

  // Custom navigation theme
  const navigationTheme = {
    ...DefaultTheme,
    dark: theme.isDark,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.accent,
    },
  };

  useEffect(() => {
    const initializeAdvancedServices = async () => {
      try {
        console.log('🚀 Initializing 5 Pillars of Life Advanced Services...');
        
        // Initialize services
        const notificationService = IntelligentNotificationService.getInstance();
        const notificationInit = await notificationService.initialize();
        
        if (notificationInit) {
          console.log('🔔 Notification Service initialized successfully');
          await notificationService.scheduleMotivationalMessage();
        } else {
          console.warn('⚠️ Notification permissions not granted');
        }
        
        const offlineService = OfflineService.getInstance();
        await offlineService.initialize();
        console.log('📱 Offline Service initialized successfully');
        
        const socialService = SocialService.getInstance();
        console.log('👥 Social Service ready');
        
        console.log('✅ All Advanced Services initialized successfully!');
        console.log('🕉️ Welcome to 5 Pillars of Life - Production Ready!');
        
      } catch (error) {
        console.error('❌ Error initializing advanced services:', error);
        
        if (__DEV__) {
          Alert.alert(
            'Service Initialization',
            'Some advanced features may not be available. The app will still work normally.',
            [{ text: 'Continue', style: 'default' }]
          );
        }
      }
    };

    initializeAdvancedServices();
  }, []);

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right',
        }}
      >
        {/* Core Screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        
        {/* Pillar Screens */}
        <Stack.Screen name="BodyScreen" component={BodyScreen} />
        <Stack.Screen name="MindScreen" component={MindScreen} />
        <Stack.Screen name="HeartScreen" component={HeartScreen} />
        <Stack.Screen name="SpiritScreen" component={SpiritScreen} />
        <Stack.Screen name="DietScreen" component={DietScreen} />
        
        {/* Feature Screens */}
        <Stack.Screen name="UserProfileScreen">
          {() => (
            <ErrorBoundary>
              <UserProfileScreen />
            </ErrorBoundary>
          )}
        </Stack.Screen>
        
        {/* Community & Social Features */}
        <Stack.Screen 
          name="CommunityScreen" 
          component={CommunityScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        
        {/* Session & Practice Screens */}
        <Stack.Screen name="QuickSessionScreen" component={QuickSessionScreen} />
        <Stack.Screen name="DailyCheckInScreen" component={DailyCheckInScreen} />
        <Stack.Screen name="AICoachScreen" component={AICoachScreen} />
        
        {/* Advanced Feature Screens */}
        <Stack.Screen 
          name="AdvancedAnalyticsScreen" 
          component={AdvancedAnalyticsScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="AIInsightDetailScreen" component={AIInsightDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AppDataProvider>
            <AppNavigator />
          </AppDataProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
