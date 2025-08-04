// src/screens/AnalyticsScreen.tsx - FIXED VERSION WITH PROPER FUNCTION ORDERING
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDataSelectors, useAppData } from '../context/AppDataContext';
import { usePerformanceOptimization, PerformanceMonitor } from '../hooks/usePerformanceOptimization';
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

interface TrendData {
  pillar: string;
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface SessionAnalytics {
  totalSessions: number;
  totalTime: number;
  averageSession: number;
  consistencyScore: number;
  mostActivePillar: string;
  improvementRate: number;
}

const AnalyticsScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { actions } = useAppData();
  
  const {
    pillarScores,
    sessionHistory,
    userProfile,
    sessionData,
    achievements,
    overallScore,
    isInitialized
  } = useAppDataSelectors();

  const { measurePerformance } = usePerformanceOptimization();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [selectedMetric, setSelectedMetric] = useState<'score' | 'sessions' | 'time'>('score');

  // MOVED: All calculation functions BEFORE useMemo
  const calculateConsistencyScore = useCallback((sessions: any[], timeRange: string): number => {
    if (sessions.length === 0) return 0;
    
    try {
      // Group sessions by date
      const sessionsByDate = sessions.reduce((acc, session) => {
        const date = new Date(session.date).toDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const daysWithSessions = Object.keys(sessionsByDate).length;
      const totalDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 365;
      
      return Math.round((daysWithSessions / Math.min(totalDays, 365)) * 100);
    } catch (error) {
      console.error('Error calculating consistency score:', error);
      return 0;
    }
  }, []);

  const getMostActivePillar = useCallback((sessions: any[]): string => {
    if (sessions.length === 0) return 'mind';
    
    try {
      const pillarCounts = sessions.reduce((acc, session) => {
        acc[session.pillar] = (acc[session.pillar] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(pillarCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'mind';
    } catch (error) {
      console.error('Error getting most active pillar:', error);
      return 'mind';
    }
  }, []);

  const calculatePreviousScore = useCallback((pillar: string, pillarSessions: any[]): number => {
    try {
      if (pillarSessions.length === 0) return safeGet(pillarScores, pillar, 70);
      
      // Calculate what the score would have been without recent improvements
      const totalImprovement = pillarSessions.reduce((sum, session) => sum + (session.improvement || 0), 0);
      return Math.max(50, (safeGet(pillarScores, pillar, 70) - totalImprovement));
    } catch (error) {
      console.error('Error calculating previous score:', error);
      return safeGet(pillarScores, pillar, 70);
    }
  }, [pillarScores]);

  const calculateImprovementRate = useCallback((sessions: any[], timeRange: string): number => {
    try {
      if (sessions.length === 0) return 0;
      
      const totalImprovement = sessions.reduce((sum, session) => sum + (session.improvement || 0), 0);
      const timeSpan = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 365;
      
      return Math.round((totalImprovement / timeSpan) * 7); // Weekly improvement rate
    } catch (error) {
      console.error('Error calculating improvement rate:', error);
      return 0;
    }
  }, []);

  useEffect(() => {
    const measurement = measurePerformance('AnalyticsScreen');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      measurement.end();
    });
  }, [fadeAnim]);

  // FIXED: useMemo now uses the properly declared functions above
  const analyticsData = useMemo(() => {
    try {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (selectedTimeRange) {
        case '7d':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case 'all':
          cutoffDate.setFullYear(2020); // Far back to include all data
          break;
      }

      // Filter sessions by time range - SAFE FILTERING
      const filteredSessions = (sessionHistory || []).filter(session => {
        try {
          return new Date(session.date) >= cutoffDate;
        } catch (error) {
          return false; // Skip invalid sessions
        }
      });

      // Calculate session analytics - SAFE CALCULATIONS
      const sessionAnalytics: SessionAnalytics = {
        totalSessions: filteredSessions.length,
        totalTime: filteredSessions.reduce((sum, session) => sum + (session.duration || 0), 0),
        averageSession: filteredSessions.length > 0 
          ? Math.round(filteredSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / filteredSessions.length)
          : 0,
        consistencyScore: calculateConsistencyScore(filteredSessions, selectedTimeRange),
        mostActivePillar: getMostActivePillar(filteredSessions),
        improvementRate: calculateImprovementRate(filteredSessions, selectedTimeRange)
      };

      // Calculate pillar trends - SAFE TREND CALCULATION
      const pillarTrends: TrendData[] = Object.entries(pillarScores || {}).map(([pillar, currentScore]) => {
        try {
          const pillarSessions = filteredSessions.filter(session => session.pillar === pillar);
          const previousScore = calculatePreviousScore(pillar, pillarSessions);
          const change = (currentScore as number) - previousScore;
          
          return {
            pillar,
            current: currentScore as number,
            previous: previousScore,
            trend: change > 2 ? 'up' : change < -2 ? 'down' : 'stable',
            change: Math.abs(change)
          };
        } catch (error) {
          console.error(`Error calculating trend for ${pillar}:`, error);
          return {
            pillar,
            current: currentScore as number,
            previous: currentScore as number,
            trend: 'stable' as const,
            change: 0
          };
        }
      });

      return { sessionAnalytics, pillarTrends };
    } catch (error) {
      console.error('Error in analyticsData calculation:', error);
      
      // Return safe default values
      return {
        sessionAnalytics: {
          totalSessions: 0,
          totalTime: 0,
          averageSession: 0,
          consistencyScore: 0,
          mostActivePillar: 'mind',
          improvementRate: 0
        },
        pillarTrends: Object.entries(pillarScores || {}).map(([pillar, score]) => ({
          pillar,
          current: score as number,
          previous: score as number,
          trend: 'stable' as const,
          change: 0
        }))
      };
    }
  }, [pillarScores, sessionHistory, selectedTimeRange, calculateConsistencyScore, getMostActivePillar, calculatePreviousScore, calculateImprovementRate]);

  const renderOverviewCards = () => (
    <PerformanceMonitor>
      <View style={styles.overviewSection}>
        <Text style={styles.sectionTitle}>Neural Analytics Overview</Text>
        
        <View style={styles.overviewGrid}>
          <View style={[styles.overviewCard, { backgroundColor: `${Colors.accent}15` }]}>
            <Ionicons name="flash" size={24} color={Colors.accent} />
            <Text style={styles.overviewValue}>{overallScore || 0}%</Text>
            <Text style={styles.overviewLabel}>Overall Score</Text>
            <Text style={styles.overviewTrend}>
              +{analyticsData.sessionAnalytics.improvementRate}% this week
            </Text>
          </View>

          <View style={[styles.overviewCard, { backgroundColor: `${Colors.success}15` }]}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <Text style={styles.overviewValue}>{analyticsData.sessionAnalytics.totalSessions}</Text>
            <Text style={styles.overviewLabel}>Sessions</Text>
            <Text style={styles.overviewTrend}>
              {selectedTimeRange === '7d' ? 'Last 7 days' : selectedTimeRange === '30d' ? 'Last 30 days' : 'All time'}
            </Text>
          </View>

          <View style={[styles.overviewCard, { backgroundColor: `${Colors.warning}15` }]}>
            <Ionicons name="time" size={24} color={Colors.warning} />
            <Text style={styles.overviewValue}>{analyticsData.sessionAnalytics.totalTime}m</Text>
            <Text style={styles.overviewLabel}>Total Time</Text>
            <Text style={styles.overviewTrend}>
              Avg: {analyticsData.sessionAnalytics.averageSession}m/session
            </Text>
          </View>

          <View style={[styles.overviewCard, { backgroundColor: `${Colors.spirit}15` }]}>
            <Ionicons name="trending-up" size={24} color={Colors.spirit} />
            <Text style={styles.overviewValue}>{analyticsData.sessionAnalytics.consistencyScore}%</Text>
            <Text style={styles.overviewLabel}>Consistency</Text>
            <Text style={styles.overviewTrend}>
              Daily practice rate
            </Text>
          </View>
        </View>
      </View>
    </PerformanceMonitor>
  );

  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeSelector}>
      {[
        { key: '7d', label: '7 Days' },
        { key: '30d', label: '30 Days' },
        { key: 'all', label: 'All Time' }
      ].map(range => (
        <TouchableOpacity
          key={range.key}
          style={[
            styles.timeRangeButton,
            selectedTimeRange === range.key && styles.timeRangeButtonActive
          ]}
          onPress={() => setSelectedTimeRange(range.key as any)}
        >
          <Text style={[
            styles.timeRangeText,
            selectedTimeRange === range.key && styles.timeRangeTextActive
          ]}>
            {range.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPillarTrends = () => (
    <PerformanceMonitor>
      <View style={styles.trendsSection}>
        <Text style={styles.sectionTitle}>Pillar Performance Trends</Text>
        
        {analyticsData.pillarTrends.map((trend, index) => {
          const pillarColor = {
            body: Colors.body,
            mind: Colors.mind,
            heart: Colors.heart,
            spirit: Colors.spirit,
            diet: Colors.diet
          }[trend.pillar] || Colors.accent;

          return (
            <View key={trend.pillar} style={styles.trendCard}>
              <View style={styles.trendHeader}>
                <View style={[styles.trendIcon, { backgroundColor: pillarColor }]}>
                  <Ionicons 
                    name={
                      trend.pillar === 'body' ? 'fitness' :
                      trend.pillar === 'mind' ? 'library' :
                      trend.pillar === 'heart' ? 'heart' :
                      trend.pillar === 'spirit' ? 'leaf' :
                      'restaurant'
                    } 
                    size={20} 
                    color="#FFFFFF" 
                  />
                </View>
                <View style={styles.trendInfo}>
                  <Text style={styles.trendPillar}>{trend.pillar.toUpperCase()}</Text>
                  <Text style={styles.trendScore}>Current: {trend.current}%</Text>
                </View>
                <View style={styles.trendChange}>
                  <Ionicons 
                    name={
                      trend.trend === 'up' ? 'trending-up' :
                      trend.trend === 'down' ? 'trending-down' :
                      'remove'
                    }
                    size={20}
                    color={
                      trend.trend === 'up' ? Colors.success :
                      trend.trend === 'down' ? Colors.body :
                      Colors.textSecondary
                    }
                  />
                  <Text style={[
                    styles.trendChangeText,
                    {
                      color: trend.trend === 'up' ? Colors.success :
                             trend.trend === 'down' ? Colors.body :
                             Colors.textSecondary
                    }
                  ]}>
                    {trend.trend === 'stable' ? 'Stable' : `${Math.round(trend.change)}%`}
                  </Text>
                </View>
              </View>
              
              {/* Progress Bar showing current vs previous */}
              <View style={styles.trendProgressContainer}>
                <View style={styles.trendProgressBar}>
                  <View 
                    style={[
                      styles.trendProgressFill, 
                      { 
                        width: `${Math.min(100, Math.max(0, trend.current))}%`, 
                        backgroundColor: pillarColor 
                      }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.trendPreviousMarker,
                      { left: `${Math.min(100, Math.max(0, trend.previous))}%` }
                    ]}
                  />
                </View>
                <Text style={styles.trendProgressLabel}>
                  Previous: {Math.round(trend.previous)}% → Current: {Math.round(trend.current)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </PerformanceMonitor>
  );

  const renderSessionInsights = () => (
    <PerformanceMonitor>
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Session Insights</Text>
        
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="star" size={24} color={Colors.warning} />
            <Text style={styles.insightTitle}>Most Active Pillar</Text>
          </View>
          <Text style={styles.insightValue}>
            {analyticsData.sessionAnalytics.mostActivePillar.toUpperCase()}
          </Text>
          <Text style={styles.insightDescription}>
            You've been focusing most on {analyticsData.sessionAnalytics.mostActivePillar} optimization recently
          </Text>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="calendar" size={24} color={Colors.success} />
            <Text style={styles.insightTitle}>Practice Consistency</Text>
          </View>
          <Text style={styles.insightValue}>
            {analyticsData.sessionAnalytics.consistencyScore}%
          </Text>
          <Text style={styles.insightDescription}>
            {analyticsData.sessionAnalytics.consistencyScore >= 80 
              ? 'Excellent daily practice consistency!'
              : analyticsData.sessionAnalytics.consistencyScore >= 60
              ? 'Good consistency, try for daily practice'
              : 'Focus on building a daily optimization habit'
            }
          </Text>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="flash" size={24} color={Colors.accent} />
            <Text style={styles.insightTitle}>Improvement Rate</Text>
          </View>
          <Text style={styles.insightValue}>
            +{analyticsData.sessionAnalytics.improvementRate}%
          </Text>
          <Text style={styles.insightDescription}>
            Weekly neural optimization improvement rate
          </Text>
        </View>
      </View>
    </PerformanceMonitor>
  );

  const renderAchievementSummary = () => (
    <PerformanceMonitor>
      <View style={styles.achievementSection}>
        <Text style={styles.sectionTitle}>Achievement Progress</Text>
        
        <View style={styles.achievementSummary}>
          <View style={styles.achievementStats}>
            <Text style={styles.achievementCount}>{(achievements || []).length}</Text>
            <Text style={styles.achievementLabel}>Unlocked</Text>
          </View>
          
          <View style={styles.achievementBreakdown}>
            {['common', 'rare', 'epic', 'legendary'].map(rarity => {
              const count = (achievements || []).filter(a => a.rarity === rarity).length;
              const rarityColor = {
                common: Colors.textSecondary,
                rare: Colors.accent,
                epic: Colors.spirit,
                legendary: Colors.warning
              }[rarity];
              
              return (
                <View key={rarity} style={styles.rarityItem}>
                  <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
                  <Text style={styles.rarityText}>{rarity}: {count}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {(achievements || []).length > 0 && (
          <View style={styles.recentAchievements}>
            <Text style={styles.recentTitle}>Recent Achievements</Text>
            {(achievements || []).slice(0, 3).map((achievement, index) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <Ionicons name="trophy" size={16} color={Colors.warning} />
                <Text style={styles.achievementName}>{achievement.title}</Text>
                <Text style={styles.achievementDate}>
                  {new Date(achievement.unlockedDate).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </PerformanceMonitor>
  );

  const renderDataExportSection = () => (
    <PerformanceMonitor>
      <View style={styles.exportSection}>
        <Text style={styles.sectionTitle}>Analytics Export</Text>
        
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={() => safeNavigate(navigation, 'UserProfileScreen')}
        >
          <Ionicons name="download" size={20} color={Colors.accent} />
          <View style={styles.exportInfo}>
            <Text style={styles.exportTitle}>Export Analytics Data</Text>
            <Text style={styles.exportDescription}>
              Download your complete neural optimization analytics
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </PerformanceMonitor>
  );

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="analytics" size={48} color={Colors.accent} />
        <Text style={styles.loadingText}>Loading Neural Analytics...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => safeNavigate(navigation, 'Home')}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Neural Analytics</Text>
          <Text style={styles.headerSubtitle}>Data-Driven Optimization Insights</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => safeNavigate(navigation, 'UserProfileScreen')}
        >
          <Ionicons name="settings" size={20} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderTimeRangeSelector()}
        {renderOverviewCards()}
        {renderPillarTrends()}
        {renderSessionInsights()}
        {renderAchievementSummary()}
        {renderDataExportSection()}
      </ScrollView>
    </Animated.View>
  );
};

// [All styles remain the same as previous version]
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeRangeButtonActive: {
    backgroundColor: Colors.accent,
  },
  timeRangeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  overviewSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  overviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  overviewTrend: {
    fontSize: 10,
    color: Colors.success,
    marginTop: 4,
    fontWeight: '500',
  },
  trendsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  trendCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trendInfo: {
    flex: 1,
  },
  trendPillar: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  trendScore: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  trendChange: {
    alignItems: 'center',
  },
  trendChangeText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  trendProgressContainer: {
    marginTop: 8,
  },
  trendProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  trendProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  trendPreviousMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.textSecondary,
  },
  trendProgressLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  insightsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  insightCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  achievementSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  achievementSummary: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementStats: {
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.warning,
  },
  achievementLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  achievementBreakdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rarityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  rarityText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  recentAchievements: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  achievementName: {
    fontSize: 12,
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  achievementDate: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  exportSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  exportInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  exportDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default React.memo(AnalyticsScreen);
