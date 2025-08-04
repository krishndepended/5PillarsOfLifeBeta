// src/components/SvgProgressRing.tsx - ANIMATED CIRCULAR PROGRESS
import React, { useEffect, useRef } from 'react';
import { Animated, Platform } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Filter,
  FeGaussianBlur,
  G
} from 'react-native-svg';

interface SvgProgressRingProps {
  size: number;
  strokeWidth: number;
  progress: number; // 0-100
  color: string;
  backgroundColor?: string;
  animated?: boolean;
  showGlow?: boolean;
  children?: React.ReactNode;
}

const SvgProgressRing: React.FC<SvgProgressRingProps> = ({
  size,
  strokeWidth,
  progress,
  color,
  backgroundColor = '#E5E7EB',
  animated = true,
  showGlow = false,
  children
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 1500,
        useNativeDriver: false,
      }).start();

      if (showGlow) {
        const glowLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: false,
            }),
          ])
        );
        glowLoop.start();
      }
    } else {
      progressAnim.setValue(progress);
    }
  }, [progress, animated, showGlow]);

  return (
    <Animated.View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient
            id="progress-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </LinearGradient>
          
          {showGlow && (
            <Filter id="glow-effect">
              <FeGaussianBlur stdDeviation="3" result="coloredBlur" />
            </Filter>
          )}
        </Defs>

        <G>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <Animated.View>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="url(#progress-gradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: [circumference, 0],
              })}
              transform={`rotate(-90 ${center} ${center})`}
              filter={showGlow ? "url(#glow-effect)" : undefined}
            />
          </Animated.View>
        </G>
      </Svg>

      {/* Center content */}
      {children && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {children}
        </View>
      )}
    </Animated.View>
  );
};

export default SvgProgressRing;
