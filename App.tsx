// App.tsx - COMPLETE VERSION WITH AI INSIGHT DETAIL SCREEN ROUTE
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppDataProvider } from './src/context/AppDataContext';
import NotificationManager from './src/utils/NotificationManager';

// Import all screens
import HomeScreen from './src/screens/HomeScreen';
import BodyScreen from './src/screens/BodyScreen';
import MindScreen from './src/screens/MindScreen';
import HeartScreen from './src/screens/HeartScreen';
import SpiritScreen from './src/screens/SpiritScreen';
import DietScreen from './src/screens/DietScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import AICoachScreen from './src/screens/AICoachScreen';
import AIInsightDetailScreen from './src/screens/AIInsightDetailScreen'; // NEW AI INSIGHT DETAIL SCREEN

const Stack = createNativeStackNavigator();

// Enhanced app initializer with notifications
const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize notification system
      const notificationManager = NotificationManager.getInstance();
      await notificationManager.initialize();
      
      // Set up default daily reminder
      await notificationManager.scheduleDailyReminder('09:00', true);
      
      // Schedule motivational reminder
      await notificationManager.scheduleMotivationalReminder();
      
      console.log('5PillarsOfLife app fully initialized with notifications, AI Coach, and AI Insight Details!');
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setTimeout(() => setIsReady(true), 1000);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Initializing Neural Platform...</Text>
        <Text style={styles.loadingSubtext}>Setting up AI insights & detailed recommendations</Text>
      </View>
    );
  }

  return <>{children}</>;
};

// Enhanced navigation error boundary
class NavigationErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Navigation Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Neural Navigation Offline</Text>
          <Text style={styles.errorMessage}>
            System temporarily unavailable. Restarting optimization protocols...
          </Text>
          <Text 
            style={styles.retryButton}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            Restart Neural Platform
          </Text>
        </View>
      );
    }

    return <>{this.props.children}</>;
  }
}

// Complete navigator with all features INCLUDING AI COACH AND AI INSIGHT DETAIL
const SafeNavigator = () => {
  return (
    <NavigationContainer
      onUnhandledAction={(action) => {
        console.warn('Unhandled navigation action:', action);
      }}
      onStateChange={(state) => {
        console.log('Neural navigation state changed');
      }}
    >
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: '5 Pillars of Life' }}
        />
        <Stack.Screen 
          name="BodyScreen" 
          component={BodyScreen}
          options={{ title: 'Body Optimization' }}
        />
        <Stack.Screen 
          name="MindScreen" 
          component={MindScreen}
          options={{ title: 'Mind Enhancement' }}
        />
        <Stack.Screen 
          name="HeartScreen" 
          component={HeartScreen}
          options={{ title: 'Heart Intelligence' }}
        />
        <Stack.Screen 
          name="SpiritScreen" 
          component={SpiritScreen}
          options={{ title: 'Spirit Expansion' }}
        />
        <Stack.Screen 
          name="DietScreen" 
          component={DietScreen}
          options={{ title: 'Diet Optimization' }}
        />
        <Stack.Screen 
          name="AnalyticsScreen" 
          component={AnalyticsScreen}
          options={{ title: 'Neural Analytics' }}
        />
        <Stack.Screen 
          name="UserProfileScreen" 
          component={UserProfileScreen}
          options={{ title: 'Neural Profile' }}
        />
        <Stack.Screen 
          name="NotificationSettingsScreen" 
          component={NotificationSettingsScreen}
          options={{ title: 'Notification Settings' }}
        />
        {/* AI Coach Screen Route */}
        <Stack.Screen 
          name="AICoachScreen" 
          component={AICoachScreen}
          options={{ title: 'AI Coach' }}
        />
        {/* NEW: AI Insight Detail Screen Route */}
        <Stack.Screen 
          name="AIInsightDetailScreen" 
          component={AIInsightDetailScreen}
          options={{ 
            title: 'AI Insight Detail',
            animation: 'slide_from_bottom' // Special animation for detail views
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AppDataProvider>
      <NavigationErrorBoundary>
        <AppInitializer>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <SafeNavigator />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </AppInitializer>
      </NavigationErrorBoundary>
    </AppDataProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: 'bold',
    padding: 12,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderRadius: 8,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
  },
});
