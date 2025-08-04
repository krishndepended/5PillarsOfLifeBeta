// src/hooks/usePerformanceOptimization.tsx - COMPLETE FIXED VERSION
import { useEffect, useCallback, useMemo, useRef } from 'react';
import { Platform, InteractionManager, Dimensions } from 'react-native';
import React from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
  screenSize: { width: number; height: number };
  isLowEndDevice: boolean;
}

export const usePerformanceOptimization = () => {
  const isWeb = Platform.OS === 'web';
  const isAndroid = Platform.OS === 'android';
  const isIOS = Platform.OS === 'ios';
  const performanceMetrics = useRef<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    frameRate: 60,
    screenSize: Dimensions.get('window'),
    isLowEndDevice: false
  });

  // Detect device performance level
  const devicePerformance = useMemo(() => {
    const { width, height } = Dimensions.get('window');
    const screenPixels = width * height;
    
    // Rough device performance classification
    const isLowEnd = screenPixels < 1000000 || // Less than ~1M pixels
                     (isAndroid && Platform.Version && Platform.Version < 29);
    
    return {
      isHighEnd: screenPixels > 2000000 && !isLowEnd,
      isMidRange: screenPixels > 1000000 && !isLowEnd,
      isLowEnd,
      shouldReduceAnimations: isLowEnd,
      shouldLimitConcurrentOperations: isLowEnd,
      maxConcurrentOperations: isLowEnd ? 2 : 5
    };
  }, [isAndroid]);

  // Optimized interaction handler
  const runAfterInteractions = useCallback((callback: () => void) => {
    if (isWeb) {
      requestAnimationFrame(() => {
        requestAnimationFrame(callback);
      });
    } else {
      InteractionManager.runAfterInteractions(callback);
    }
  }, [isWeb]);

  // Memory optimization
  const optimizeMemory = useCallback(() => {
    try {
      if (global.gc && __DEV__) {
        global.gc();
      }
      
      // Clear any cached data if needed
      if (isAndroid && global.nativeCallSyncHook) {
        // Android-specific memory optimization
        global.nativeCallSyncHook('RNPerformance', 'clearMemoryCache', []);
      }
    } catch (error) {
      console.warn('Memory optimization failed:', error);
    }
  }, [isAndroid]);

  // Platform-specific optimizations
  const platformOptimizations = useMemo(() => ({
    // Animation settings
    useNativeDriver: !isWeb,
    reducedMotion: devicePerformance.shouldReduceAnimations,
    animationDuration: devicePerformance.isLowEnd ? 200 : 300,
    
    // Rendering optimizations
    removeClippedSubviews: isAndroid,
    maxToRenderPerBatch: devicePerformance.isLowEnd ? 5 : 10,
    updateCellsBatchingPeriod: devicePerformance.isLowEnd ? 100 : 50,
    initialNumToRender: devicePerformance.isLowEnd ? 3 : 5,
    windowSize: devicePerformance.isLowEnd ? 3 : 6,
    
    // Image optimizations
    resizeMode: 'cover',
    blurRadius: devicePerformance.isLowEnd ? 1 : 2,
    
    // Gesture optimizations
    enableHardwareAcceleration: true,
    shouldCancelWhenOutside: true,
    
    // Bundle optimizations
    enableHermes: isAndroid,
    enableProguard: isAndroid,
    enableSeparateBuildPerCPUArchitecture: isAndroid,
  }), [isWeb, isAndroid, devicePerformance]);

  // Performance monitoring
  const measurePerformance = useCallback((componentName: string) => {
    const startTime = performance.now();
    
    return {
      end: () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (__DEV__) {
          console.log(`🚀 Performance: ${componentName} rendered in ${duration.toFixed(2)}ms`);
        }
        
        performanceMetrics.current.renderTime = duration;
        return duration;
      }
    };
  }, []);

  // Debounce heavy operations
  const createDebouncedFunction = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Throttle rapid updates
  const createThrottledFunction = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return (...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Batch state updates
  const batchUpdates = useCallback((updates: Array<() => void>) => {
    runAfterInteractions(() => {
      updates.forEach(update => update());
    });
  }, [runAfterInteractions]);

  // Image optimization helper
  const getOptimizedImageProps = useCallback((width: number, height: number) => ({
    style: { width, height },
    resizeMode: platformOptimizations.resizeMode as any,
    removeClippedSubviews: platformOptimizations.removeClippedSubviews,
    blurRadius: platformOptimizations.blurRadius,
  }), [platformOptimizations]);

  // List optimization props
  const getOptimizedFlatListProps = useCallback(() => ({
    removeClippedSubviews: platformOptimizations.removeClippedSubviews,
    maxToRenderPerBatch: platformOptimizations.maxToRenderPerBatch,
    updateCellsBatchingPeriod: platformOptimizations.updateCellsBatchingPeriod,
    initialNumToRender: platformOptimizations.initialNumToRender,
    windowSize: platformOptimizations.windowSize,
    getItemLayout: null, // Implement if you know item dimensions
    keyExtractor: (item: any, index: number) => item.id || index.toString(),
  }), [platformOptimizations]);

  return {
    // Core functions
    runAfterInteractions,
    optimizeMemory,
    measurePerformance,
    
    // Utility functions
    createDebouncedFunction,
    createThrottledFunction,
    batchUpdates,
    
    // Optimization helpers
    getOptimizedImageProps,
    getOptimizedFlatListProps,
    
    // Platform info
    platformOptimizations,
    devicePerformance,
    performanceMetrics: performanceMetrics.current,
    
    // Platform flags
    isWeb,
    isAndroid,
    isIOS
  };
};

// FIXED: Performance monitoring component with proper JSX syntax
interface PerformanceMonitorProps {
  children: React.ReactNode;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ children }) => {
  const { measurePerformance } = usePerformanceOptimization();
  
  useEffect(() => {
    const measurement = measurePerformance('PerformanceMonitor');
    return () => {
      measurement.end();
    };
  }, [measurePerformance]);

  // FIXED: Now works properly in .tsx file
  return <>{children}</>;
};
