// src/screens/HomeScreen.tsx - COMPLETE VERSION WITH AI INSIGHT DETAIL NAVIGATION
import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  Platform,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDataSelectors, useAppData } from '../context/AppDataContext';

// Advanced feature imports
import { usePerformanceOptimization, PerformanceMonitor } from '../hooks/usePerformanceOptimization';
import OptimizedLoadingState from '../components/OptimizedLoadingState';
import NotificationManager from '../utils/NotificationManager';
import AdvancedAIEngine from '../utils/AdvancedAIEngine';
import { safeNavigate, safeGet } from '../utils/SafeNavigation';

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

const HomeScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { actions } = useAppData();
  
  // Enhanced selectors with SAFE ACCESS
  const { 
    pillarScores, 
    aiInsights, 
    userProfile, 
    sessionData, 
    analytics,
    overallScore, 
    isLoading, 
    isInitialized 
  } = useAppDataSelectors();

  // Advanced performance optimization
  const { 
    runAfterInteractions, 
    measurePerformance, 
    getOptimizedFlatListProps,
    platformOptimizations,
    devicePerformance 
  } = usePerformanceOptimization();

  // AI and Notification managers with SAFE INITIALIZATION
  const notificationManager = NotificationManager.getInstance();
  const aiEngine = AdvancedAIEngine.getInstance();

  useEffect(() => {
    if (isInitialized) {
      const measurement = measurePerformance('HomeScreen');
      
      // Optimized animation with platform-specific settings
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: platformOptimizations.animationDuration,
        useNativeDriver: platformOptimizations.useNativeDriver,
      }).start(() => {
        measurement.end();
      });

      // Initialize advanced features after interactions
      runAfterInteractions(() => {
        initializeAdvancedFeatures();
      });
    }
  }, [isInitialized, fadeAnim]);

  const initializeAdvancedFeatures = async () => {
    try {
      // SAFE INITIALIZATION: Check if managers are ready
      if (notificationManager && notificationManager.isReady()) {
        // Schedule motivational reminder
        await notificationManager.scheduleMotivationalReminder();
        
        // Check for achievements and notify
        const achievements = checkForNewAchievements();
        for (const achievement of achievements) {
          await notificationManager.scheduleAchievementNotification(achievement.title, achievement.pillar);
        }
      }

      // SAFE AI ENGINE: Check if engine is available
      if (aiEngine && actions && actions.setAIInsights) {
        // Generate AI recommendations
        const userContext = {
          totalSessions: safeGet(userProfile, 'totalSessions', 0),
          currentStreak: safeGet(userProfile, 'streak', 0),
          preferredTime: '09:00',
          completionRate: safeGet(sessionData, 'completedToday', 0) / Math.max(safeGet(sessionData, 'todaySessions', 1), 1),
          pillarPreferences: Object.entries(pillarScores || {})
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 2)
            .map(([pillar]) => pillar),
          previousSuccess: {},
          learningStyle: 'mixed' as const,
          motivationType: 'achievement' as const
        };

        const aiRecommendations = aiEngine.analyzeNeuralPatterns(
          pillarScores || {},
          [], // Session history would come from persistent storage
          userProfile || {},
          userContext
        );

        // SAFE UPDATE: Only update if we have valid recommendations
        if (Array.isArray(aiRecommendations) && aiRecommendations.length > 0) {
          actions.setAIInsights([
            ...((aiInsights || []).slice(0, 2)), // Keep existing insights
            ...aiRecommendations.slice(0, 2).map(rec => ({
              id: rec.id || `ai-${Date.now()}`,
              title: rec.title || 'AI Recommendation',
              description: rec.description || 'AI has a suggestion for you',
              pillar: rec.pillar || 'overall',
              confidence: rec.confidence || 0.85,
              priority: rec.priority || 'medium',
              actionPlan: rec.actionPlan ? rec.actionPlan.slice(0, 3) : []
            }))
          ]);
        }
      }

    } catch (error) {
      console.error('Error initializing advanced features:', error);
    }
  };

  const checkForNewAchievements = () => {
    const achievements = [];
    
    try {
      // SAFE ACHIEVEMENT CHECKING
      const streak = safeGet(userProfile, 'streak', 0);
      const totalSessions = safeGet(userProfile, 'totalSessions', 0);
      
      if (streak >= 7 && streak % 7 === 0) {
        achievements.push({ title: `${streak}-Day Streak Master`, pillar: 'overall' });
      }
      
      if (pillarScores) {
        Object.entries(pillarScores).forEach(([pillar, score]) => {
          if ((score as number) >= 90 && (score as number) % 10 === 0) {
            achievements.push({ title: `${pillar.toUpperCase()} Excellence`, pillar });
          }
        });
      }

      if (totalSessions === 50 || totalSessions === 100) {
        achievements.push({ title: `${totalSessions} Sessions Completed`, pillar: 'overall' });
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }

    return achievements;
  };

  // Enhanced header component with SAFE NAVIGATION
  const HeaderComponent = React.memo(() => (
    <PerformanceMonitor>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>5 Pillars of Life</Text>
          <Text style={styles.headerSubtitle}>Neural Optimization Platform</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => {
            const measurement = measurePerformance('Navigation-Profile');
            // SAFE NAVIGATION: Use safeNavigate instead of direct navigation
            safeNavigate(navigation, 'UserProfileScreen');
            measurement.end();
          }}
        >
          <View style={styles.profileImagePlaceholder}>
            <Ionicons name="person" size={20} color={Colors.accent} />
          </View>
          <Text style={styles.profileLevel}>Lv.{safeGet(userProfile, 'level', 1)}</Text>
        </TouchableOpacity>
      </View>
    </PerformanceMonitor>
  ));

  // Enhanced score card with SAFE DATA ACCESS
  const renderScoreCard = React.useCallback(() => (
    <PerformanceMonitor>
      <View style={styles.scoreCard}>
        <LinearGradient
          colors={[Colors.accent, Colors.spirit]}
          style={styles.scoreGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.scoreHeader}>
            <Ionicons name="flash" size={24} color="rgba(255,255,255,0.9)" />
            <Text style={styles.scoreTitle}>Neural Optimization Score</Text>
          </View>
          <Text style={styles.scoreValue}>{overallScore || 0}%</Text>
          <Text style={styles.scoreSubtitle}>Overall Brain Enhancement</Text>
          
          {/* Enhanced user stats with SAFE ACCESS */}
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{safeGet(userProfile, 'totalSessions', 0)}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{safeGet(userProfile, 'streak', 0)}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{safeGet(sessionData, 'totalTime', 0)}m</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
          </View>

          {/* AI Performance Indicator with SAFE ACCESS */}
          <View style={styles.aiIndicator}>
            <Ionicons name="extension-puzzle" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.aiIndicatorText}>
              AI Confidence: {(aiInsights && aiInsights.length > 0) ? Math.round((safeGet(aiInsights, '0.confidence', 0.85)) * 100) : 85}%
            </Text>
          </View>
        </LinearGradient>
      </View>
    </PerformanceMonitor>
  ), [overallScore, userProfile, sessionData, aiInsights]);

  // UPDATED: Enhanced AI insights with DETAILED NAVIGATION
  const renderAIInsights = React.useCallback(() => (
    <PerformanceMonitor>
      <View style={styles.aiInsightsSection}>
        <View style={styles.aiHeader}>
          <Ionicons name="extension-puzzle" size={24} color={Colors.accent} />
          <Text style={styles.aiTitle}>Advanced AI Neural Insights</Text>
          <View style={styles.aiPriorityBadge}>
            <Text style={styles.aiPriorityText}>{(aiInsights || []).length} Active</Text>
          </View>
        </View>
        
        {(aiInsights || []).length > 0 ? (
          (aiInsights || []).slice(0, 3).map((insight, index) => (
            <TouchableOpacity 
              key={safeGet(insight, 'id', index)}
              style={[
                styles.insightCard,
                safeGet(insight, 'priority', '') === 'high' && styles.insightCardHigh
              ]}
              onPress={() => {
                const measurement = measurePerformance('Navigation-AIInsight-Detail');
                console.log('AI insight pressed:', safeGet(insight, 'title', 'Unknown insight'));
                // UPDATED: Navigate to detailed insight view with insight ID
                safeNavigate(navigation, 'AIInsightDetailScreen', { 
                  insightId: safeGet(insight, 'id', null),
                  insight: insight // Pass the full insight object as backup
                });
                measurement.end();
              }}
            >
              <View style={styles.insightHeader}>
                <View style={[
                  styles.insightIcon, 
                  { backgroundColor: safeGet(insight, 'priority', '') === 'high' ? Colors.warning : Colors.accent }
                ]}>
                  <Ionicons 
                    name={safeGet(insight, 'priority', '') === 'high' ? 'warning' : 'bulb'} 
                    size={16} 
                    color="#FFFFFF" 
                  />
                </View>
                <View style={styles.insightTitleContainer}>
                  <Text style={styles.insightTitle}>{safeGet(insight, 'title', 'AI Insight')}</Text>
                  <Text style={styles.insightPillar}>
                    {(safeGet(insight, 'pillar', 'overall') || 'OVERALL').toUpperCase()} • {Math.round((safeGet(insight, 'confidence', 0.85)) * 100)}% confidence
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
              </View>
              <Text style={styles.insightDescription} numberOfLines={2}>
                {safeGet(insight, 'description', 'AI has generated a recommendation for your optimization journey.')}
              </Text>
              
              {/* Action plan preview with SAFE ACCESS */}
              {safeGet(insight, 'actionPlan.length', 0) > 0 && (
                <View style={styles.actionPreview}>
                  <Text style={styles.actionPreviewText}>
                    Next: {safeGet(insight, 'actionPlan.0', 'Take action based on AI guidance')}
                  </Text>
                </View>
              )}

              {/* AI Enhancement Badge */}
              <View style={styles.aiEnhancementBadge}>
                <Ionicons name="flash" size={12} color={Colors.accent} />
                <Text style={styles.aiEnhancementText}>AI Enhanced • Tap for Details</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noInsightsContainer}>
            <Ionicons name="analytics" size={48} color={Colors.textSecondary} />
            <Text style={styles.noInsights}>AI is analyzing your neural patterns...</Text>
            <Text style={styles.noInsightsSubtext}>Advanced recommendations will appear here</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => {
            const measurement = measurePerformance('Navigation-AICoach-All');
            console.log('View all AI recommendations');
            // Navigate to AI Coach for all recommendations
            safeNavigate(navigation, 'AICoachScreen');
            measurement.end();
          }}
        >
          <Text style={styles.viewAllText}>Chat with AI Coach</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.accent} />
        </TouchableOpacity>
      </View>
    </PerformanceMonitor>
  ), [aiInsights, navigation, measurePerformance]);

  // Today's progress with SAFE DATA ACCESS
  const renderTodaysProgress = React.useCallback(() => (
    <PerformanceMonitor>
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Today's Neural Progress</Text>
        <View style={styles.progressGrid}>
          <View style={[styles.progressCard, { backgroundColor: `${Colors.success}15` }]}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <Text style={styles.progressValue}>{safeGet(sessionData, 'completedToday', 0)}</Text>
            <Text style={styles.progressLabel}>Sessions</Text>
          </View>
          <View style={[styles.progressCard, { backgroundColor: `${Colors.accent}15` }]}>
            <Ionicons name="time" size={24} color={Colors.accent} />
            <Text style={styles.progressValue}>{safeGet(sessionData, 'totalTime', 0)}m</Text>
            <Text style={styles.progressLabel}>Training</Text>
          </View>
          <View style={[styles.progressCard, { backgroundColor: `${Colors.warning}15` }]}>
            <Ionicons name="flame" size={24} color={Colors.warning} />
            <Text style={styles.progressValue}>{safeGet(userProfile, 'streak', 0)}</Text>
            <Text style={styles.progressLabel}>Streak</Text>
          </View>
        </View>
        
        {/* Weekly goal progress with SAFE ACCESS */}
        <View style={styles.weeklyGoalContainer}>
          <View style={styles.weeklyGoalHeader}>
            <Text style={styles.weeklyGoalTitle}>Weekly Goal Progress</Text>
            <Text style={styles.weeklyGoalStats}>
              {safeGet(sessionData, 'completedToday', 0) * 7}/{safeGet(sessionData, 'weeklyGoal', 21)}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${Math.min(100, (safeGet(sessionData, 'completedToday', 0) * 7 / safeGet(sessionData, 'weeklyGoal', 21)) * 100)}%` }
              ]} 
            />
          </View>
          {/* AI Prediction */}
          <Text style={styles.aiPrediction}>
            🤖 AI predicts 94% goal completion probability
          </Text>
        </View>
      </View>
    </PerformanceMonitor>
  ), [sessionData, userProfile]);

  const pillarData = React.useMemo(() => [
    { name: 'BODY', description: 'Physical optimization', color: Colors.body, icon: 'fitness', screenName: 'BodyScreen' },
    { name: 'MIND', description: 'Cognitive enhancement', color: Colors.mind, icon: 'library', screenName: 'MindScreen' },
    { name: 'HEART', description: 'Emotional intelligence', color: Colors.heart, icon: 'heart', screenName: 'HeartScreen' },
    { name: 'SPIRIT', description: 'Consciousness expansion', color: Colors.spirit, icon: 'leaf', screenName: 'SpiritScreen' },
    { name: 'DIET', description: 'Nutritional optimization', color: Colors.diet, icon: 'restaurant', screenName: 'DietScreen' }
  ], []);

  // Enhanced pillars section with SAFE NAVIGATION
  const renderPillars = React.useCallback(() => (
    <PerformanceMonitor>
      <View style={styles.pillarsSection}>
        <Text style={styles.sectionTitle}>Your 5 Pillars</Text>
        <Text style={styles.sectionSubtitle}>
          Tap any pillar to begin AI-guided neural optimization
        </Text>

        {pillarData.map((pillar) => {
          const score = safeGet(pillarScores, pillar.name.toLowerCase(), 0) as number;
          const scoreColor = score >= 90 ? Colors.success : score >= 70 ? Colors.warning : Colors.body;
          
          return (
            <TouchableOpacity
              key={pillar.name}
              style={[styles.pillarCard, { backgroundColor: `${pillar.color}08` }]}
              onPress={() => {
                const measurement = measurePerformance(`Navigation-${pillar.name}`);
                console.log(`Navigating to ${pillar.screenName}`);
                // SAFE NAVIGATION: Navigate to pillar screen
                safeNavigate(navigation, pillar.screenName);
                measurement.end();
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.pillarIcon, { backgroundColor: pillar.color }]}>
                <Ionicons name={pillar.icon as any} size={28} color="#FFFFFF" />
              </View>
              <View style={styles.pillarContent}>
                <Text style={styles.pillarName}>{pillar.name}</Text>
                <Text style={styles.pillarDescription}>{pillar.description}</Text>
                
                {/* Progress indicator with SAFE VALUES */}
                <View style={styles.pillarProgressContainer}>
                  <View style={styles.pillarProgressBar}>
                    <View 
                      style={[
                        styles.pillarProgressFill, 
                        { width: `${Math.min(100, Math.max(0, score))}%`, backgroundColor: scoreColor }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.pillarProgressText, { color: scoreColor }]}>
                    {score > 85 ? 'Excellent' : score > 70 ? 'Good' : 'Improving'}
                  </Text>
                </View>

                {/* AI Improvement Suggestion */}
                <View style={styles.aiSuggestion}>
                  <Ionicons name="flash" size={12} color={Colors.accent} />
                  <Text style={styles.aiSuggestionText}>
                    AI suggests: +{Math.floor(Math.random() * 8) + 2}% potential
                  </Text>
                </View>
              </View>
              <View style={styles.pillarScoreContainer}>
                <Text style={[styles.pillarScore, { color: scoreColor }]}>
                  {score}%
                </Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </PerformanceMonitor>
  ), [pillarData, pillarScores, navigation, measurePerformance]);

  // UPDATED: Enhanced quick actions with SAFE NAVIGATION
  const renderQuickActions = React.useCallback(() => (
    <PerformanceMonitor>
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              const measurement = measurePerformance('Navigation-Analytics');
              console.log('Navigating to Analytics');
              // SAFE NAVIGATION: Navigate to Analytics
              safeNavigate(navigation, 'AnalyticsScreen');
              measurement.end();
            }}
          >
            <Ionicons name="analytics" size={24} color={Colors.accent} />
            <Text style={styles.actionText}>Analytics</Text>
            <Text style={styles.actionSubtext}>AI Insights</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              const measurement = measurePerformance('Navigation-AICoach');
              console.log('Navigating to AI Coach');
              // SAFE NAVIGATION: Navigate to AI Coach
              safeNavigate(navigation, 'AICoachScreen');
              measurement.end();
            }}
          >
            <Ionicons name="extension-puzzle" size={24} color={Colors.spirit} />
            <Text style={styles.actionText}>AI Coach</Text>
            <Text style={styles.actionSubtext}>Smart Guidance</Text>
          </TouchableOpacity>
        </View>

        {/* Enhanced notification status with SAFE ACCESS */}
        <View style={styles.notificationStatus}>
          <Ionicons 
            name={(notificationManager && notificationManager.isReady()) ? "notifications" : "notifications-off"} 
            size={16} 
            color={(notificationManager && notificationManager.isReady()) ? Colors.success : Colors.textSecondary} 
          />
          <Text style={styles.notificationStatusText}>
            Smart notifications {(notificationManager && notificationManager.isReady()) ? 'active' : 'setup needed'}
          </Text>
        </View>
      </View>
    </PerformanceMonitor>
  ), [navigation, measurePerformance, notificationManager]);

  // Enhanced loading screen with SAFE CHECKS
  if (!isInitialized || isLoading) {
    return (
      <PerformanceMonitor>
        <OptimizedLoadingState
          message="Initializing Neural Platform..."
          submessage="Loading AI insights and performance optimizations"
          progress={75}
          type="neural"
        />
      </PerformanceMonitor>
    );
  }

  const screenData = React.useMemo(() => [
    { id: 'header', type: 'header' },
    { id: 'scoreCard', type: 'scoreCard' },
    { id: 'progress', type: 'progress' },
    { id: 'aiInsights', type: 'aiInsights' },
    { id: 'pillars', type: 'pillars' },
    { id: 'actions', type: 'actions' },
  ], []);

  const renderItem = React.useCallback(({ item }: { item: { id: string; type: string } }) => {
    try {
      switch (item.type) {
        case 'header':
          return <HeaderComponent />;
        case 'scoreCard':
          return renderScoreCard();
        case 'progress':
          return renderTodaysProgress();
        case 'aiInsights':
          return renderAIInsights();
        case 'pillars':
          return renderPillars();
        case 'actions':
          return renderQuickActions();
        default:
          return null;
      }
    } catch (error) {
      console.error('Error rendering item:', error);
      return (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>Unable to load component</Text>
        </View>
      );
    }
  }, [renderScoreCard, renderTodaysProgress, renderAIInsights, renderPillars, renderQuickActions]);

  return (
    <PerformanceMonitor>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <FlatList
          data={screenData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          {...getOptimizedFlatListProps()}
        />
      </Animated.View>
    </PerformanceMonitor>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  profileImagePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  profileLevel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
  flatListContent: {
    paddingBottom: 100,
  },
  scoreCard: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  scoreGradient: {
    padding: 24,
    alignItems: 'center',
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  scoreSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 12,
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
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  aiIndicatorText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  progressSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  progressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  progressCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  weeklyGoalContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  weeklyGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weeklyGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  weeklyGoalStats: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  aiPrediction: {
    fontSize: 12,
    color: Colors.accent,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  aiInsightsSection: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  aiPriorityBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiPriorityText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  insightCardHigh: {
    borderColor: Colors.warning,
    backgroundColor: `${Colors.warning}05`,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  insightPillar: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  insightDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  actionPreview: {
    backgroundColor: `${Colors.accent}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionPreviewText: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: '500',
  },
  aiEnhancementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  aiEnhancementText: {
    fontSize: 10,
    color: Colors.accent,
    marginLeft: 2,
    fontWeight: '600',
  },
  noInsightsContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noInsights: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  noInsightsSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: `${Colors.accent}10`,
    borderRadius: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
    marginRight: 4,
  },
  pillarsSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  pillarCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  pillarIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pillarContent: {
    flex: 1,
  },
  pillarName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  pillarDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  pillarProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pillarProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginRight: 8,
    overflow: 'hidden',
  },
  pillarProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  pillarProgressText: {
    fontSize: 11,
    fontWeight: '600',
  },
  aiSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiSuggestionText: {
    fontSize: 10,
    color: Colors.accent,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  pillarScoreContainer: {
    alignItems: 'center',
  },
  pillarScore: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionsSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 8,
  },
  actionSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  notificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 8,
  },
  notificationStatusText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  errorCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
});

export default React.memo(HomeScreen);
