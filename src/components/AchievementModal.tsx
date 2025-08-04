// src/components/AchievementModal.tsx - CELEBRATION MODAL
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

const { width, height } = Dimensions.get('window');

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
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

interface AchievementModalProps {
  visible: boolean;
  achievement: Achievement | null;
  onClose: () => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  visible,
  achievement,
  onClose
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnims = useRef([...Array(8)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (visible && achievement) {
      // Scale animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      // Rotation animation
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      // Sparkle animations
      sparkleAnims.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 200),
            Animated.timing(anim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: Platform.OS !== 'web',
            }),
          ])
        ).start();
      });
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      sparkleAnims.forEach(anim => anim.setValue(0));
    }
  }, [visible, achievement]);

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <LinearGradient
            colors={getRarityGradient(achievement.rarity)}
            style={styles.modalGradient}
          >
            {/* Sparkles */}
            {sparkleAnims.map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.sparkle,
                  {
                    opacity: anim,
                    transform: [
                      {
                        translateX: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, (index % 2 === 0 ? 1 : -1) * 50],
                        }),
                      },
                      {
                        translateY: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -30],
                        }),
                      },
                    ],
                    left: `${12.5 * (index + 1)}%`,
                    top: '20%',
                  },
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
                {achievement.rarity.toUpperCase()} ACHIEVEMENT
              </Text>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
              <Text style={styles.achievementPillar}>
                {achievement.pillar.toUpperCase()} PILLAR
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Awesome!</Text>
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
  modalContainer: {
    width: width * 0.85,
    maxWidth: 350,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 32,
    alignItems: 'center',
    position: 'relative',
  },
  sparkle: {
    position: 'absolute',
  },
  trophyContainer: {
    marginBottom: 24,
  },
  achievementContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  achievementBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    letterSpacing: 1,
  },
  achievementTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
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
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AchievementModal;
