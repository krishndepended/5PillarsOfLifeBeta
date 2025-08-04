// src/services/WearableIntegration.tsx
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import { Platform } from 'react-native';

interface HealthMetrics {
  heartRate?: number;
  steps?: number;
  sleepHours?: number;
  activeMinutes?: number;
  calories?: number;
  hrv?: number; // Heart Rate Variability
  restingHeartRate?: number;
  vo2Max?: number;
}

interface SleepData {
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  stages: {
    deep: number;
    light: number;
    rem: number;
    awake: number;
  };
}

export class WearableIntegration {
  private static instance: WearableIntegration;
  private isHealthKitAvailable = false;

  public static getInstance(): WearableIntegration {
    if (!WearableIntegration.instance) {
      WearableIntegration.instance = new WearableIntegration();
    }
    return WearableIntegration.instance;
  }

  async initialize(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      console.log('HealthKit only available on iOS');
      return false;
    }

    try {
      // Check if HealthKit is available
      this.isHealthKitAvailable = await HealthKit.isHealthKitAvailableAsync();
      
      if (!this.isHealthKitAvailable) {
        console.log('HealthKit not available on this device');
        return false;
      }

      // Request permissions
      const permissions = {
        read: [
          HealthKit.HealthKitPermissions.HeartRate,
          HealthKit.HealthKitPermissions.Steps,
          HealthKit.HealthKitPermissions.SleepAnalysis,
          HealthKit.HealthKitPermissions.ActiveEnergyBurned,
          HealthKit.HealthKitPermissions.RestingHeartRate,
          HealthKit.HealthKitPermissions.HeartRateVariability,
        ],
        write: [
          HealthKit.HealthKitPermissions.Workout,
        ],
      };

      const { status } = await HealthKit.requestPermissionsAsync(permissions);
      
      return status === HealthKit.HealthKitAuthorizationStatus.SharingAuthorized;
    } catch (error) {
      console.error('Error initializing HealthKit:', error);
      return false;
    }
  }

  async getLatestHealthMetrics(): Promise<HealthMetrics> {
    if (!this.isHealthKitAvailable) {
      return this.getMockHealthData();
    }

    try {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const [heartRate, steps, activeMinutes, calories, restingHeartRate, hrv] = await Promise.all([
        this.getHeartRate(twentyFourHoursAgo, now),
        this.getSteps(twentyFourHoursAgo, now),
        this.getActiveMinutes(twentyFourHoursAgo, now),
        this.getCalories(twentyFourHoursAgo, now),
        this.getRestingHeartRate(twentyFourHoursAgo, now),
        this.getHeartRateVariability(twentyFourHoursAgo, now),
      ]);

      return {
        heartRate,
        steps,
        activeMinutes,
        calories,
        restingHeartRate,
        hrv,
      };
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      return this.getMockHealthData();
    }
  }

  private async getHeartRate(startDate: Date, endDate: Date): Promise<number | undefined> {
    try {
      const samples = await HealthKit.queryQuantitySamplesAsync(
        HealthKit.HealthKitSampleType.HeartRate,
        { startDate, endDate }
      );

      if (samples.length > 0) {
        const latestSample = samples[samples.length - 1];
        return Math.round(latestSample.quantity);
      }
    } catch (error) {
      console.error('Error fetching heart rate:', error);
    }
    return undefined;
  }

  private async getSteps(startDate: Date, endDate: Date): Promise<number | undefined> {
    try {
      const samples = await HealthKit.queryQuantitySamplesAsync(
        HealthKit.HealthKitSampleType.StepCount,
        { startDate, endDate }
      );

      const totalSteps = samples.reduce((sum, sample) => sum + sample.quantity, 0);
      return Math.round(totalSteps);
    } catch (error) {
      console.error('Error fetching steps:', error);
    }
    return undefined;
  }

  private async getActiveMinutes(startDate: Date, endDate: Date): Promise<number | undefined> {
    try {
      const samples = await HealthKit.queryQuantitySamplesAsync(
        HealthKit.HealthKitSampleType.AppleExerciseTime,
        { startDate, endDate }
      );

      const totalMinutes = samples.reduce((sum, sample) => sum + sample.quantity, 0);
      return Math.round(totalMinutes);
    } catch (error) {
      console.error('Error fetching active minutes:', error);
    }
    return undefined;
  }

  private async getCalories(startDate: Date, endDate: Date): Promise<number | undefined> {
    try {
      const samples = await HealthKit.queryQuantitySamplesAsync(
        HealthKit.HealthKitSampleType.ActiveEnergyBurned,
        { startDate, endDate }
      );

      const totalCalories = samples.reduce((sum, sample) => sum + sample.quantity, 0);
      return Math.round(totalCalories);
    } catch (error) {
      console.error('Error fetching calories:', error);
    }
    return undefined;
  }

  private async getRestingHeartRate(startDate: Date, endDate: Date): Promise<number | undefined> {
    try {
      const samples = await HealthKit.queryQuantitySamplesAsync(
        HealthKit.HealthKitSampleType.RestingHeartRate,
        { startDate, endDate }
      );

      if (samples.length > 0) {
        const latestSample = samples[samples.length - 1];
        return Math.round(latestSample.quantity);
      }
    } catch (error) {
      console.error('Error fetching resting heart rate:', error);
    }
    return undefined;
  }

  private async getHeartRateVariability(startDate: Date, endDate: Date): Promise<number | undefined> {
    try {
      const samples = await HealthKit.queryQuantitySamplesAsync(
        HealthKit.HealthKitSampleType.HeartRateVariabilitySDNN,
        { startDate, endDate }
      );

      if (samples.length > 0) {
        const latestSample = samples[samples.length - 1];
        return Math.round(latestSample.quantity);
      }
    } catch (error) {
      console.error('Error fetching HRV:', error);
    }
    return undefined;
  }

  async getSleepData(): Promise<SleepData | null> {
    if (!this.isHealthKitAvailable) {
      return this.getMockSleepData();
    }

    try {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const sleepSamples = await HealthKit.queryCategorySamplesAsync(
        HealthKit.HealthKitSampleType.SleepAnalysis,
        { startDate: yesterday, endDate: now }
      );

      if (sleepSamples.length === 0) {
        return null;
      }

      // Process sleep samples to extract meaningful data
      const sleepPeriods = sleepSamples.map(sample => ({
        startDate: sample.startDate,
        endDate: sample.endDate,
        value: sample.value // 0 = InBed, 1 = Asleep, 2 = Awake
      }));

      // Find the main sleep period
      const asleepPeriods = sleepPeriods.filter(p => p.value === 1);
      
      if (asleepPeriods.length === 0) {
        return null;
      }

      const bedtime = asleepPeriods[0].startDate;
      const wakeTime = asleepPeriods[asleepPeriods.length - 1].endDate;
      const duration = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60); // in hours

      return {
        bedtime: bedtime.toISOString(),
        wakeTime: wakeTime.toISOString(),
        duration,
        quality: this.calculateSleepQuality(duration, asleepPeriods.length),
        stages: {
          deep: duration * 0.15, // Estimated 15% deep sleep
          light: duration * 0.55, // Estimated 55% light sleep
          rem: duration * 0.25,   // Estimated 25% REM sleep
          awake: duration * 0.05  // Estimated 5% awake time
        }
      };
    } catch (error) {
      console.error('Error fetching sleep data:', error);
      return null;
    }
  }

  private calculateSleepQuality(duration: number, interruptions: number): number {
    // Simple sleep quality calculation based on duration and interruptions
    let quality = 100;
    
    // Penalize for too short or too long sleep
    if (duration < 6) {
      quality -= (6 - duration) * 10;
    } else if (duration > 9) {
      quality -= (duration - 9) * 5;
    }
    
    // Penalize for interruptions
    quality -= Math.max(0, (interruptions - 1) * 5);
    
    return Math.max(0, Math.min(100, quality));
  }

  // Mock data for testing/development
  private getMockHealthData(): HealthMetrics {
    return {
      heartRate: 75 + Math.floor(Math.random() * 20),
      steps: 8000 + Math.floor(Math.random() * 4000),
      sleepHours: 7 + Math.random() * 2,
      activeMinutes: 30 + Math.floor(Math.random() * 60),
      calories: 2000 + Math.floor(Math.random() * 800),
      hrv: 25 + Math.floor(Math.random() * 25),
      restingHeartRate: 60 + Math.floor(Math.random() * 15),
    };
  }

  private getMockSleepData(): SleepData {
    const bedtime = new Date();
    bedtime.setHours(22, 30, 0, 0);
    const wakeTime = new Date();
    wakeTime.setHours(6, 45, 0, 0);
    wakeTime.setDate(wakeTime.getDate() + 1);

    const duration = 8.25;

    return {
      bedtime: bedtime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      duration,
      quality: 85,
      stages: {
        deep: 1.2,
        light: 4.5,
        rem: 2.1,
        awake: 0.45
      }
    };
  }

  // Calculate neural readiness score based on health metrics
  calculateNeuralReadiness(metrics: HealthMetrics): number {
    let score = 100;
    
    // Heart rate variability (higher is better)
    if (metrics.hrv) {
      if (metrics.hrv < 20) score -= 15;
      else if (metrics.hrv > 40) score += 5;
    }
    
    // Resting heart rate (lower is generally better)
    if (metrics.restingHeartRate) {
      if (metrics.restingHeartRate > 80) score -= 10;
      else if (metrics.restingHeartRate < 60) score += 5;
    }
    
    // Sleep duration
    if (metrics.sleepHours) {
      if (metrics.sleepHours < 6) score -= 20;
      else if (metrics.sleepHours < 7) score -= 10;
      else if (metrics.sleepHours > 9) score -= 5;
    }
    
    // Activity level
    if (metrics.activeMinutes) {
      if (metrics.activeMinutes < 20) score -= 10;
      else if (metrics.activeMinutes > 60) score += 5;
    }
    
    return Math.max(0, Math.min(100, score));
  }
}
