// src/services/MLPatternRecognition.tsx
interface UserBehaviorData {
  timestamp: string;
  pillar: string;
  duration: number;
  performance: number;
  mood: number;
  energy: number;
  context: {
    timeOfDay: number;
    dayOfWeek: number;
    weather?: string;
    location?: string;
  };
}

interface Pattern {
  id: string;
  type: 'temporal' | 'performance' | 'mood' | 'energy';
  confidence: number;
  description: string;
  insights: string[];
  recommendations: string[];
}

export class MLPatternRecognition {
  private static instance: MLPatternRecognition;
  private behaviorData: UserBehaviorData[] = [];
  private patterns: Pattern[] = [];

  public static getInstance(): MLPatternRecognition {
    if (!MLPatternRecognition.instance) {
      MLPatternRecognition.instance = new MLPatternRecognition();
    }
    return MLPatternRecognition.instance;
  }

  addBehaviorData(data: UserBehaviorData): void {
    this.behaviorData.push(data);
    
    // Keep only last 90 days of data
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    this.behaviorData = this.behaviorData.filter(
      item => new Date(item.timestamp) > ninetyDaysAgo
    );

    // Trigger pattern analysis if we have enough data
    if (this.behaviorData.length >= 10) {
      this.analyzePatterns();
    }
  }

  private analyzePatterns(): void {
    this.patterns = [];
    
    // Analyze temporal patterns
    this.analyzeTemporalPatterns();
    
    // Analyze performance patterns
    this.analyzePerformancePatterns();
    
    // Analyze mood patterns
    this.analyzeMoodPatterns();
    
    // Analyze energy patterns
    this.analyzeEnergyPatterns();
  }

  private analyzeTemporalPatterns(): void {
    const timeSlots = new Map<number, UserBehaviorData[]>();
    
    // Group data by hour of day
    this.behaviorData.forEach(data => {
      const hour = data.context.timeOfDay;
      if (!timeSlots.has(hour)) {
        timeSlots.set(hour, []);
      }
      timeSlots.get(hour)!.push(data);
    });

    // Find peak performance times
    let bestHour = -1;
    let bestPerformance = 0;
    
    timeSlots.forEach((sessions, hour) => {
      const avgPerformance = sessions.reduce((sum, s) => sum + s.performance, 0) / sessions.length;
      if (avgPerformance > bestPerformance && sessions.length >= 3) {
        bestPerformance = avgPerformance;
        bestHour = hour;
      }
    });

    if (bestHour !== -1) {
      this.patterns.push({
        id: 'temporal_peak',
        type: 'temporal',
        confidence: 0.85,
        description: `Peak performance consistently occurs around ${bestHour}:00`,
        insights: [
          `Your neural performance peaks at ${bestHour}:00`,
          `${Math.round(bestPerformance)}% average performance during this time`,
          'Consistent pattern observed over multiple sessions'
        ],
        recommendations: [
          `Schedule your most important tasks around ${bestHour}:00`,
          'Block this time for deep work and challenging activities',
          'Avoid distractions during your peak performance window'
        ]
      });
    }

    // Analyze day-of-week patterns
    const dayPatterns = new Map<number, number[]>();
    this.behaviorData.forEach(data => {
      const day = data.context.dayOfWeek;
      if (!dayPatterns.has(day)) {
        dayPatterns.set(day, []);
      }
      dayPatterns.get(day)!.push(data.performance);
    });

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let bestDay = -1;
    let bestDayPerformance = 0;

    dayPatterns.forEach((performances, day) => {
      const avg = performances.reduce((sum, p) => sum + p, 0) / performances.length;
      if (avg > bestDayPerformance) {
        bestDayPerformance = avg;
        bestDay = day;
      }
    });

    if (bestDay !== -1) {
      this.patterns.push({
        id: 'weekly_peak',
        type: 'temporal',
        confidence: 0.78,
        description: `${dayNames[bestDay]} shows consistently higher performance`,
        insights: [
          `${dayNames[bestDay]} is your strongest day of the week`,
          `${Math.round(bestDayPerformance)}% average performance`,
          'Plan important activities on this day'
        ],
        recommendations: [
          `Schedule challenging goals on ${dayNames[bestDay]}`,
          'Use this day for breakthrough sessions',
          'Maintain consistent sleep before this day'
        ]
      });
    }
  }

