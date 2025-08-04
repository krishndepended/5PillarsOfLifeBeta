// src/components/NeuralProgressRing.tsx - ADVANCED CIRCULAR PROGRESS RING
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { VictoryPie } from 'victory-native';
import { LinearGradient } from 'expo-linear-gradient';

interface NeuralProgressRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  title?: string;
  subtitle?: string;
}

const NeuralProgressRing: React.FC<NeuralProgressRingProps> = ({
  score,
  size = 150,
  strokeWidth = 12,
  color = '#3B82F6',
  title = 'Neural Score',
  subtitle = 'Overall Optimization'
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: score,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [score]);

  const data = [
    { x: 1, y: score },
    { x: 2, y: 100 - score }
  ];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <VictoryPie
        data={data}
        width={size}
        height={size}
        innerRadius={size * 0.3}
        colorScale={[color, '#E5E7EB']}
        startAngle={-90}
        endAngle={270}
        animate={{ duration: 1500 }}
        cornerRadius={strokeWidth / 2}
      />
      
      <View style={styles.centerContent}>
        <Text style={[styles.scoreValue, { color }]}>{score}%</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default NeuralProgressRing;
