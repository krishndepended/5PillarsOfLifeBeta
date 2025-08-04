// src/screens/AdvancedAnalyticsScreen.tsx - COMPLETE VICTORY CHARTS DASHBOARD
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
  Dimensions,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Victory Charts imports
import {
  VictoryChart,
  VictoryLine,
  VictoryBar,
  VictoryArea,
  VictoryScatter,
  VictoryPie,
  VictoryPolarAxis,
  VictoryTheme,
  VictoryAxis,
  VictoryTooltip,
  VictoryLabel,
  VictoryContainer
} from 'victory-native';

import { useAppDataSelectors } from '../context/AppDataContext';
import AdvancedAnalyticsEngine from '../utils/AdvancedAnalyticsEngine';
import { PremiumAnimations, HapticFeedback } from '../utils/AnimationUtils';
import { PerformanceMonitor } from '../hooks/usePerformanceOptimization';
import { safeNavigate, safeGet } from '../utils/SafeNavigation';

const { width, height } = Dimensions.get('window');

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  body: '#EF4444',
  mind: '#3B82F6',
  heart: '#EC4899',
  spirit: '#8B5CF6',
  diet: '#10B981',
};

const AdvancedAnalyticsScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const analyticsEngine = AdvancedAnalyticsEngine.getInstance();
  
  const { userProfile, sessionData, pillarScores, achievements } = useAppDataSelectors();
  
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [showChartModal, setShowChartModal] = useState(false);

  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    neuralRadar: analyticsEngine.generateNeuralRadarData(pillarScores),
    weeklyProgress: analyticsEngine.generateWeeklyProgressData(sessionData),
    culturalEngagement: analyticsEngine.generateCulturalEngagementData(userProfile),
    achievementTimeline: analyticsEngine.generateAchievementTimelineData(achievements || []),
    practiceFrequency: analyticsEngine.generatePracticeFrequencyData(),
    neuralTrends: analyticsEngine.generateNeuralTrendsData(selectedTimeRange),
    analyticsSummary: analyticsEngine.getAnalyticsSummary(userProfile, sessionData, pillarScores)
  });

  useEffect(() => {
    PremiumAnimations.createFadeAnimation(fadeAnim, 1, 800).start();
  }, []);

  useEffect(() => {
    // Update trends when time range changes
    setAnalyticsData(prev => ({
      ...prev,
      neuralTrends: analyticsEngine.generateNeuralTrendsData(selectedTimeRange)
    }));
  }, [selectedTimeRange]);

  const handleTimeRangeChange = (range: '7d' | '30d' | '90d') => {
    HapticFeedback.light();
    setSelectedTimeRange(range);
  };

  const handleChartPress = (chartType: string) => {
    HapticFeedback.medium();
    setSelectedChart(chartType);
    setShowChartModal(true);
  };

  const renderHeader = () => (
    <LinearGradient
      colors={[Colors.accent, Colors.spirit]}
      style={styles.header}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          HapticFeedback.light();
          safeNavigate(navigation, 'Home');
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Neural Analytics</Text>
        <Text style={styles.headerSubtitle}>
          Advanced Optimization Insights • विश्लेषण
        </Text>
      </View>

      <View style={styles.headerStats}>
        <Text style={styles.headerScore}>{analyticsData.analyticsSummary.overallScore}%</Text>
        <Text style={styles.headerScoreLabel}>Neural Score</Text>
      </View>
    </LinearGradient>
  );

  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      <Text style={styles.sectionTitle}>Time Range Analysis</Text>
      <View style={styles.timeRangeButtons}>
        {(['7d', '30d', '90d'] as const).map(range => (
          <TouchableOpacity
            key={range}
            style={[
              styles.timeRangeButton,
              selectedTimeRange === range && styles.timeRangeButtonActive
            ]}
            onPress={() => handleTimeRangeChange(range)}
          >
            <Text style={[
              styles.timeRangeButtonText,
              selectedTimeRange === range && styles.timeRangeButtonTextActive
            ]}>
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderNeuralRadarChart = () => (
    <TouchableOpacity
      style={styles.chartContainer}
      onPress={() => handleChartPress('neural-radar')}
    >
      <View style={styles.chartHeader}>
        <Ionicons name="radio" size={20} color={Colors.accent} />
        <Text style={styles.chartTitle}>5 Pillars Neural Map</Text>
        <Ionicons name="expand" size={16} color={Colors.textSecondary} />
      </View>

      <View style={styles.chartWrapper}>
        <VictoryChart
          theme={VictoryTheme.material}
          domain={{ y: [0, 100] }}
          width={width - 60}
          height={200}
          padding={{ top: 20, bottom: 40, left: 50, right: 50 }}
          containerComponent={<VictoryContainer responsive={false} />}
        >
          <VictoryPolarAxis 
            dependentAxis
            style={{
              axis: { stroke: Colors.textSecondary, strokeWidth: 1 },
              grid: { stroke: `${Colors.textSecondary}30`, strokeWidth: 1 }
            }}
            tickFormat={() => ''}
          />
          <VictoryPolarAxis 
            style={{
              axis: { stroke: Colors.textSecondary, strokeWidth: 1 },
              tickLabels: { fontSize: 12, fill: Colors.text, fontWeight: '600' }
            }}
          />
          <VictoryArea
            data={analyticsData.neuralRadar}
            animate={{
              duration: 1000,
              onLoad: { duration: 500 }
            }}
            style={{
              data: {
                fillOpacity: 0.3,
                fill: Colors.accent,
                stroke: Colors.accent,
                strokeWidth: 2
              }
            }}
          />
          <VictoryScatter
            data={analyticsData.neuralRadar}
            size={4}
            style={{
              data: { fill: Colors.accent }
            }}
          />
        </VictoryChart>
      </View>

      <View style={styles.chartFooter}>
        <Text style={styles.chartInsight}>
          🧠 Spirit pillar showing strongest neural optimization
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderWeeklyProgressChart = () => (
    <TouchableOpacity
      style={styles.chartContainer}
      onPress={() => handleChartPress('weekly-progress')}
    >
      <View style={styles.chartHeader}>
        <Ionicons name="trending-up" size={20} color={Colors.success} />
        <Text style={styles.chartTitle}>Weekly Progress Trend</Text>
        <Ionicons name="expand" size={16} color={Colors.textSecondary} />
      </View>

      <View style={styles.chartWrapper}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={width - 60}
          height={180}
          padding={{ top: 20, bottom: 40, left: 50, right: 50 }}
          containerComponent={<VictoryContainer responsive={false} />}
        >
          <VictoryAxis 
            style={{
              axis: { stroke: Colors.textSecondary },
              tickLabels: { fontSize: 12, fill: Colors.text }
            }}
          />
          <VictoryAxis 
            dependentAxis
            style={{
              axis: { stroke: Colors.textSecondary },
              tickLabels: { fontSize: 12, fill: Colors.text },
              grid: { stroke: `${Colors.textSecondary}20`, strokeWidth: 1 }
            }}
          />
          <VictoryArea
            data={analyticsData.weeklyProgress}
            animate={{
              duration: 1000,
              onLoad: { duration: 500 }
            }}
            style={{
              data: {
                fill: `url(#gradient)`,
                fillOpacity: 0.6,
                stroke: Colors.success,
                strokeWidth: 3
              }
            }}
          />
          <VictoryScatter
            data={analyticsData.weeklyProgress}
            size={3}
            style={{
              data: { fill: Colors.success }
            }}
            labelComponent={<VictoryTooltip />}
          />
        </VictoryChart>
      </View>

      <View style={styles.chartFooter}>
        <Text style={styles.chartInsight}>
          📈 Consistent upward trend in neural optimization
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCulturalEngagementChart = () => (
    <TouchableOpacity
      style={styles.chartContainer}
      onPress={() => handleChartPress('cultural-engagement')}
    >
      <View style={styles.chartHeader}>
        <Ionicons name="leaf" size={20} color={Colors.spirit} />
        <Text style={styles.chartTitle}>Cultural Wisdom Engagement</Text>
        <Ionicons name="expand" size={16} color={Colors.textSecondary} />
      </View>

      <View style={styles.chartWrapper}>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={{ x: 20 }}
          width={width - 60}
          height={180}
          padding={{ top: 20, bottom: 60, left: 50, right: 50 }}
          containerComponent={<VictoryContainer responsive={false} />}
        >
          <VictoryAxis 
            style={{
              axis: { stroke: Colors.textSecondary },
              tickLabels: { fontSize: 10, fill: Colors.text, angle: -45 }
            }}
          />
          <VictoryAxis 
            dependentAxis
            style={{
              axis: { stroke: Colors.textSecondary },
              tickLabels: { fontSize: 12, fill: Colors.text },
              grid: { stroke: `${Colors.textSecondary}20`, strokeWidth: 1 }
            }}
          />
          <VictoryBar
            data={analyticsData.culturalEngagement}
            animate={{
              duration: 1000,
              onLoad: { duration: 500 }
            }}
            style={{
              data: { 
                fill: ({ datum }) => datum.fill,
                fillOpacity: 0.8,
                stroke: ({ datum }) => datum.fill,
                strokeWidth: 1
              }
            }}
            cornerRadius={4}
            labelComponent={<VictoryTooltip />}
          />
        </VictoryChart>
      </View>

      <View style={styles.chartFooter}>
        <Text style={styles.chartInsight}>
          🕉️ Strong engagement across all cultural practices
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPracticeFrequencyChart = () => (
    <TouchableOpacity
      style={styles.chartContainer}
      onPress={() => handleChartPress('practice-frequency')}
    >
      <View style={styles.chartHeader}>
        <Ionicons name="fitness" size={20} color={Colors.warning} />
        <Text style={styles.chartTitle}>Practice Frequency Analysis</Text>
        <Ionicons name="expand" size={16} color={Colors.textSecondary} />
      </View>

      <View style={styles.chartWrapper}>
        <VictoryPie
          data={analyticsData.practiceFrequency}
          width={width - 60}
          height={200}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 }
          }}
          colorScale={[
            Colors.spirit, Colors.success, Colors.warning, 
            Colors.heart, Colors.accent, Colors.body
          ]}
          innerRadius={50}
          labelRadius={({ innerRadius }) => (innerRadius as number) + 30}
          labelComponent={<VictoryLabel style={{ fontSize: 12, fill: Colors.text }} />}
          containerComponent={<VictoryContainer responsive={false} />}
        />
      </View>

      <View style={styles.chartFooter}>
        <Text style={styles.chartInsight}>
          🧘 Meditation and yoga showing highest frequency
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderInsightsSummary = () => (
    <View style={styles.insightsContainer}>
      <View style={styles.insightsHeader}>
        <Ionicons name="bulb" size={24} color={Colors.warning} />
        <Text style={styles.insightsTitle}>AI Neural Insights</Text>
      </View>

      <View style={styles.insightsList}>
        <View style={styles.insightItem}>
          <View style={[styles.insightIndicator, { backgroundColor: Colors.success }]} />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Spiritual Optimization Peak</Text>
            <Text style={styles.insightDescription}>
              Your Spirit pillar is performing exceptionally well with 94% cultural engagement
            </Text>
          </View>
        </View>

        <View style={styles.insightItem}>
          <View style={[styles.insightIndicator, { backgroundColor: Colors.warning }]} />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Diet Consistency Opportunity</Text>
            <Text style={styles.insightDescription}>
              68% consistency in diet practices suggests room for improvement in nutritional habits
            </Text>
          </View>
        </View>

        <View style={styles.insightItem}>
          <View style={[styles.insightIndicator, { backgroundColor: Colors.accent }]} />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Cultural Integration Success</Text>
            <Text style={styles.insightDescription}>
              89% wisdom engagement shows strong connection with Indian cultural practices
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderExpandedChart = () => {
    if (!selectedChart) return null;

    const chartConfig = {
      'neural-radar': {
        title: '5 Pillars Neural Optimization Map',
        description: 'Comprehensive view of your neural optimization across all five life pillars',
        component: (
          <VictoryChart
            theme={VictoryTheme.material}
            domain={{ y: [0, 100] }}
            width={width - 40}
            height={300}
            padding={{ top: 20, bottom: 40, left: 50, right: 50 }}
          >
            <VictoryPolarAxis 
              dependentAxis
              style={{
                axis: { stroke: Colors.textSecondary, strokeWidth: 1 },
                grid: { stroke: `${Colors.textSecondary}30`, strokeWidth: 1 }
              }}
            />
            <VictoryPolarAxis 
              style={{
                axis: { stroke: Colors.textSecondary, strokeWidth: 1 },
                tickLabels: { fontSize: 14, fill: Colors.text, fontWeight: '600' }
              }}
            />
            <VictoryArea
              data={analyticsData.neuralRadar}
              animate={{ duration: 1000 }}
              style={{
                data: {
                  fillOpacity: 0.4,
                  fill: Colors.accent,
                  stroke: Colors.accent,
                  strokeWidth: 3
                }
              }}
            />
            <VictoryScatter
              data={analyticsData.neuralRadar}
              size={6}
              style={{ data: { fill: Colors.accent } }}
            />
          </VictoryChart>
        )
      }
    };

    const config = chartConfig[selectedChart as keyof typeof chartConfig];

    return (
      <Modal
        visible={showChartModal}
        animationType="slide"
        onRequestClose={() => setShowChartModal(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={[Colors.accent, Colors.spirit]}
            style={styles.modalHeader}
          >
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                HapticFeedback.light();
                setShowChartModal(false);
              }}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{config?.title}</Text>
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            <View style={styles.modalChartContainer}>
              {config?.component}
            </View>
            <Text style={styles.modalDescription}>{config?.description}</Text>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <PerformanceMonitor>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {renderHeader()}
        
        <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
          {renderTimeRangeSelector()}
          {renderNeuralRadarChart()}
          {renderWeeklyProgressChart()}
          {renderCulturalEngagementChart()}
          {renderPracticeFrequencyChart()}
          {renderInsightsSummary()}
        </ScrollView>

        {renderExpandedChart()}
      </Animated.View>
    </PerformanceMonitor>
  );
};

// Complete styles for the analytics dashboard
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
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
    marginTop: 4,
  },
  headerStats: {
    alignItems: 'center',
  },
  headerScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerScoreLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  timeRangeContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  timeRangeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeRangeButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  timeRangeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  timeRangeButtonTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  chartWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  chartFooter: {
    alignItems: 'center',
  },
  chartInsight: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  insightsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  insightsList: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 45 : 60,
  },
  modalCloseButton: {
    padding: 8,
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalChartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
  },
});

export default React.memo(AdvancedAnalyticsScreen);
