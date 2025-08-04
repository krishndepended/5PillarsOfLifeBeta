// src/utils/BundleAnalyzer.tsx - BUNDLE SIZE OPTIMIZATION UTILITIES
export class BundleAnalyzer {
  static analyzeImports() {
    const imports = {
      react: 'React core library',
      'react-native': 'React Native framework',
      '@react-navigation': 'Navigation library',
      'expo-linear-gradient': 'Gradient components',
      '@expo/vector-icons': 'Icon library',
      'react-native-gesture-handler': 'Gesture handling',
      'react-native-safe-area-context': 'Safe area utilities',
      '@react-native-async-storage/async-storage': 'Storage utilities'
    };

    console.log('Bundle Analysis:', imports);
    return imports;
  }

  static getOptimizationTips() {
    return [
      'Use React.lazy() for code splitting',
      'Optimize image sizes and formats',
      'Remove unused dependencies',
      'Use tree shaking for libraries',
      'Minimize inline styles',
      'Cache heavy computations',
      'Use FlatList for large data sets',
      'Implement proper memoization'
    ];
  }

  static measureComponentSize(componentName: string, renderCount: number) {
    const startTime = performance.now();
    
    return {
      component: componentName,
      renderCount,
      startTime,
      endTime: null,
      duration: null,
      complete: function() {
        this.endTime = performance.now();
        this.duration = this.endTime - this.startTime;
        console.log(`${componentName} rendered ${renderCount} times in ${this.duration.toFixed(2)}ms`);
        return this;
      }
    };
  }
}
