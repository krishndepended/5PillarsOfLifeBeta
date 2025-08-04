// src/screens/MindScreen.tsx - COMPREHENSIVE COGNITIVE TRAINING & MENTAL WELLNESS
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
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Real Data Integration
import { useAppData, useAppDataSelectors } from '../context/AppDataContext';

// Components
import ErrorBoundary from '../components/ErrorBoundary';

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
  mind: '#3B82F6',
  mindLight: '#EBF4FF',
  spirit: '#8B5CF6',
};

interface MemoryGame {
  id: string;
  sequence: number[];
  userSequence: number[];
  currentStep: number;
  isPlaying: boolean;
  isUserTurn: boolean;
  score: number;
  level: number;
}

interface FocusSession {
  id: string;
  type: 'pomodoro' | 'meditation' | 'breathing' | 'concentration';
  duration: number; // minutes
  timeRemaining: number; // seconds
  isActive: boolean;
  completedCycles: number;
  targetCycles: number;
}

interface CognitiveExercise {
  id: string;
  name: string;
  sanskrit?: string;
  description: string;
  type: 'memory' | 'attention' | 'processing' | 'flexibility';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  benefits: string[];
  cultural: boolean;
}

interface MentalWellnessContent {
  id: string;
  title: string;
  sanskrit?: string;
  type: 'meditation' | 'mantra' | 'breathing' | 'wisdom';
  duration: number;
  description: string;
  content: string[];
  benefits: string[];
}

