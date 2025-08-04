// src/services/AdvancedHealthMetrics.tsx
import { WearableIntegration } from './WearableIntegration';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BiometricData {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  bloodOxygen: number;
  bodyTemperature: number;
  respiratoryRate: number;
  timestamp: string;
}

interface SleepAnalysis {
  duration: number;
  quality: number;
  stages: {
    deep: number;
    light: number;
    rem: number;
    awake: number;
  };
  bedtime: string;
  wakeTime: string;
  sleepScore: number;
  recommendations: string[];
}

interface StressMetrics {
  hrv: number; // Heart Rate Variability
  stressLevel: number; // 1-10 scale
  cortisol: number; // estimated
  recoveryTime: number; // hours
  stressFactors: string[];
  interventions: string[];
}

interface NutritionInsights {
  macros: { protein: number; carbs: number; fats: number };
  micronutrients: { [key: string]: number };
  hydration: number;
  nutritionScore: number;
  deficiencies: string[];
  recommendations: string[];
}

interface WellnessInsight {
  id: string;
  category: 'sleep' | 'stress' | 'nutrition' | 'fitness' | 'mental';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
  recommendations: string[];
  timestamp: string;
}

export class AdvancedHealthMetrics {
  private static instance: AdvancedHealthMetrics;
  private wearableIntegration: WearableIntegration;
  private healthHistory: BiometricData[] = [];
  private insights: WellnessInsight[] = [];

  public static getInstance(): AdvancedHealthMetrics {
    if (!AdvancedHealthMetrics.instance) {
      AdvancedHealthMetrics.instance = new AdvancedHealthMetrics();
    }
    return AdvancedHealthMetrics.instance;
  }

  constructor() {
    this.wearableIntegration = WearableIntegration.getInstance();
  }

  // Comprehensive health assessment
  async generateHealthAssessment(): Promise<{
    overallScore: number;
    biometrics: BiometricData;
    sleep: SleepAnalysis;
    stress: StressMetrics;
    nutrition: NutritionInsights;
    insights: WellnessInsight[];
  }> {
    
    const healthMetrics = await this.wearableIntegration.getLatestHealthMetrics();
    const sleepData = await this.wearableIntegration.getSleepData();
    
    const biometrics = await this.analyzeBiometrics(healthMetrics);
    const sleep = await this.analyzeSleep(sleepData);
    const stress = await this.analyzeStress(healthMetrics);
    const nutrition = await this.analyzeNutrition();
    
    // Generate AI insights
    const insights = await this.generateHealthInsights(biometrics, sleep, stress, nutrition);
    
    // Calculate overall wellness score
    const overallScore = this.calculateOverallWellnessScore(biometrics, sleep, stress, nutrition);
    
    return {
      overallScore,
      biometrics,
      sleep,
      stress,
      nutrition,
      insights
    };
  }

  private async analyzeBiometrics(healthMetrics: any): Promise<BiometricData> {
    // Simulate comprehensive biometric analysis
    return {
      heartRate: healthMetrics.heartRate || 72,
      bloodPressure: {
        systolic: 120 + Math.floor(Math.random() * 20),
        diastolic: 80 + Math.floor(Math.random() * 10)
      },
      bloodOxygen: 97 + Math.floor(Math.random() * 3),
      bodyTemperature: 98.6 + (Math.random() - 0.5),
      respiratoryRate: 12 + Math.floor(Math.random() * 8),
      timestamp: new Date().toISOString()
    };
  }

  private async analyzeSleep(sleepData: any): Promise<SleepAnalysis> {
    if (!sleepData) {
      return this.generateMockSleepAnalysis();
    }

    const sleepScore = this.calculateSleepScore(sleepData);
    const recommendations = this.generateSleepRecommendations(sleepData);

    return {
      duration: sleepData.duration,
      quality: sleepData.quality,
      stages: sleepData.stages,
      bedtime: sleepData.bedtime,
      wakeTime: sleepData.wakeTime,
      sleepScore,
      recommendations
    };
  }

