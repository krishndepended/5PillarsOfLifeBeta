// src/components/AnimatedPillarCard.tsx - PREMIUM PILLAR CARDS WITH ANIMATIONS
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PremiumAnimations, HapticFeedback } from '../utils/AnimationUtils';

const { width } = Dimensions.get('window');

const Colors = {
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
};

interface AnimatedPillarCardProps {
  pillar: {
    name: string;
    description: string;
    color: string;
    icon: string;
  };
  score: number;
  onPress: () => void;
  index: number;
}

const AnimatedPillarCard: React.FC<AnimatedPillarCardProps> = ({
  pillar,
  score,
  onPress,
  index
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;
  
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    // Staggered entrance animation
    const entranceDelay = index * 150;
    
    Animated.parallel([
      Animated.sequence([
        Animated.delay(entranceDelay),
        PremiumAnimations.createFadeAnimation(fadeAnim, 1, 400)
      ]),
      Animated.sequence([
        Animated.delay(entranceDelay),
        PremiumAnimations.createSlideAnimation(slideAnim, 0, 500)
      ]),
      Animated.sequence([
        Animated.delay(entranceDelay + 200),
        PremiumAnimations.createProgressAnimation(progressAnim, score / 100, 800)
      ])
    ]).start();

    // Glow animation for high scores
    if (score >= 85) {
      const glowAnimation = Animated.loop(
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
      glowAnimation.start();
      return () => glowAnimation.stop();
    }
  }, [score, index]);

  const handlePressIn = () => {
    setIsPressed(true);
    HapticFeedback.light();
    
    Animated.parallel([
      PremiumAnimations.createScaleAnimation(scaleAnim, 0.95, 100),
      Animated.timing(iconRotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      })
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    
    Animated.parallel([
      PremiumAnimations.createScaleAnimation(scaleAnim, 1, 150),
      Animated.timing(iconRotateAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      })
    ]).start();
  };

  const handlePress = () => {
    HapticFeedback.medium();
    
    // Success animation
    Animated.sequence([
      PremiumAnimations.createScaleAnimation(scaleAnim, 1.02, 100),
      PremiumAnimations.createScaleAnimation(scaleAnim, 1, 100)
    ]).start(() => {
      onPress();
    });
  };

  const scoreColor = score >= 90 ? Colors.success : score >= 70 ? Colors.warning : '#EF4444';
  
  const iconRotation = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      {/* Glow effect for high scores */}
      {score >= 85 && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowOpacity,
              shadowColor: pillar.color,
            }
          ]}
        />
      )}

      <TouchableOpacity
        style={[styles.card, { backgroundColor: `${pillar.color}08` }]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        {/* Progress background */}
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: `${pillar.color}20`,
              }
            ]}
          />
        </View>

        <View style={styles.cardContent}>
          {/* Animated Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              { 
                backgroundColor: pillar.color,
                transform: [{ rotate: iconRotation }]
              }
            ]}
          >
            <Ionicons name={pillar.icon as any} size={28} color="#FFFFFF" />
          </Animated.View>

          {/* Content */}
          <View style={styles.textContent}>
            <Text style={styles.pillarName}>{pillar.name}</Text>
            <Text style={styles.pillarDescription}>{pillar.description}</Text>
            
            {/* Animated Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                      backgroundColor: scoreColor
                    }
                  ]}
                />
              </View>
              <Animated.Text style={[styles.progressText, { color: scoreColor }]}>
                {score > 85 ? 'Excellent' : score > 70 ? 'Good' : 'Improving'}
              </Animated.Text>
            </View>

            {/* AI Suggestion with subtle animation */}
            <View style={styles.aiSuggestion}>
              <Ionicons name="flash" size={12} color={Colors.accent} />
              <Text style={styles.aiSuggestionText}>
                AI suggests: +{Math.floor(Math.random() * 8) + 2}% potential
              </Text>
            </View>
          </View>

          {/* Score with pulse animation for high scores */}
          <View style={styles.scoreContainer}>
            <Animated.Text style={[styles.score, { color: scoreColor }]}>
              {Math.round(score)}%
            </Animated.Text>
            <Ionicons 
              name="chevron-forward" 
              size={16} 
              color={isPressed ? pillar.color : Colors.textSecondary} 
            />
          </View>
        </View>

        {/* Ripple effect overlay */}
        {isPressed && (
          <View style={[styles.rippleEffect, { backgroundColor: `${pillar.color}15` }]} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  card: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressFill: {
    height: '100%',
    borderRadius: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.surface,
    position: 'relative',
    zIndex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  textContent: {
    flex: 1,
  },
  pillarName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  pillarDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    minWidth: 60,
  },
  aiSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiSuggestionText: {
    fontSize: 10,
    color: Colors.accent,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  scoreContainer: {
    alignItems: 'center',
    paddingLeft: 12,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rippleEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
});

export default AnimatedPillarCard;
