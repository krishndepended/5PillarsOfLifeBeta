// src/components/DailyProgressWidget.tsx - REAL-TIME PROGRESS WIDGET
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

interface DailyProgressWidgetProps {
  onQuickSession: (pillar: string) => void;
  onCheckIn: (type: 'morning' | 'evening') => void;
}

const DailyProgressWidget: React.FC<DailyProgressWidgetProps> = ({
  onQuickSession,
  onCheckIn
}) => {
  const { sessionData, userProfile } = useAppDataSelectors();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const completedToday = safeGet(sessionData, 'completedToday', 0);
  const dailyGoal = safeGet(sessionData, 'dailyGoal', 3);
  const progressPercentage = Math.min(100, (completedToday / dailyGoal) * 100);

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progressPercentage / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Pulse animation for call-to-action
    if (completedToday < dailyGoal) {
      const pulse = Animated.loop(
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
      pulse.start();
      return () => pulse.stop();
    }
  }, [completedToday, dailyGoal]);

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: 'Good Morning', emoji: '🌅', type: 'morning' as const };
    if (hour < 17) return { greeting: 'Good Afternoon', emoji: '☀️', type: 'afternoon' as const };
    return { greeting: 'Good Evening', emoji: '🌙', type: 'evening' as const };
  };

  const timeInfo = getCurrentTimeGreeting();
  const userName = safeGet(userProfile, 'name', 'Neural Optimizer');

  const getMotivationalMessage = () => {
    if (completedToday === 0) {
      return "Ready to start your neural optimization journey today?";
    } else if (completedToday >= dailyGoal) {
      return "Outstanding! You've exceeded your daily goal! 🎉";
    } else {
      return `Great progress! ${dailyGoal - completedToday} more session${dailyGoal - completedToday > 1 ? 's' : ''} to reach your goal.`;
    }
  };

  const suggestNextAction = () => {
    if (timeInfo.type === 'morning' && completedToday === 0) {
      return { action: 'Check-in', subtitle: 'Start with morning intention', icon: 'sunny', onPress: () => onCheckIn('morning') };
    } else if (timeInfo.type === 'evening') {
      return { action: 'Reflect', subtitle: 'Evening gratitude practice', icon: 'moon', onPress: () => onCheckIn('evening') };
    } else {
      return { action: 'Quick Session', subtitle: '5-minute optimization', icon: 'flash', onPress: () => onQuickSession('mind') };
    }
  };

  const nextAction = suggestNextAction();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={completedToday >= dailyGoal ? [Colors.success, '#059669'] : [Colors.accent, Colors.spirit]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {timeInfo.emoji} {timeInfo.greeting}, {userName}!
            </Text>
            <Text style={styles.motivationalMessage}>
              {getMotivationalMessage()}
            </Text>
          </View>
          
          {completedToday >= dailyGoal && (
            <View style={styles.successBadge}>
              <Ionicons name="trophy" size={20} color={Colors.warning} />
            </View>
          )}
        </View>

        {/* Progress Section */}
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
            </View>
            <Text style={styles.progressPercentage}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <Animated.View style={[styles.actionSection, { transform: [{ scale: pulseAnim }] }]}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={nextAction.onPress}
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

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Sessions</Text>
          <View style={styles.quickActionButtons}>
            {[
              { pillar: 'mind', icon: 'library', color: Colors.accent },
              { pillar: 'heart', icon: 'heart', color: Colors.heart },
              { pillar: 'body', icon: 'fitness', color: '#EF4444' },
              { pillar: 'spirit', icon: 'leaf', color: Colors.spirit }
            ].map(item => (
              <TouchableOpacity
                key={item.pillar}
                style={[styles.quickActionButton, { backgroundColor: `${item.color}15` }]}
                onPress={() => onQuickSession(item.pillar)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    padding: 20,
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
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    minWidth: 35,
  },
  actionSection: {
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 16,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default DailyProgressWidget;
