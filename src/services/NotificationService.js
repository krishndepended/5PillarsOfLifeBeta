// src/services/NotificationService.js - SMART NOTIFICATION SYSTEM
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.initializeNotifications();
  }

  async initializeNotifications() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('neural-optimization', {
        name: 'Neural Optimization',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#8B5CF6',
      });
    }
  }

  // Smart session reminders based on user patterns
  async scheduleSmartReminders(userPreferences, aiInsights = null) {
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!userPreferences.sessionReminders) return;

    const [hours, minutes] = userPreferences.reminderTime.split(':').map(Number);
    
    // Primary daily reminder
    await this.scheduleNotification({
      title: "🧠 Neural Optimization Time!",
      body: this.getSmartReminderMessage(userPreferences),
      trigger: { hour: hours, minute: minutes, repeats: true },
      data: { type: 'daily_reminder', screen: 'HomeScreen' }
    });

    // AI-enhanced reminders based on patterns
    if (aiInsights?.optimalTimes) {
      for (const time of aiInsights.optimalTimes) {
        await this.scheduleNotification({
          title: "⚡ Peak Neural Window",
          body: `Based on your patterns, now is optimal for ${time.pillar.toLowerCase()} training!`,
          trigger: { hour: time.hour, minute: time.minute, repeats: true },
          data: { 
            type: 'optimal_window', 
            pillar: time.pillar,
            screen: 'EnhancedTimerScreen',
            params: { pillar: time.pillar }
          }
        });
      }
    }

    // Streak maintenance reminders
    await this.scheduleNotification({
      title: "🔥 Maintain Your Streak!",
      body: "Don't break your neural optimization momentum. Quick 15-minute session?",
      trigger: { hour: 20, minute: 0, repeats: true }, // 8 PM reminder
      data: { type: 'streak_reminder', screen: 'HomeScreen' }
    });
  }

  // Achievement and milestone notifications
  async scheduleAchievementNotification(achievement) {
    await this.scheduleNotification({
      title: "🏆 Achievement Unlocked!",
      body: `${achievement.title} - ${achievement.description}`,
      trigger: { seconds: 1 },
      data: { 
        type: 'achievement', 
        achievementId: achievement.id,
        screen: 'UserProfileScreen',
        params: { defaultTab: 'achievements' }
      }
    });
  }

  // Goal progress notifications
  async scheduleGoalProgressNotification(goalType, current, target) {
    const percentage = Math.round((current / target) * 100);
    let title, body;

    if (percentage >= 90) {
      title = "🎯 Almost There!";
      body = `You're ${target - current} away from your ${goalType} goal!`;
    } else if (percentage >= 50) {
      title = "💪 Great Progress!";
      body = `${percentage}% towards your ${goalType} goal. Keep going!`;
    } else {
      return; // Don't spam for low progress
    }

    await this.scheduleNotification({
      title,
      body,
      trigger: { seconds: 60 * 60 * 2 }, // 2 hours from now
      data: { 
        type: 'goal_progress',
        goalType,
        screen: 'UserProfileScreen',
        params: { defaultTab: 'goals' }
      }
    });
  }

  // Pillar-specific motivational notifications
  async schedulePillarMotivation(pillar, score) {
    const messages = {
      BODY: {
        low: "💪 Your body is your neural foundation. Ready for some BDNF-boosting movement?",
        medium: "🏃‍♂️ Great physical progress! Let's push those neural pathways further.",
        high: "🔥 Your body pillar is strong! Maintain this neurogenesis momentum!"
      },
      MIND: {
        low: "🧠 Time to sharpen that mental edge. Your prefrontal cortex awaits training!",
        medium: "🎯 Solid cognitive gains! Ready for the next level of mental optimization?",
        high: "🚀 Your mind is operating at peak efficiency. Incredible neural development!"
      },
      HEART: {
        low: "💝 Your emotional intelligence deserves attention. Heart coherence time?",
        medium: "❤️ Beautiful emotional growth! Let's deepen that heart-brain connection.",
        high: "🌟 Your heart pillar radiates strength! Emotional mastery achieved!"
      },
      SPIRIT: {
        low: "🙏 Connect with your deeper self. Consciousness expansion awaits.",
        medium: "✨ Spiritual awareness growing! Ready to transcend ordinary limits?",
        high: "🕯️ Your spirit pillar shines bright! Profound consciousness achieved!"
      },
      DIET: {
        low: "🥗 Fuel your brain optimally. Neurogenesis starts with nutrition!",
        medium: "🍎 Great nutritional choices! Your brain is well-nourished for growth.",
        high: "🌱 Perfect nutritional optimization! Your neural fuel is premium quality!"
      }
    };

    const level = score < 60 ? 'low' : score < 80 ? 'medium' : 'high';
    
    await this.scheduleNotification({
      title: `${pillar} Pillar Update`,
      body: messages[pillar][level],
      trigger: { seconds: 60 * 60 * 6 }, // 6 hours from now
      data: { 
        type: 'pillar_motivation',
        pillar,
        screen: `${pillar.charAt(0) + pillar.slice(1).toLowerCase()}Screen`
      }
    });
  }

  // Correlation insights notifications
  async scheduleCorrelationInsight(pillar1, pillar2, correlation) {
    await this.scheduleNotification({
      title: "🔗 Neural Connection Discovered!",
      body: `Your ${pillar1} and ${pillar2} pillars show ${Math.round(correlation * 100)}% correlation. Training one boosts the other!`,
      trigger: { seconds: 60 * 60 * 12 }, // 12 hours from now
      data: { 
        type: 'correlation_insight',
        pillars: [pillar1, pillar2],
        screen: 'AIRecommendationsScreen'
      }
    });
  }

  // Weekly summary notifications
  async scheduleWeeklySummary(weeklyStats) {
    const day = new Date().getDay();
    if (day === 0) { // Sunday
      await this.scheduleNotification({
        title: "📊 Weekly Neural Summary",
        body: `${weeklyStats.totalSessions} sessions, ${weeklyStats.avgScore}% avg score. Ready for next week's optimization?`,
        trigger: { hour: 19, minute: 0 }, // 7 PM Sunday
        data: { 
          type: 'weekly_summary',
          stats: weeklyStats,
          screen: 'AnalyticsScreen'
        }
      });
    }
  }

  // Helper method for scheduling notifications
  async scheduleNotification({ title, body, trigger, data }) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  // Smart reminder message generation
  getSmartReminderMessage(preferences) {
    const messages = [
      "Your neural pathways are ready for optimization!",
      "Time to enhance your 5 pillars of neural excellence!",
      "Ready to unlock your brain's potential today?",
      "Your daily dose of neuroplasticity awaits!",
      "Let's sculpt your neural architecture together!",
    ];

    if (preferences.focusPillar) {
      return `Ready for some ${preferences.focusPillar.toLowerCase()} pillar optimization?`;
    }

    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Handle notification taps
  setupNotificationHandlers() {
    Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      if (data.screen) {
        // Use NavigationService to navigate
        const NavigationService = require('./NavigationService').default;
        NavigationService.navigate(data.screen, data.params);
      }
    });
  }
}

export default new NotificationService();
