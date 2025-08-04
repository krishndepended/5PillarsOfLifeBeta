// src/components/AnimatedAchievementBadge.tsx - SVG ACHIEVEMENT BADGES
import React, { useEffect, useRef } from 'react';
import { Animated, Platform } from 'react-native';
import Svg, {
  Circle,
  Path,
  G,
  Defs,
  RadialGradient,
  Stop,
  Filter,
  FeDropShadow,
  Text as SvgText
} from 'react-native-svg';
import { PremiumAnimations } from '../utils/AnimationUtils';

interface Achievement {
  id: string;
  title: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  pillar: string;
}

interface AnimatedAchievementBadgeProps {
  achievement: Achievement;
  size: number;
  animated?: boolean;
  unlocked?: boolean;
}

const AnimatedAchievementBadge: React.FC<AnimatedAchievementBadgeProps> = ({
  achievement,
  size,
  animated = true,
  unlocked = false
}) => {
  const scaleAnim = useRef(new Animated.Value(unlocked ? 1 : 0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  const rarityColors = {
    common: { primary: '#10B981', secondary: '#059669' },
    rare: { primary: '#3B82F6', secondary: '#2563EB' },
    epic: { primary: '#8B5CF6', secondary: '#7C3AED' },
    legendary: { primary: '#F59E0B', secondary: '#D97706' }
  };

  const pillarIcons = {
    body: '💪',
    mind: '🧠',
    heart: '❤️',
    spirit: '🕉️',
    diet: '🌿',
    overall: '✨'
  };

  useEffect(() => {
    if (animated && unlocked) {
      // Scale animation for unlock
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      // Continuous rotation for legendary
      if (achievement.rarity === 'legendary') {
        const rotationLoop = Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: Platform.OS !== 'web',
          })
        );
        rotationLoop.start();
      }

      // Glow animation for epic and legendary
      if (achievement.rarity === 'epic' || achievement.rarity === 'legendary') {
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

      // Sparkle animation for legendary
      if (achievement.rarity === 'legendary') {
        const sparkleLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(sparkleAnim, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(sparkleAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: Platform.OS !== 'web',
            }),
          ])
        );
        sparkleLoop.start();
      }
    }
  }, [animated, unlocked, achievement.rarity]);

  const center = size / 2;
  const colors = rarityColors[achievement.rarity];

  const createBadgeShape = () => {
    if (achievement.rarity === 'legendary') {
      // Star shape for legendary
      const points = 8;
      const outerRadius = size * 0.4;
      const innerRadius = size * 0.25;
      let path = '';

      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points;
        const x = center + radius * Math.cos(angle - Math.PI / 2);
        const y = center + radius * Math.sin(angle - Math.PI / 2);
        
        if (i === 0) {
          path += `M ${x} ${y}`;
        } else {
          path += ` L ${x} ${y}`;
        }
      }
      path += ' Z';
      return path;
    } else if (achievement.rarity === 'epic') {
      // Hexagon for epic
      const radius = size * 0.4;
      let path = '';
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        if (i === 0) {
          path += `M ${x} ${y}`;
        } else {
          path += ` L ${x} ${y}`;
        }
      }
      path += ' Z';
      return path;
    } else {
      // Circle for common and rare
      return null; // Will use Circle component
    }
  };

  const createSparkles = () => {
    if (achievement.rarity !== 'legendary') return null;

    const sparkles = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 * Math.PI) / 180;
      const distance = size * 0.55;
      const x = center + distance * Math.cos(angle);
      const y = center + distance * Math.sin(angle);

      sparkles.push(
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: x - 4,
            top: y - 4,
            opacity: sparkleAnim,
            transform: [{
              rotate: sparkleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              })
            }]
          }}
        >
          <Svg width={8} height={8}>
            <Path
              d="M 4 0 L 5 3 L 8 4 L 5 5 L 4 8 L 3 5 L 0 4 L 3 3 Z"
              fill="#FFD700"
            />
          </Svg>
        </Animated.View>
      );
    }
    return sparkles;
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const badgeShape = createBadgeShape();

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        transform: [
          { scale: scaleAnim },
          { rotate: spin }
        ],
        opacity: unlocked ? 1 : 0.3,
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient
            id={`badge-gradient-${achievement.id}`}
            cx="50%"
            cy="30%"
            r="70%"
          >
            <Stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors.secondary} stopOpacity="0.8" />
          </RadialGradient>
          
          <Filter id="shadow">
            <FeDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
          </Filter>
        </Defs>

        {/* Badge shape */}
        {badgeShape ? (
          <Path
            d={badgeShape}
            fill={`url(#badge-gradient-${achievement.id})`}
            stroke={colors.primary}
            strokeWidth={2}
            filter="url(#shadow)"
          />
        ) : (
          <Circle
            cx={center}
            cy={center}
            r={size * 0.4}
            fill={`url(#badge-gradient-${achievement.id})`}
            stroke={colors.primary}
            strokeWidth={2}
            filter="url(#shadow)"
          />
        )}

        {/* Inner decoration ring */}
        <Circle
          cx={center}
          cy={center}
          r={size * 0.25}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={2}
        />

        {/* Pillar icon background */}
        <Circle
          cx={center}
          cy={center}
          r={size * 0.15}
          fill="rgba(255,255,255,0.9)"
        />

        {/* Achievement text */}
        <SvgText
          x={center}
          y={center + 4}
          textAnchor="middle"
          fontSize={size * 0.15}
          fill={colors.secondary}
          fontWeight="bold"
        >
          {pillarIcons[achievement.pillar as keyof typeof pillarIcons] || '🏆'}
        </SvgText>
      </Svg>

      {/* Sparkles for legendary */}
      {createSparkles()}
    </Animated.View>
  );
};

export default AnimatedAchievementBadge;
