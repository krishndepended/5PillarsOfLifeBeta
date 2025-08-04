// src/screens/BodyScreen.tsx - COMPREHENSIVE FITNESS & CULTURAL WELLNESS
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Real Data Integration
import { useAppData, useAppDataSelectors } from '../context/AppDataContext';

// Components
import ErrorBoundary from '../components/ErrorBoundary';

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  body: '#EF4444',
  bodyLight: '#FEE2E2',
};

interface Exercise {
  id: string;
  name: string;
  sanskrit?: string;
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'yoga' | 'cardio' | 'strength' | 'flexibility';
  description: string;
  benefits: string[];
  instructions: string[];
  cultural: boolean;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  totalDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cultural: boolean;
}

const BodyScreen = () => {
  const navigation = useNavigation();
  const { actions } = useAppData();
  const { userProfile, pillarScores, sessions } = useAppDataSelectors();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // State
  const [activeWorkout, setActiveWorkout] = useState<WorkoutPlan | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'workouts' | 'yoga' | 'progress' | 'ayurveda'>('workouts');

  // Mock fitness data (replace with real sensor data)
  const [fitnessMetrics] = useState({
    steps: 8742,
    calories: 324,
    heartRate: 72,
    workoutsThisWeek: 4,
    totalWorkouts: sessions.filter(s => s.pillar === 'body').length,
  });

  // Workout plans data
  const workoutPlans: WorkoutPlan[] = [
    {
      id: 'surya-namaskara',
      name: 'Surya Namaskara',
      description: 'Traditional Sun Salutation sequence for complete body wellness',
      totalDuration: 15,
      difficulty: 'beginner',
      cultural: true,
      exercises: [
        {
          id: 'prayer-pose',
          name: 'Prayer Pose',
          sanskrit: 'प्रणामासन (Pranamasana)',
          duration: 1,
          difficulty: 'beginner',
          type: 'yoga',
          description: 'Stand with feet together, palms pressed together at heart center',
          benefits: ['Centering', 'Focus', 'Grounding'],
          instructions: [
            'Stand tall with feet together',
            'Bring palms together at heart center',
            'Close eyes and take 3 deep breaths',
            'Set intention for practice'
          ],
          cultural: true
        },
        {
          id: 'raised-arms-pose',
          name: 'Raised Arms Pose',
          sanskrit: 'हस्तउत्तानासन (Hasta Uttanasana)',
          duration: 1,
          difficulty: 'beginner',
          type: 'yoga',
          description: 'Arms sweep up overhead, gentle backbend',
          benefits: ['Chest opening', 'Energy activation', 'Spinal flexibility'],
          instructions: [
            'Inhale and sweep arms up overhead',
            'Gently arch back, lifting chest',
            'Keep feet grounded',
            'Gaze upward'
          ],
          cultural: true
        },
        // Add more poses...
      ]
    },
    {
      id: 'cardio-burst',
      name: 'Energy Burst Cardio',
      description: 'High-intensity interval training for cardiovascular health',
      totalDuration: 20,
      difficulty: 'intermediate',
      cultural: false,
      exercises: [
        {
          id: 'jumping-jacks',
          name: 'Jumping Jacks',
          duration: 2,
          difficulty: 'beginner',
          type: 'cardio',
          description: 'Classic full-body cardio movement',
          benefits: ['Cardiovascular health', 'Coordination', 'Full body activation'],
          instructions: [
            'Start with feet together, arms at sides',
            'Jump feet apart while raising arms overhead',
            'Jump back to starting position',
            'Maintain steady rhythm'
          ],
          cultural: false
        },
        // Add more exercises...
      ]
    },
    {
      id: 'strength-basics',
      name: 'Foundation Strength',
      description: 'Basic strength building exercises for beginners',
      totalDuration: 25,
      difficulty: 'beginner',
      cultural: false,
      exercises: [
        {
          id: 'pushups',
          name: 'Push-ups',
          duration: 3,
          difficulty: 'beginner',
          type: 'strength',
          description: 'Upper body strength development',
          benefits: ['Chest strength', 'Arm strength', 'Core stability'],
          instructions: [
            'Start in plank position',
            'Lower body until chest nearly touches ground',
            'Push back up to starting position',
            'Maintain straight line from head to heels'
          ],
          cultural: false
        },
        // Add more exercises...
      ]
    }
  ];

  // Ayurvedic tips
  const ayurvedicTips = [
    {
      id: 'morning-movement',
      title: 'Morning Movement Ritual',
      sanskrit: 'प्रातःकाल व्यायाम',
      description: 'Begin each day with gentle movement to awaken the body\'s natural energy',
      tips: [
        'Practice yoga or stretching within 1 hour of waking',
        'Face east during morning practice when possible',
        'Start with 5-10 minutes and gradually increase',
        'Listen to your body\'s natural rhythm'
      ],
      dosha: 'All doshas',
      season: 'All seasons'
    },
    {
      id: 'seasonal-exercise',
      title: 'Seasonal Exercise Wisdom',
      sanskrit: 'ऋतु व्यायाम',
      description: 'Adapt your physical practice to align with natural seasonal rhythms',
      tips: [
        'Summer: Cool, gentle practices like swimming',
        'Winter: Warming, vigorous practices like heated yoga',
        'Monsoon: Indoor practices, avoid outdoor activities',
        'Spring: Detoxifying movements, dynamic flows'
      ],
      dosha: 'Varies by season',
      season: 'Seasonal adaptation'
    }
  ];

  // Effects
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isWorkingOut && workoutTimer > 0) {
      interval = setInterval(() => {
        setWorkoutTimer(timer => {
          if (timer <= 1) {
            handleExerciseComplete();
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkingOut, workoutTimer]);

  // Handlers
  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home' as never);
    }
  }, [navigation]);

  const handleStartWorkout = useCallback(async (workout: WorkoutPlan) => {
    setActiveWorkout(workout);
    if (workout.exercises.length > 0) {
      setCurrentExercise(workout.exercises[0]);
      setWorkoutTimer(workout.exercises[0].duration * 60); // Convert to seconds
      setIsWorkingOut(true);
      
      // Add session start
      await actions.addSession({
        pillar: 'body',
        type: 'exercise',
        duration: 0, // Will update on completion
        date: new Date().toISOString(),
        score: 0, // Will update on completion
        mood: 'good',
        notes: `Started ${workout.name} workout`
      });
    }
  }, [actions]);

  const handleExerciseComplete = useCallback(async () => {
    if (!activeWorkout || !currentExercise) return;

    const currentIndex = activeWorkout.exercises.findIndex(e => e.id === currentExercise.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < activeWorkout.exercises.length) {
      // Move to next exercise
      const nextExercise = activeWorkout.exercises[nextIndex];
      setCurrentExercise(nextExercise);
      setWorkoutTimer(nextExercise.duration * 60);
    } else {
      // Workout complete
      setIsWorkingOut(false);
      setActiveWorkout(null);
      setCurrentExercise(null);
      setWorkoutTimer(0);

      // Add completion session
      await actions.addSession({
        pillar: 'body',
        type: 'exercise',
        duration: activeWorkout.totalDuration,
        date: new Date().toISOString(),
        score: Math.floor(Math.random() * 20) + 80, // 80-100 score
        mood: 'excellent',
        notes: `Completed ${activeWorkout.name} workout`
      });

      // Check for achievements
      const bodySessionsCount = sessions.filter(s => s.pillar === 'body').length + 1;
      if (bodySessionsCount === 1) {
        await actions.addAchievement({
          title: '💪 First Workout',
          description: 'Completed your first body practice session',
          pillar: 'body',
          rarity: 'common'
        });
      } else if (bodySessionsCount === 10) {
        await actions.addAchievement({
          title: '🏃‍♂️ Fitness Enthusiast',
          description: 'Completed 10 body practice sessions',
          pillar: 'body',
          rarity: 'rare'
        });
      }

      if (activeWorkout.cultural) {
        await actions.addAchievement({
          title: '🕉️ Cultural Warrior',
          description: 'Completed a traditional Indian fitness practice',
          pillar: 'body',
          rarity: 'rare'
        });
      }

      Alert.alert(
        '🎉 Workout Complete!',
        `Excellent work! You completed ${activeWorkout.name}. Your body pillar score has increased.`,
        [{ text: 'Amazing!', style: 'default' }]
      );
    }
  }, [activeWorkout, currentExercise, actions, sessions]);

  const handleStopWorkout = useCallback(() => {
    Alert.alert(
      'Stop Workout?',
      'Are you sure you want to stop the current workout?',
      [
        { text: 'Continue', style: 'cancel' },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: () => {
            setIsWorkingOut(false);
            setActiveWorkout(null);
            setCurrentExercise(null);
            setWorkoutTimer(0);
          }
        }
      ]
    );
  }, []);

  // Render functions
  const renderHeader = () => (
    <LinearGradient
      colors={[Colors.body, '#DC2626']}
      style={styles.header}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Body Pillar</Text>
        <Text style={styles.headerSubtitle}>Physical Wellness • शारीरिक कल्याण</Text>
      </View>

      <View style={styles.headerScore}>
        <Text style={styles.headerScoreValue}>{Math.round(pillarScores.body || 0)}%</Text>
      </View>
    </LinearGradient>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {[
        { key: 'workouts', label: 'Workouts', icon: 'fitness' },
        { key: 'yoga', label: 'Yoga', icon: 'leaf' },
        { key: 'progress', label: 'Progress', icon: 'analytics' },
        { key: 'ayurveda', label: 'Ayurveda', icon: 'medical' }
      ].map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, selectedTab === tab.key && styles.tabActive]}
          onPress={() => setSelectedTab(tab.key as any)}
        >
          <Ionicons 
            name={tab.icon as any} 
            size={20} 
            color={selectedTab === tab.key ? Colors.body : Colors.textSecondary} 
          />
          <Text style={[
            styles.tabLabel,
            selectedTab === tab.key && styles.tabLabelActive
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderActiveWorkout = () => {
    if (!isWorkingOut || !currentExercise) return null;

    const minutes = Math.floor(workoutTimer / 60);
    const seconds = workoutTimer % 60;

    return (
      <View style={styles.activeWorkoutContainer}>
        <LinearGradient
          colors={[Colors.body, '#DC2626']}
          style={styles.activeWorkoutCard}
        >
          <View style={styles.activeWorkoutHeader}>
            <Text style={styles.activeWorkoutTitle}>{currentExercise.name}</Text>
            {currentExercise.sanskrit && (
              <Text style={styles.activeWorkoutSanskrit}>{currentExercise.sanskrit}</Text>
            )}
            <TouchableOpacity style={styles.stopButton} onPress={handleStopWorkout}>
              <Ionicons name="stop" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </Text>
          </View>

          <Text style={styles.exerciseDescription}>
            {currentExercise.description}
          </Text>

          <TouchableOpacity 
            style={styles.completeButton} 
            onPress={handleExerciseComplete}
          >
            <Text style={styles.completeButtonText}>Complete Exercise</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  const renderFitnessMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>Today's Metrics</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Ionicons name="walk" size={24} color={Colors.success} />
          <Text style={styles.metricValue}>{fitnessMetrics.steps.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Steps</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="flame" size={24} color={Colors.warning} />
          <Text style={styles.metricValue}>{fitnessMetrics.calories}</Text>
          <Text style={styles.metricLabel}>Calories</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="heart" size={24} color={Colors.danger} />
          <Text style={styles.metricValue}>{fitnessMetrics.heartRate}</Text>
          <Text style={styles.metricLabel}>BPM</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="trophy" size={24} color={Colors.body} />
          <Text style={styles.metricValue}>{fitnessMetrics.workoutsThisWeek}</Text>
          <Text style={styles.metricLabel}>This Week</Text>
        </View>
      </View>
    </View>
  );

  const renderWorkoutPlans = () => (
    <View style={styles.workoutPlansContainer}>
      <Text style={styles.sectionTitle}>Workout Plans</Text>
      {workoutPlans.map(plan => (
        <TouchableOpacity
          key={plan.id}
          style={styles.workoutPlanCard}
          onPress={() => handleStartWorkout(plan)}
          disabled={isWorkingOut}
        >
          <View style={styles.workoutPlanHeader}>
            <View style={styles.workoutPlanInfo}>
              <Text style={styles.workoutPlanName}>{plan.name}</Text>
              <Text style={styles.workoutPlanDescription}>{plan.description}</Text>
            </View>
            <View style={styles.workoutPlanMeta}>
              <Text style={styles.workoutPlanDuration}>{plan.totalDuration}min</Text>
              <Text style={styles.workoutPlanDifficulty}>
                {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}
              </Text>
              {plan.cultural && <Text style={styles.culturalBadge}>Cultural</Text>}
            </View>
          </View>
          <View style={styles.workoutPlanFooter}>
            <Text style={styles.exerciseCount}>
              {plan.exercises.length} exercises
            </Text>
            <Ionicons name="play-circle" size={24} color={Colors.body} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderYogaSection = () => (
    <View style={styles.yogaContainer}>
      <Text style={styles.sectionTitle}>Traditional Yoga Practices</Text>
      <Text style={styles.sectionSubtitle}>योग • Ancient wisdom for modern wellness</Text>
      
      {workoutPlans.filter(plan => plan.cultural).map(plan => (
        <View key={plan.id} style={styles.yogaCard}>
          <LinearGradient
            colors={[Colors.spirit + '20', Colors.spirit + '10']}
            style={styles.yogaCardGradient}
          >
            <View style={styles.yogaCardHeader}>
              <Text style={styles.yogaCardTitle}>{plan.name}</Text>
              <Text style={styles.yogaCardSubtitle}>Traditional Practice</Text>
            </View>
            <Text style={styles.yogaCardDescription}>{plan.description}</Text>
            <View style={styles.yogaCardFooter}>
              <Text style={styles.yogaDuration}>{plan.totalDuration} minutes</Text>
              <TouchableOpacity 
                style={styles.startYogaButton}
                onPress={() => handleStartWorkout(plan)}
                disabled={isWorkingOut}
              >
                <Text style={styles.startYogaButtonText}>Begin Practice</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      ))}
    </View>
  );

  const renderProgressSection = () => (
    <View style={styles.progressContainer}>
      <Text style={styles.sectionTitle}>Your Progress</Text>
      
      <View style={styles.progressCard}>
        <Text style={styles.progressCardTitle}>Body Pillar Score</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${Math.min(pillarScores.body || 0, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressScore}>{Math.round(pillarScores.body || 0)}%</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{fitnessMetrics.totalWorkouts}</Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{fitnessMetrics.workoutsThisWeek}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {sessions.filter(s => s.pillar === 'body' && s.type === 'exercise').length}
          </Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
      </View>
    </View>
  );

  const renderAyurvedaSection = () => (
    <View style={styles.ayurvedaContainer}>
      <Text style={styles.sectionTitle}>Ayurvedic Wellness</Text>
      <Text style={styles.sectionSubtitle}>आयुर्वेद • Ancient health wisdom</Text>
      
      {ayurvedicTips.map(tip => (
        <View key={tip.id} style={styles.ayurvedaTipCard}>
          <View style={styles.ayurvedaTipHeader}>
            <Text style={styles.ayurvedaTipTitle}>{tip.title}</Text>
            <Text style={styles.ayurvedaTipSanskrit}>{tip.sanskrit}</Text>
          </View>
          <Text style={styles.ayurvedaTipDescription}>{tip.description}</Text>
          <View style={styles.ayurvedaTipsList}>
            {tip.tips.map((tipText, index) => (
              <View key={index} style={styles.ayurvedaTipItem}>
                <Ionicons name="leaf" size={12} color={Colors.success} />
                <Text style={styles.ayurvedaTipText}>{tipText}</Text>
              </View>
            ))}
          </View>
          <View style={styles.ayurvedaTipFooter}>
            <Text style={styles.ayurvedaDosha}>Dosha: {tip.dosha}</Text>
            <Text style={styles.ayurvedaSeason}>Season: {tip.season}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'workouts':
        return (
          <>
            {renderFitnessMetrics()}
            {renderWorkoutPlans()}
          </>
        );
      case 'yoga':
        return renderYogaSection();
      case 'progress':
        return renderProgressSection();
      case 'ayurveda':
        return renderAyurvedaSection();
      default:
        return renderWorkoutPlans();
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {renderHeader()}
          {renderActiveWorkout()}
          {renderTabBar()}
          <ScrollView 
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
          >
            {renderTabContent()}
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

// Comprehensive styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  headerScore: {
    alignItems: 'center',
  },
  headerScoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  // Active Workout
  activeWorkoutContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  activeWorkoutCard: {
    borderRadius: 16,
    padding: 20,
  },
  activeWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activeWorkoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  activeWorkoutSanskrit: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  stopButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  exerciseDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  completeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.bodyLight,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: Colors.body,
  },

  // Scroll Content
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },

  // Sections
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },

  // Fitness Metrics
  metricsContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  // Workout Plans
  workoutPlansContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  workoutPlanCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  workoutPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  workoutPlanInfo: {
    flex: 1,
    marginRight: 16,
  },
  workoutPlanName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  workoutPlanDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  workoutPlanMeta: {
    alignItems: 'flex-end',
  },
  workoutPlanDuration: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.body,
  },
  workoutPlanDifficulty: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  culturalBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.spirit,
    backgroundColor: Colors.spirit + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  workoutPlanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  // Yoga Section
  yogaContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  yogaCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  yogaCardGradient: {
    padding: 20,
  },
  yogaCardHeader: {
    marginBottom: 12,
  },
  yogaCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  yogaCardSubtitle: {
    fontSize: 12,
    color: Colors.spirit,
    marginTop: 2,
  },
  yogaCardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  yogaCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yogaDuration: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  startYogaButton: {
    backgroundColor: Colors.spirit,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startYogaButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Progress Section
  progressContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  progressCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.bodyLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.body,
    borderRadius: 4,
  },
  progressScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.body,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.body,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Ayurveda Section
  ayurvedaContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  ayurvedaTipCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  ayurvedaTipHeader: {
    marginBottom: 12,
  },
  ayurvedaTipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  ayurvedaTipSanskrit: {
    fontSize: 14,
    color: Colors.success,
    fontStyle: 'italic',
    marginTop: 2,
  },
  ayurvedaTipDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  ayurvedaTipsList: {
    marginBottom: 16,
  },
  ayurvedaTipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  ayurvedaTipText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  ayurvedaTipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ayurvedaDosha: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  ayurvedaSeason: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

export default BodyScreen;
