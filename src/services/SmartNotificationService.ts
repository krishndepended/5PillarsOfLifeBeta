// src/services/SmartNotificationService.ts - INTELLIGENT NOTIFICATIONS
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AIRecommendationEngine from './OptimizedAIEngine';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface NotificationSchedule {
  id: string;
  title: string;
  body: string;
  trigger: Notifications.NotificationTriggerInput;
  type: 'reminder' | 'insight' | 'achievement' | 'motivation';
}

class SmartNotificationService {
  async initialize() {
    await this.requestPermissions();
    await this.scheduleIntelligentNotifications();
  }

  private async requestPermissions() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('neural-optimization', {
        name: '5 Pillars Neural Optimization',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }
  }

  async scheduleIntelligentNotifications() {
    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Get user preferences and patterns
    const optimalTime = await this.getOptimalNotificationTime();
    
    // Schedule daily optimization reminder
    await this.scheduleDailyReminder(optimalTime);
    
    // Schedule weekly insights
    await this.scheduleWeeklyInsights();
    
    // Schedule motivational messages
    await this.scheduleMotivationalNotifications();
  }

  private async getOptimalNotificationTime(): Promise<{ hour: number; minute: number }> {
    try {
      const storedTime = await AsyncStorage.getItem('optimalNotificationTime');
      if (storedTime) {
        return JSON.parse(storedTime);
      }
    } catch (error) {
      console.error('Error getting optimal notification time:', error);
    }
    
    // Default to 9:00 AM
    return { hour: 9, minute: 0 };
  }

  private async scheduleDailyReminder(time: { hour: number; minute: number }) {
    const notifications: NotificationSchedule[] = [
      {
        id: 'daily-neural-optimization',
        title: '🧠 Neural Optimization Time',
        body: 'Ready to enhance your 5 pillars? Your brain is primed for growth!',
        trigger: {
          hour: time.hour,
          minute: time.minute,
          repeats: true,
        },
        type: 'reminder'
      }
    ];

    for (const notification of notifications) {
      await Notifications.scheduleNotificationAsync({
        identifier: notification.id,
        content: {
          title: notification.title,
          body: notification.body,
          data: { type: notification.type },
          categoryIdentifier: 'neural-optimization',
        },
        trigger: notification.trigger,
      });
    }
  }

  private async scheduleWeeklyInsights() {
    const notifications: NotificationSchedule[] = [
      {
        id: 'weekly-progress-insights',
        title: '📊 Weekly Neural Insights Ready',
        body: 'Discover your optimization patterns and AI recommendations!',
        trigger: {
          weekday: 1, // Monday
          hour: 10,
          minute: 0,
          repeats: true,
        },
        type: 'insight'
      }
    ];

    for (const notification of notifications) {
      await Notifications.scheduleNotificationAsync({
        identifier: notification.id,
        content: {
          title: notification.title,
          body: notification.body,
          data: { type: notification.type },
        },
        trigger: notification.trigger,
      });
    }
  }

  private async scheduleMotivationalNotifications() {
    const motivationalMessages = [
      { title: '🌟 Neural Plasticity', body: 'Every session rewires your brain for peak performance!' },
      { title: '🚀 Optimization Momentum', body: 'Your consistency is building unstoppable neural pathways!' },
      { title: '⚡ Peak Performance', body: 'Today is perfect for pushing your neural limits!' },
      { title: '🎯 Focus Power', body: 'Your MIND pillar is ready for advanced training!' },
      { title: '❤️ Emotional Mastery', body: 'Time to strengthen your HEART pillar connections!' }
    ];

    // Schedule random motivational messages 3 times per week
    for (let i = 0; i < 3; i++) {
      const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      const randomHour = Math.floor(Math.random() * 10) + 8; // Between 8 AM and 6 PM
      
      await Notifications.scheduleNotificationAsync({
        identifier: `motivation-${i}`,
        content: {
          title: message.title,
          body: message.body,
          data: { type: 'motivation' },
        },
        trigger: {
          seconds: Math.random() * 604800, // Random time within a week
          repeats: true,
        },
      });
    }
  }

  async sendAchievementNotification(achievement: {
    title: string;
    description: string;
    points: number;
  }) {
    await Notifications.scheduleNotificationAsync({
      identifier: `achievement-${Date.now()}`,
      content: {
        title: `🏆 ${achievement.title}`,
        body: `${achievement.description} (+${achievement.points} points)`,
        data: { type: 'achievement', points: achievement.points },
      },
      trigger: null, // Send immediately
    });
  }

  async sendPersonalizedRecommendation(recommendation: {
    title: string;
    description: string;
    pillar: string;
  }) {
    const pillarEmojis: { [key: string]: string } = {
      body: '💪',
      mind: '🧠',
      heart: '❤️',
      spirit: '🌟',
      diet: '🥗',
      overall: '⚡'
    };

    await Notifications.scheduleNotificationAsync({
      identifier: `recommendation-${Date.now()}`,
      content: {
        title: `${pillarEmojis[recommendation.pillar]} ${recommendation.title}`,
        body: recommendation.description,
        data: { type: 'recommendation', pillar: recommendation.pillar },
      },
      trigger: null, // Send immediately
    });
  }

  async updateOptimalNotificationTime(hour: number, minute: number) {
    try {
      await AsyncStorage.setItem('optimalNotificationTime', JSON.stringify({ hour, minute }));
      // Reschedule notifications with new optimal time
      await this.scheduleIntelligentNotifications();
    } catch (error) {
      console.error('Error updating optimal notification time:', error);
    }
  }
}

export default new SmartNotificationService();