  private analyzePerformancePatterns(): void {
    // Analyze pillar-specific performance
    const pillarPerformance = new Map<string, number[]>();
    
    this.behaviorData.forEach(data => {
      if (!pillarPerformance.has(data.pillar)) {
        pillarPerformance.set(data.pillar, []);
      }
      pillarPerformance.get(data.pillar)!.push(data.performance);
    });

    let strongestPillar = '';
    let highestAvg = 0;
    let weakestPillar = '';
    let lowestAvg = 100;

    pillarPerformance.forEach((performances, pillar) => {
      const avg = performances.reduce((sum, p) => sum + p, 0) / performances.length;
      if (avg > highestAvg) {
        highestAvg = avg;
        strongestPillar = pillar;
      }
      if (avg < lowestAvg) {
        lowestAvg = avg;
        weakestPillar = pillar;
      }
    });

    if (strongestPillar) {
      this.patterns.push({
        id: 'pillar_strength',
        type: 'performance',
        confidence: 0.82,
        description: `${strongestPillar} pillar shows exceptional performance`,
        insights: [
          `${strongestPillar} is your strongest pillar at ${Math.round(highestAvg)}% performance`,
          'Consistent high scores across multiple sessions',
          'Natural affinity and developed skill in this area'
        ],
        recommendations: [
          `Use ${strongestPillar} success strategies for other pillars`,
          'Leverage this strength to build momentum',
          'Consider becoming a mentor in this area'
        ]
      });
    }

    if (weakestPillar && lowestAvg < 70) {
      this.patterns.push({
        id: 'pillar_opportunity',
        type: 'performance',
        confidence: 0.75,
        description: `${weakestPillar} pillar needs focused attention`,
        insights: [
          `${weakestPillar} shows lower performance at ${Math.round(lowestAvg)}%`,
          'Opportunity for significant improvement',
          'Addressing this could boost overall neural score'
        ],
        recommendations: [
          `Allocate 20% more time to ${weakestPillar} activities`,
          'Break down challenges into smaller, manageable steps',
          'Seek guidance or resources specific to this pillar'
        ]
      });
    }
  }

  private analyzeMoodPatterns(): void {
    // Analyze correlation between mood and performance
    const moodPerformanceData = this.behaviorData.map(d => ({
      mood: d.mood,
      performance: d.performance
    }));

    if (moodPerformanceData.length < 10) return;

    // Simple correlation calculation
    const correlation = this.calculateCorrelation(
      moodPerformanceData.map(d => d.mood),
      moodPerformanceData.map(d => d.performance)
    );

    if (correlation > 0.6) {
      this.patterns.push({
        id: 'mood_performance_correlation',
        type: 'mood',
        confidence: Math.min(correlation, 0.95),
        description: 'Strong correlation between mood and performance detected',
        insights: [
          `${Math.round(correlation * 100)}% correlation between mood and performance`,
          'Better mood consistently leads to better results',
          'Mood management is key to optimization'
        ],
        recommendations: [
          'Prioritize mood-boosting activities before important sessions',
          'Track mood patterns to predict performance windows',
          'Develop mood regulation techniques for consistency'
        ]
      });
    }
  }

  private analyzeEnergyPatterns(): void {
    // Group by energy levels and analyze performance
    const energyGroups = {
      low: this.behaviorData.filter(d => d.energy <= 3),
      medium: this.behaviorData.filter(d => d.energy > 3 && d.energy <= 7),
      high: this.behaviorData.filter(d => d.energy > 7)
    };

    const energyPerformance = {
      low: energyGroups.low.reduce((sum, d) => sum + d.performance, 0) / (energyGroups.low.length || 1),
      medium: energyGroups.medium.reduce((sum, d) => sum + d.performance, 0) / (energyGroups.medium.length || 1),
      high: energyGroups.high.reduce((sum, d) => sum + d.performance, 0) / (energyGroups.high.length || 1)
    };

    const performanceDiff = energyPerformance.high - energyPerformance.low;

    if (performanceDiff > 20) {
      this.patterns.push({
        id: 'energy_performance_link',
        type: 'energy',
        confidence: 0.88,
        description: 'Energy levels significantly impact performance',
        insights: [
          `${Math.round(performanceDiff)}% performance difference between high and low energy`,
          'Energy management is crucial for optimization',
          'High energy sessions show consistently better results'
        ],
        recommendations: [
          'Track and optimize factors that affect your energy',
          'Schedule important activities during high-energy periods',
          'Develop energy restoration techniques',
          'Consider power naps and energy-boosting nutrition'
        ]
      });
    }
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.reduce((sum, val) => sum + val * val, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  getPatterns(): Pattern[] {
    return this.patterns.sort((a, b) => b.confidence - a.confidence);
  }

  getPersonalizedRecommendations(): string[] {
    const recommendations: string[] = [];
    
    this.patterns.forEach(pattern => {
      recommendations.push(...pattern.recommendations);
    });

    // Remove duplicates and return top 5
    return [...new Set(recommendations)].slice(0, 5);
  }

  getPredictedOptimalTime(): { hour: number; confidence: number } | null {
    const temporalPatterns = this.patterns.filter(p => p.type === 'temporal');
    
    if (temporalPatterns.length > 0) {
      const peakPattern = temporalPatterns.find(p => p.id === 'temporal_peak');
      if (peakPattern) {
        const hour = parseInt(peakPattern.description.match(/(\d+):00/)?.[1] || '0');
        return { hour, confidence: peakPattern.confidence };
      }
    }

    return null;
  }
}
