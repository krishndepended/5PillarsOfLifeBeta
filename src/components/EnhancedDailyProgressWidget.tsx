// src/components/EnhancedDailyProgressWidget.tsx - PREMIUM PROGRESS WIDGET
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDataSelectors } from '../context/AppDataContext';
import { safeGet } from '../utils/SafeNavigation';
import { PremiumAnimations, HapticFeedback } from '../utils/AnimationUtils';

const Colors = {
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  spirit: '#8B5CF6',
  heart: '#EC4899',
};

interface EnhancedDailyProgressWidgetProps {
  onQuickSession: (pillar: string) => void;
  onCheckIn: (type: 'morning' | 'evening') => void;
}

const EnhancedDailyProgressWidget: React.FC<EnhancedDailyProgressWidgetProps> = ({
  onQuickSession,
  onCheckIn
}) => {
  const { sessionData, userProfile } = useAppDataSelectors();
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;
  
  const completedToday = safeGet(sessionData, 'completedToday', 0);
  const dailyGoal = safeGet(sessionData, 'dailyGoal', 3);
  const progressPercentage = Math.min(100, (completedToday / dailyGoal) * 100);
  const isGoalCompleted = completedToday >= dailyGoal;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      PremiumAnimations.createFadeAnimation(fadeAnim, 1, 400),
      PremiumAnimations.createSlideAnimation(slideAnim, 0, 500)
    ]).start();

    // Progress bar animation
    PremiumAnimations.createProgressAnimation(progressAnim, progressPercentage / 100, 1200).start();

    // Shimmer effect for completed goals
    if (isGoalCompleted) {
      const shimmerAnimation = PremiumAnimations.createShimmerAnimation(shimmerAnim);
      shimmerAnimation.start();
      
      // Celebration animation
      Animated.sequence([
        Animated.delay(300),
        PremiumAnimations.createScaleAnimation(celebrationAnim, 1.1, 200),
        PremiumAnimations.createScaleAnimation(celebrationAnim, 1, 200)
      ]).start();
    }

    // Pulse animation for incomplete goals
    if (!isGoalCompleted && completedToday < dailyGoal) {
      const pulseAnimation = PremiumAnimations.createPulseAnimation(pulseAnim);
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [completedToday, dailyGoal, progressPercentage, isGoalCompleted]);

  const handleActionPress = (action: () => void) => {
    HapticFeedback.medium();
    action();
  };

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: 'Good Morning', emoji: '🌅', type: 'morning' as const };
    if (hour < 17) return { greeting: 'Good Afternoon', emoji: '☀️', type: 'afternoon' as const };
    return { greeting: 'Good Evening', emoji: '🌙', type: 'evening' as const };
  };

  const timeInfo = getCurrentTimeGreeting();
  const userName = safeGet(userProfile, 'name', 'Neural Optimizer');

  const getMotivationalMessage = () => {
    if (isGoalCompleted) {
      return "Outstanding! You've exceeded your daily goal! 🎉";
    } else if (completedToday === 0) {
      return "Ready to start your neural optimization journey today?";
    } else {
      return `Great progress! ${dailyGoal - completedToday} more session${dailyGoal - completedToday > 1 ? 's' : ''} to reach your goal.`;
    }
  };

  const suggestNextAction = () => {
    if (timeInfo.type === 'morning' && completedToday === 0) {
      return { 
        action: 'Morning Check-in', 
        subtitle: 'Set your daily intention', 
        icon: 'sunny', 
        onPress: () => handleActionPress(() => onCheckIn('morning')) 
      };
    } else if (timeInfo.type === 'evening') {
      return { 
        action: 'Evening Reflection', 
        subtitle: 'Gratitude & reflection', 
        icon: 'moon', 
        onPress: () => handleActionPress(() => onCheckIn('evening')) 
      };
    } else {
      return { 
        action: 'Quick Session', 
        subtitle: '5-minute optimization', 
        icon: 'flash', 
        onPress: () => handleActionPress(() => onQuickSession('mind')) 
      };
    }
  };

  const nextAction = suggestNextAction();

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={isGoalCompleted ? [Colors.success, '#059669'] : [Colors.accent, Colors.spirit]}
        style={styles.gradient}
      >
        {/* Shimmer overlay for completed goals */}
        {isGoalCompleted && (
          <Animated.View
            style={[
              styles.shimmerOverlay,
              {
                opacity: shimmerAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.1, 0.3, 0.1],
                })
              }
            ]}
          />
        )}

        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              transform: [{ scale: celebrationAnim }]
            }
          ]}
        >
          <View>
            <Text style={styles.greeting}>
              {timeInfo.emoji} {timeInfo.greeting}, {userName}!
            </Text>
            <Text style={styles.motivationalMessage}>
              {getMotivationalMessage()}
            </Text>
          </View>
          
          {isGoalCompleted && (
            <Animated.View 
              style={[
                styles.successBadge,
                {
                  transform: [{ scale: celebrationAnim }]
                }
              ]}
            >
              <Ionicons name="trophy" size={20} color={Colors.warning} />
            </Animated.View>
          )}
        </Animated.View>

        {/* Enhanced Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Daily Progress</Text>
            <Text style={styles.progressStats}>
              {completedToday}/{dailyGoal} sessions
            </Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View 
                style={[
                  styles.progressBarFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    })
                  }
                ]}
              />
              {/* Progress glow effect */}
              {isGoalCompleted && (
                <Animated.View
                  style={[
                    styles.progressGlow,
                    {
                      opacity: shimmerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      })
                    }
                  ]}
                />
              )}
            </View>
            <Animated.Text style={styles.progressPercentage}>
              {Math.round(progressPercentage)}%
            </Animated.Text>
          </View>
        </View>

        {/* Enhanced Action Button */}
        <Animated.View 
          style={[
            styles.actionSection, 
            { 
              transform: [{ scale: !isGoalCompleted ? pulseAnim : 1 }] 
            }
          ]}
        >
          <TouchableOpacity
            style={styles.actionButton}
            onPress={nextAction.onPress}
            onPressIn={() => HapticFeedback.light()}
          >
            <View style={styles.actionContent}>
              <View style={styles.actionIcon}>
                <Ionicons name={nextAction.icon as any} size={24} color={Colors.spirit} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{nextAction.action}</Text>
                <Text style={styles.actionSubtitle}>{nextAction.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Enhanced Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Sessions</Text>
          <View style={styles.quickActionButtons}>
            {[
              { pillar: 'mind', icon: 'library', color: Colors.accent },
              { pillar: 'heart', icon: 'heart', color: Colors.heart },
              { pillar: 'body', icon: 'fitness', color: '#EF4444' },
              { pillar: 'spirit', icon: 'leaf', color: Colors.spirit }
            ].map((item, index) => (
              <TouchableOpacity
                key={item.pillar}
                style={[
                  styles.quickActionButton, 
                  { backgroundColor: `${item.color}15` }
                ]}
                onPress={() => handleActionPress(() => onQuickSession(item.pillar))}
                onPressIn={() => HapticFeedback.light()}
              >
                <Ionicons name={item.icon as any} size={20} color={item.color} />
                <Text style={[styles.quickActionText, { color: item.color }]}>
                  {item.pillar.charAt(0).toUpperCase() + item.pillar.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  gradient: {
    padding: 20,
    position: 'relative',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  motivationalMessage: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  successBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 8,
    shadowColor: Colors.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  progressStats: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    minWidth: 35,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionSection: {
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.spirit}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  quickActions: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  quickActionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6,
  },
});

export default EnhancedDailyProgressWidget;
