// src/screens/QuickSessionScreen.tsx - 5-MINUTE GUIDED SESSIONS
import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDataSelectors, useAppData } from '../context/AppDataContext';
import { usePerformanceOptimization, PerformanceMonitor } from '../hooks/usePerformanceOptimization';
import { safeNavigate, safeGet } from '../utils/SafeNavigation';

const { width } = Dimensions.get('window');

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
};

interface SessionStep {
  id: string;
  title: string;
  instruction: string;
  duration: number; // seconds
  culturalWisdom?: string;
}

const QuickSessionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { actions } = useAppData();
  const { userProfile, isInitialized } = useAppDataSelectors();
  const { measurePerformance } = usePerformanceOptimization();

  const pillar = safeGet(route, 'params.pillar', 'mind') as string;
  const sessionType = safeGet(route, 'params.type', 'beginner') as string;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionStartTime] = useState(Date.now());

  // Session configurations
  const sessionConfigs = {
    body: {
      beginner: [
        { id: 'warmup', title: 'Gentle Warm-up', instruction: 'Roll your shoulders back and forth slowly. Feel your body awakening.', duration: 60, culturalWisdom: 'शरीर प्रारंभिक तैयारी' },
        { id: 'stretch', title: 'Simple Stretches', instruction: 'Stretch your arms above your head. Breathe deeply and feel the expansion.', duration: 90 },
        { id: 'movement', title: 'Mindful Movement', instruction: 'Take 10 deep breaths while gently moving your body.', duration: 90 },
        { id: 'completion', title: 'Integration', instruction: 'Notice how your body feels now. Set an intention to move mindfully today.', duration: 60 }
      ]
    },
    mind: {
      beginner: [
        { id: 'focus', title: 'Mind Settling', instruction: 'Close your eyes and take three deep breaths. Let your mind become still.', duration: 60, culturalWisdom: 'मन की शांति' },
        { id: 'awareness', title: 'Present Moment', instruction: 'Notice your thoughts without judgment. Simply observe them like clouds passing.', duration: 120 },
        { id: 'concentration', title: 'Single Focus', instruction: 'Count your breaths from 1 to 10, then start again. Return to 1 if you lose count.', duration: 90 },
        { id: 'integration', title: 'Wisdom Integration', instruction: 'Feel the clarity that comes from a focused mind. Carry this awareness forward.', duration: 30 }
      ]
    },
    heart: {
      beginner: [
        { id: 'centering', title: 'Heart Centering', instruction: 'Place your hand on your heart. Feel its steady rhythm and warmth.', duration: 60, culturalWisdom: 'हृदय में प्रेम' },
        { id: 'compassion', title: 'Self-Compassion', instruction: 'Send yourself loving-kindness: "May I be happy, may I be healthy, may I be at peace."', duration: 90 },
        { id: 'gratitude', title: 'Gratitude Practice', instruction: 'Think of three things you are grateful for right now. Feel the warmth of appreciation.', duration: 90 },
        { id: 'extension', title: 'Loving Extension', instruction: 'Extend this love to someone you care about. Feel the connection.', duration: 60 }
      ]
    },
    spirit: {
      beginner: [
        { id: 'stillness', title: 'Inner Stillness', instruction: 'Sit comfortably and find complete stillness in your body and mind.', duration: 60, culturalWisdom: 'आत्मा की शांति' },
        { id: 'connection', title: 'Universal Connection', instruction: 'Feel your connection to all life. You are part of the infinite cosmos.', duration: 120 },
        { id: 'presence', title: 'Pure Awareness', instruction: 'Rest in pure awareness. You are the witness of all experience.', duration: 90 },
        { id: 'integration', title: 'Sacred Integration', instruction: 'Carry this sacred awareness into your daily activities.', duration: 30 }
      ]
    },
    diet: {
      beginner: [
        { id: 'gratitude', title: 'Food Gratitude', instruction: 'Think about the nourishing foods you will eat today with appreciation.', duration: 60, culturalWisdom: 'अन्न का सम्मान' },
        { id: 'intention', title: 'Eating Intention', instruction: 'Set an intention to eat mindfully and choose foods that nourish your body and soul.', duration: 90 },
        { id: 'planning', title: 'Meal Awareness', instruction: 'Visualize preparing and eating wholesome, plant-based Indian meals with love.', duration: 90 },
        { id: 'commitment', title: 'Nutrition Commitment', instruction: 'Commit to honoring your body with conscious food choices today.', duration: 60 }
      ]
    }
  };

  const currentSession = sessionConfigs[pillar as keyof typeof sessionConfigs]?.[sessionType as keyof typeof sessionConfigs[keyof typeof sessionConfigs]] || sessionConfigs.mind.beginner;

  useEffect(() => {
    const measurement = measurePerformance('QuickSessionScreen');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      measurement.end();
    });

    // Start pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleStepComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeRemaining]);

  const startStep = () => {
    setTimeRemaining(currentSession[currentStep].duration);
    setIsActive(true);
  };

  const handleStepComplete = () => {
    setIsActive(false);
    
    if (currentStep < currentSession.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeSession();
    }
  };

  const completeSession = async () => {
    try {
      const totalDuration = Math.round((Date.now() - sessionStartTime) / 1000 / 60); // minutes
      const improvement = Math.floor(Math.random() * 3) + 2; // 2-4 points improvement

      // Add session to user data
      actions.addSession({
        pillar: pillar,
        duration: totalDuration,
        improvement: improvement,
        type: 'quick_session'
      });

      // Add achievement for first session
      actions.addAchievement({
        id: `achievement_first_${pillar}_${Date.now()}`,
        title: `First ${pillar.charAt(0).toUpperCase() + pillar.slice(1)} Session!`,
        description: `Completed your first guided ${pillar} optimization session`,
        pillar: pillar,
        unlockedDate: new Date().toISOString(),
        rarity: 'common'
      });

      // Navigate back with success
      safeNavigate(navigation, 'Home', { 
        sessionCompleted: true, 
        pillar: pillar,
        improvement: improvement 
      });
      
    } catch (error) {
      console.error('Error completing session:', error);
      safeNavigate(navigation, 'Home');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPillarColor = () => {
    switch (pillar) {
      case 'body': return Colors.body;
      case 'mind': return Colors.mind;
      case 'heart': return Colors.heart;
      case 'spirit': return Colors.spirit;
      case 'diet': return Colors.diet;
      default: return Colors.accent;
    }
  };

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="timer" size={48} color={getPillarColor()} />
        <Text style={styles.loadingText}>Preparing Session...</Text>
      </View>
    );
  }

  const currentStepData = currentSession[currentStep];

  return (
    <PerformanceMonitor>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={[getPillarColor(), `${getPillarColor()}CC`]}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => safeNavigate(navigation, 'Home')}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {pillar.charAt(0).toUpperCase() + pillar.slice(1)} Session
            </Text>
            <Text style={styles.headerSubtitle}>
              Step {currentStep + 1} of {currentSession.length}
            </Text>
          </View>

          <View style={styles.progressRing}>
            <Text style={styles.progressText}>
              {Math.round(((currentStep + (isActive ? 1 : 0)) / currentSession.length) * 100)}%
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.timerContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <View style={[styles.timerCircle, { borderColor: getPillarColor() }]}>
              <Text style={styles.timerText}>
                {isActive ? formatTime(timeRemaining) : '○'}
              </Text>
            </View>
          </Animated.View>

          <View style={styles.instructionContainer}>
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>
            <Text style={styles.stepInstruction}>{currentStepData.instruction}</Text>
            
            {currentStepData.culturalWisdom && (
              <View style={styles.wisdomContainer}>
                <Ionicons name="book" size={16} color={Colors.spirit} />
                <Text style={styles.wisdomText}>{currentStepData.culturalWisdom}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.navigationContainer}>
          {!isActive ? (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: getPillarColor() }]}
              onPress={startStep}
            >
              <Ionicons name="play" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                {currentStep === 0 ? 'Begin Session' : 'Continue'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeIndicator}>
              <View style={[styles.activeCircle, { backgroundColor: getPillarColor() }]} />
              <Text style={styles.activeText}>Session in progress...</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </PerformanceMonitor>
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
    paddingVertical: 20,
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
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  progressRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  timerContainer: {
    marginBottom: 48,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 12,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
  },
  instructionContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  stepInstruction: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
  },
  wisdomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.spirit}15`,
    padding: 12,
    borderRadius: 8,
    maxWidth: '90%',
  },
  wisdomText: {
    fontSize: 14,
    color: Colors.spirit,
    fontStyle: 'italic',
    marginLeft: 8,
  },
  navigationContainer: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  activeCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activeText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default React.memo(QuickSessionScreen);
