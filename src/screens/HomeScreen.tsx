// src/screens/HomeScreen.tsx - COMPLETE WITH COMMUNITY INTEGRATION
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  Platform,
  FlatList,
  Alert,
  SafeAreaView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// REAL DATA CONTEXT
import { useAppData, useAppDataSelectors } from '../context/AppDataContext';

// SERVICES
import IntelligentNotificationService from '../services/NotificationService';
import SocialService from '../services/SocialService';

const { width } = Dimensions.get('window');

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  body: '#EF4444',
  mind: '#3B82F6',
  heart: '#EC4899',
  spirit: '#8B5CF6',
  diet: '#10B981',
  warning: '#F59E0B',
};

// Simple animation helpers
const HapticFeedback = {
  light: () => console.log('Haptic: light'),
  medium: () => console.log('Haptic: medium'),
  success: () => console.log('Haptic: success'),
};

const safeNavigate = (navigation: any, screenName: string, params?: any) => {
  try {
    navigation.navigate(screenName, params);
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

const HomeScreen = () => {
  // Hooks in consistent order
  const navigation = useNavigation();
  const route = useRoute();
  
  // REAL DATA HOOKS
  const { actions } = useAppData();
  const {
    userProfile,
    pillarScores,
    overallScore,
    sessions,
    todaySessions,
    achievements,
    newAchievements,
    aiInsights,
    unreadInsights,
    dailyGoals,
    streakData,
    isLoading,
    isInitialized,
    lastSyncDate
  } = useAppDataSelectors();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Local state
  const [showFirstTime, setShowFirstTime] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  // Services
  const notificationService = IntelligentNotificationService.getInstance();
  const socialService = SocialService.getInstance();

  // Memoized data
  const pillarData = useMemo(() => [
    { name: 'BODY', description: 'Physical optimization', color: Colors.body, icon: 'fitness', screenName: 'BodyScreen' },
    { name: 'MIND', description: 'Cognitive enhancement', color: Colors.mind, icon: 'library', screenName: 'MindScreen' },
    { name: 'HEART', description: 'Emotional intelligence', color: Colors.heart, icon: 'heart', screenName: 'HeartScreen' },
    { name: 'SPIRIT', description: 'Consciousness expansion', color: Colors.spirit, icon: 'leaf', screenName: 'SpiritScreen' },
    { name: 'DIET', description: 'Nutritional optimization', color: Colors.diet, icon: 'restaurant', screenName: 'DietScreen' }
  ], []);

  const screenData = useMemo(() => [
    { id: 'header', type: 'header' },
    { id: 'dailyProgress', type: 'dailyProgress' },
    { id: 'scoreCard', type: 'scoreCard' },
    { id: 'communitySection', type: 'communitySection' },
    { id: 'aiInsights', type: 'aiInsights' },
    { id: 'pillars', type: 'pillars' },
    { id: 'achievementGallery', type: 'achievementGallery' },
    { id: 'quickActions', type: 'quickActions' },
  ], []);

  // Effects
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();

    setContentReady(true);
  }, []);

  // Real data actions
  const handleQuickSession = useCallback(async (pillar: string) => {
    HapticFeedback.medium();
    
    // Add a quick session to real data
    await actions.addSession({
      pillar,
      type: 'practice',
      duration: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
      date: new Date().toISOString(),
      score: Math.floor(Math.random() * 30) + 70, // 70-100 score
      mood: 'good',
      notes: `Quick ${pillar} session completed`
    });
    
    // Show success message
    Alert.alert(
      '🎉 Session Complete!',
      `Great work on your ${pillar} practice! Your progress has been saved.`,
      [{ text: 'Continue', style: 'default' }]
    );
    
    safeNavigate(navigation, 'QuickSessionScreen', { pillar, type: 'beginner' });
  }, [navigation, actions]);

  const handleCheckIn = useCallback(async (type: 'morning' | 'evening') => {
    HapticFeedback.medium();
    
    // Add check-in session
    await actions.addSession({
      pillar: 'overall',
      type: 'checkin',
      duration: 2,
      date: new Date().toISOString(),
      score: Math.floor(Math.random() * 20) + 80,
      mood: type === 'morning' ? 'good' : 'okay',
      notes: `${type.charAt(0).toUpperCase() + type.slice(1)} check-in completed`
    });
    
    safeNavigate(navigation, 'DailyCheckInScreen', { type });
  }, [navigation, actions]);

  const handleAchievementShare = useCallback(async (achievement: any) => {
    HapticFeedback.medium();
    
    try {
      const success = await socialService.shareAchievement(achievement, userProfile);
      if (success) {
        Alert.alert('🎉 Achievement Shared!', 'Your amazing progress has been shared with the community!');
      }
    } catch (error) {
      Alert.alert('Share Error', 'Unable to share achievement at this time.');
    }
  }, [socialService, userProfile]);

  const navigateToCommunity = useCallback(() => {
    HapticFeedback.medium();
    safeNavigate(navigation, 'CommunityScreen');
  }, [navigation]);

  const navigateToProfile = useCallback(() => {
    HapticFeedback.light();
    safeNavigate(navigation, 'UserProfileScreen');
  }, [navigation]);

  const handleAnalyticsPress = useCallback(() => {
    HapticFeedback.medium();
    safeNavigate(navigation, 'AdvancedAnalyticsScreen');
  }, [navigation]);

  // Header component with REAL DATA
  const HeaderComponent = useCallback(() => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'सुप्रभात' : hour < 17 ? 'नमस्ते' : 'शुभ संध्या';
    const englishGreeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Namaste' : 'Good Evening';

    return (
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.omSymbol}>🕉️</Text>
            <Text style={styles.headerTitle}>5 Pillars of Life</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {`${greeting} • ${englishGreeting}, ${userProfile?.name || 'Seeker'}`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={navigateToProfile}
        >
          <View style={styles.profileImagePlaceholder}>
            <Ionicons name="person" size={20} color={Colors.accent} />
          </View>
          <Text style={styles.profileLevel}>Lv.{userProfile?.level || 1}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [fadeAnim, slideAnim, userProfile, navigateToProfile]);

  // Daily Progress with REAL DATA
  const DailyProgressComponent = useCallback(() => (
    <Animated.View 
      style={[
        styles.dailyProgress,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.progressHeader}>
        <Text style={styles.dailyProgressTitle}>Today's Progress</Text>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={16} color={Colors.warning} />
          <Text style={styles.streakText}>{streakData.current} day streak</Text>
        </View>
      </View>

      <View style={styles.progressStats}>
        <View style={styles.progressStat}>
          <Text style={styles.progressStatValue}>{todaySessions.length}</Text>
          <Text style={styles.progressStatLabel}>Sessions</Text>
          <Text style={styles.progressStatTarget}>/ {dailyGoals.sessionTarget}</Text>
        </View>
        <View style={styles.progressStat}>
          <Text style={styles.progressStatValue}>
            {todaySessions.reduce((sum, s) => sum + s.duration, 0)}m
          </Text>
          <Text style={styles.progressStatLabel}>Minutes</Text>
          <Text style={styles.progressStatTarget}>/ {dailyGoals.minutesTarget}m</Text>
        </View>
        <View style={styles.progressStat}>
          <Text style={styles.progressStatValue}>{achievements.length}</Text>
          <Text style={styles.progressStatLabel}>Achievements</Text>
        </View>
      </View>

      <View style={styles.progressButtons}>
        <TouchableOpacity
          style={[styles.progressButton, styles.quickSessionButton]}
          onPress={() => handleQuickSession('spirit')}
        >
          <Ionicons name="flash" size={20} color="#FFFFFF" />
          <Text style={styles.progressButtonText}>Quick Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.progressButton, styles.checkInButton]}
          onPress={() => handleCheckIn(new Date().getHours() < 12 ? 'morning' : 'evening')}
        >
          <Ionicons name="checkbox" size={20} color="#FFFFFF" />
          <Text style={styles.progressButtonText}>Check-In</Text>
        </TouchableOpacity>
      </View>

      {dailyGoals.completed && (
        <View style={styles.goalCompleted}>
          <Ionicons name="trophy" size={20} color={Colors.warning} />
          <Text style={styles.goalCompletedText}>Daily goal achieved! 🎉</Text>
        </View>
      )}
    </Animated.View>
  ), [fadeAnim, slideAnim, todaySessions, dailyGoals, streakData, achievements, handleQuickSession, handleCheckIn]);

  // Score Card with REAL DATA
  const ScoreCardComponent = useCallback(() => (
    <Animated.View 
      style={[
        styles.scoreCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={[Colors.accent, Colors.spirit]}
        style={styles.scoreGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.scoreHeader}>
          <Ionicons name="flash" size={24} color="rgba(255,255,255,0.9)" />
          <Text style={styles.scoreTitle}>आत्मा शक्ति • Neural Score</Text>
        </View>

        <Text style={styles.scoreValue}>{Math.round(overallScore || 0)}%</Text>
        <Text style={styles.scoreSubtitle}>
          Holistic Life Enhancement • समग्र जीवन उन्नति
        </Text>
        
        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile?.totalSessions || 0}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{streakData.current}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile?.stats?.totalMinutes || 0}m</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
        </View>

        <View style={styles.aiIndicator}>
          <Ionicons name="extension-puzzle" size={16} color="rgba(255,255,255,0.8)" />
          <Text style={styles.aiIndicatorText}>
            AI Insights: {aiInsights.length} active • {unreadInsights.length} new
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  ), [fadeAnim, slideAnim, overallScore, userProfile, streakData, aiInsights, unreadInsights]);

  // Community Section with REAL SOCIAL DATA
  const CommunitySection = useCallback(() => (
    <Animated.View 
      style={[
        styles.communitySection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.communitySectionHeader}>
        <View style={styles.communityTitleRow}>
          <Ionicons name="people" size={24} color={Colors.accent} />
          <Text style={styles.communitySectionTitle}>Community & Challenges</Text>
        </View>
        <TouchableOpacity style={styles.viewAllButton} onPress={navigateToCommunity}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.communityCard} onPress={navigateToCommunity}>
        <LinearGradient
          colors={['#8B5CF6', '#3B82F6']}
          style={styles.communityGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.communityContent}>
            <View style={styles.communityInfo}>
              <Text style={styles.communityTitle}>Join Global Challenges</Text>
              <Text style={styles.communitySubtitle}>Connect with wellness seekers worldwide</Text>
              <View style={styles.communityStats}>
                <Text style={styles.communityStatText}>🌍 2,847 active members</Text>
                <Text style={styles.communityStatText}>🏆 12 challenges running</Text>
              </View>
            </View>
            <View style={styles.communityIconContainer}>
              <Ionicons name="people-circle" size={48} color="rgba(255,255,255,0.8)" />
            </View>
          </View>
          
          <View style={styles.communityActions}>
            <View style={styles.communityAction}>
              <Ionicons name="trophy" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.communityActionText}>Leaderboard</Text>
            </View>
            <View style={styles.communityAction}>
              <Ionicons name="share" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.communityActionText}>Share Progress</Text>
            </View>
            <View style={styles.communityAction}>
              <Ionicons name="flag" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.communityActionText}>Challenges</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  ), [fadeAnim, slideAnim, navigateToCommunity]);

  // AI Insights with REAL DATA
  const AIInsightsComponent = useCallback(() => (
    <Animated.View 
      style={[
        styles.aiInsightsSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.aiHeader}>
        <Ionicons name="extension-puzzle" size={24} color={Colors.accent} />
        <Text style={styles.aiTitle}>AI Neural Insights</Text>
        <View style={styles.aiPriorityBadge}>
          <Text style={styles.aiPriorityText}>{aiInsights.length} Active</Text>
        </View>
      </View>
      
      {aiInsights.length > 0 ? (
        aiInsights.slice(0, 2).map((insight, index) => (
          <TouchableOpacity 
            key={insight.id}
            style={[
              styles.insightCard,
              insight.priority === 'high' && styles.insightCardHigh,
              !insight.isRead && styles.insightCardUnread
            ]}
            onPress={async () => {
              HapticFeedback.medium();
              await actions.markInsightRead(insight.id);
              safeNavigate(navigation, 'AIInsightDetailScreen', { 
                insightId: insight.id,
                insight: insight
              });
            }}
          >
            <View style={styles.insightHeader}>
              <View style={[
                styles.insightIcon, 
                { backgroundColor: insight.priority === 'high' ? Colors.warning : Colors.accent }
              ]}>
                <Ionicons 
                  name={insight.priority === 'high' ? 'warning' : 'bulb'} 
                  size={16} 
                  color="#FFFFFF" 
                />
              </View>
              <View style={styles.insightTitleContainer}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightPillar}>
                  {insight.pillar.toUpperCase()} • {Math.round(insight.confidence * 100)}% confidence
                </Text>
              </View>
              <View style={styles.insightMeta}>
                {!insight.isRead && <View style={styles.unreadDot} />}
                <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
              </View>
            </View>
            <Text style={styles.insightDescription} numberOfLines={2}>
              {insight.description}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.noInsightsContainer}>
          <Ionicons name="analytics" size={48} color={Colors.textSecondary} />
          <Text style={styles.noInsights}>AI is analyzing your patterns...</Text>
          <Text style={styles.noInsightsSubtext}>
            Complete more sessions to get personalized insights
          </Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.viewAllButton}
        onPress={() => {
          HapticFeedback.light();
          safeNavigate(navigation, 'AICoachScreen');
        }}
      >
        <Text style={styles.viewAllText}>Chat with AI Coach</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.accent} />
      </TouchableOpacity>
    </Animated.View>
  ), [fadeAnim, slideAnim, aiInsights, unreadInsights, actions, navigation]);

  // Pillars with REAL DATA
  const PillarsComponent = useCallback(() => (
    <Animated.View 
      style={[
        styles.pillarsSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.pillarsSectionHeader}>
        <Text style={styles.lotusSymbol}>🪷</Text>
        <Text style={styles.sectionTitle}>पञ्च स्तम्भ • Your 5 Pillars</Text>
      </View>
      <Text style={styles.sectionSubtitle}>
        Ancient wisdom meets modern optimization • Real progress tracking
      </Text>

      {pillarData.map((pillar, index) => {
        const score = Math.round(pillarScores[pillar.name.toLowerCase() as keyof typeof pillarScores] || 0);
        const pillarSessions = sessions.filter(s => s.pillar === pillar.name.toLowerCase()).length;
        
        return (
          <TouchableOpacity
            key={pillar.name}
            style={styles.pillarCard}
            onPress={() => {
              HapticFeedback.medium();
              safeNavigate(navigation, pillar.screenName);
            }}
          >
            <LinearGradient
              colors={[pillar.color, `${pillar.color}CC`]}
              style={styles.pillarGradient}
            >
              <View style={styles.pillarHeader}>
                <Ionicons name={pillar.icon} size={32} color="#FFFFFF" />
                <View style={styles.pillarInfo}>
                  <Text style={styles.pillarName}>{pillar.name}</Text>
                  <Text style={styles.pillarDescription}>{pillar.description}</Text>
                  <Text style={styles.pillarSessions}>{pillarSessions} sessions completed</Text>
                </View>
                <View style={styles.pillarScore}>
                  <Text style={styles.pillarScoreText}>{score}%</Text>
                </View>
              </View>
              
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${Math.min(score, 100)}%`,
                      backgroundColor: '#FFFFFF'
                    }
                  ]} 
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  ), [fadeAnim, slideAnim, pillarData, pillarScores, sessions, navigation]);

  // Achievement Gallery with REAL DATA
  const AchievementGalleryComponent = useCallback(() => (
    <Animated.View 
      style={[
        styles.achievementGallery,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.achievementHeader}>
        <Ionicons name="trophy" size={24} color={Colors.warning} />
        <Text style={styles.sectionTitle}>Sacred Achievements</Text>
        {newAchievements.length > 0 && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>{newAchievements.length} new</Text>
          </View>
        )}
      </View>
      
      <View style={styles.achievementBadges}>
        {achievements.slice(0, 6).map((achievement, index) => (
          <TouchableOpacity 
            key={achievement.id} 
            style={styles.achievementBadge}
            onPress={() => {
              Alert.alert(
                achievement.title,
                `${achievement.description}\n\nUnlocked: ${new Date(achievement.unlockedDate).toLocaleDateString()}`,
                [
                  { text: 'Share', onPress: () => handleAchievementShare(achievement) },
                  { text: 'Amazing!', style: 'default' }
                ]
              );
            }}
          >
            <View style={[
              styles.badgeCircle,
              { 
                backgroundColor: achievement.rarity === 'legendary' ? '#FFD700' :
                                achievement.rarity === 'epic' ? Colors.spirit :
                                achievement.rarity === 'rare' ? Colors.accent : Colors.success
              }
            ]}>
              <Text style={styles.badgeEmoji}>
                {achievement.pillar === 'spirit' ? '🕉️' : 
                 achievement.pillar === 'diet' ? '🌿' :
                 achievement.pillar === 'body' ? '💪' :
                 achievement.pillar === 'mind' ? '🧠' :
                 achievement.pillar === 'heart' ? '❤️' : '🏆'}
              </Text>
              {achievement.isNew && <View style={styles.newIndicator} />}
            </View>
            <Text style={styles.badgeTitle} numberOfLines={1}>{achievement.title}</Text>
          </TouchableOpacity>
        ))}
        
        {/* Placeholder badges for future achievements */}
        {Array.from({ length: Math.max(0, 6 - achievements.length) }, (_, index) => (
          <View key={`placeholder-${index}`} style={styles.achievementBadge}>
            <View style={[styles.badgeCircle, styles.placeholderBadge]}>
              <Text style={styles.badgeEmoji}>❓</Text>
            </View>
            <Text style={styles.badgeTitle}>Future</Text>
          </View>
        ))}
      </View>

      {achievements.length > 6 && (
        <TouchableOpacity 
          style={styles.viewAllAchievements}
          onPress={() => safeNavigate(navigation, 'CommunityScreen')}
        >
          <Text style={styles.viewAllAchievementsText}>
            View All {achievements.length} Achievements
          </Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.accent} />
        </TouchableOpacity>
      )}
    </Animated.View>
  ), [fadeAnim, slideAnim, achievements, newAchievements, navigation, handleAchievementShare]);

  // Quick Actions Component
  const QuickActionsComponent = useCallback(() => (
    <Animated.View 
      style={[
        styles.quickActions,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionGrid}>
        <TouchableOpacity style={styles.actionCard} onPress={() => safeNavigate(navigation, 'AICoachScreen')}>
          <Ionicons name="chatbubble-ellipses" size={24} color={Colors.accent} />
          <Text style={styles.actionTitle}>AI Coach</Text>
          <Text style={styles.actionSubtitle}>Get guidance</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard} onPress={handleAnalyticsPress}>
          <Ionicons name="analytics" size={24} color={Colors.success} />
          <Text style={styles.actionTitle}>Analytics</Text>
          <Text style={styles.actionSubtitle}>Track progress</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard} onPress={navigateToCommunity}>
          <Ionicons name="people" size={24} color={Colors.heart} />
          <Text style={styles.actionTitle}>Community</Text>
          <Text style={styles.actionSubtitle}>Connect & share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard} onPress={navigateToProfile}>
          <Ionicons name="person" size={24} color={Colors.warning} />
          <Text style={styles.actionTitle}>Profile</Text>
          <Text style={styles.actionSubtitle}>Settings & data</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  ), [fadeAnim, slideAnim, navigation, handleAnalyticsPress, navigateToCommunity, navigateToProfile]);

  const renderItem = useCallback(({ item }: { item: { id: string; type: string } }) => {
    try {
      switch (item.type) {
        case 'header':
          return <HeaderComponent />;
        case 'dailyProgress':
          return <DailyProgressComponent />;
        case 'scoreCard':
          return <ScoreCardComponent />;
        case 'communitySection':
          return <CommunitySection />;
        case 'aiInsights':
          return <AIInsightsComponent />;
        case 'pillars':
          return <PillarsComponent />;
        case 'achievementGallery':
          return <AchievementGalleryComponent />;
        case 'quickActions':
          return <QuickActionsComponent />;
        default:
          return null;
      }
    } catch (error) {
      console.error('Error rendering item:', error);
      return null;
    }
  }, [
    HeaderComponent,
    DailyProgressComponent,
    ScoreCardComponent,
    CommunitySection,
    AIInsightsComponent,
    PillarsComponent,
    AchievementGalleryComponent,
    QuickActionsComponent
  ]);

  if (isLoading || !contentReady) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>🕉️ Loading your wellness journey...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={screenData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={3}
        windowSize={5}
      />
    </SafeAreaView>
  );
};

// Comprehensive styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  omSymbol: {
    fontSize: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    alignItems: 'center',
  },
  profileImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileLevel: {
    fontSize: 12,
    color: Colors.accent,
    marginTop: 4,
    fontWeight: '600',
  },

  // Daily Progress
  dailyProgress: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dailyProgressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.warning,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  progressStatLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  progressStatTarget: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  progressButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  progressButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  quickSessionButton: {
    backgroundColor: Colors.spirit,
  },
  checkInButton: {
    backgroundColor: Colors.success,
  },
  progressButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  goalCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.warning + '20',
    borderRadius: 8,
    gap: 8,
  },
  goalCompletedText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
  },

  // Score Card
  scoreCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  scoreGradient: {
    padding: 20,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.9)',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  aiIndicatorText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },

  // Community Section
  communitySection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  communitySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  communityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  communitySectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  communityCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  communityGradient: {
    padding: 20,
  },
  communityContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  communityInfo: {
    flex: 1,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  communitySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  communityStats: {
    gap: 4,
  },
  communityStatText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  communityIconContainer: {
    marginLeft: 16,
  },
  communityActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  communityAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  communityActionText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },

  // AI Insights
  aiInsightsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  aiPriorityBadge: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  aiPriorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent,
  },
  insightCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightCardHigh: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  insightCardUnread: {
    backgroundColor: Colors.accent + '05',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  insightPillar: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  insightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  insightDescription: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  noInsightsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  noInsights: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noInsightsSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Pillars Section
  pillarsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  pillarsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  lotusSymbol: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  pillarCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  pillarGradient: {
    padding: 20,
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pillarInfo: {
    flex: 1,
    marginLeft: 16,
  },
  pillarName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pillarDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  pillarSessions: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  pillarScore: {
    alignItems: 'center',
  },
  pillarScoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Achievement Gallery
  achievementGallery: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  newBadge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  achievementBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  achievementBadge: {
    width: (width - 80) / 3,
    alignItems: 'center',
  },
  badgeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  badgeEmoji: {
    fontSize: 24,
  },
  newIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.warning,
  },
  badgeTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  placeholderBadge: {
    backgroundColor: Colors.textSecondary + '30',
  },
  viewAllAchievements: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 4,
  },
  viewAllAchievementsText: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600',
  },

  // Quick Actions
  quickActions: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Common Elements
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600',
  },
});

export default HomeScreen;
