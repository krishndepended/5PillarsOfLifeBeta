// src/components/EnhancedAchievementModal.tsx - PREMIUM ACHIEVEMENT CELEBRATIONS
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PremiumAnimations, HapticFeedback } from '../utils/AnimationUtils';

const { width, height } = Dimensions.get('window');

const Colors = {
  surface: '#FFFFFF',
  text: '#1F2937',
  accent: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  spirit: '#8B5CF6',
};

interface Achievement {
  id: string;
  title: string;
  description: string;
  pillar: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface EnhancedAchievementModalProps {
  visible: boolean;
  achievement: Achievement | null;
  onClose: () => void;
}

const EnhancedAchievementModal: React.FC<EnhancedAchievementModalProps> = ({
  visible,
  achievement,
  onClose
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  
  // Particle system
  const particleAnims = useRef([...Array(12)].map(() => ({
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0),
    scale: new Animated.Value(0),
    rotate: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }))).current;

  const confettiAnims = useRef([...Array(20)].map(() => ({
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0),
    rotate: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }))).current;

  useEffect(() => {
    if (visible && achievement) {
      // Trigger haptic feedback
      HapticFeedback.success();
      
      // Main modal animation
      Animated.sequence([
        Animated.parallel([
          PremiumAnimations.createScaleAnimation(scaleAnim, 1, 300),
          PremiumAnimations.createFadeAnimation(bounceAnim, 1, 300)
        ]),
        Animated.spring(bounceAnim, {
          toValue: 1.1,
          tension: 100,
          friction: 6,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: Platform.OS !== 'web',
        })
      ]).start();

      // Trophy rotation
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      // Glow effect
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      );
      glowAnimation.start();

      // Particle burst animation
      const particleAnimations = particleAnims.map((particle, index) => {
        const angle = (index * 30) * Math.PI / 180;
        const distance = 80 + (Math.random() * 40);
        
        return Animated.parallel([
          Animated.sequence([
            Animated.delay(200 + (index * 50)),
            Animated.timing(particle.opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: Platform.OS !== 'web',
            })
          ]),
          Animated.sequence([
            Animated.delay(200 + (index * 50)),
            Animated.timing(particle.translateX, {
              toValue: Math.cos(angle) * distance,
              duration: 1200,
              useNativeDriver: Platform.OS !== 'web',
            })
          ]),
          Animated.sequence([
            Animated.delay(200 + (index * 50)),
            Animated.timing(particle.translateY, {
              toValue: Math.sin(angle) * distance,
              duration: 1200,
              useNativeDriver: Platform.OS !== 'web',
            })
          ]),
          Animated.sequence([
            Animated.delay(200 + (index * 50)),
            PremiumAnimations.createScaleAnimation(particle.scale, 1, 400)
          ]),
          Animated.sequence([
            Animated.delay(200 + (index * 50)),
            Animated.timing(particle.rotate, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: Platform.OS !== 'web',
            })
          ]),
          // Fade out
          Animated.sequence([
            Animated.delay(800 + (index * 50)),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 600,
              useNativeDriver: Platform.OS !== 'web',
            })
          ])
        ]);
      });

      Animated.parallel(particleAnimations).start();

      // Confetti animation
      const confettiAnimations = confettiAnims.map((confetti, index) => {
        const startX = (Math.random() - 0.5) * width;
        const endX = startX + ((Math.random() - 0.5) * 200);
        const fallDistance = height + 100;
        
        return Animated.sequence([
          Animated.delay(Math.random() * 500),
          Animated.parallel([
            Animated.timing(confetti.opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(confetti.translateX, {
              toValue: endX,
              duration: 3000 + (Math.random() * 1000),
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(confetti.translateY, {
              toValue: fallDistance,
              duration: 3000 + (Math.random() * 1000),
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.loop(
              Animated.timing(confetti.rotate, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: Platform.OS !== 'web',
              })
            )
          ])
        ]);
      });

      Animated.stagger(100, confettiAnimations).start();

      return () => {
        glowAnimation.stop();
      };
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      glowAnim.setValue(0);
      bounceAnim.setValue(0);
      
      particleAnims.forEach(particle => {
        particle.translateX.setValue(0);
        particle.translateY.setValue(0);
        particle.scale.setValue(0);
        particle.rotate.setValue(0);
        particle.opacity.setValue(0);
      });
      
      confettiAnims.forEach(confetti => {
        confetti.translateX.setValue(0);
        confetti.translateY.setValue(0);
        confetti.rotate.setValue(0);
        confetti.opacity.setValue(0);
      });
    }
  }, [visible, achievement]);

  const handleClose = () => {
    HapticFeedback.light();
    onClose();
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return Colors.success;
      case 'rare': return Colors.accent;
      case 'epic': return Colors.spirit;
      case 'legendary': return Colors.warning;
      default: return Colors.success;
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return [Colors.success, '#059669'];
      case 'rare': return [Colors.accent, '#2563EB'];
      case 'epic': return [Colors.spirit, '#7C3AED'];
      case 'legendary': return [Colors.warning, '#D97706'];
      default: return [Colors.success, '#059669'];
    }
  };

  if (!achievement) return null;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Confetti */}
        {confettiAnims.map((confetti, index) => (
          <Animated.View
            key={`confetti-${index}`}
            style={[
              styles.confetti,
              {
                opacity: confetti.opacity,
                transform: [
                  { translateX: confetti.translateX },
                  { translateY: confetti.translateY },
                  {
                    rotate: confetti.rotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    })
                  }
                ],
                backgroundColor: index % 3 === 0 ? Colors.warning : 
                                index % 3 === 1 ? Colors.spirit : Colors.success,
              }
            ]}
          />
        ))}

        {/* Main Modal */}
        <Animated.View 
          style={[
            styles.modalContainer,
            { 
              transform: [
                { scale: scaleAnim },
                { scale: bounceAnim }
              ] 
            }
          ]}
        >
          {/* Glow Effect */}
          <Animated.View
            style={[
              styles.glowContainer,
              {
                opacity: glowOpacity,
                shadowColor: getRarityColor(achievement.rarity),
              }
            ]}
          />

          <LinearGradient
            colors={getRarityGradient(achievement.rarity)}
            style={styles.modalGradient}
          >
            {/* Particles */}
            {particleAnims.map((particle, index) => (
              <Animated.View
                key={`particle-${index}`}
                style={[
                  styles.particle,
                  {
                    opacity: particle.opacity,
                    transform: [
                      { translateX: particle.translateX },
                      { translateY: particle.translateY },
                      { scale: particle.scale },
                      {
                        rotate: particle.rotate.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '720deg'],
                        })
                      }
                    ]
                  }
                ]}
              >
                <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              </Animated.View>
            ))}

            {/* Trophy Icon */}
            <Animated.View 
              style={[
                styles.trophyContainer,
                { transform: [{ rotate: spin }] }
              ]}
            >
              <Ionicons name="trophy" size={64} color="#FFFFFF" />
            </Animated.View>

            {/* Achievement Content */}
            <View style={styles.achievementContent}>
              <Text style={styles.achievementBadge}>
                {achievement.rarity.toUpperCase()} ACHIEVEMENT UNLOCKED!
              </Text>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
              <Text style={styles.achievementPillar}>
                {achievement.pillar.toUpperCase()} PILLAR
              </Text>
            </View>

            {/* Enhanced Close Button */}
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleClose}
              onPressIn={() => HapticFeedback.light()}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.closeButtonGradient}
              >
                <Text style={styles.closeButtonText}>Celebrate! 🎉</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    top: -50,
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 350,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 20,
  },
  modalGradient: {
    padding: 32,
    alignItems: 'center',
    position: 'relative',
  },
  particle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  trophyContainer: {
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  achievementContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  achievementBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    letterSpacing: 1,
    textAlign: 'center',
  },
  achievementTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  achievementDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  achievementPillar: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
  },
  closeButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  closeButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.spirit,
  },
});

export default EnhancedAchievementModal;
