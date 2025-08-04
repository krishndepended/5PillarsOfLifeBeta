// src/components/AIRecommendationCard.tsx - INTELLIGENT RECOMMENDATION UI
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  spirit: '#8B5CF6',
  body: '#EF4444',
  mind: '#3B82F6',
  heart: '#EC4899',
  diet: '#10B981',
};

interface AIRecommendationCardProps {
  recommendation: {
    id: string;
    title: string;
    description: string;
    pillar: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    actionPlan: string[];
    estimatedImpact: number;
    timeToResult: string;
    difficulty: 'easy' | 'moderate' | 'challenging';
    category: 'optimization' | 'maintenance' | 'breakthrough' | 'recovery';
  };
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
  onAccept,
  onDismiss
}) => {
  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'critical': return Colors.danger;
      case 'high': return Colors.warning;
      case 'medium': return Colors.accent;
      case 'low': return Colors.success;
      default: return Colors.accent;
    }
  };

  const getPillarColor = () => {
    return Colors[recommendation.pillar as keyof typeof Colors] || Colors.accent;
  };

  const getCategoryIcon = () => {
    switch (recommendation.category) {
      case 'optimization': return 'trending-up';
      case 'maintenance': return 'shield-checkmark';
      case 'breakthrough': return 'rocket';
      case 'recovery': return 'refresh';
      default: return 'bulb';
    }
  };

  const getDifficultyDisplay = () => {
    const icons = {
      easy: '●',
      moderate: '●●',
      challenging: '●●●'
    };
    return icons[recommendation.difficulty];
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[getPillarColor() + '10', getPillarColor() + '05']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.categoryIcon, { backgroundColor: getPillarColor() }]}>
              <Ionicons name={getCategoryIcon() as any} size={16} color="#FFFFFF" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>{recommendation.title}</Text>
              <View style={styles.metadata}>
                <Text style={styles.pillarTag}>{recommendation.pillar.toUpperCase()}</Text>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor() }]} />
                <Text style={styles.priority}>{recommendation.priority.toUpperCase()}</Text>
              </View>
            </View>
          </View>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceText}>{Math.round(recommendation.confidence * 100)}%</Text>
            <Text style={styles.confidenceLabel}>confidence</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{recommendation.description}</Text>

        {/* Metrics Row */}
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Ionicons name="flash" size={16} color={Colors.warning} />
            <Text style={styles.metricText}>+{recommendation.estimatedImpact}% impact</Text>
          </View>
          <View style={styles.metric}>
            <Ionicons name="time" size={16} color={Colors.accent} />
            <Text style={styles.metricText}>{recommendation.timeToResult}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.difficultyText}>{getDifficultyDisplay()}</Text>
            <Text style={styles.metricText}>{recommendation.difficulty}</Text>
          </View>
        </View>

        {/* Action Plan Preview */}
        <View style={styles.actionPlanContainer}>
          <Text style={styles.actionPlanTitle}>Action Plan Preview:</Text>
          {recommendation.actionPlan.slice(0, 2).map((action, index) => (
            <View key={index} style={styles.actionItem}>
              <View style={styles.actionBullet} />
              <Text style={styles.actionText}>{action}</Text>
            </View>
          ))}
          {recommendation.actionPlan.length > 2 && (
            <Text style={styles.moreActions}>
              +{recommendation.actionPlan.length - 2} more steps
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => onDismiss(recommendation.id)}
          >
            <Text style={styles.dismissText}>Not Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acceptButton, { backgroundColor: getPillarColor() }]}
            onPress={() => onAccept(recommendation.id)}
          >
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            <Text style={styles.acceptText}>Start Optimization</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillarTag: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    backgroundColor: Colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  priority: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.success,
  },
  confidenceLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metricText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  difficultyText: {
    fontSize: 12,
    color: Colors.warning,
    marginRight: 4,
  },
  actionPlanContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  actionPlanTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  actionBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent,
    marginTop: 6,
    marginRight: 8,
  },
  actionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  moreActions: {
    fontSize: 11,
    color: Colors.accent,
    fontStyle: 'italic',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  dismissButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    alignItems: 'center',
  },
  dismissText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  acceptText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
export default React.memo(AIRecommendationCard);