const MindScreen = () => {
  const navigation = useNavigation();
  const { actions } = useAppData();
  const { userProfile, pillarScores, sessions } = useAppDataSelectors();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // State
  const [selectedTab, setSelectedTab] = useState<'training' | 'focus' | 'games' | 'wisdom'>('training');
  const [memoryGame, setMemoryGame] = useState<MemoryGame | null>(null);
  const [focusSession, setFocusSession] = useState<FocusSession | null>(null);
  const [showingSequence, setShowingSequence] = useState(false);

  // Mock cognitive metrics
  const [cognitiveMetrics] = useState({
    focusScore: 78,
    memoryScore: 82,
    attentionSpan: 15, // minutes
    sessionsToday: sessions.filter(s => s.pillar === 'mind' && 
      new Date(s.date).toDateString() === new Date().toDateString()).length,
    totalMindSessions: sessions.filter(s => s.pillar === 'mind').length,
    longestFocusStreak: 45, // minutes
  });

  // Cognitive exercises data
  const cognitiveExercises: CognitiveExercise[] = [
    {
      id: 'memory-palace',
      name: 'Memory Palace Technique',
      sanskrit: 'स्मृति महल (Smriti Mahal)',
      description: 'Ancient technique to enhance memory using spatial visualization',
      type: 'memory',
      difficulty: 'intermediate',
      duration: 10,
      benefits: ['Enhanced recall', 'Spatial memory', 'Visualization skills'],
      cultural: true
    },
    {
      id: 'attention-training',
      name: 'Focused Attention Training',
      sanskrit: 'एकाग्रता अभ्यास (Ekagrata Abhyas)',
      description: 'Develop sustained attention through mindful observation',
      type: 'attention',
      difficulty: 'beginner',
      duration: 15,
      benefits: ['Improved focus', 'Reduced mind wandering', 'Mental clarity'],
      cultural: true
    },
    {
      id: 'processing-speed',
      name: 'Cognitive Processing Challenge',
      description: 'Rapid pattern recognition and response training',
      type: 'processing',
      difficulty: 'advanced',
      duration: 8,
      benefits: ['Faster thinking', 'Quick decision making', 'Mental agility'],
      cultural: false
    },
    {
      id: 'mental-flexibility',
      name: 'Cognitive Flexibility Training',
      sanskrit: 'मानसिक लचीलापन (Mansik Lacheelapan)',
      description: 'Switch between different mental tasks and concepts',
      type: 'flexibility',
      difficulty: 'intermediate',
      duration: 12,
      benefits: ['Adaptability', 'Creative thinking', 'Problem solving'],
      cultural: true
    }
  ];

  // Mental wellness content
  const mentalWellnessContent: MentalWellnessContent[] = [
    {
      id: 'gayatri-mantra',
      title: 'Gayatri Mantra for Mental Clarity',
      sanskrit: 'गायत्री मंत्र',
      type: 'mantra',
      duration: 10,
      description: 'Sacred mantra to illuminate the mind and enhance cognitive function',
      content: [
        'ॐ भूर्भुवः स्वः',
        'तत्सवितुर्वरेण्यं',
        'भर्गो देवस्य धीमहि',
        'धियो यो नः प्रचोदयात्'
      ],
      benefits: ['Mental clarity', 'Enhanced concentration', 'Spiritual awakening']
    },
    {
      id: 'pranayama-focus',
      title: 'Nadi Shodhana for Mental Balance',
      sanskrit: 'नाड़ी शोधन प्राणायाम',
      type: 'breathing',
      duration: 8,
      description: 'Alternate nostril breathing to balance the nervous system',
      content: [
        'Sit comfortably with spine straight',
        'Use right thumb to close right nostril',
        'Inhale through left nostril for 4 counts',
        'Close left nostril, release right, exhale for 4 counts',
        'Inhale right nostril, switch, exhale left',
        'Continue for 8-10 cycles'
      ],
      benefits: ['Nervous system balance', 'Mental equilibrium', 'Enhanced focus']
    },
    {
      id: 'meditation-clarity',
      title: 'Trataka Meditation',
      sanskrit: 'त्राटक ध्यान',
      type: 'meditation',
      duration: 15,
      description: 'Candle gazing meditation to develop concentration and mental clarity',
      content: [
        'Sit 3 feet away from a lit candle',
        'Gaze steadily at the flame without blinking',
        'When eyes water, close them and visualize the flame',
        'Hold the inner image as long as possible',
        'Open eyes and repeat the process',
        'Practice for 10-15 minutes daily'
      ],
      benefits: ['Concentration power', 'Memory enhancement', 'Mental stability']
    },
    {
      id: 'vedic-wisdom',
      title: 'Ancient Wisdom for Modern Mind',
      sanskrit: 'वैदिक ज्ञान',
      type: 'wisdom',
      duration: 5,
      description: 'Timeless principles for mental wellness from Vedic tradition',
      content: [
        'यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः - Where there is focused mind, there is success',
        'मन एव मनुष्याणां कारणं बन्धमोक्षयोः - Mind is the cause of bondage and liberation',
        'Regular practice (अभ्यास) leads to mastery',
        'Detachment (वैराग्य) brings mental peace',
        'Consistent effort (पुरुषार्थ) yields results'
      ],
      benefits: ['Philosophical understanding', 'Mental framework', 'Life wisdom']
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

    // Pulse animation for active elements
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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
    pulseLoop.start();

    return () => pulseLoop.stop();
  }, []);

  // Focus session timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (focusSession && focusSession.isActive && focusSession.timeRemaining > 0) {
      interval = setInterval(() => {
        setFocusSession(prev => {
          if (!prev) return null;
          const newTime = prev.timeRemaining - 1;
          if (newTime <= 0) {
            handleFocusSessionComplete();
            return { ...prev, timeRemaining: 0, isActive: false };
          }
          return { ...prev, timeRemaining: newTime };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusSession]);

  // Handlers
  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home' as never);
    }
  }, [navigation]);

  const startMemoryGame = useCallback(() => {
    const initialSequence = [Math.floor(Math.random() * 4) + 1];
    setMemoryGame({
      id: `memory-${Date.now()}`,
      sequence: initialSequence,
      userSequence: [],
      currentStep: 0,
      isPlaying: true,
      isUserTurn: false,
      score: 0,
      level: 1
    });
    setShowingSequence(true);
    
    // Show sequence to user
    setTimeout(() => {
      setShowingSequence(false);
      setMemoryGame(prev => prev ? { ...prev, isUserTurn: true } : null);
    }, (initialSequence.length + 1) * 800);
  }, []);

  const handleMemoryInput = useCallback(async (number: number) => {
    if (!memoryGame || !memoryGame.isUserTurn) return;

    const newUserSequence = [...memoryGame.userSequence, number];
    const isCorrect = newUserSequence[memoryGame.currentStep] === memoryGame.sequence[memoryGame.currentStep];

    if (!isCorrect) {
      // Game over
      Alert.alert('Game Over!', `Final Score: ${memoryGame.score}\nLevel Reached: ${memoryGame.level}`);
      
      // Add session
      await actions.addSession({
        pillar: 'mind',
        type: 'practice',
        duration: 5,
        date: new Date().toISOString(),
        score: Math.min(memoryGame.score * 10, 100),
        mood: 'good',
        notes: `Memory game - Level ${memoryGame.level}, Score ${memoryGame.score}`
      });

      setMemoryGame(null);
      return;
    }

    if (newUserSequence.length === memoryGame.sequence.length) {
      // Level complete
      const newLevel = memoryGame.level + 1;
      const newScore = memoryGame.score + memoryGame.level * 10;
      const newSequence = [...memoryGame.sequence, Math.floor(Math.random() * 4) + 1];
      
      setMemoryGame({
        ...memoryGame,
        sequence: newSequence,
        userSequence: [],
        currentStep: 0,
        isUserTurn: false,
        score: newScore,
        level: newLevel
      });
      
      setShowingSequence(true);
      setTimeout(() => {
        setShowingSequence(false);
        setMemoryGame(prev => prev ? { ...prev, isUserTurn: true } : null);
      }, (newSequence.length + 1) * 800);
    } else {
      setMemoryGame({
        ...memoryGame,
        userSequence: newUserSequence,
        currentStep: memoryGame.currentStep + 1
      });
    }
  }, [memoryGame, actions]);

  const startFocusSession = useCallback((type: FocusSession['type'], duration: number) => {
    setFocusSession({
      id: `focus-${Date.now()}`,
      type,
      duration,
      timeRemaining: duration * 60,
      isActive: true,
      completedCycles: 0,
      targetCycles: type === 'pomodoro' ? 4 : 1
    });
  }, []);

  const handleFocusSessionComplete = useCallback(async () => {
    if (!focusSession) return;

    await actions.addSession({
      pillar: 'mind',
      type: 'practice',
      duration: focusSession.duration,
      date: new Date().toISOString(),
      score: 85 + Math.floor(Math.random() * 15),
      mood: 'excellent',
      notes: `${focusSession.type} session completed`
    });

    // Check for achievements
    const mindSessionsCount = sessions.filter(s => s.pillar === 'mind').length + 1;
    if (mindSessionsCount === 1) {
      await actions.addAchievement({
        title: '🧠 Mental Training Begins',
        description: 'Completed your first mind training session',
        pillar: 'mind',
        rarity: 'common'
      });
    }

    if (focusSession.duration >= 25) {
      await actions.addAchievement({
        title: '⏰ Deep Focus Master',
        description: 'Completed a 25+ minute focused session',
        pillar: 'mind',
        rarity: 'rare'
      });
    }

    Alert.alert(
      '🎉 Session Complete!',
      `Excellent focus! You completed a ${focusSession.duration}-minute ${focusSession.type} session.`,
      [{ text: 'Great!', style: 'default' }]
    );

    setFocusSession(null);
  }, [focusSession, actions, sessions]);

  const stopFocusSession = useCallback(() => {
    Alert.alert(
      'Stop Session?',
      'Are you sure you want to stop the current focus session?',
      [
        { text: 'Continue', style: 'cancel' },
        { text: 'Stop', style: 'destructive', onPress: () => setFocusSession(null) }
      ]
    );
  }, []);

  const startCognitiveExercise = useCallback(async (exercise: CognitiveExercise) => {
    // Simulate exercise completion
    await actions.addSession({
      pillar: 'mind',
      type: 'practice',
      duration: exercise.duration,
      date: new Date().toISOString(),
      score: 75 + Math.floor(Math.random() * 25),
      mood: 'good',
      notes: `Cognitive exercise: ${exercise.name}`
    });

    if (exercise.cultural) {
      await actions.addAchievement({
        title: '🕉️ Ancient Wisdom Seeker',
        description: 'Completed a traditional cognitive practice',
        pillar: 'mind',
        rarity: 'rare'
      });
    }

    Alert.alert(
      '✨ Exercise Complete!',
      `You completed ${exercise.name}. Your cognitive abilities are improving!`,
      [{ text: 'Continue Training', style: 'default' }]
    );
  }, [actions]);

  // Render functions
  const renderHeader = () => (
    <LinearGradient
      colors={[Colors.mind, '#2563EB']}
      style={styles.header}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Mind Pillar</Text>
        <Text style={styles.headerSubtitle}>Cognitive Enhancement • मानसिक विकास</Text>
      </View>

      <View style={styles.headerScore}>
        <Text style={styles.headerScoreValue}>{Math.round(pillarScores.mind || 0)}%</Text>
      </View>
    </LinearGradient>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {[
        { key: 'training', label: 'Training', icon: 'fitness' },
        { key: 'focus', label: 'Focus', icon: 'time' },
        { key: 'games', label: 'Games', icon: 'game-controller' },
        { key: 'wisdom', label: 'Wisdom', icon: 'book' }
      ].map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, selectedTab === tab.key && styles.tabActive]}
          onPress={() => setSelectedTab(tab.key as any)}
        >
          <Ionicons 
            name={tab.icon as any} 
            size={20} 
            color={selectedTab === tab.key ? Colors.mind : Colors.textSecondary} 
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

  const renderActiveFocusSession = () => {
    if (!focusSession || !focusSession.isActive) return null;

    const minutes = Math.floor(focusSession.timeRemaining / 60);
    const seconds = focusSession.timeRemaining % 60;

    return (
      <Animated.View style={[styles.activeFocusContainer, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient
          colors={[Colors.mind, '#2563EB']}
          style={styles.activeFocusCard}
        >
          <View style={styles.activeFocusHeader}>
            <Text style={styles.activeFocusTitle}>
              {focusSession.type.charAt(0).toUpperCase() + focusSession.type.slice(1)} Session
            </Text>
            <TouchableOpacity style={styles.stopButton} onPress={stopFocusSession}>
              <Ionicons name="stop" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </Text>
          </View>

          <Text style={styles.focusInstructions}>
            Stay focused on your breath. Let thoughts pass without judgment.
          </Text>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderCognitiveMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>Cognitive Metrics</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Ionicons name="eye" size={24} color={Colors.success} />
          <Text style={styles.metricValue}>{cognitiveMetrics.focusScore}</Text>
          <Text style={styles.metricLabel}>Focus Score</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="library" size={24} color={Colors.warning} />
          <Text style={styles.metricValue}>{cognitiveMetrics.memoryScore}</Text>
          <Text style={styles.metricLabel}>Memory Score</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="time" size={24} color={Colors.mind} />
          <Text style={styles.metricValue}>{cognitiveMetrics.attentionSpan}m</Text>
          <Text style={styles.metricLabel}>Attention Span</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="trophy" size={24} color={Colors.danger} />
          <Text style={styles.metricValue}>{cognitiveMetrics.sessionsToday}</Text>
          <Text style={styles.metricLabel}>Today</Text>
        </View>
      </View>
    </View>
  );

  const renderCognitiveTraining = () => (
    <View style={styles.trainingContainer}>
      <Text style={styles.sectionTitle}>Cognitive Training</Text>
      {cognitiveExercises.map(exercise => (
        <TouchableOpacity
          key={exercise.id}
          style={styles.exerciseCard}
          onPress={() => startCognitiveExercise(exercise)}
        >
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              {exercise.sanskrit && (
                <Text style={styles.exerciseSanskrit}>{exercise.sanskrit}</Text>
              )}
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
            </View>
            <View style={styles.exerciseMeta}>
              <Text style={styles.exerciseDuration}>{exercise.duration}min</Text>
              <Text style={styles.exerciseDifficulty}>
                {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
              </Text>
              {exercise.cultural && <Text style={styles.culturalBadge}>Cultural</Text>}
            </View>
          </View>
          <View style={styles.exerciseBenefits}>
            {exercise.benefits.slice(0, 3).map((benefit, index) => (
              <Text key={index} style={styles.benefitTag}>{benefit}</Text>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFocusTraining = () => (
    <View style={styles.focusContainer}>
      <Text style={styles.sectionTitle}>Focus Training</Text>
      <Text style={styles.sectionSubtitle}>Build sustained attention and mental clarity</Text>
      
      <View style={styles.focusOptionsGrid}>
        <TouchableOpacity
          style={styles.focusOptionCard}
          onPress={() => startFocusSession('pomodoro', 25)}
          disabled={!!focusSession}
        >
          <Ionicons name="time" size={32} color={Colors.danger} />
          <Text style={styles.focusOptionTitle}>Pomodoro</Text>
          <Text style={styles.focusOptionSubtitle}>25 min work focus</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.focusOptionCard}
          onPress={() => startFocusSession('meditation', 15)}
          disabled={!!focusSession}
        >
          <Ionicons name="leaf" size={32} color={Colors.spirit} />
          <Text style={styles.focusOptionTitle}>Meditation</Text>
          <Text style={styles.focusOptionSubtitle}>15 min mindfulness</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.focusOptionCard}
          onPress={() => startFocusSession('breathing', 10)}
          disabled={!!focusSession}
        >
          <Ionicons name="cloud" size={32} color={Colors.success} />
          <Text style={styles.focusOptionTitle}>Breathing</Text>
          <Text style={styles.focusOptionSubtitle}>10 min pranayama</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.focusOptionCard}
          onPress={() => startFocusSession('concentration', 20)}
          disabled={!!focusSession}
        >
          <Ionicons name="eye" size={32} color={Colors.warning} />
          <Text style={styles.focusOptionTitle}>Concentration</Text>
          <Text style={styles.focusOptionSubtitle}>20 min deep focus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMemoryGame = () => (
    <View style={styles.gameContainer}>
      <Text style={styles.sectionTitle}>Memory Challenge</Text>
      <Text style={styles.sectionSubtitle}>Test and improve your sequential memory</Text>
      
      {!memoryGame ? (
        <TouchableOpacity style={styles.startGameButton} onPress={startMemoryGame}>
          <Ionicons name="play-circle" size={48} color={Colors.mind} />
          <Text style={styles.startGameText}>Start Memory Game</Text>
          <Text style={styles.startGameSubtext}>Follow the sequence and repeat it back</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.memoryGameActive}>
          <View style={styles.gameStats}>
            <Text style={styles.gameLevel}>Level: {memoryGame.level}</Text>
            <Text style={styles.gameScore}>Score: {memoryGame.score}</Text>
          </View>
          
          <Text style={styles.gameInstructions}>
            {showingSequence ? 'Watch the sequence...' : 
             memoryGame.isUserTurn ? 'Repeat the sequence' : 'Get ready...'}
          </Text>

          <View style={styles.gameButtons}>
            {[1, 2, 3, 4].map(number => (
              <TouchableOpacity
                key={number}
                style={[
                  styles.gameButton,
                  showingSequence && memoryGame.sequence[memoryGame.currentStep] === number && styles.gameButtonActive
                ]}
                onPress={() => handleMemoryInput(number)}
                disabled={!memoryGame.isUserTurn}
              >
                <Text style={styles.gameButtonText}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderMentalWisdom = () => (
    <View style={styles.wisdomContainer}>
      <Text style={styles.sectionTitle}>Mental Wellness Wisdom</Text>
      <Text style={styles.sectionSubtitle}>वेदांत • Ancient practices for modern minds</Text>
      
      {mentalWellnessContent.map(content => (
        <View key={content.id} style={styles.wisdomCard}>
          <View style={styles.wisdomHeader}>
            <View style={styles.wisdomTitleContainer}>
              <Text style={styles.wisdomTitle}>{content.title}</Text>
              {content.sanskrit && (
                <Text style={styles.wisdomSanskrit}>{content.sanskrit}</Text>
              )}
            </View>
            <View style={styles.wisdomMeta}>
              <Text style={styles.wisdomDuration}>{content.duration}min</Text>
              <Ionicons 
                name={
                  content.type === 'mantra' ? 'musical-notes' :
                  content.type === 'breathing' ? 'cloud' :
                  content.type === 'meditation' ? 'leaf' : 'book'
                } 
                size={20} 
                color={Colors.spirit} 
              />
            </View>
          </View>
          
          <Text style={styles.wisdomDescription}>{content.description}</Text>
          
          <View style={styles.wisdomContent}>
            {content.content.slice(0, 3).map((item, index) => (
              <Text key={index} style={styles.wisdomContentItem}>• {item}</Text>
            ))}
            {content.content.length > 3 && (
              <Text style={styles.wisdomMore}>+{content.content.length - 3} more steps</Text>
            )}
          </View>

          <View style={styles.wisdomBenefits}>
            {content.benefits.map((benefit, index) => (
              <Text key={index} style={styles.wisdomBenefit}>{benefit}</Text>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.startWisdomButton}
            onPress={async () => {
              await actions.addSession({
                pillar: 'mind',
                type: 'practice',
                duration: content.duration,
                date: new Date().toISOString(),
                score: 80 + Math.floor(Math.random() * 20),
                mood: 'excellent',
                notes: `Mental wellness practice: ${content.title}`
              });

              Alert.alert(
                '🕉️ Practice Complete!',
                `You completed ${content.title}. Your mind feels more clear and focused.`,
                [{ text: 'Namaste 🙏', style: 'default' }]
              );
            }}
          >
            <Text style={styles.startWisdomButtonText}>Begin Practice</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'training':
        return (
          <>
            {renderCognitiveMetrics()}
            {renderCognitiveTraining()}
          </>
        );
      case 'focus':
        return renderFocusTraining();
      case 'games':
        return renderMemoryGame();
      case 'wisdom':
        return renderMentalWisdom();
      default:
        return renderCognitiveTraining();
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {renderHeader()}
          {renderActiveFocusSession()}
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

  // Active Focus Session
  activeFocusContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  activeFocusCard: {
    borderRadius: 16,
    padding: 20,
  },
  activeFocusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activeFocusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  focusInstructions: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
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
    backgroundColor: Colors.mindLight,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: Colors.mind,
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

  // Cognitive Metrics
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

  // Cognitive Training
  trainingContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  exerciseCard: {
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
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  exerciseSanskrit: {
    fontSize: 14,
    color: Colors.spirit,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  exerciseMeta: {
    alignItems: 'flex-end',
  },
  exerciseDuration: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.mind,
  },
  exerciseDifficulty: {
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
  exerciseBenefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  benefitTag: {
    fontSize: 12,
    color: Colors.mind,
    backgroundColor: Colors.mindLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  // Focus Training
  focusContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  focusOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  focusOptionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  focusOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  focusOptionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Memory Game
  gameContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  startGameButton: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  startGameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  startGameSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  memoryGameActive: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gameLevel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.mind,
  },
  gameScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.success,
  },
  gameInstructions: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  gameButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  gameButton: {
    width: 80,
    height: 80,
    backgroundColor: Colors.mindLight,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  gameButtonActive: {
    backgroundColor: Colors.mind,
    borderColor: Colors.mind,
  },
  gameButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.mind,
  },

  // Mental Wisdom
  wisdomContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  wisdomCard: {
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
  wisdomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  wisdomTitleContainer: {
    flex: 1,
  },
  wisdomTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  wisdomSanskrit: {
    fontSize: 14,
    color: Colors.spirit,
    fontStyle: 'italic',
  },
  wisdomMeta: {
    alignItems: 'center',
    gap: 4,
  },
  wisdomDuration: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  wisdomDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  wisdomContent: {
    marginBottom: 16,
  },
  wisdomContentItem: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  wisdomMore: {
    fontSize: 12,
    color: Colors.mind,
    fontStyle: 'italic',
    marginTop: 4,
  },
  wisdomBenefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  wisdomBenefit: {
    fontSize: 12,
    color: Colors.spirit,
    backgroundColor: Colors.spirit + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  startWisdomButton: {
    backgroundColor: Colors.spirit,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  startWisdomButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default MindScreen;
