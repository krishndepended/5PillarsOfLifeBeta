// src/utils/PerformanceManager.ts - ADVANCED PERFORMANCE MONITORING
import { Platform, InteractionManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: number;
  memory?: number;
  pillar?: string;
}

class PerformanceManager {
  private metrics: PerformanceMetric[] = [];
  private isEnabled = __DEV__;

  startTimer(operation: string): () => void {
    if (!this.isEnabled) return () => {};
    
    const startTime = Date.now();
    const startMemory = this.getMemoryUsage();
    
    return () => {
      const duration = Date.now() - startTime;
      const endMemory = this.getMemoryUsage();
      
      this.recordMetric({
        operation,
        duration,
        timestamp: Date.now(),
        memory: endMemory - startMemory
      });
      
      // Log slow operations
      if (duration > 1000) {
        console.warn(`⚠️ Slow operation detected: ${operation} took ${duration}ms`);
      }
    };
  }

  private recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
    
    // Auto-save critical metrics
    if (metric.duration > 500) {
      this.saveSlowOperations();
    }
  }

  private getMemoryUsage(): number {
    if (Platform.OS === 'android') {
      // Android memory tracking
      return (global as any).performance?.memory?.usedJSHeapSize || 0;
    }
    return 0;
  }

  async getPerformanceReport(): Promise<{
    avgResponseTime: number;
    slowOperations: PerformanceMetric[];
    memoryLeaks: PerformanceMetric[];
    recommendations: string[];
  }> {
    const avgResponseTime = this.metrics.reduce((sum, m) => sum + m.duration, 0) / this.metrics.length;
    const slowOperations = this.metrics.filter(m => m.duration > 500);
    const memoryLeaks = this.metrics.filter(m => (m.memory || 0) > 10000000); // 10MB+
    
    const recommendations = [];
    if (avgResponseTime > 300) recommendations.push('Consider reducing component complexity');
    if (slowOperations.length > 5) recommendations.push('Optimize slow operations with async loading');
    if (memoryLeaks.length > 0) recommendations.push('Investigate memory leaks in components');
    
    return { avgResponseTime, slowOperations, memoryLeaks, recommendations };
  }

  private async saveSlowOperations() {
    try {
      const slowOps = this.metrics.filter(m => m.duration > 500);
      await AsyncStorage.setItem('slowOperations', JSON.stringify(slowOps));
    } catch (error) {
      console.error('Failed to save slow operations:', error);
    }
  }

  // Hook for React components
  usePerformanceTimer(operation: string, dependencies: any[] = []) {
    React.useEffect(() => {
      const stopTimer = this.startTimer(operation);
      return stopTimer;
    }, dependencies);
  }
}

export default new PerformanceManager();

// React Hook for easy component integration
export const usePerformance = (componentName: string) => {
  React.useEffect(() => {
    const stopTimer = PerformanceManager.startTimer(`${componentName}_render`);
    return stopTimer;
  }, [componentName]);
};
