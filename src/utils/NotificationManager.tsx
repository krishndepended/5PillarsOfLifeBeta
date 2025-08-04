// src/utils/NotificationManager.tsx - COMPLETE SMART NOTIFICATION SYSTEM
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  categoryIdentifier?: string;
}

class NotificationManager {
  private static instance: NotificationManager;
  private expoPushToken: string | null = null;
  private isInitialized: boolean = false;

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      if (!Device.isDevice) {
        console.log('Notifications work only on physical devices');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      this.expoPushToken = token.data;
      console.log('5PillarsOfLife Notification token:', this.expoPushToken);

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('neural-optimization', {
          name: '5 Pillars Neural Optimization',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#3B82F6',
          description: 'Neural optimization reminders and achievements',
        });
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  async scheduleDailyReminder(time: string, enabled: boolean): Promise<void> {
    try {
      await this.cancelNotificationsByIdentifier('daily-reminder');

      if (!enabled) return;

      const [hours, minutes] = time.split(':').map(Number);
      
      await Notifications.scheduleNotificationAsync({
        identifier: 'daily-reminder',
        content: {
          title: '🧠 Neural Optimization Time!',
          body: 'Ready to enhance your 5 Pillars? Your brain is optimized for peak performance right now.',
          data: { type: 'daily-reminder', pillar: 'all' },
          categoryIdentifier: 'neural-optimization',
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });

      console.log(`Daily neural optimization reminder set for ${time}`);
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
    }
  }

  async scheduleAchievementNotification(achievement: string, pillar?: string): Promise<void> {
    try {
      const pillarEmojis = {
        body: '💪',
        mind: '🧠',
        heart: '❤️',
        spirit: '🌟',
        diet: '🥗',
        overall: '🏆'
      };

      const emoji = pillarEmojis[pillar as keyof typeof pillarEmojis] || '🏆';

      await Notifications.scheduleNotificationAsync({
        identifier: `achievement-${Date.now()}`,
        content: {
          title: `${emoji} Neural Achievement Unlocked!`,
          body: `Outstanding! You've mastered: ${achievement}. Your optimization journey is inspiring!`,
          data: { type: 'achievement', achievement, pillar },
          categoryIdentifier: 'neural-optimization',
        },
        trigger: {
          seconds: 2,
        },
      });
    } catch (error) {
      console.error('Error scheduling achievement notification:', error);
    }
  }

  async scheduleMotivationalReminder(): Promise<void> {
    try {
      const motivationalMessages = [
        {
          title: '🚀 Neural Pathways Strengthening',
          body: 'Every optimization session builds stronger neural connections. Your future self thanks you!'
        },
        {
          title: '⚡ Peak Performance Mode',
          body: 'Your brain craves consistency. 15 minutes of optimization = 24 hours of enhanced thinking!'
        },
        {
          title: '🌟 Optimization Mastery',
          body: 'Excellence is a habit, not an act. Show up for your neural optimization journey today!'
        },
        {
          title: '🧠 Cognitive Enhancement',
          body: 'Your mind is your most powerful tool. Time to sharpen it with focused optimization!'
        },
        {
          title: '💫 Transformation Active',
          body: 'Small daily optimizations create extraordinary life transformations. Keep going!'
        }
      ];

      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

      await Notifications.scheduleNotificationAsync({
        identifier: `motivation-${Date.now()}`,
        content: {
          title: randomMessage.title,
          body: randomMessage.body,
          data: { type: 'motivation' },
          categoryIdentifier: 'neural-optimization',
        },
        trigger: {
          seconds: Math.random() * 14400 + 3600, // Random between 1-5 hours
        },
      });
    } catch (error) {
      console.error('Error scheduling motivational reminder:', error);
    }
  }

  async scheduleWeeklyProgress(): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: 'weekly-progress',
        content: {
          title: '📊 Weekly Neural Progress Report',
          body: 'Your optimization journey this week has been remarkable! Check your analytics for detailed insights.',
          data: { type: 'weekly-progress' },
          categoryIdentifier: 'neural-optimization',
        },
        trigger: {
          weekday: 1, // Monday
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });
    } catch (error) {
      console.error('Error scheduling weekly progress:', error);
    }
  }

  async schedulePillarReminder(pillar: string, currentScore: number, targetScore: number): Promise<void> {
    try {
      const pillarInfo = {
        body: { emoji: '💪', name: 'Physical', action: 'time for strength optimization' },
        mind: { emoji: '🧠', name: 'Cognitive', action: 'enhance your mental clarity' },
        heart: { emoji: '❤️', name: 'Emotional', action: 'nurture your emotional intelligence' },
        spirit: { emoji: '🌟', name: 'Spiritual', action: 'expand your consciousness' },
        diet: { emoji: '🥗', name: 'Nutritional', action: 'optimize your fuel intake' }
      };

      const info = pillarInfo[pillar as keyof typeof pillarInfo];
      if (!info) return;

      const progressNeeded = targetScore - currentScore;

      await Notifications.scheduleNotificationAsync({
        identifier: `pillar-reminder-${pillar}`,
        content: {
          title: `${info.emoji} ${info.name} Optimization Ready`,
          body: `You're ${progressNeeded}% away from your ${pillar} target! Perfect time to ${info.action}.`,
          data: { type: 'pillar-reminder', pillar, currentScore, targetScore },
          categoryIdentifier: 'neural-optimization',
        },
        trigger: {
          seconds: 7200, // 2 hours from now
        },
      });
    } catch (error) {
      console.error('Error scheduling pillar reminder:', error);
    }
  }

  async sendImmediateNotification(notification: NotificationData): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.categoryIdentifier || 'neural-optimization',
        },
        trigger: {
          seconds: 1,
        },
      });
    } catch (error) {
      console.error('Error sending immediate notification:', error);
    }
  }

  async cancelNotificationsByIdentifier(identifier: string): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const toCancel = scheduledNotifications
        .filter(notification => notification.identifier.includes(identifier))
        .map(notification => notification.identifier);
      
      if (toCancel.length > 0) {
        await Notifications.cancelScheduledNotificationsAsync(toCancel);
        console.log(`Cancelled ${toCancel.length} notifications with identifier: ${identifier}`);
      }
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All neural optimization notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

export default NotificationManager;
