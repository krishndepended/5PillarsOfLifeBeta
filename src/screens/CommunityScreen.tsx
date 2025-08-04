// src/screens/CommunityScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Platform, Animated, Modal, TextInput, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GlassPanel from '../components/GlassPanel';
import { CommunitySystem } from '../services/CommunitySystem';
import { HapticService } from '../services/HapticService';

const { width } = Dimensions.get('window');

const Colors = {
  neonGreen: '#00FF88',
  neonBlue: '#00AAFF',
  neonPurple: '#AA55FF',
  neonRed: '#FF4444',
  neonYellow: '#FFD700',
  neonPink: '#FF6B9D',
  surface: { secondary: '#F8FAFC' }
};

const CommunityScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('feed');
  const [socialFeed, setSocialFeed] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [selectedPillar, setSelectedPillar] = useState('ALL');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const community = CommunitySystem.getInstance();
  const haptics = HapticService.getInstance();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    const feed = community.getSocialFeed();
    const activeChallenges = community.getActiveChallenges();
    
    setSocialFeed(feed);
    setChallenges(activeChallenges);

    // Generate default content if empty
    if (feed.length === 0) {
      await generateSampleContent();
    }
  };

  const generateSampleContent = async () => {
    const samplePosts = [
      {
        userId: 'user1',
        username: 'Neural Explorer',
        avatar: '🧠',
        content: 'Just completed my 7-day neural optimization streak! The mind-body connection is incredible. #NeuralGrowth',
        type: 'achievement',
        pillar: 'MIND'
      },
      {
        userId: 'user2',
        username: 'Wellness Warrior',
        avatar: '⚡',
        content: 'Morning meditation session complete! Starting the day with spiritual alignment sets the tone for everything. 🧘‍♀️',
        type: 'progress',
        pillar: 'SPIRIT'
      },
      {
        userId: 'user3',
        username: 'Heart Coherence Master',
        avatar: '❤️',
        content: 'Gratitude practice tip: Write down 3 things you\'re grateful for before your morning coffee. Game changer! ☕✨',
        type: 'tip',
        pillar: 'HEART'
      }
    ];

    for (const post of samplePosts) {
      await community.createSocialPost(post);
    }

    await community.generateDefaultChallenges();
    loadCommunityData();
  };

  const createPost = async () => {
    if (newPost.trim().length === 0) return;

    haptics.success();
    await community.createSocialPost({
      userId: 'currentUser',
      username: 'You',
      avatar: '🌟',
      content: newPost,
      type: 'motivation',
      pillar: selectedPillar !== 'ALL' ? selectedPillar : undefined
    });

    setNewPost('');
    setShowCreatePost(false);
    loadCommunityData();
  };

  const likePost = async (postId: string) => {
    haptics.light();
    await community.likePost(postId);
    loadCommunityData();
  };

  const joinChallenge = async (challengeId: string) => {
    haptics.medium();
    const success = await community.joinChallenge(challengeId, 'currentUser', 'You', '🌟');
    if (success) {
      Alert.alert('Success!', 'You\'ve joined the challenge. Let\'s optimize those neural pathways!');
      loadCommunityData();
    }
  };

  const TabButton = ({ title, icon, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color={isActive ? '#000' : '#666'} />
      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{title}</Text>
    </TouchableOpacity>
  );

  const PostCard = ({ post }) => (
    <GlassPanel style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userAvatar}>{post.avatar}</Text>
          <View>
            <Text style={styles.username}>{post.username}</Text>
            <Text style={styles.postTime}>
              {new Date(post.timestamp).toLocaleDateString()}
            </Text>
          </View>
        </View>
        {post.pillar && (
          <View style={[styles.pillarBadge, { backgroundColor: getPillarColor(post.pillar) }]}>
            <Text style={styles.pillarBadgeText}>{post.pillar}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.postContent}>{post.content}</Text>
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => likePost(post.id)}>
          <Ionicons name="heart" size={20} color={Colors.neonRed} />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble" size={20} color={Colors.neonBlue} />
          <Text style={styles.actionText}>{post.comments.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share" size={20} color={Colors.neonGreen} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </GlassPanel>
  );

  const ChallengeCard = ({ challenge }) => (
    <GlassPanel style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
          <Text style={styles.difficultyText}>{challenge.difficulty.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.challengeDescription}>{challenge.description}</Text>
      
      <View style={styles.challengeStats}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={16} color={Colors.neonBlue} />
          <Text style={styles.statText}>{challenge.participants.length} joined</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="calendar" size={16} color={Colors.neonGreen} />
          <Text style={styles.statText}>{challenge.duration} days</Text>
        </View>
      </View>

      <View style={styles.challengeRewards}>
        <Text style={styles.rewardsTitle}>Rewards:</Text>
        {challenge.rewards.slice(0, 2).map((reward, index) => (
          <View key={index} style={styles.rewardItem}>
            <Text style={styles.rewardIcon}>{getRewardIcon(reward.type)}</Text>
            <Text style={styles.rewardText}>{reward.name}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.joinButton} onPress={() => joinChallenge(challenge.id)}>
        <Text style={styles.joinButtonText}>JOIN CHALLENGE</Text>
      </TouchableOpacity>
    </GlassPanel>
  );

  const LeaderboardCard = ({ entry, index }) => (
    <View style={[styles.leaderboardItem, index < 3 && styles.topThree]}>
      <View style={styles.rankContainer}>
        <Text style={[styles.rank, index < 3 && styles.topRank]}>{entry.rank}</Text>
        {index === 0 && <Ionicons name="trophy" size={16} color={Colors.neonYellow} />}
        {index === 1 && <Ionicons name="medal" size={16} color="#C0C0C0" />}
        {index === 2 && <Ionicons name="medal" size={16} color="#CD7F32" />}
      </View>
      
      <Text style={styles.leaderboardAvatar}>{entry.avatar}</Text>
      <View style={styles.leaderboardInfo}>
        <Text style={styles.leaderboardName}>{entry.username}</Text>
        <Text style={styles.leaderboardScore}>{entry.score} points</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${entry.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{entry.progress}%</Text>
      </View>
    </View>
  );

  const getPillarColor = (pillar: string) => {
    const colors = {
      BODY: Colors.neonRed,
      MIND: Colors.neonBlue,
      HEART: Colors.neonPink,
      SPIRIT: Colors.neonPurple,
      DIET: Colors.neonGreen
    };
    return colors[pillar] || Colors.neonYellow;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: Colors.neonGreen,
      intermediate: Colors.neonYellow,
      advanced: Colors.neonRed
    };
    return colors[difficulty] || Colors.neonBlue;
  };

  const getRewardIcon = (type: string) => {
    const icons = {
      badge: '🏆',
      points: '⭐',
      premium: '💎',
      physical: '🎁'
    };
    return icons[type] || '🎯';
  };

  const renderFeedTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.createPostContainer}>
        <TouchableOpacity style={styles.createPostButton} onPress={() => setShowCreatePost(true)}>
          <Ionicons name="add" size={24} color={Colors.neonGreen} />
          <Text style={styles.createPostText}>Share your neural journey...</Text>
        </TouchableOpacity>
      </View>

      {socialFeed.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </ScrollView>
  );

  const renderChallengesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.challengesHeader}>
        <Text style={styles.sectionTitle}>🏆 Active Neural Challenges</Text>
        <Text style={styles.sectionSubtitle}>Join community challenges and optimize together!</Text>
      </View>

      {challenges.map(challenge => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </ScrollView>
  );

  const renderLeaderboardTab = () => {
    const topChallenge = challenges[0];
    const leaderboard = topChallenge ? community.getLeaderboard(topChallenge.id) : [];

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        <GlassPanel style={styles.leaderboardHeader}>
          <Text style={styles.sectionTitle}>🌟 Global Leaderboard</Text>
          <Text style={styles.sectionSubtitle}>
            {topChallenge ? topChallenge.title : 'Neural Optimization Champions'}
          </Text>
        </GlassPanel>

        {leaderboard.map((entry, index) => (
          <GlassPanel key={entry.userId} style={{ marginBottom: 12 }}>
            <LeaderboardCard entry={entry} index={index} />
          </GlassPanel>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {/* Header */}
        <GlassPanel style={{ marginHorizontal: 16, marginTop: 40 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={Colors.neonGreen} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>NEURAL COMMUNITY</Text>
            <TouchableOpacity>
              <Ionicons name="notifications" size={24} color={Colors.neonBlue} />
            </TouchableOpacity>
          </View>
        </GlassPanel>

        {/* Tab Navigation */}
        <GlassPanel style={{ marginHorizontal: 16, marginTop: 16 }}>
          <View style={styles.tabNavigation}>
            <TabButton
              title="Feed"
              icon="home"
              isActive={activeTab === 'feed'}
              onPress={() => setActiveTab('feed')}
            />
            <TabButton
              title="Challenges"
              icon="trophy"
              isActive={activeTab === 'challenges'}
              onPress={() => setActiveTab('challenges')}
            />
            <TabButton
              title="Leaderboard"
              icon="stats-chart"
              isActive={activeTab === 'leaderboard'}
              onPress={() => setActiveTab('leaderboard')}
            />
          </View>
        </GlassPanel>

        {/* Tab Content */}
        <View style={styles.content}>
          {activeTab === 'feed' && renderFeedTab()}
          {activeTab === 'challenges' && renderChallengesTab()}
          {activeTab === 'leaderboard' && renderLeaderboardTab()}
        </View>

        {/* Create Post Modal */}
        <Modal visible={showCreatePost} animationType="slide" presentationStyle="pageSheet">
          <View style={styles.modalContainer}>
            <GlassPanel style={{ marginTop: 50, marginHorizontal: 16 }}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowCreatePost(false)}>
                  <Ionicons name="close" size={24} color={Colors.neonGreen} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Share Your Journey</Text>
                <TouchableOpacity onPress={createPost}>
                  <Ionicons name="checkmark" size={24} color={Colors.neonGreen} />
                </TouchableOpacity>
              </View>
            </GlassPanel>

            <GlassPanel style={{ margin: 16, padding: 20 }}>
              <TextInput
                style={styles.postInput}
                placeholder="Share your neural optimization journey, tips, or achievements..."
                value={newPost}
                onChangeText={setNewPost}
                multiline
                numberOfLines={4}
              />

              <View style={styles.pillarSelector}>
                <Text style={styles.pillarLabel}>Select Pillar:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {['ALL', 'BODY', 'MIND', 'HEART', 'SPIRIT', 'DIET'].map(pillar => (
                    <TouchableOpacity
                      key={pillar}
                      style={[
                        styles.pillarOption,
                        selectedPillar === pillar && styles.pillarOptionActive,
                        { borderColor: getPillarColor(pillar) }
                      ]}
                      onPress={() => setSelectedPillar(pillar)}
                    >
                      <Text style={[
                        styles.pillarOptionText,
                        selectedPillar === pillar && { color: getPillarColor(pillar) }
                      ]}>
                        {pillar}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </GlassPanel>
          </View>
        </Modal>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neonGreen,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
    letterSpacing: 2,
  },
  tabNavigation: {
    flexDirection: 'row',
    padding: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabButtonActive: {
    backgroundColor: Colors.neonGreen,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  tabTextActive: {
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabContent: {
    flex: 1,
  },
  createPostContainer: {
    marginBottom: 20,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neonGreen,
  },
  createPostText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  postCard: {
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  postTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  pillarBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillarBadgeText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  challengeCard: {
    padding: 20,
    marginBottom: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  challengeRewards: {
    marginBottom: 16,
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.neonBlue,
    marginBottom: 8,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rewardIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  rewardText: {
    fontSize: 14,
    color: '#333',
  },
  joinButton: {
    backgroundColor: Colors.neonGreen,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  leaderboardHeader: {
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neonBlue,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  topThree: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 50,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  topRank: {
    color: Colors.neonYellow,
  },
  leaderboardAvatar: {
    fontSize: 20,
    marginRight: 12,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  leaderboardScore: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressBar: {
    width: 60,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.neonGreen,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  challengesHeader: {
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.surface.secondary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neonGreen,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  postInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  pillarSelector: {
    marginTop: 16,
  },
  pillarLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.neonBlue,
    marginBottom: 12,
  },
  pillarOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  pillarOptionActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  pillarOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});

export default CommunityScreen;