  private calculateSleepScore(sleepData: any): number {
    let score = 100;
    
    // Duration scoring
    if (sleepData.duration < 6) score -= 30;
    else if (sleepData.duration < 7) score -= 15;
    else if (sleepData.duration > 9) score -= 10;
    
    // Quality factors
    const deepSleepPercentage = (sleepData.stages.deep / sleepData.duration) * 100;
    if (deepSleepPercentage < 15) score -= 20;
    else if (deepSleepPercentage > 25) score += 10;
    
    const remPercentage = (sleepData.stages.rem / sleepData.duration) * 100;
    if (remPercentage < 20) score -= 15;
    else if (remPercentage > 30) score += 5;
    
    return Math.max(0, Math.min(100, score));
  }

  private generateSleepRecommendations(sleepData: any): string[] {
    const recommendations = [];
    
    if (sleepData.duration < 7) {
      recommendations.push('Aim for 7-9 hours of sleep for optimal neural recovery');
    }
    
    if (sleepData.stages.deep < sleepData.duration * 0.15) {
      recommendations.push('Improve deep sleep with cool room temperature (65-68°F)');
      recommendations.push('Avoid screens 2 hours before bed for better deep sleep');
    }
    
    if (sleepData.stages.rem < sleepData.duration * 0.20) {
      recommendations.push('REM sleep enhancement: maintain consistent sleep schedule');
      recommendations.push('Consider magnesium supplementation for REM optimization');
    }
    
    const bedtime = new Date(sleepData.bedtime);
    if (bedtime.getHours() > 23) {
      recommendations.push('Earlier bedtime (before 11 PM) aligns with circadian rhythms');
    }
    
    return recommendations;
  }

  private async analyzeStress(healthMetrics: any): Promise<StressMetrics> {
    // Calculate stress based on HRV and other markers
    const hrv = healthMetrics.hrv || 30;
    let stressLevel = 5; // Default moderate stress
    
    if (hrv > 40) stressLevel = 2; // Low stress
    else if (hrv > 25) stressLevel = 4; // Mild stress
    else if (hrv < 20) stressLevel = 8; // High stress
    
    const cortisol = this.estimateCortisol(stressLevel, new Date().getHours());
    const recoveryTime = this.calculateRecoveryTime(stressLevel, hrv);
    
    return {
      hrv,
      stressLevel,
      cortisol,
      recoveryTime,
      stressFactors: this.identifyStressFactors(stressLevel),
      interventions: this.recommendStressInterventions(stressLevel)
    };
  }

  private estimateCortisol(stressLevel: number, hour: number): number {
    // Cortisol typically peaks in morning, lowest at night
    let baseLevel = 15; // μg/dL
    
    // Circadian adjustment
    if (hour >= 6 && hour <= 9) baseLevel *= 1.5; // Morning peak
    else if (hour >= 22 || hour <= 2) baseLevel *= 0.3; // Night low
    
    // Stress adjustment
    baseLevel *= (1 + (stressLevel - 5) * 0.2);
    
    return Math.max(5, Math.min(30, baseLevel));
  }

  private calculateRecoveryTime(stressLevel: number, hrv: number): number {
    // Recovery time based on stress level and HRV
    const baseRecovery = stressLevel * 2; // hours
    const hrvAdjustment = hrv > 30 ? -2 : hrv < 20 ? +4 : 0;
    
    return Math.max(2, Math.min(24, baseRecovery + hrvAdjustment));
  }

  private identifyStressFactors(stressLevel: number): string[] {
    const factors = [];
    
    if (stressLevel >= 7) {
      factors.push('High physiological stress detected');
      factors.push('Potential sleep debt accumulation');
      factors.push('Autonomic nervous system imbalance');
    } else if (stressLevel >= 5) {
      factors.push('Moderate stress response active');
      factors.push('Possible lifestyle or environmental stressors');
    }
    
    return factors;
  }

