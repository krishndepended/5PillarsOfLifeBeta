// src/screens/MindScreen.tsx - COMPLETE ADVANCED COGNITIVE OPTIMIZATION SYSTEM
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Animated,
  Dimensions,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDataSelectors, useAppData } from '../context/AppDataContext';
import { usePerformanceOptimization, PerformanceMonitor } from '../hooks/usePerformanceOptimization';
import NotificationManager from '../utils/NotificationManager';

const { width } = Dimensions.get('window');

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  mind: '#3B82F6',
  warning: '#F59E0B',
  spirit: '#8B5CF6',
};

interface CognitiveMetrics {
  focusLevel: number;
  memoryScore: number;
  processingSpeed: number;
  creativity: number;
  mentalClarity: number;
  neuroplasticity: number;
}

interface BrainTrainingModule {
  id: string;
  name: string;
  type: 'memory' | 'focus' | 'speed' | 'creativity' | 'logic';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  exercises: CognitiveExercise[];
  aiOptimized: boolean;
  neuralBenefit: string;
}

interface CognitiveExercise {
  name: string;
  description: string;
  targetArea: string[];
  estimatedTime: number;
  cognitiveLoad: 'low' | 'medium' | 'high';
}

const MindScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { actions } = useAppData();
  const { pillarScores, userProfile } = useAppDataSelectors();
  const { measurePerformance } = usePerformanceOptimization();
  const notificationManager = NotificationManager.getInstance();

  const [cognitiveMetrics, setCognitiveMetrics] = useState<CognitiveMetrics>({
    focusLevel: 85,
    memoryScore: 78,
    processingSpeed: 82,
    creativity: 88,
    mentalClarity: 80,
    neuroplasticity: 75
  });

  const [activeBrainTraining, setActiveBrainTraining] = useState<BrainTrainingModule | null>(null);
  const [trainingTimer, setTrainingTimer] = useState(0);
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState<string>('');

  useEffect(() => {
    const measurement = measurePerformance('MindScreen');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      measurement.end();
    });

    initializeMindOptimization();
  }, [fadeAnim]);

  const initializeMindOptimization = async () => {
    try {
      generateAIBrainTraining();
      generateDailyChallenge();
      updateCognitiveMetrics();
      checkMindAchievements();
    } catch (error) {
      console.error('Error initializing mind optimization:', error);
    }
  };

  const generateAIBrainTraining = () => {
    const currentScore = pillarScores.mind;
    const userLevel = userProfile.level;
    
    const brainTrainingModules: BrainTrainingModule[] = [
      {
        id: 'neuroplasticity-boost',
        name: 'Neural Pathway Enhancement',
        type: 'memory',
        duration: 20,
        difficulty: currentScore > 85 ? 'advanced' : 'intermediate',
        aiOptimized: true,
        neuralBenefit: 'Strengthens synaptic connections and enhances memory consolidation',
        exercises: [
          {
            name: 'Pattern Recognition Matrix',
            description: 'Identify complex visual patterns to enhance pattern recognition abilities',
            targetArea: ['visual processing', 'pattern recognition', 'working memory'],
            estimatedTime: 5,
            cognitiveLoad: 'high'
          },
          {
            name: 'Memory Palace Construction',
            description: 'Build mental maps to enhance spatial-visual memory systems',
            targetArea: ['spatial memory', 'visualization', 'recall'],
            estimatedTime: 8,
            cognitiveLoad: 'medium'
          },
          {
            name: 'Dual N-Back Training',
            description: 'Advanced working memory enhancement through dual-task paradigm',
            targetArea: ['working memory', 'attention', 'fluid intelligence'],
            estimatedTime: 7,
            cognitiveLoad: 'high'
          }
        ]
      },
      {
        id: 'focus-mastery',
        name: 'Attention Optimization Protocol',
        type: 'focus',
        duration: 15,
        difficulty: currentScore > 80 ? 'advanced' : 'intermediate',
        aiOptimized: true,
        neuralBenefit: 'Enhances sustained attention and cognitive control networks',
        exercises: [
          {
            name: 'Mindful Attention Training',
            description: 'Focused breathing with distraction resistance protocols',
            targetArea: ['sustained attention', 'cognitive control', 'mindfulness'],
            estimatedTime: 10,
            cognitiveLoad: 'medium'
          },
          {
            name: 'Stroop Interference Training',
            description: 'Advanced cognitive flexibility and inhibitory control',
            targetArea: ['cognitive flexibility', 'inhibitory control', 'processing speed'],
            estimatedTime: 5,
            cognitiveLoad: 'high'
          }
        ]
      }
    ];

    setActiveBrainTraining(brainTrainingModules[0]);
  };

  const generateDailyChallenge = () => {
    const challenges = [
      'Memorize a 10-digit number sequence and recall it after 5 minutes',
      'Practice mental math: Calculate 17 × 23 without writing',
      'Name 20 objects in your room backwards alphabetically',
      'Visualize your childhood home in complete detail for 3 minutes',
      'Learn 5 new vocabulary words in a foreign language',
      'Practice the Pomodoro Technique: 25 min focus + 5 min break',
      'Meditate for 10 minutes focusing only on breath awareness'
    ];
    
    setDailyChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
  };

  const updateCognitiveMetrics = () => {
    setCognitiveMetrics(prev => ({
      focusLevel: Math.max(70, Math.min(100, prev.focusLevel + (Math.random() - 0.4) * 5)),
      memoryScore: Math.max(70, Math.min(100, prev.memoryScore + (Math.random() - 0.3) * 4)),
      processingSpeed: Math.max(70, Math.min(100, prev.processingSpeed + (Math.random() - 0.2) * 3)),
      creativity: Math.max(70, Math.min(100, prev.creativity + (Math.random() - 0.1) * 6)),
      mentalClarity: Math.max(70, Math.min(100, prev.mentalClarity + (Math.random() - 0.3) * 4)),
      neuroplasticity: Math.max(60, Math.min(95, prev.neuroplasticity + (Math.random() - 0.2) * 3))
    }));
  };

  const checkMindAchievements = async () => {
    const achievements = [];
    
    if (pillarScores.mind >= 90) {
      achievements.push('Cognitive Excellence Master');
    }
    
    if (cognitiveMetrics.focusLevel >= 90) {
      achievements.push('Focus Mastery Champion');
    }
    
    if (cognitiveMetrics.neuroplasticity >= 85) {
      achievements.push('Neuroplasticity Expert');
    }

    for (const achievement of achievements) {
      await notificationManager.scheduleAchievementNotification(achievement, 'mind');
    }
  };

  const startBrainTraining = () => {
    if (!activeBrainTraining) return;
    
    setIsTrainingActive(true);
    setTrainingTimer(0);
    
    const timer = setInterval(() => {
      setTrainingTimer(prev => prev + 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      completeBrainTraining();
    }, activeBrainTraining.duration * 60 * 1000);

    Alert.alert(
      '🧠 Brain Training Started!',
      `Beginning ${activeBrainTraining.name}. Focus your mind and enhance your cognitive abilities!`,
      [{ text: 'Let\'s Begin!', style: 'default' }]
    );
  };

  const completeBrainTraining = async () => {
    if (!activeBrainTraining) return;

    setIsTrainingActive(false);
    
    const improvement = Math.floor(Math.random() * 6) + 3;
    const newScore = Math.min(100, pillarScores.mind + improvement);
    actions.updatePillarScore('mind', newScore);

    actions.addSession({
      pillar: 'mind',
      duration: Math.floor(trainingTimer / 60),
      improvement: improvement
    });

    await notificationManager.scheduleAchievementNotification(
      `Brain Training Complete: +${improvement}% Cognitive Enhancement`,
      'mind'
    );

    Alert.alert(
      '🎉 Training Completed!',
      `Outstanding cognitive work! Your mind pillar improved by ${improvement}%. Your neural pathways are strengthening!`,
      [{ text: 'Brilliant!', style: 'default' }]
    );
  };

  const renderCognitiveMetrics = () => (
    <PerformanceMonitor>
      <View style={styles.cognitiveSection}>
        <Text style={styles.sectionTitle}>Cognitive Performance Metrics</Text>
        
        <View style={styles.metricsGrid}>
          {[
            { label: 'Focus', value: cognitiveMetrics.focusLevel, icon: 'eye', color: Colors.mind },
            { label: 'Memory', value: cognitiveMetrics.memoryScore, icon: 'library', color: Colors.success },
            { label: 'Speed', value: cognitiveMetrics.processingSpeed, icon: 'flash', color: Colors.warning },
            { label: 'Creativity', value: cognitiveMetrics.creativity, icon: 'color-palette', color: Colors.spirit }
          ].map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: metric.color }]}>
                <Ionicons name={metric.icon as any} size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{metric.value}%</Text>
              <View style={styles.metricBar}>
                <View 
                  style={[
                    styles.metricBarFill, 
                    { width: `${metric.value}%`, backgroundColor: metric.color }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </PerformanceMonitor>
  );

  const renderBrainTraining = () => (
    <PerformanceMonitor>
      <View style={styles.trainingSection}>
        <View style={styles.trainingHeader}>
          <Text style={styles.sectionTitle}>AI Brain Training</Text>
          {activeBrainTraining?.aiOptimized && (
            <View style={styles.aiOptimizedBadge}>
              <Ionicons name="flash" size={12} color="#FFFFFF" />
              <Text style={styles.aiOptimizedText}>AI Optimized</Text>
            </View>
          )}
        </View>

        {activeBrainTraining && (
          <View style={styles.trainingCard}>
            <LinearGradient
              colors={[Colors.mind, '#6366F1']}
              style={styles.trainingGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.trainingInfo}>
                <Text style={styles.trainingName}>{activeBrainTraining.name}</Text>
                <Text style={styles.trainingDetails}>
                  {activeBrainTraining.duration} min • {activeBrainTraining.difficulty.toUpperCase()}
                </Text>
                <Text style={styles.trainingBenefit}>
                  {activeBrainTraining.neuralBenefit}
                </Text>
              </View>

              {isTrainingActive ? (
                <View style={styles.trainingTimer}>
                  <Text style={styles.timerText}>
                    {Math.floor(trainingTimer / 60)}:{(trainingTimer % 60).toString().padStart(2, '0')}
                  </Text>
                  <Text style={styles.timerLabel}>Training</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.startTrainingButton}
                  onPress={startBrainTraining}
                >
                  <Ionicons name="play" size={24} color="#FFFFFF" />
                  <Text style={styles.startTrainingText}>Start</Text>
                </TouchableOpacity>
              )}
            </LinearGradient>

            <View style={styles.exercisePreview}>
              <Text style={styles.exercisePreviewTitle}>Training Modules:</Text>
              {activeBrainTraining.exercises.slice(0, 2).map((exercise, index) => (
                <View key={index} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                  <Text style={styles.exerciseTargets}>
                    Targets: {exercise.targetArea.join(', ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </PerformanceMonitor>
  );

  const renderMindOptimizationScore = () => (
    <PerformanceMonitor>
      <View style={styles.scoreSection}>
        <LinearGradient
          colors={[Colors.mind, '#4F46E5']}
          style={styles.scoreGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.scoreHeader}>
            <Ionicons name="library" size={32} color="#FFFFFF" />
            <Text style={styles.scoreTitle}>Mind Optimization</Text>
          </View>
          <Text style={styles.scoreValue}>{pillarScores.mind}%</Text>
          <Text style={styles.scoreSubtitle}>Cognitive Enhancement Level</Text>
          
          <View style={styles.aiPrediction}>
            <Ionicons name="extension-puzzle" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.aiPredictionText}>
              Neuroplasticity at {cognitiveMetrics.neuroplasticity}% - Optimal learning state
            </Text>
          </View>

          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{userProfile.totalSessions}</Text>
              <Text style={styles.quickStatLabel}>Brain Sessions</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{cognitiveMetrics.mentalClarity}</Text>
              <Text style={styles.quickStatLabel}>Mental Clarity</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </PerformanceMonitor>
  );

  const renderDailyChallenge = () => (
    <PerformanceMonitor>
      <View style={styles.challengeSection}>
        <Text style={styles.sectionTitle}>Daily Cognitive Challenge</Text>
        <View style={styles.challengeCard}>
          <View style={styles.challengeIcon}>
            <Ionicons name="trophy" size={24} color={Colors.warning} />
          </View>
          <View style={styles.challengeContent}>
            <Text style={styles.challengeText}>{dailyChallenge}</Text>
            <TouchableOpacity 
              style={styles.challengeButton}
              onPress={() => Alert.alert('🎯 Challenge Accepted!', 'Great! Complete this challenge and track your progress.')}
            >
              <Text style={styles.challengeButtonText}>Accept Challenge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </PerformanceMonitor>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mind Optimization</Text>
          <Text style={styles.headerSubtitle}>Advanced Cognitive Enhancement</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings" size={20} color={Colors.mind} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderMindOptimizationScore()}
        {renderCognitiveMetrics()}
        {renderBrainTraining()}
        {renderDailyChallenge()}
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
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  scoreSection: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  scoreGradient: {
    padding: 24,
    alignItems: 'center',
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  scoreSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  aiPrediction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiPredictionText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quickStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  cognitiveSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 56) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  metricBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  trainingSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiOptimizedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.mind,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiOptimizedText: {
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 2,
    fontWeight: '600',
  },
  trainingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  trainingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  trainingInfo: {
    flex: 1,
  },
  trainingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  trainingDetails: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  trainingBenefit: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    lineHeight: 14,
  },
  startTrainingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startTrainingText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '600',
  },
  trainingTimer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timerLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  exercisePreview: {
    padding: 16,
  },
  exercisePreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  exerciseItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  exerciseName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  exerciseDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
  exerciseTargets: {
    fontSize: 10,
    color: Colors.mind,
    marginTop: 4,
    fontStyle: 'italic',
  },
  challengeSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  challengeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  challengeIcon: {
    marginRight: 16,
  },
  challengeContent: {
    flex: 1,
  },
  challengeText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  challengeButton: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  challengeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default React.memo(MindScreen);
