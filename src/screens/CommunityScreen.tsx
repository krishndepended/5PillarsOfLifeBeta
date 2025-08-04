// src/screens/CommunityScreen.tsx - SOCIAL FEATURES UI
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Services
import SocialService from '../services/SocialService';
import { useAppData, useAppDataSelectors } from '../context/AppDataContext';

const Colors = {
  primary: '#8B5CF6',
  secondary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
};

const CommunityScreen = () => {
  const navigation = useNavigation();
  const { userProfile, achievements } = useAppDataSelectors();
  const [selectedTab, setSelectedTab] = useState<'challenges' | 'leaderboard' | 'achievements'>('challenges');
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  
  const socialService = SocialService.getInstance();

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      const challengesData = await socialService.getActiveChallenges();
      setChallenges(challengesData);
      
      const leaderboardData = await socialService.getLeaderboard('global');
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading community data:', error);
    }
  };

  const handleShareAchievement = async (achievement: any) => {
    try {
      const success = await socialService.shareAchievement(achievement, userProfile);
      if (success) {
        Alert.alert('🎉 Shared!', 'Your achievement has been shared successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to share achievement. Please try again.');
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const success = await socialService.joinChallenge(challengeId);
      if (success) {
        Alert.alert('🚀 Joined!', 'You have successfully joined the challenge!');
        loadCommunityData(); // Refresh data
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to join challenge. Please try again.');
    }
  };

  const renderHeader = () => (
    <LinearGradient
      colors={[Colors.primary, Colors.secondary]}
      style={styles.header}
    >
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Connect • Share • Grow Together</Text>
      </View>

      <TouchableOpacity style={styles.shareButton}>
        <Ionicons name="share-social" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {[
        { key: 'challenges', label: 'Challenges', icon: 'flag' },
        { key: 'leaderboard', label: 'Leaderboard', icon: 'trophy' },
        { key: 'achievements', label: 'Share', icon: 'share' }
      ].map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, selectedTab === tab.key && styles.tabActive]}
          onPress={() => setSelectedTab(tab.key as any)}
        >
          <Ionicons 
            name={tab.icon as any} 
            size={20} 
            color={selectedTab === tab.key ? Colors.primary : Colors.textSecondary} 
          />
          <Text style={[
            styles.tabLabel,
            selectedTab === tab.key && styles.tabLabelActive
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderChallenges = () => (
    <View style={styles.challengesContainer}>
      <Text style={styles.sectionTitle}>Active Challenges</Text>
      {challenges.map((challenge: any) => (
        <View key={challenge.id} style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <View style={[styles.pillarBadge, { backgroundColor: getPillarColor(challenge.pillar) }]}>
              <Text style={styles.pillarText}>{challenge.pillar.toUpperCase()}</Text>
            </View>
          </View>
          
          <Text style={styles.challengeDescription}>{challenge.description}</Text>
          
          <View style={styles.challengeStats}>
            <Text style={styles.statText}>👥 {challenge.participants} participants</Text>
            <Text style={styles.statText}>⏱️ {challenge.duration} days</Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.joinButton,
              challenge.isJoined && styles.joinedButton
            ]}
            onPress={() => !challenge.isJoined && handleJoinChallenge(challenge.id)}
          >
            <Text style={[
              styles.joinButtonText,
              challenge.isJoined && styles.joinedButtonText
            ]}>
              {challenge.isJoined ? '✓ Joined' : 'Join Challenge'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderLeaderboard = () => (
    <View style={styles.leaderboardContainer}>
      <Text style={styles.sectionTitle}>Global Leaderboard</Text>
      {leaderboard.slice(0, 10).map((user: any, index) => (
        <View key={user.id} style={styles.leaderboardItem}>
          <View style={styles.rankContainer}>
            <Text style={styles.rank}>#{user.rank}</Text>
            {index < 3 && (
              <Text style={styles.medal}>
                {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
              </Text>
            )}
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.userStats}>
              Level {user.level} • {user.streak} day streak
            </Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>{user.score}</Text>
            <Text style={styles.scoreLabel}>points</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderAchievementSharing = () => (
    <View style={styles.sharingContainer}>
      <Text style={styles.sectionTitle}>Share Your Achievements</Text>
      {achievements.slice(0, 5).map((achievement: any) => (
        <View key={achievement.id} style={styles.achievementCard}>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDescription}>{achievement.description}</Text>
            <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(achievement.rarity) }]}>
              <Text style={styles.rarityText}>{achievement.rarity.toUpperCase()}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.shareAchievementButton}
            onPress={() => handleShareAchievement(achievement)}
          >
            <Ionicons name="share" size={16} color="#FFFFFF" />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'challenges':
        return renderChallenges();
      case 'leaderboard':
        return renderLeaderboard();
      case 'achievements':
        return renderAchievementSharing();
      default:
        return renderChallenges();
    }
  };

  const getPillarColor = (pillar: string) => {
    const colors = {
      body: '#EF4444',
      mind: '#3B82F6',
      heart: '#EC4899',
      spirit: '#8B5CF6',
      diet: '#10B981'
    };
    return colors[pillar as keyof typeof colors] + '20' || Colors.textSecondary + '20';
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: '#6B7280',
      rare: '#3B82F6',
      epic: '#8B5CF6',
      legendary: '#F59E0B'
    };
    return colors[rarity as keyof typeof colors] || Colors.textSecondary;
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTabBar()}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

// Comprehensive styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  shareButton: {
    padding: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.primary + '20',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  
  // Challenges
  challengesContainer: {
    paddingHorizontal: 20,
  },
  challengeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  pillarBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillarText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
  },
  challengeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinedButton: {
    backgroundColor: Colors.success,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  joinedButtonText: {
    color: '#FFFFFF',
  },

  // Leaderboard
  leaderboardContainer: {
    paddingHorizontal: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  medal: {
    fontSize: 18,
    marginLeft: 4,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  userStats: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  scoreLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  // Achievement Sharing
  sharingContainer: {
    paddingHorizontal: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementInfo: {
    flex: 1,
    marginRight: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  shareAchievementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CommunityScreen;
