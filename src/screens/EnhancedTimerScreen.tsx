// src/screens/EnhancedTimerScreen.tsx - FIXED SCROLLING VERSION
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
  Platform, Animated, SafeAreaView, Alert, Vibration, ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

// CONSISTENT COLOR SCHEME
const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  // Pillar colors
  body: '#EF4444',
  mind: '#3B82F6',
  heart: '#EC4899',
  spirit: '#8B5CF6',
  diet: '#10B981',
};

interface SessionData {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  benefit: string;
  description: string;
  neuralScore: number;
}

interface SessionPhase {
  name: string;
  duration: number; // in seconds
  description: string;
  instructions: string[];
  neuralFocus: string;
}

interface NeuralMetrics {
  focus: number;
  engagement: number;
  consistency: number;
  overallScore: number;
}

const EnhancedTimerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pillar, sessionData } = route.params as { pillar: string; sessionData: SessionData };

  // Timer State
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [sessionPhases, setSessionPhases] = useState<SessionPhase[]>([]);

  // Neural Tracking State
  const [neuralMetrics, setNeuralMetrics] = useState<NeuralMetrics>({
    focus: 85,
    engagement: 92,
    consistency: 78,
    overallScore: 85
  });

  // Animation References
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Audio State
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    initializeSession();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const initializeSession = () => {
    const phases = generateSessionPhases(pillar, sessionData);
    setSessionPhases(phases);
    
    const total = phases.reduce((sum, phase) => sum + phase.duration, 0);
    setTotalDuration(total);
    setCurrentTime(total);
    
    startPulseAnimation();
  };

  const generateSessionPhases = (pillarType: string, session: SessionData): SessionPhase[] => {
    const baseDuration = parseDurationToSeconds(session.duration);
    
    const pillarPhases = {
      BODY: [
        {
          name: 'Activation',
          duration: Math.floor(baseDuration * 0.2),
          description: 'Neural-body connection preparation',
          instructions: [
            'Take 5 deep breaths to center yourself',
            'Visualize your body systems awakening',
            'Set intention for physical optimization'
          ],
          neuralFocus: 'Motor cortex priming'
        },
        {
          name: 'Main Training',
          duration: Math.floor(baseDuration * 0.7),
          description: 'Peak neurogenesis activation',
          instructions: [
            'Maintain focused attention on movement',
            'Feel the mind-muscle connection',
            'Push through resistance mindfully'
          ],
          neuralFocus: 'BDNF production maximization'
        },
        {
          name: 'Integration',
          duration: Math.floor(baseDuration * 0.1),
          description: 'Neural pathway consolidation',
          instructions: [
            'Cool down with deep breathing',
            'Reflect on the session experience',
            'Appreciate your body\'s capabilities'
          ],
          neuralFocus: 'Memory consolidation'
        }
      ],
      MIND: [
        {
          name: 'Focus Preparation',
          duration: Math.floor(baseDuration * 0.15),
          description: 'Cognitive system activation',
          instructions: [
            'Clear your mental workspace',
            'Set clear focus intention',
            'Eliminate external distractions'
          ],
          neuralFocus: 'Prefrontal cortex activation'
        },
        {
          name: 'Deep Focus State',
          duration: Math.floor(baseDuration * 0.75),
          description: 'Peak cognitive performance',
          instructions: [
            'Maintain single-pointed attention',
            'Notice when mind wanders, gently return',
            'Sustain concentrated mental effort'
          ],
          neuralFocus: 'Neural pathway strengthening'
        },
        {
          name: 'Integration',
          duration: Math.floor(baseDuration * 0.1),
          description: 'Cognitive consolidation',
          instructions: [
            'Gradually expand awareness',
            'Reflect on insights gained',
            'Appreciate mental clarity achieved'
          ],
          neuralFocus: 'Memory encoding'
        }
      ],
      HEART: [
        {
          name: 'Heart Opening',
          duration: Math.floor(baseDuration * 0.2),
          description: 'Emotional center activation',
          instructions: [
            'Place hand on heart, feel its rhythm',
            'Cultivate sense of warmth and openness',
            'Set intention for emotional growth'
          ],
          neuralFocus: 'Limbic system harmonization'
        },
        {
          name: 'Coherence Practice',
          duration: Math.floor(baseDuration * 0.6),
          description: 'Heart-brain synchronization',
          instructions: [
            'Breathe into your heart space',
            'Generate feelings of gratitude',
            'Maintain heart-focused awareness'
          ],
          neuralFocus: 'Vagal tone optimization'
        },
        {
          name: 'Emotional Integration',
          duration: Math.floor(baseDuration * 0.2),
          description: 'Emotional wisdom cultivation',
          instructions: [
            'Expand feelings to others',
            'Send loving-kindness outward',
            'Rest in emotional balance'
          ],
          neuralFocus: 'Social brain network enhancement'
        }
      ],
      SPIRIT: [
        {
          name: 'Sacred Preparation',
          duration: Math.floor(baseDuration * 0.2),
          description: 'Consciousness expansion readiness',
          instructions: [
            'Create sacred mental space',
            'Connect with higher purpose',
            'Open to transcendent experience'
          ],
          neuralFocus: 'Default mode network regulation'
        },
        {
          name: 'Transcendent State',
          duration: Math.floor(baseDuration * 0.6),
          description: 'Pure awareness cultivation',
          instructions: [
            'Rest in pure being',
            'Transcend ordinary thought patterns',
            'Merge with infinite awareness'
          ],
          neuralFocus: 'Consciousness expansion'
        },
        {
          name: 'Sacred Integration',
          duration: Math.floor(baseDuration * 0.2),
          description: 'Wisdom embodiment',
          instructions: [
            'Gradually return to ordinary awareness',
            'Integrate insights received',
            'Carry peace into daily life'
          ],
          neuralFocus: 'Wisdom network consolidation'
        }
      ],
      DIET: [
        {
          name: 'Mindful Preparation',
          duration: Math.floor(baseDuration * 0.3),
          description: 'Nutritional awareness activation',
          instructions: [
            'Tune into body\'s nutritional needs',
            'Set intention for optimal nourishment',
            'Appreciate food as medicine'
          ],
          neuralFocus: 'Interoceptive awareness'
        },
        {
          name: 'Conscious Implementation',
          duration: Math.floor(baseDuration * 0.5),
          description: 'Optimal nutrition application',
          instructions: [
            'Make conscious food choices',
            'Eat with full presence',
            'Feel nutrients nourishing cells'
          ],
          neuralFocus: 'Gut-brain axis optimization'
        },
        {
          name: 'Metabolic Integration',
          duration: Math.floor(baseDuration * 0.2),
          description: 'Nutritional wisdom embodiment',
          instructions: [
            'Feel gratitude for nourishment',
            'Visualize nutrients reaching brain',
            'Set intention for continued wellness'
          ],
          neuralFocus: 'Nutritional neuroplasticity'
        }
      ]
    };

    return pillarPhases[pillarType] || pillarPhases.MIND;
  };

  const parseDurationToSeconds = (duration: string): number => {
    const match = duration.match(/(\d+)\s*min/);
    return match ? parseInt(match[1]) * 60 : 1200; // Default 20 minutes
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startTimer = async () => {
    setIsRunning(true);
    setIsPaused(false);
    
    // Play start sound
    await playSound('start');
    
    timerInterval.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev <= 1) {
          completeSession();
          return 0;
        }
        
        // Update progress animation
        const progress = (totalDuration - prev + 1) / totalDuration;
        Animated.timing(progressAnim, {
          toValue: progress,
          duration: 100,
          useNativeDriver: false,
        }).start();
        
        // Check for phase transitions
        checkPhaseTransition(prev - 1);
        
        // Update neural metrics (simulated)
        updateNeuralMetrics();
        
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = async () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    setIsPaused(true);
    setIsRunning(false);
    
    await playSound('pause');
  };

  const resumeTimer = async () => {
    await startTimer();
    await playSound('resume');
  };

  const stopTimer = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this neural optimization session?',
      [
        { text: 'Continue', style: 'cancel' },
        { text: 'End Session', style: 'destructive', onPress: endSession }
      ]
    );
  };

  const endSession = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    navigation.goBack();
  };

  const completeSession = async () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    
    setIsRunning(false);
    await playSound('complete');
    
    // Show completion celebration
    showCompletionCelebration();
  };

  const showCompletionCelebration = () => {
    Alert.alert(
      '🎉 Session Complete!',
      `Excellent work! You've completed your ${pillar} neural optimization session.\n\nNeural Score: ${neuralMetrics.overallScore}/100`,
      [
        { text: 'View Progress', onPress: () => navigation.navigate('AnalyticsScreen') },
        { text: 'Done', onPress: () => navigation.goBack() }
      ]
    );
  };

  const checkPhaseTransition = (timeLeft: number) => {
    let elapsedTime = totalDuration - timeLeft;
    let phaseTime = 0;
    
    for (let i = 0; i < sessionPhases.length; i++) {
      phaseTime += sessionPhases[i].duration;
      if (elapsedTime <= phaseTime) {
        if (currentPhase !== i) {
          setCurrentPhase(i);
          announcePhaseTransition(sessionPhases[i]);
        }
        break;
      }
    }
  };

  const announcePhaseTransition = async (phase: SessionPhase) => {
    Vibration.vibrate([0, 200, 100, 200]);
    await playSound('phase');
  };

  const updateNeuralMetrics = () => {
    // Simulate neural tracking based on session progress
    setNeuralMetrics(prev => ({
      focus: Math.min(100, prev.focus + (Math.random() - 0.3)),
      engagement: Math.min(100, prev.engagement + (Math.random() - 0.4)),
      consistency: Math.min(100, prev.consistency + (Math.random() - 0.2)),
      overallScore: Math.min(100, (prev.focus + prev.engagement + prev.consistency) / 3)
    }));
  };

  const playSound = async (type: 'start' | 'pause' | 'resume' | 'complete' | 'phase') => {
    try {
      // In a real implementation, you'd load different sounds for each type
      // const { sound } = await Audio.Sound.createAsync(
      //   require('../assets/sounds/bell.mp3') // You'd need to add sound files
      // );
      // setSound(sound);
      // await sound.playAsync();
      console.log(`Playing ${type} sound`);
    } catch (error) {
      console.log('Sound playback error:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentPhase = (): SessionPhase | null => {
    return sessionPhases[currentPhase] || null;
  };

  const getPillarColor = () => {
    return Colors[pillar.toLowerCase()] || Colors.accent;
  };

  const renderTimerDisplay = () => (
    <Animated.View style={[styles.timerContainer, { transform: [{ scale: pulseAnim }] }]}>
      <LinearGradient
        colors={[getPillarColor(), `${getPillarColor()}80`]}
        style={styles.timerCircle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.timerInner}>
          <Text style={styles.timerText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timerLabel}>Neural Optimization</Text>
        </View>
      </LinearGradient>
      
      {/* Progress Ring */}
      <Animated.View style={styles.progressRing}>
        {/* This would be implemented with SVG for a real progress ring */}
      </Animated.View>
    </Animated.View>
  );

  const renderPhaseInfo = () => {
    const phase = getCurrentPhase();
    if (!phase) return null;

    return (
      <View style={styles.phaseContainer}>
        <Text style={styles.phaseTitle}>{phase.name}</Text>
        <Text style={styles.phaseDescription}>{phase.description}</Text>
        <Text style={styles.neuralFocus}>🧠 {phase.neuralFocus}</Text>
        
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Session Guidance:</Text>
          {phase.instructions.map((instruction, index) => (
            <Text key={index} style={styles.instructionText}>
              • {instruction}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderNeuralMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.metricsTitle}>Real-time Neural Tracking</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{Math.round(neuralMetrics.focus)}</Text>
          <Text style={styles.metricLabel}>Focus</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{Math.round(neuralMetrics.engagement)}</Text>
          <Text style={styles.metricLabel}>Engagement</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{Math.round(neuralMetrics.consistency)}</Text>
          <Text style={styles.metricLabel}>Consistency</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: getPillarColor() }]}>
            {Math.round(neuralMetrics.overallScore)}
          </Text>
          <Text style={styles.metricLabel}>Neural Score</Text>
        </View>
      </View>
    </View>
  );

  const renderControls = () => (
    <View style={styles.controlsContainer}>
      {!isRunning && !isPaused ? (
        <TouchableOpacity style={[styles.controlButton, styles.startButton]} onPress={startTimer}>
          <Ionicons name="play" size={32} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>Begin Session</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.activeControls}>
          <TouchableOpacity 
            style={[styles.controlButton, styles.pauseButton]} 
            onPress={isRunning ? pauseTimer : resumeTimer}
          >
            <Ionicons name={isRunning ? "pause" : "play"} size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.controlButton, styles.stopButton]} onPress={stopTimer}>
            <Ionicons name="stop" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {/* Header - Fixed at top */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{pillar} SESSION</Text>
            <Text style={styles.headerSubtitle}>{sessionData.title}</Text>
          </View>

          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {renderTimerDisplay()}
          {renderPhaseInfo()}
          {renderNeuralMetrics()}
          
          {/* Bottom spacing to ensure controls are always visible */}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Fixed Controls at Bottom */}
        <View style={styles.fixedControlsWrapper}>
          {renderControls()}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 1000, // Ensure header stays on top
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif',
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 20, // Extra bottom padding
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  timerInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  timerLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  progressRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  phaseContainer: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif',
  },
  phaseDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 22,
  },
  neuralFocus: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600',
    marginBottom: 16,
  },
  instructionsContainer: {
    marginTop: 8,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  metricsContainer: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  fixedControlsWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  startButton: {
    backgroundColor: Colors.success,
    minWidth: 200,
  },
  pauseButton: {
    backgroundColor: Colors.warning,
    width: 80,
  },
  stopButton: {
    backgroundColor: Colors.danger,
    width: 80,
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif',
  },
  activeControls: {
    flexDirection: 'row',
    gap: 20,
  },
});

export default EnhancedTimerScreen;
