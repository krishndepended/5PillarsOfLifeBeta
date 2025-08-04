// src/services/NotificationService.ts - SIMPLIFIED VERSION
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

class IntelligentNotificationService {
  private static instance: IntelligentNotificationService;
  
  // Simple motivational messages
  private motivationalMessages = [
    {
      sanskrit: "योगः कर्मसु कौशलम्",
      translation: "Yoga is skill in action",
      timeOfDay: 'morning'
    },
    {
      sanskrit: "सत्यमेव जयते",
      translation: "Truth alone triumphs", 
      timeOfDay: 'any'
    },
    {
      sanskrit: "वसुधैव कुटुम्बकम्",
      translation: "The world is one family",
      timeOfDay: 'evening'
    }
  ];

  public static getInstance(): IntelligentNotificationService {
    if (!IntelligentNotificationService.instance) {
      IntelligentNotificationService.instance = new IntelligentNotificationService();
    }
    return IntelligentNotificationService.instance;
  }

  async initialize() {
    try {
      // Configure notification handling
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
      }

      console.log('✅ Notification Service initialized');
      return true;
    } catch (error) {
      console.error('❌ Notification Service initialization error:', error);
      return false;
    }
  }

  async sendAchievementNotification(achievement: any) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🎉 Achievement Unlocked!`,
          body: `${achievement.title}\n${achievement.description}`,
          data: { achievement, type: 'achievement' },
          sound: true
        },
        trigger: null // Send immediately
      });
    } catch (error) {
      console.error('Error sending achievement notification:', error);
    }
  }

  async scheduleMotivationalMessage() {
    try {
      const message = this.motivationalMessages[Math.floor(Math.random() * this.motivationalMessages.length)];
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '✨ Daily Wisdom',
          body: `${message.sanskrit}\n"${message.translation}"`,
          data: { message, type: 'motivation' },
          sound: true
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true
        }
      });
    } catch (error) {
      console.error('Error scheduling motivational message:', error);
    }
  }
}

export default IntelligentNotificationService;
