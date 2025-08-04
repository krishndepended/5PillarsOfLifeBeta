export interface NeurogenesisWindow {
  pillar: string;
  isOptimal: boolean;
  optimizationLevel: number;
  timeWindow: string;
  scientificReason: string;
  recommendations: string[];
  nextOptimalTime: string;
}

class NeurogenesisService {
  private hour = () => new Date().getHours();

  getPillarStatus(pillar: string): NeurogenesisWindow {
    const h = this.hour();

    // Morning BDNF peak
    if (h >= 6 && h < 11 && ['BODY', 'MIND', 'DIET'].includes(pillar)) {
      return this.buildWindow(pillar, true, 75, 100, 'MORNING BDNF PEAK', 'TOMORROW 06:00');
    }

    // Afternoon focus (Mind only)
    if (h >= 12 && h < 17 && pillar === 'MIND') {
      return this.buildWindow(pillar, true, 70, 90, 'AFTERNOON FOCUS PEAK', 'TOMORROW 06:00');
    }

    // Evening serotonin peak
    if (h >= 18 && h < 22 && ['HEART', 'SPIRIT'].includes(pillar)) {
      return this.buildWindow(pillar, true, 75, 100, 'EVENING EMOTIONAL PEAK', 'TOMORROW 18:00');
    }

    // Default active
    return this.buildWindow(pillar, false, 30, 70, 'STANDARD ACTIVE MODE', this.nextOptimal(pillar));
  }

  getAllStatuses(): NeurogenesisWindow[] {
    return ['BODY', 'MIND', 'HEART', 'SPIRIT', 'DIET'].map(p => this.getPillarStatus(p));
  }

  private buildWindow(
    pillar: string,
    optimal: boolean,
    min: number,
    max: number,
    window: string,
    next: string,
  ): NeurogenesisWindow {
    return {
      pillar,
      isOptimal: optimal,
      optimizationLevel: Math.floor(Math.random() * (max - min + 1)) + min,
      timeWindow: window,
      scientificReason: '',
      recommendations: [],
      nextOptimalTime: next,
    };
  }

  private nextOptimal(pillar: string) {
    return ['BODY', 'MIND', 'DIET'].includes(pillar)
      ? 'TOMORROW 06:00-11:00'
      : 'TODAY 18:00-22:00';
  }
}

export default new NeurogenesisService();
