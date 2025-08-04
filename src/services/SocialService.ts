// src/services/SocialService.ts - SIMPLIFIED VERSION
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Share } from 'react-native';

class SocialService {
  private static instance: SocialService;

  public static getInstance(): SocialService {
    if (!SocialService.instance) {
      SocialService.instance = new SocialService();
    }
    return SocialService.instance;
  }

  async shareAchievement(achievement: any, userProfile: any) {
    try {
      const shareContent = `🎉 Achievement Unlocked!\n\n${achievement.title}\n${achievement.description}\n\nJoin me on the wellness journey with 5 Pillars of Life! 🕉️\n\n#WellnessJourney #AncientWisdom #${achievement.pillar}Pillar`;
      
      const result = await Share.share({
        message: shareContent,
        title: `${achievement.title} - 5 Pillars of Life`,
      });

      if (result.action === Share.sharedAction) {
        await this.trackSocialAction('achievement_shared', {
          achievementId: achievement.id,
          pillar: achievement.pillar
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error sharing achievement:', error);
      Alert.alert('Share Error', 'Unable to share achievement at this time.');
      return false;
    }
  }

  async getActiveChallenges() {
    // Mock challenges for now
    return [
      {
        id: 'meditation-challenge',
        title: '7 Days of Meditation',
        description: 'Meditate every day for a week to build your spiritual practice',
        type: 'individual',
        pillar: 'spirit',
        duration: 7,
        participants: 542,
        isActive: true,
        isJoined: false
      },
      {
        id: 'gratitude-challenge',
        title: 'Gratitude Practice',
        description: 'Write 3 gratitudes daily to open your heart',
        type: 'community',
        pillar: 'heart',
        duration: 14,
        participants: 823,
        isActive: true,
        isJoined: false
      }
    ];
  }

  private async trackSocialAction(action: string, data: any) {
    try {
      const analytics = {
        action,
        data,
        timestamp: new Date().toISOString()
      };

      const stored = await AsyncStorage.getItem('social_analytics') || '[]';
      const analytics_data = JSON.parse(stored);
      analytics_data.push(analytics);
      
      await AsyncStorage.setItem('social_analytics', JSON.stringify(analytics_data));
    } catch (error) {
      console.error('Error tracking social action:', error);
    }
  }
}

export default SocialService;