  private recommendStressInterventions(stressLevel: number): string[] {
    const interventions = [];
    
    if (stressLevel >= 7) {
      interventions.push('Immediate: 4-7-8 breathing technique (3 cycles)');
      interventions.push('Short-term: 20-minute meditation or yoga session');
      interventions.push('Long-term: Consider stress management counseling');
    } else if (stressLevel >= 5) {
      interventions.push('Practice mindfulness for 10 minutes');
      interventions.push('Take a 15-minute nature walk');
      interventions.push('Engage in preferred relaxation activity');
    } else {
      interventions.push('Maintain current stress management practices');
      interventions.push('Continue regular exercise routine');
    }
    
    return interventions;
  }

  private async analyzeNutrition(): Promise<NutritionInsights> {
    // Simulate nutritional analysis based on user data
    return {
      macros: {
        protein: 150 + Math.floor(Math.random() * 50),
        carbs: 200 + Math.floor(Math.random() * 100),
        fats: 80 + Math.floor(Math.random() * 40)
      },
      micronutrients: {
        'Vitamin D': 400 + Math.floor(Math.random() * 200),
        'Vitamin B12': 2.4 + Math.random(),
        'Iron': 15 + Math.floor(Math.random() * 10),
        'Magnesium': 300 + Math.floor(Math.random() * 100),
        'Omega-3': 1.5 + Math.random()
      },
      hydration: 2.5 + Math.random(),
      nutritionScore: 75 + Math.floor(Math.random() * 20),
      deficiencies: this.identifyNutritionalDeficiencies(),
      recommendations: this.generateNutritionRecommendations()
    };
  }

  private identifyNutritionalDeficiencies(): string[] {
    const possibleDeficiencies = [
      'Vitamin D (optimize sun exposure or supplementation)',
      'Omega-3 fatty acids (increase fish or supplement intake)',
      'Magnesium (consider supplementation for better sleep)',
      'B-vitamins (focus on whole grains and leafy greens)'
    ];
    
    // Randomly select 0-2 deficiencies for demo
    const numDeficiencies = Math.floor(Math.random() * 3);
    return possibleDeficiencies.slice(0, numDeficiencies);
  }

  private generateNutritionRecommendations(): string[] {
    return [
      'Increase protein intake to 1.6g per kg body weight for optimal recovery',
      'Time carbohydrate intake around workouts for better performance',
      'Include anti-inflammatory foods: berries, leafy greens, fatty fish',
      'Maintain hydration at 35ml per kg body weight daily',
      'Consider intermittent fasting aligned with circadian rhythms'
    ];
  }

  private async generateHealthInsights(
    biometrics: BiometricData,
    sleep: SleepAnalysis,
    stress: StressMetrics,
    nutrition: NutritionInsights
  ): Promise<WellnessInsight[]> {
    
    const insights: WellnessInsight[] = [];
    
    // Sleep insights
    if (sleep.sleepScore < 70) {
      insights.push({
        id: 'sleep_quality_low',
        category: 'sleep',
        title: 'Sleep Quality Needs Attention',
        description: `Your sleep score of ${sleep.sleepScore}/100 indicates room for improvement in sleep quality and recovery.`,
        severity: 'medium',
        actionable: true,
        recommendations: sleep.recommendations,
        timestamp: new Date().toISOString()
      });
    }
    
    // Stress insights
    if (stress.stressLevel >= 7) {
      insights.push({
        id: 'stress_high',
        category: 'stress',
        title: 'Elevated Stress Levels Detected',
        description: `High stress level (${stress.stressLevel}/10) with low HRV (${stress.hrv}ms) suggests need for immediate stress management.`,
        severity: 'high',
        actionable: true,
        recommendations: stress.interventions,
        timestamp: new Date().toISOString()
      });
    }
    
    // Nutrition insights
    if (nutrition.nutritionScore < 80) {
      insights.push({
        id: 'nutrition_optimization',
        category: 'nutrition',
        title: 'Nutrition Optimization Opportunity',
        description: `Nutrition score of ${nutrition.nutritionScore}/100 suggests potential for dietary improvements.`,
        severity: 'low',
        actionable: true,
        recommendations: nutrition.recommendations,
        timestamp: new Date().toISOString()
      });
    }
    
    // Biometric insights
    if (biometrics.heartRate > 85 || biometrics.heartRate < 50) {
      insights.push({
        id: 'heart_rate_abnormal',
        category: 'fitness',
        title: 'Heart Rate Outside Optimal Range',
        description: `Resting heart rate of ${biometrics.heartRate} bpm may indicate fitness or health considerations.`,
        severity: biometrics.heartRate > 100 ? 'high' : 'medium',
        actionable: true,
        recommendations: [
          'Monitor heart rate trends over time',
          'Consider cardiovascular fitness assessment',
          'Consult healthcare provider if persistent'
        ],
        timestamp: new Date().toISOString()
      });
    }
    
    return insights;
  }

