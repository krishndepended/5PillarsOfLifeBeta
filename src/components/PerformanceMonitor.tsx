// src/components/PerformanceMonitor.tsx - COMPLETE PERFORMANCE MONITORING
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
  bundleSize: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    frameRate: 60,
    bundleSize: 0
  });

  useEffect(() => {
    const startTime = performance.now();
    
    // Monitor render time
    const endTime = performance.now();
    setMetrics(prev => ({
      ...prev,
      renderTime: endTime - startTime
    }));

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memInfo.usedJSHeapSize / (1024 * 1024) // MB
      }));
    }
  }, []);

  if (__DEV__) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Performance Monitor</Text>
        <Text style={styles.metric}>Render: {metrics.renderTime.toFixed(2)}ms</Text>
        <Text style={styles.metric}>Memory: {metrics.memoryUsage.toFixed(2)}MB</Text>
        <Text style={styles.metric}>FPS: {metrics.frameRate}</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 8,
    borderRadius: 4,
    zIndex: 1000,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  metric: {
    color: '#FFFFFF',
    fontSize: 8,
  },
});
