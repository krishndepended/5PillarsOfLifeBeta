// src/components/NeuralInsightsPanel.tsx - AI-POWERED INSIGHTS PANEL
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface InsightItem {
  type: 'trend' | 'recommendation' | 'achievement' | 'warning';
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  priority: 'high' | 'medium' | 'low';
}

const NeuralInsightsPanel: React.FC = () => {
  const insights: InsightItem[] = [
    {
      type: 'trend',
      title: 'Neural Momentum Building',
      description: 'Your MIND pillar shows 23% improvement this week. Cognitive exercises are paying off!',
      icon: 'trending-up',
      color: '#10B981',
      priority: 'high'
    },
    {
      type: 'recommendation',
      title: 'Optimize Sleep Schedule',
      description: 'Based on your patterns, sleeping 30 minutes earlier could boost your BODY pillar by 12%.',
      icon: 'bulb',
      color: '#3B82F6',
      priority: 'high'
    },
    {
      type: 'achievement',
      title: 'Consistency Streak!',
      description: '15 days of neural optimization completed. Your dedication is remarkable!',
      icon: 'trophy',
      color: '#F59E0B',
      priority: 'medium'
    },
    {
      type: 'warning',
      title: 'HEART Pillar Attention',
      description: 'Emotional intelligence sessions have decreased. Consider adding mindfulness practice.',
      icon: 'warning',
      color: '#EF4444',
      priority: 'medium'
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return 'analytics';
      case 'recommendation': return 'extension-puzzle';
      case 'achievement': return 'trophy';
      case 'warning': return 'alert-circle';
      default: return 'information-circle';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Neural Insights</Text>
      <Text style={styles.subtitle}>AI-powered analysis of your optimization journey</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {insights.map((insight, index) => (
          <View key={index} style={styles.insightCard}>
            <LinearGradient
              colors={[insight.color + '20', insight.color + '10']}
              style={styles.insightGradient}
            >
              <View style={styles.insightHeader}>
                <View style={[styles.iconContainer, { backgroundColor: insight.color }]}>
                  <Ionicons name={getInsightIcon(insight.type)} size={20} color="#FFFFFF" />
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(insight.priority) }]}>
                  <Text style={styles.priorityText}>{insight.priority.toUpperCase()}</Text>
                </View>
              </View>
              
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
              
              <View style={styles.insightFooter}>
                <Text style={[styles.insightType, { color: insight.color }]}>
                  {insight.type.toUpperCase()}
                </Text>
              </View>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  insightCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  insightGradient: {
    padding: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  insightFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
  },
  insightType: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NeuralInsightsPanel;
