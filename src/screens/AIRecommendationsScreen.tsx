// src/screens/AIRecommendationsScreen.tsx - AI RECOMMENDATIONS INTERFACE
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  FlatList,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AIRecommendationEngine from '../services/OptimizedAIEngine';

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  body: '#EF4444',
  mind: '#3B82F6',
  heart: '#EC4899',
  spirit: '#8B5CF6',
  diet: '#10B981',
  warning: '#F59E0B',
  critical: '#DC2626',
};

interface Recommendation {
  id: string;
  type: 'optimization' | 'timing' | 'focus' | 'balance' | 'habit';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  pillar: 'body' | 'mind' | 'heart' | 'spirit' | 'diet' | 'overall';
  actionPlan: string[];
  expectedImpact: number;
  confidence: number;
  timeframe: string;
  category: string;
}

const AIRecommendationsScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    initializeAI();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, []);

  const initializeAI = async () => {
    try {
      setLoading(true);
      await AIRecommendationEngine.initialize();
      const recs = await AIRecommendationEngine.generateRecommendations();
      setRecommendations(recs);
    } catch (error) {
      console.error('Error initializing AI:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await initializeAI();
    setRefreshing(false);
  };

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const getPillarColor = (pillar: string) => {
    const colors: { [key: string]: string } = {
      body: Colors.body,
      mind: Colors.mind,
      heart: Colors.heart,
      spirit: Colors.spirit,
      diet: Colors.diet,
      overall: Colors.accent,
    };
    return colors[pillar] || Colors.accent;
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      critical: Colors.critical,
      high: Colors.warning,
      medium: Colors.accent,
      low: Colors.success,
    };
    return colors[priority] || Colors.accent;
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      optimization: 'trending-up',
      timing: 'time',
      focus: 'eye',
      balance: 'scale',
      habit: 'repeat',
    };
    return icons[type] || 'bulb';
  };

  const HeaderComponent = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>AI Neural Coach</Text>
        <Text style={styles.headerSubtitle}>Personalized Optimization Insights</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={handleRefresh}
      >
        <Ionicons name="refresh" size={24} color={Colors.accent} />
      </TouchableOpacity>
    </View>
  );

  const StatsComponent = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>AI Analysis Summary</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{recommendations.length}</Text>
          <Text style={styles.statLabel}>Recommendations</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{recommendations.filter(r => r.priority === 'critical' || r.priority === 'high').length}</Text>
          <Text style={styles.statLabel}>Priority Actions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{Math.round(recommendations.reduce((sum, r) => sum + r.expectedImpact, 0))}</Text>
          <Text style={styles.statLabel}>Total Impact %</Text>
        </View>
      </View>
    </View>
  );

  const renderRecommendation = ({ item }: { item: Recommendation }) => {
    const isExpanded = expandedCards.has(item.id);
    const pillarColor = getPillarColor(item.pillar);
    const priorityColor = getPriorityColor(item.priority);

    return (
      <TouchableOpacity
        style={styles.recommendationCard}
        onPress={() => toggleCard(item.id)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[pillarColor + '08', pillarColor + '04']}
          style={styles.cardGradient}
        >
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.typeIcon, { backgroundColor: pillarColor }]}>
                <Ionicons name={getTypeIcon(item.type)} size={20} color="#FFFFFF" />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardCategory}>{item.category}</Text>
              </View>
            </View>
            
            <View style={styles.cardHeaderRight}>
              <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
                <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
              </View>
              <Ionicons 
                name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={Colors.textSecondary} 
              />
            </View>
          </View>

          {/* Description */}
          <Text style={styles.cardDescription}>{item.description}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={16} color={Colors.success} />
              <Text style={styles.statText}>+{item.expectedImpact}% impact</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.accent} />
              <Text style={styles.statText}>{Math.round(item.confidence * 100)}% confidence</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color={Colors.warning} />
              <Text style={styles.statText}>{item.timeframe}</Text>
            </View>
          </View>

          {/* Expanded Action Plan */}
          {isExpanded && (
            <View style={styles.actionPlanContainer}>
              <Text style={styles.actionPlanTitle}>Recommended Action Plan:</Text>
              {item.actionPlan.map((action, index) => (
                <View key={index} style={styles.actionItem}>
                  <View style={styles.actionBullet}>
                    <Text style={styles.actionNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.actionText}>{action}</Text>
                </View>
              ))}
              
              <TouchableOpacity style={[styles.implementButton, { backgroundColor: pillarColor }]}>
                <Ionicons name="rocket" size={20} color="#FFFFFF" />
                <Text style={styles.implementText}>Implement This Plan</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const screenData = [
    { id: 'header', type: 'header' },
    { id: 'stats', type: 'stats' },
    ...recommendations.map(rec => ({ id: rec.id, type: 'recommendation', data: rec }))
  ];

  const renderItem = ({ item }: any) => {
    switch (item.type) {
      case 'header':
        return <HeaderComponent />;
      case 'stats':
        return <StatsComponent />;
      case 'recommendation':
        return renderRecommendation({ item: item.data });
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <FlatList
        data={screenData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
  },
  flatListContent: {
    paddingBottom: 100,
  },
  statsContainer: {
    backgroundColor: Colors.surface,
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  recommendationCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  cardCategory: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  cardDescription: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionPlanContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionPlanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  actionBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  actionNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  implementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  implementText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default AIRecommendationsScreen;
