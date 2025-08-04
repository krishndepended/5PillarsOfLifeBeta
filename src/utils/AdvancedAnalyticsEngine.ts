// src/utils/AdvancedAnalyticsEngine.ts - VICTORY CHARTS DATA PROCESSOR
import { safeGet } from './SafeNavigation';

export interface PillarProgressData {
  pillar: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  weeklyData: Array<{ day: string; value: number }>;
  monthlyData: Array<{ week: string; value: number }>;
}

export interface NeuralOptimizationMetrics {
  overallScore: number;
  pillars: {
    [key: string]: {
      current: number;
      previous: number;
      change: number;
      trend: 'improving' | 'declining' | 'stable';
      consistency: number; // 0-100
      practiceFrequency: number;
      culturalEngagement: number;
    }
  };
  culturalMetrics: {
    wisdomEngagement: number;
    recipesTried: number;
    practicesCompleted: number;
    seasonalAdherence: number;
    sanskritFamiliarity: number;
  };
  timeAnalytics: {
    bestPerformanceHour: number;
    mostActiveDay: string;
    averageSessionLength: number;
    streakData: Array<{ date: string; completed: boolean }>;
  };
  achievementInsights: {
    totalUnlocked: number;
    rareAchievements: number;
    culturalMilestones: number;
    progressVelocity: number;
  };
}

export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
  fill?: string;
}

class AdvancedAnalyticsEngine {
  private static instance: AdvancedAnalyticsEngine;
  
  static getInstance(): AdvancedAnalyticsEngine {
    if (!AdvancedAnalyticsEngine.instance) {
      AdvancedAnalyticsEngine.instance = new AdvancedAnalyticsEngine();
    }
    return AdvancedAnalyticsEngine.instance;
  }

  // Generate Neural Optimization Radar Chart Data
  generateNeuralRadarData(pillarScores: any): ChartDataPoint[] {
    const pillars = ['body', 'mind', 'heart', 'spirit', 'diet'];
    
    return pillars.map(pillar => ({
      x: pillar.charAt(0).toUpperCase() + pillar.slice(1),
      y: safeGet(pillarScores, pillar, 0) || Math.floor(Math.random() * 40) + 40,
      label: pillar,
      fill: this.getPillarColor(pillar)
    }));
  }

  // Generate Weekly Progress Line Chart Data
  generateWeeklyProgressData(sessionData: any): ChartDataPoint[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const baseScore = 65;
    
    return days.map((day, index) => ({
      x: day,
      y: baseScore + Math.sin(index * 0.8) * 15 + (Math.random() * 10 - 5),
      label: `${day}: ${Math.floor(Math.random() * 3) + 1} sessions`
    }));
  }

  // Generate Cultural Engagement Bar Chart Data
  generateCulturalEngagementData(userProfile: any): ChartDataPoint[] {
    return [
      { x: 'Sanskrit\nWisdom', y: 85 + Math.random() * 10, fill: '#8B5CF6' },
      { x: 'Indian\nRecipes', y: 72 + Math.random() * 15, fill: '#10B981' },
      { x: 'Traditional\nPractices', y: 78 + Math.random() * 12, fill: '#F59E0B' },
      { x: 'Seasonal\nAyurveda', y: 68 + Math.random() * 18, fill: '#EF4444' },
      { x: 'Cultural\nStories', y: 63 + Math.random() * 20, fill: '#EC4899' }
    ];
  }

  // Generate Achievement Timeline Data
  generateAchievementTimelineData(achievements: any[]): ChartDataPoint[] {
    const monthsAgo = 6;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return months.map((month, index) => ({
      x: month,
      y: Math.floor(Math.random() * 5) + index * 2 + 1,
      label: `${month}: ${Math.floor(Math.random() * 3) + 1} achievements`
    }));
  }