  private calculateOverallWellnessScore(
    biometrics: BiometricData,
    sleep: SleepAnalysis,
    stress: StressMetrics,
    nutrition: NutritionInsights
  ): number {
    
    // Weighted scoring system
    const sleepWeight = 0.3;
    const stressWeight = 0.25;
    const nutritionWeight = 0.25;
    const biometricsWeight = 0.2;
    
    const sleepScore = sleep.sleepScore;
    const stressScore = Math.max(0, 100 - (stress.stressLevel * 10));
    const nutritionScore = nutrition.nutritionScore;
    
    // Biometrics scoring (simplified)
    let biometricsScore = 100;
    if (biometrics.heartRate > 85 || biometrics.heartRate < 50) biometricsScore -= 20;
    if (biometrics.bloodPressure.systolic > 140) biometricsScore -= 30;
    if (biometrics.bloodOxygen < 95) biometricsScore -= 25;
    
    const overallScore = (
      sleepScore * sleepWeight +
      stressScore * stressWeight +
      nutritionScore * nutritionWeight +
      biometricsScore * biometricsWeight
    );
    
    return Math.round(Math.max(0, Math.min(100, overallScore)));
  }

  private generateMockSleepAnalysis(): SleepAnalysis {
    return {
      duration: 7.5,
      quality: 78,
      stages: {
        deep: 1.2,
        light: 4.8,
        rem: 1.3,
        awake: 0.2
      },
      bedtime: '2024-01-01T22:30:00Z',
      wakeTime: '2024-01-02T06:00:00Z',
      sleepScore: 82,
      recommendations: [
        'Maintain consistent sleep schedule',
        'Optimize bedroom environment for better deep sleep'
      ]
    };
  }

  // Get health trends over time
  async getHealthTrends(days: number = 30): Promise<{
    sleepTrend: number[];
    stressTrend: number[];
    energyTrend: number[];
    overallTrend: number[];
  }> {
    
    // Simulate trend data
    const trends = {
      sleepTrend: [],
      stressTrend: [],
      energyTrend: [],
      overallTrend: []
    };
    
    for (let i = 0; i < days; i++) {
      trends.sleepTrend.push(70 + Math.floor(Math.random() * 25));
      trends.stressTrend.push(3 + Math.floor(Math.random() * 5));
      trends.energyTrend.push(60 + Math.floor(Math.random() * 35));
      trends.overallTrend.push(75 + Math.floor(Math.random() * 20));
    }
    
    return trends;
  }

  // Save health data
  async saveHealthData(data: any): Promise<void> {
    try {
      this.healthHistory.push(data);
      await AsyncStorage.setItem('healthHistory', JSON.stringify(this.healthHistory));
    } catch (error) {
      console.error('Error saving health data:', error);
    }
  }

  // Get health insights
  getHealthInsights(): WellnessInsight[] {
    return this.insights.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }
}
