// src/screens/AIInsightDetailScreen.tsx - DETAILED AI INSIGHT IMPLEMENTATION SCREEN
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Animated,
  Alert,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDataSelectors, useAppData } from '../context/AppDataContext';
import { usePerformanceOptimization, PerformanceMonitor } from '../hooks/usePerformanceOptimization';
import { safeNavigate, safeGet } from '../utils/SafeNavigation';
import NotificationManager from '../utils/NotificationManager';

const { width } = Dimensions.get('window');

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  spirit: '#8B5CF6',
  heart: '#EC4899',
};

interface AIInsightDetail {
  id: string;
  title: string;
  description: string;
  pillar: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  actionPlan: string[];
  expectedOutcome: string;
  timeToResult: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  scientificBasis: string;
  personalizedReason: string;
  implementationSteps: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    estimatedTime: number;
  }[];
}

const AIInsightDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  
  const { actions } = useAppData();
  const { aiInsights, pillarScores, userProfile } = useAppDataSelectors();
  const { measurePerformance } = usePerformanceOptimization();
  const notificationManager = NotificationManager.getInstance();

  // Get insight ID from route params
  const insightId = safeGet(route, 'params.insightId', null);
  
  const [insightDetail, setInsightDetail] = useState<AIInsightDetail | null>(null);
  const [implementationProgress, setImplementationProgress] = useState(0);
  const [isImplementing, setIsImplementing] = useState(false);

  useEffect(() => {
    const measurement = measurePerformance('AIInsightDetailScreen');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      measurement.end();
    });

    // Initialize with insight data
    initializeInsightDetail();
  }, [fadeAnim, insightId]);

  const initializeInsightDetail = () => {
    try {
      // Find the specific insight or create a detailed one
      let baseInsight = null;
      if (insightId && aiInsights) {
        baseInsight = aiInsights.find(insight => insight.id === insightId);
      }

      // If no specific insight found, use first available or create default
      if (!baseInsight && aiInsights && aiInsights.length > 0) {
        baseInsight = aiInsights[0];
      }

      // Generate detailed insight with implementation steps
      const detailedInsight = generateDetailedInsight(baseInsight);
      setInsightDetail(detailedInsight);

      // Calculate initial progress
      const completedSteps = detailedInsight.implementationSteps.filter(step => step.completed).length;
      const totalSteps = detailedInsight.implementationSteps.length;
      const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
      setImplementationProgress(progress);

      // Animate progress
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();

    } catch (error) {
      console.error('Error initializing insight detail:', error);
    }
  };

  const generateDetailedInsight = (baseInsight: any): AIInsightDetail => {
    const pillar = safeGet(baseInsight, 'pillar', 'overall');
    const priority = safeGet(baseInsight, 'priority', 'medium');
    
    return {
      id: safeGet(baseInsight, 'id', `insight_${Date.now()}`),
      title: safeGet(baseInsight, 'title', 'AI Optimization Recommendation'),
      description: safeGet(baseInsight, 'description', 'AI has analyzed your patterns and generated a personalized recommendation.'),
      pillar: pillar,
      priority: priority,
      confidence: safeGet(baseInsight, 'confidence', 0.85),
      actionPlan: safeGet(baseInsight, 'actionPlan', ['Take action based on AI analysis']),
      expectedOutcome: `Expected improvement: +${Math.floor(Math.random() * 8) + 5}% in ${pillar} pillar`,
      timeToResult: '1-2 weeks',
      difficulty: priority === 'high' ? 'challenging' : priority === 'low' ? 'easy' : 'moderate',
      scientificBasis: generateScientificBasis(pillar),
      personalizedReason: generatePersonalizedReason(pillar, pillarScores),
      implementationSteps: generateImplementationSteps(pillar, priority)
    };
  };

  const generateScientificBasis = (pillar: string): string => {
    const scientificBases = {
      body: 'Research shows that progressive adaptation combined with adequate recovery enhances muscular strength by 15-25% within 4 weeks. Neural adaptations occur within the first 2 weeks.',
      mind: 'Neuroplasticity studies demonstrate that focused cognitive training can increase working memory capacity by 20% and processing speed by 15% within 3 weeks of consistent practice.',
      heart: 'Heart Rate Variability (HRV) research indicates that coherence-based breathing techniques can improve emotional regulation by 30% and reduce stress hormones by 25%.',
      spirit: 'Contemplative neuroscience shows that regular meditation practice increases gray matter density in attention and sensory processing regions by 8% in just 8 weeks.',
      diet: 'Nutritional optimization studies reveal that balanced plant-based diets can improve cognitive function by 12% and energy levels by 20% within 2-3 weeks.'
    };
    
    return scientificBases[pillar as keyof typeof scientificBases] || scientificBases.body;
  };

  const generatePersonalizedReason = (pillar: string, scores: any): string => {
    const currentScore = safeGet(scores, pillar, 70);
    const gap = 90 - currentScore;
    
    return `Your ${pillar} pillar is currently at ${currentScore}%. Based on your usage patterns and consistency, you have ${gap}% optimization potential. Your learning style and engagement patterns suggest this approach will be highly effective.`;
  };

  const generateImplementationSteps = (pillar: string, priority: string) => {
    const stepTemplates = {
      body: [
        { title: 'Assessment Phase', description: 'Complete initial physical assessment and set baseline metrics', estimatedTime: 15 },
        { title: 'Progressive Training', description: 'Begin structured workout routine with gradual intensity increases', estimatedTime: 30 },
        { title: 'Recovery Integration', description: 'Implement recovery protocols and sleep optimization', estimatedTime: 20 },
        { title: 'Performance Tracking', description: 'Monitor progress and adjust training variables', estimatedTime: 10 }
      ],
      mind: [
        { title: 'Cognitive Assessment', description: 'Establish baseline cognitive performance metrics', estimatedTime: 20 },
        { title: 'Brain Training Protocol', description: 'Start targeted cognitive exercises and memory training', estimatedTime: 25 },
        { title: 'Focus Enhancement', description: 'Practice sustained attention and concentration techniques', estimatedTime: 20 },
        { title: 'Neural Optimization', description: 'Advanced cognitive challenges and neuroplasticity exercises', estimatedTime: 30 }
      ],
      heart: [
        { title: 'Emotional Baseline', description: 'Assess current emotional intelligence and stress levels', estimatedTime: 15 },
        { title: 'Heart Coherence Training', description: 'Learn and practice heart-focused breathing techniques', estimatedTime: 20 },
        { title: 'Empathy Development', description: 'Engage in compassion and loving-kindness practices', estimatedTime: 25 },
        { title: 'Relationship Integration', description: 'Apply emotional skills in daily interactions', estimatedTime: 15 }
      ],
      spirit: [
        { title: 'Spiritual Assessment', description: 'Explore current spiritual practices and beliefs', estimatedTime: 20 },
        { title: 'Meditation Foundation', description: 'Establish daily meditation practice with proper technique', estimatedTime: 30 },
        { title: 'Consciousness Expansion', description: 'Advanced contemplative practices and mindfulness', estimatedTime: 35 },
        { title: 'Integration Practice', description: 'Integrate spiritual insights into daily life', estimatedTime: 20 }
      ],
      diet: [
        { title: 'Nutritional Analysis', description: 'Assess current diet and identify optimization areas', estimatedTime: 20 },
        { title: 'Meal Planning', description: 'Create personalized Indian vegetarian meal plans', estimatedTime: 25 },
        { title: 'Ayurvedic Integration', description: 'Incorporate dosha-balancing foods and eating practices', estimatedTime: 20 },
        { title: 'Hydration & Timing', description: 'Optimize meal timing and hydration patterns', estimatedTime: 15 }
      ]
    };

    const steps = stepTemplates[pillar as keyof typeof stepTemplates] || stepTemplates.body;
    
    return steps.map((step, index) => ({
      id: `step_${index}`,
      title: step.title,
      description: step.description,
      completed: Math.random() > 0.7, // Some steps randomly completed for demo
      estimatedTime: step.estimatedTime
    }));
  };

  const toggleStepCompletion = async (stepId: string) => {
    if (!insightDetail) return;

    const updatedSteps = insightDetail.implementationSteps.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );

    const updatedInsight = { ...insightDetail, implementationSteps: updatedSteps };
    setInsightDetail(updatedInsight);

    // Update progress
    const completedSteps = updatedSteps.filter(step => step.completed).length;
    const totalSteps = updatedSteps.length;
    const newProgress = (completedSteps / totalSteps) * 100;
    setImplementationProgress(newProgress);

    // Animate progress change
    Animated.timing(progressAnim, {
      toValue: newProgress,
      duration: 500,
      useNativeDriver: false,
    }).start();

    // If step was completed, add session and possible achievement
    const step = updatedSteps.find(s => s.id === stepId);
    if (step && step.completed) {
      actions.addSession({
        pillar: insightDetail.pillar,
        duration: step.estimatedTime,
        improvement: Math.floor(Math.random() * 3) + 1,
        type: 'implementation'
      });

      // Notify completion
      await notificationManager.scheduleAchievementNotification(
        `Implementation Step Completed: ${step.title}`,
        insightDetail.pillar
      );

      // Check for full implementation completion
      if (newProgress >= 100) {
        Alert.alert(
          '🎉 Implementation Complete!',
          `Congratulations! You've successfully implemented this AI recommendation. Your ${insightDetail.pillar} pillar should show significant improvement.`,
          [{ text: 'Amazing!', style: 'default' }]
        );
      }
    }
  };

  const startImplementation = async () => {
    if (!insightDetail) return;

    setIsImplementing(true);

    // Add to session data
    actions.addSession({
      pillar: insightDetail.pillar,
      duration: 0,
      improvement: 0,
      type: 'planning'
    });

    // Schedule implementation reminder
    await notificationManager.scheduleAchievementNotification(
      `AI Implementation Started: ${insightDetail.title}`,
      insightDetail.pillar
    );

    Alert.alert(
      '🚀 Implementation Started!',
      `You've begun implementing "${insightDetail.title}". Track your progress through each step and watch your ${insightDetail.pillar} pillar improve!`,
      [{ text: 'Let\'s Begin!', style: 'default' }]
    );
  };

  const renderInsightHeader = () => (
    <PerformanceMonitor>
      <View style={styles.insightHeader}>
        <LinearGradient
          colors={insightDetail?.priority === 'high' ? [Colors.warning, '#F59E0B'] : 
                 insightDetail?.priority === 'critical' ? ['#EF4444', '#DC2626'] :
                 [Colors.accent, Colors.spirit]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>{insightDetail?.priority.toUpperCase()}</Text>
              <Text style={styles.confidenceText}>{Math.round((insightDetail?.confidence || 0) * 100)}% Confidence</Text>
            </View>
            <Text style={styles.insightTitle}>{insightDetail?.title}</Text>
            <Text style={styles.pillarLabel}>{insightDetail?.pillar.toUpperCase()} PILLAR OPTIMIZATION</Text>
          </View>
        </LinearGradient>
      </View>
    </PerformanceMonitor>
  );

  const renderImplementationProgress = () => (
    <PerformanceMonitor>
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Implementation Progress</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Completion</Text>
            <Text style={styles.progressValue}>{Math.round(implementationProgress)}%</Text>
          </View>
          
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  })
                }
              ]}
            />
          </View>
          
          <Text style={styles.progressSubtext}>
            {insightDetail?.implementationSteps.filter(step => step.completed).length || 0} of {insightDetail?.implementationSteps.length || 0} steps completed
          </Text>
        </View>
      </View>
    </PerformanceMonitor>
  );

  const renderImplementationSteps = () => (
    <PerformanceMonitor>
      <View style={styles.stepsSection}>
        <Text style={styles.sectionTitle}>Implementation Steps</Text>
        
        {insightDetail?.implementationSteps.map((step, index) => (
          <TouchableOpacity
            key={step.id}
            style={[styles.stepCard, step.completed && styles.stepCardCompleted]}
            onPress={() => toggleStepCompletion(step.id)}
          >
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, step.completed && styles.stepNumberCompleted]}>
                {step.completed ? (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                ) : (
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                )}
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, step.completed && styles.stepTitleCompleted]}>
                  {step.title}
                </Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
                <Text style={styles.stepTime}>⏱️ Estimated: {step.estimatedTime} minutes</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </PerformanceMonitor>
  );

  const renderScientificBasis = () => (
    <PerformanceMonitor>
      <View style={styles.scientificSection}>
        <Text style={styles.sectionTitle}>Scientific Basis</Text>
        <View style={styles.scientificCard}>
          <Ionicons name="flask" size={24} color={Colors.accent} />
          <Text style={styles.scientificText}>{insightDetail?.scientificBasis}</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Why This Works For You</Text>
        <View style={styles.personalizedCard}>
          <Ionicons name="person" size={24} color={Colors.spirit} />
          <Text style={styles.personalizedText}>{insightDetail?.personalizedReason}</Text>
        </View>
      </View>
    </PerformanceMonitor>
  );

  if (!insightDetail) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="extension-puzzle" size={48} color={Colors.accent} />
        <Text style={styles.loadingText}>Loading AI Insight...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => safeNavigate(navigation, 'Home')}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>AI Insight Detail</Text>
          <Text style={styles.headerSubtitle}>Implementation Guide</Text>
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share" size={20} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderInsightHeader()}
        {renderImplementationProgress()}
        {renderImplementationSteps()}
        {renderScientificBasis()}
        
        {!isImplementing && (
          <TouchableOpacity
            style={styles.implementButton}
            onPress={startImplementation}
          >
            <Ionicons name="play" size={20} color="#FFFFFF" />
            <Text style={styles.implementButtonText}>Start Implementation</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
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
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  shareButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  insightHeader: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  priorityBadge: {
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.9)',
  },
  confidenceText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  pillarLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  progressSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  progressContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  stepsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  stepCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  stepCardCompleted: {
    borderColor: Colors.success,
    backgroundColor: `${Colors.success}05`,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberCompleted: {
    backgroundColor: Colors.success,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  stepTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.success,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  stepTime: {
    fontSize: 12,
    color: Colors.accent,
    fontStyle: 'italic',
  },
  scientificSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  scientificCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  scientificText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  personalizedCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: Colors.spirit,
  },
  personalizedText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  implementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  implementButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(AIInsightDetailScreen);
