// src/screens/HealthDashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Platform, Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import GlassPanel from '../components/GlassPanel';
import { AdvancedHealthMetrics } from '../services/AdvancedHealthMetrics';

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

const HealthDashboardScreen = () => {
  const navigation = useNavigation();
  const [healthData, setHealthData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const [trends, setTrends] = useState(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const healthMetrics = AdvancedHealthMetrics.getInstance();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      const assessment = await healthMetrics.generateHealthAssessment();
      const healthTrends = await healthMetrics.getHealthTrends(14);
      
      setHealthData(assessment);
      setTrends(healthTrends);
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 255, 136, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: Colors.neonGreen
    }
  };

  const HealthScoreCard = ({ title, score, subtitle, icon, color, trend }) => (
    <GlassPanel style={[styles.scoreCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={styles.scoreHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <View style={styles.trendIndicator}>
          <Ionicons 
            name={trend > 0 ? 'trending-up' : trend < 0 ? 'trending-down' : 'remove'} 
            size={16} 
            color={trend > 0 ? Colors.neonGreen : trend < 0 ? Colors.neonRed : Colors.neonYellow} 
          />
        </View>
      </View>
      <Text style={styles.scoreTitle}>{title}</Text>
      <Text style={[styles.scoreValue, { color }]}>{score}</Text>
      <Text style={styles.scoreSubtitle}>{subtitle}</Text>
    </GlassPanel>
  );

  const InsightCard = ({ insight }) => (
    <GlassPanel style={[
      styles.insightCard,
      { borderLeftColor: getSeverityColor(insight.severity), borderLeftWidth: 4 }
    ]}>
      <View style={styles.insightHeader}>
        <View style={styles.insightTitleRow}>
          <Text style={styles.insightTitle}>{insight.title}</Text>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(insight.severity) }]}>
            <Text style={styles.severityText}>{insight.severity.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.insightCategory}>{insight.category.toUpperCase()}</Text>
      </View>
      
      <Text style={styles.insightDescription}>{insight.description}</Text>
      
      {insight.actionable && insight.recommendations.length > 0 && (
        <View style={styles.recommendationsSection}>
          <Text style={styles.recommendationsTitle}>Recommendations:</Text>
          {insight.recommendations.slice(0, 2).map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.neonGreen} />
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </View>
      )}
    </GlassPanel>
  );

  const BiometricDisplay = ({ label, value, unit, normal, icon, color }) => {
    const isNormal = value >= normal.min && value <= normal.max;
    
    return (
      <View style={styles.biometricItem}>
        <View style={styles.biometricHeader}>
          <Ionicons name={icon} size={20} color={color} />
          <Text style={styles.biometricLabel}>{label}</Text>
        </View>
        <View style={styles.biometricValueContainer}>
          <Text style={[styles.biometricValue, { color: isNormal ? Colors.neonGreen : Colors.neonRed }]}>
            {typeof value === 'object' ? `${value.systolic}/${value.diastolic}` : value.toFixed(1)}
          </Text>
          <Text style={styles.biometricUnit}>{unit}</Text>
        </View>
        <Text style={styles.biometricStatus}>
          {isNormal ? 'Normal' : 'Outside Range'}
        </Text>
      </View>
    );
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return Colors.neonRed;
      case 'medium': return Colors.neonYellow;
      case 'low': return Colors.neonGreen;
      default: return Colors.neonBlue;
    }
  };

  const getMetricData = () => {
    if (!trends) return { labels: [], datasets: [{ data: [] }] };
    
    const labels = Array.from({ length: 14 }, (_, i) => `${i + 1}`);
    
    switch (selectedMetric) {
      case 'sleep':
        return {
          labels,
          datasets: [{ data: trends.sleepTrend, color: () => Colors.neonBlue }]
        };
      case 'stress':
        return {
          labels,
          datasets: [{ data: trends.stressTrend, color: () => Colors.neonRed }]
        };
      case 'energy':
        return {
          labels,
          datasets: [{ data: trends.energyTrend, color: () => Colors.neonYellow }]
        };
      default:
        return {
          labels,
          datasets: [{ data: trends.overallTrend, color: () => Colors.neonGreen }]
        };
    }
  };

  if (!healthData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Analyzing Health Metrics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {/* Header */}
        <GlassPanel style={{ marginHorizontal: 16, marginTop: 40 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={Colors.neonGreen} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>HEALTH DASHBOARD</Text>
            <TouchableOpacity onPress={loadHealthData}>
              <Ionicons name="refresh" size={24} color={Colors.neonBlue} />
            </TouchableOpacity>
          </View>
        </GlassPanel>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Overall Wellness Score */}
          <GlassPanel style={styles.overallScorePanel}>
            <Text style={styles.overallScoreTitle}>Overall Wellness Score</Text>
            <Text style={[styles.overallScoreValue, { color: Colors.neonGreen }]}>
              {healthData.overallScore}/100
            </Text>
            <Text style={styles.overallScoreSubtitle}>
              {healthData.overallScore >= 85 ? 'Excellent' :
               healthData.overallScore >= 70 ? 'Good' :
               healthData.overallScore >= 55 ? 'Fair' : 'Needs Attention'}
            </Text>
          </GlassPanel>

          {/* Health Metrics Grid */}
          <View style={styles.metricsGrid}>
            <HealthScoreCard
              title="Sleep Quality"
              score={`${healthData.sleep.sleepScore}/100`}
              subtitle="Last night"
              icon="bed"
              color={Colors.neonBlue}
              trend={2}
            />
            <HealthScoreCard
              title="Stress Level"
              score={`${healthData.stress.stressLevel}/10`}
              subtitle="Current state"
              icon="heart-circle"
              color={Colors.neonRed}
              trend={-1}
            />
            <HealthScoreCard
              title="Nutrition Score"
              score={`${healthData.nutrition.nutritionScore}/100`}
              subtitle="Today's intake"
              icon="nutrition"
              color={Colors.neonGreen}
              trend={1}
            />
            <HealthScoreCard
              title="HRV"
              score={`${healthData.stress.hrv}ms`}
              subtitle="Recovery indicator"
              icon="pulse"
              color={Colors.neonPurple}
              trend={0}
            />
          </View>

          {/* Trends Chart */}
          <GlassPanel style={styles.chartPanel}>
            <Text style={styles.chartTitle}>14-Day Health Trends</Text>
            
            <View style={styles.metricSelector}>
              {['overall', 'sleep', 'stress', 'energy'].map(metric => (
                <TouchableOpacity
                  key={metric}
                  style={[
                    styles.metricButton,
                    selectedMetric === metric && styles.metricButtonActive
                  ]}
                  onPress={() => setSelectedMetric(metric)}
                >
                  <Text style={[
                    styles.metricButtonText,
                    selectedMetric === metric && styles.metricButtonTextActive
                  ]}>
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {trends && (
              <LineChart
                data={getMetricData()}
                width={width - 64}
                height={200}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            )}
          </GlassPanel>

          {/* Biometric Details */}
          <GlassPanel style={styles.biometricsPanel}>
            <Text style={styles.sectionTitle}>💓 Current Biometrics</Text>
            
            <View style={styles.biometricsGrid}>
              <BiometricDisplay
                label="Heart Rate"
                value={healthData.biometrics.heartRate}
                unit="bpm"
                normal={{ min: 60, max: 85 }}
                icon="heart"
                color={Colors.neonRed}
              />
              <BiometricDisplay
                label="Blood Pressure"
                value={healthData.biometrics.bloodPressure}
                unit="mmHg"
                normal={{ min: 90, max: 140 }}
                icon="pulse"
                color={Colors.neonBlue}
              />
              <BiometricDisplay
                label="Blood Oxygen"
                value={healthData.biometrics.bloodOxygen}
                unit="%"
                normal={{ min: 95, max: 100 }}
                icon="water"
                color={Colors.neonGreen}
              />
              <BiometricDisplay
                label="Body Temp"
                value={healthData.biometrics.bodyTemperature}
                unit="°F"
                normal={{ min: 97.0, max: 99.5 }}
                icon="thermometer"
                color={Colors.neonYellow}
              />
            </View>
          </GlassPanel>

          {/* Sleep Analysis */}
          <GlassPanel style={styles.sleepPanel}>
            <Text style={styles.sectionTitle}>😴 Sleep Analysis</Text>
            
            <View style={styles.sleepStages}>
              <View style={styles.sleepStage}>
                <Text style={styles.sleepStageLabel}>Deep</Text>
                <Text style={styles.sleepStageValue}>
                  {healthData.sleep.stages.deep.toFixed(1)}h
                </Text>
                <View style={[styles.sleepStageBar, { backgroundColor: Colors.neonBlue }]} />
              </View>
              <View style={styles.sleepStage}>
                <Text style={styles.sleepStageLabel}>Light</Text>
                <Text style={styles.sleepStageValue}>
                  {healthData.sleep.stages.light.toFixed(1)}h
                </Text>
                <View style={[styles.sleepStageBar, { backgroundColor: Colors.neonGreen }]} />
              </View>
              <View style={styles.sleepStage}>
                <Text style={styles.sleepStageLabel}>REM</Text>
                <Text style={styles.sleepStageValue}>
                  {healthData.sleep.stages.rem.toFixed(1)}h
                </Text>
                <View style={[styles.sleepStageBar, { backgroundColor: Colors.neonPurple }]} />
              </View>
            </View>

            <View style={styles.sleepSummary}>
              <Text style={styles.sleepSummaryText}>
                Total: {healthData.sleep.duration.toFixed(1)}h | 
                Quality: {healthData.sleep.quality}/100
              </Text>
            </View>
          </GlassPanel>

          {/* Health Insights */}
          <View style={styles.insightsSection}>
            <Text style={styles.sectionTitle}>🔍 AI Health Insights</Text>
            {healthData.insights.length > 0 ? (
              healthData.insights.map(insight => (
                <InsightCard key={insight.id} insight={insight} />
              ))
            ) : (
              <GlassPanel style={styles.noInsightsPanel}>
                <Text style={styles.noInsightsText}>
                  Great! No critical health insights detected. Keep up the excellent work!
                </Text>
              </GlassPanel>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface.secondary,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.neonGreen,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
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
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  overallScorePanel: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  overallScoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  overallScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
    marginBottom: 8,
  },
  overallScoreSubtitle: {
    fontSize: 16,
    color: '#888',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreCard: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  scoreSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  chartPanel: {
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neonBlue,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  metricSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  metricButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricButtonActive: {
    backgroundColor: Colors.neonGreen,
  },
  metricButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  metricButtonTextActive: {
    color: '#000',
  },
  chart: {
    borderRadius: 16,
  },
  biometricsPanel: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neonBlue,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  biometricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  biometricItem: {
    width: '48%',
    marginBottom: 16,
  },
  biometricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  biometricLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  biometricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  biometricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  biometricUnit: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  biometricStatus: {
    fontSize: 12,
    color: '#666',
  },
  sleepPanel: {
    padding: 20,
    marginBottom: 20,
  },
  sleepStages: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  sleepStage: {
    alignItems: 'center',
  },
  sleepStageLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  sleepStageValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  sleepStageBar: {
    width: 30,
    height: 4,
    borderRadius: 2,
  },
  sleepSummary: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  sleepSummaryText: {
    fontSize: 14,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  insightsSection: {
    marginBottom: 20,
  },
  insightCard: {
    padding: 16,
    marginBottom: 12,
  },
  insightHeader: {
    marginBottom: 12,
  },
  insightTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  insightCategory: {
    fontSize: 12,
    color: Colors.neonBlue,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendationsSection: {
    marginTop: 8,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.neonGreen,
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  noInsightsPanel: {
    padding: 20,
    alignItems: 'center',
  },
  noInsightsText: {
    fontSize: 16,
    color: Colors.neonGreen,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
});

export default HealthDashboardScreen;
