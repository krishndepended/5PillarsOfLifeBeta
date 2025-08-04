// src/services/PerformanceService.tsx - PERFORMANCE OPTIMIZATION
import { InteractionManager, PixelRatio } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  networkRequests: number;
  crashReports: number;
}

class PerformanceService {
  private static instance: PerformanceService;
  private performanceMetrics: PerformanceMetrics = {
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
    networkRequests: 0,
    crashReports: 0
  };

  public static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  // Optimize images based on device capabilities
  getOptimizedImageSize(width: number, height: number) {
    const pixelRatio = PixelRatio.get();
    const screenScale = PixelRatio.getFontScale();
    
    return {
      width: Math.round(width * Math.min(pixelRatio, 2)), // Cap at 2x for performance
      height: Math.round(height * Math.min(pixelRatio, 2)),
      quality: pixelRatio > 2 ? 0.8 : 0.9 // Lower quality for high-density screens
    };
  }

  // Debounce function for performance-critical operations
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate?: boolean
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      
      const callNow = immediate && !timeout;
      
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      
      if (callNow) func(...args);
    };
  }

  // Throttle function for scroll events
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return function executedFunction(...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Run after interactions for smooth animations
  runAfterInteractions(callback: () => void): Promise<void> {
    return new Promise((resolve) => {
      InteractionManager.runAfterInteractions(() => {
        callback();
        resolve();
      });
    });
  }

  // Memory management
  async clearCache() {
    try {
      // Clear non-essential cached data
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.startsWith('cache_') || 
        key.startsWith('temp_') ||
        key.startsWith('old_')
      );
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
        console.log(`Cleared ${cacheKeys.length} cache items`);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Bundle size optimization helpers
  shouldUseLazyLoading(): boolean {
    // Enable lazy loading on lower-end devices
    const pixelRatio = PixelRatio.get();
    return pixelRatio < 2; // Devices with lower pixel density
  }

  getOptimizedFlatListProps() {
    return {
      removeClippedSubviews: true,
      maxToRenderPerBatch: 10,
      windowSize: 10,
      initialNumToRender: 5,
      getItemLayout: (data: any, index: number) => ({
        length: 100, // Estimated item height
        offset: 100 * index,
        index,
      }),
    };
  }

  // Performance monitoring
  trackRenderTime(componentName: string, startTime: number) {
    const endTime = Date.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 16) { // More than one frame at 60fps
      console.warn(`Slow render detected in ${componentName}: ${renderTime}ms`);
    }
    
    this.performanceMetrics.renderTime = renderTime;
  }

  trackMemoryUsage() {
    // Estimate memory usage (simplified)
    if (__DEV__) {
      console.log('Memory tracking enabled in development');
    }
  }

  // Network optimization
  createOptimizedHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=300', // 5 minutes cache
      'Accept-Encoding': 'gzip, deflate',
    };
  }

  // Battery optimization
  getSustainableSettings() {
    return {
      animationDuration: 200, // Shorter animations save battery
      backgroundRefresh: false, // Disable background refresh
      locationAccuracy: 'balanced', // Use balanced location accuracy
      networkTimeout: 10000, // 10 second timeout
    };
  }
}

export default PerformanceService;

// Performance hooks
export const usePerformanceOptimization = () => {
  const performanceService = PerformanceService.getInstance();

  const optimizedImageSize = React.useCallback(
    (width: number, height: number) => 
      performanceService.getOptimizedImageSize(width, height),
    []
  );

  const debouncedCallback = React.useCallback(
    (callback: Function, delay: number = 300) =>
      performanceService.debounce(callback, delay),
    []
  );

  const throttledCallback = React.useCallback(
    (callback: Function, limit: number = 100) =>
      performanceService.throttle(callback, limit),
    []
  );

  const runAfterInteractions = React.useCallback(
    (callback: () => void) => 
      performanceService.runAfterInteractions(callback),
    []
  );

  return {
    optimizedImageSize,
    debouncedCallback,
    throttledCallback,
    runAfterInteractions,
    shouldUseLazyLoading: performanceService.shouldUseLazyLoading(),
    optimizedFlatListProps: performanceService.getOptimizedFlatListProps(),
    trackRenderTime: performanceService.trackRenderTime,
  };
};
