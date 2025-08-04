// src/components/SvgMandala.tsx - DYNAMIC MANDALA PROGRESS INDICATOR
import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, Platform } from 'react-native';
import Svg, {
  Circle,
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
  Filter,
  FeGaussianBlur,
  FeOffset,
  FeFlood,
  FeComposite
} from 'react-native-svg';
import { PremiumAnimations, HapticFeedback } from '../utils/AnimationUtils';

const Colors = {
  body: '#EF4444',
  mind: '#3B82F6',
  heart: '#EC4899',
  spirit: '#8B5CF6',
  diet: '#10B981',
};

interface SvgMandalaProps {
  size: number;
  pillarScores: { [key: string]: number };
  onPillarPress?: (pillar: string) => void;
  animated?: boolean;
  theme?: 'light' | 'dark';
}

const SvgMandala: React.FC<SvgMandalaProps> = ({
  size,
  pillarScores,
  onPillarPress,
  animated = true,
  theme = 'light'
}) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const pillars = [
    { key: 'spirit', angle: 0, color: Colors.spirit, icon: '🕉️' },
    { key: 'mind', angle: 72, color: Colors.mind, icon: '🧠' },
    { key: 'heart', angle: 144, color: Colors.heart, icon: '❤️' },
    { key: 'body', angle: 216, color: Colors.body, icon: '💪' },
    { key: 'diet', angle: 288, color: Colors.diet, icon: '🌿' }
  ];

  useEffect(() => {
    if (animated) {
      // Continuous rotation
      const rotationLoop = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 30000, // 30 seconds for full rotation
          useNativeDriver: Platform.OS !== 'web',
        })
      );

      // Pulse animation
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      );

      // Glow effect
      const glowLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
          }),
        ])
      );

      rotationLoop.start();
      pulseLoop.start();
      glowLoop.start();

      return () => {
        rotationLoop.stop();
        pulseLoop.stop();
        glowLoop.stop();
      };
    }
  }, [animated]);

  const center = size / 2;
  const baseRadius = size * 0.1;
  
  // Calculate ring radiuses
  const rings = pillars.map((_, index) => ({
    innerRadius: baseRadius + (index * size * 0.06),
    outerRadius: baseRadius + ((index + 1) * size * 0.06),
  }));

  const createPillarPath = (pillar: any, ringIndex: number) => {
    const score = pillarScores[pillar.key] || 0;
    const progress = score / 100;
    const ring = rings[ringIndex];
    
    const startAngle = pillar.angle - 30; // 60-degree segments
    const endAngle = startAngle + (60 * progress);
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = center + ring.innerRadius * Math.cos(startAngleRad);
    const y1 = center + ring.innerRadius * Math.sin(startAngleRad);
    const x2 = center + ring.outerRadius * Math.cos(startAngleRad);
    const y2 = center + ring.outerRadius * Math.sin(startAngleRad);
    
    const x3 = center + ring.outerRadius * Math.cos(endAngleRad);
    const y3 = center + ring.outerRadius * Math.sin(endAngleRad);
    const x4 = center + ring.innerRadius * Math.cos(endAngleRad);
    const y4 = center + ring.innerRadius * Math.sin(endAngleRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `
      M ${x1} ${y1}
      L ${x2} ${y2}
      A ${ring.outerRadius} ${ring.outerRadius} 0 ${largeArc} 1 ${x3} ${y3}
      L ${x4} ${y4}
      A ${ring.innerRadius} ${ring.innerRadius} 0 ${largeArc} 0 ${x1} ${y1}
      Z
    `;
  };

  const createMandalaPattern = () => {
    const patterns = [];
    const patternRadius = size * 0.25;
    
    // Create geometric patterns
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45 * Math.PI) / 180;
      const x = center + patternRadius * Math.cos(angle);
      const y = center + patternRadius * Math.sin(angle);
      
      patterns.push(
        <Circle
          key={`pattern-${i}`}
          cx={x}
          cy={y}
          r={size * 0.01}
          fill={theme === 'light' ? '#00000020' : '#FFFFFF20'}
        />
      );
    }
    
    return patterns;
  };

  const handlePillarPress = (pillar: string) => {
    HapticFeedback.medium();
    if (onPillarPress) {
      onPillarPress(pillar);
    }
  };

  const spin = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        transform: [
          { scale: pulseAnim },
          { rotate: spin }
        ]
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {/* Gradient definitions for each pillar */}
          {pillars.map(pillar => (
            <LinearGradient
              key={`gradient-${pillar.key}`}
              id={`gradient-${pillar.key}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor={pillar.color} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={pillar.color} stopOpacity="0.4" />
            </LinearGradient>
          ))}
          
          {/* Glow effect filter */}
          <Filter id="glow">
            <FeGaussianBlur stdDeviation="3" result="coloredBlur" />
            <FeOffset dx="0" dy="0" result="offsetblur" />
            <FeFlood floodColor="#8B5CF6" />
            <FeComposite in="SourceGraphic" in2="offsetblur" operator="over" />
          </Filter>
        </Defs>

        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={size * 0.45}
          fill={theme === 'light' ? '#F8FAFC' : '#1F2937'}
          stroke={theme === 'light' ? '#E5E7EB' : '#374151'}
          strokeWidth={2}
          filter="url(#glow)"
        />

        {/* Mandala decorative patterns */}
        <G opacity={0.3}>
          {createMandalaPattern()}
        </G>

        {/* Pillar progress rings */}
        {pillars.map((pillar, index) => (
          <G key={pillar.key}>
            {/* Background ring */}
            <Path
              d={createPillarPath(pillar, index)}
              fill={theme === 'light' ? '#F3F4F6' : '#374151'}
              opacity={0.3}
            />
            
            {/* Progress ring */}
            <TouchableOpacity onPress={() => handlePillarPress(pillar.key)}>
              <Path
                d={createPillarPath(pillar, index)}
                fill={`url(#gradient-${pillar.key})`}
                stroke={pillar.color}
                strokeWidth={1}
              />
            </TouchableOpacity>
          </G>
        ))}

        {/* Center spiritual symbol */}
        <Circle
          cx={center}
          cy={center}
          r={baseRadius * 0.8}
          fill={`url(#gradient-spirit)`}
          stroke={Colors.spirit}
          strokeWidth={2}
        />
        
        {/* Sacred geometry in center */}
        <G opacity={0.7}>
          {[0, 60, 120, 180, 240, 300].map(angle => {
            const rad = (angle * Math.PI) / 180;
            const x1 = center + (baseRadius * 0.3) * Math.cos(rad);
            const y1 = center + (baseRadius * 0.3) * Math.sin(rad);
            const x2 = center + (baseRadius * 0.6) * Math.cos(rad);
            const y2 = center + (baseRadius * 0.6) * Math.sin(rad);
            
            return (
              <Path
                key={angle}
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke={theme === 'light' ? '#FFFFFF' : '#F8FAFC'}
                strokeWidth={1}
                opacity={0.8}
              />
            );
          })}
        </G>
      </Svg>
    </Animated.View>
  );
};

export default SvgMandala;