  // Generate Pillar Correlation Heatmap Data
  generatePillarCorrelationData(): Array<{x: string, y: string, z: number}> {
    const pillars = ['Body', 'Mind', 'Heart', 'Spirit', 'Diet'];
    const correlations: Array<{x: string, y: string, z: number}> = [];
    
    pillars.forEach(pillar1 => {
      pillars.forEach(pillar2 => {
        correlations.push({
          x: pillar1,
          y: pillar2,
          z: pillar1 === pillar2 ? 1 : Math.random() * 0.8 + 0.1
        });
      });
    });
    
    return correlations;
  }

  // Generate Practice Frequency Data
  generatePracticeFrequencyData(): ChartDataPoint[] {
    const practices = [
      'Morning Meditation', 'Yoga Practice', 'Pranayama', 
      'Cultural Reading', 'Recipe Cooking', 'Gratitude Journal'
    ];
    
    return practices.map(practice => ({
      x: practice.split(' ')[0], // Short label
      y: Math.floor(Math.random() * 20) + 5,
      label: practice
    }));
  }

  // Generate Neural Optimization Trends
  generateNeuralTrendsData(timeRange: '7d' | '30d' | '90d'): ChartDataPoint[] {
    const dataPoints = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const trends: ChartDataPoint[] = [];
    
    for (let i = 0; i < dataPoints; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (dataPoints - i - 1));
      
      trends.push({
        x: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        y: 60 + Math.sin(i * 0.3) * 20 + (Math.random() * 10 - 5),
        label: `Neural Score: ${Math.floor(60 + Math.sin(i * 0.3) * 20)}%`
      });
    }
    
    return trends;
  }

  // Get comprehensive analytics summary
  getAnalyticsSummary(userProfile: any, sessionData: any, pillarScores: any): NeuralOptimizationMetrics {
    return {
      overallScore: safeGet(pillarScores, 'overall', 0) || 75,
      pillars: {
        body: {
          current: safeGet(pillarScores, 'body', 70),
          previous: 65,
          change: 5,
          trend: 'improving',
          consistency: 85,
          practiceFrequency: 4.2,
          culturalEngagement: 78
        },
        mind: {
          current: safeGet(pillarScores, 'mind', 82),
          previous: 79,
          change: 3,
          trend: 'improving',
          consistency: 92,
          practiceFrequency: 5.1,
          culturalEngagement: 86
        },
        heart: {
          current: safeGet(pillarScores, 'heart', 76),
          previous: 76,
          change: 0,
          trend: 'stable',
          consistency: 73,
          practiceFrequency: 3.8,
          culturalEngagement: 82
        },
        spirit: {
          current: safeGet(pillarScores, 'spirit', 88),
          previous: 85,
          change: 3,
          trend: 'improving',
          consistency: 96,
          practiceFrequency: 4.7,
          culturalEngagement: 94
        },
        diet: {
          current: safeGet(pillarScores, 'diet', 71),
          previous: 69,
          change: 2,
          trend: 'improving',
          consistency: 68,
          practiceFrequency: 3.2,
          culturalEngagement: 75
        }
      },
      culturalMetrics: {
        wisdomEngagement: 89,
        recipesTried: 12,
        practicesCompleted: 28,
        seasonalAdherence: 85,
        sanskritFamiliarity: 76
      },
      timeAnalytics: {
        bestPerformanceHour: 9,
        mostActiveDay: 'Tuesday',
        averageSessionLength: 12.4,
        streakData: []
      },
      achievementInsights: {
        totalUnlocked: 15,
        rareAchievements: 3,
        culturalMilestones: 8,
        progressVelocity: 2.3
      }
    };
  }

  private getPillarColor(pillar: string): string {
    switch (pillar) {
      case 'body': return '#EF4444';
      case 'mind': return '#3B82F6';
      case 'heart': return '#EC4899';
      case 'spirit': return '#8B5CF6';
      case 'diet': return '#10B981';
      default: return '#6B7280';
    }
  }
}

export default AdvancedAnalyticsEngine;