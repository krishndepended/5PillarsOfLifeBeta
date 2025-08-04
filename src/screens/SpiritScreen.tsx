// src/screens/SpiritScreen.tsx - COMPREHENSIVE SPIRITUAL WELLNESS & CONSCIOUSNESS
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
  TextInput,
  Modal,
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
  spirit: '#8B5CF6',
  spiritLight: '#F3E8FF',
  sacred: '#7C3AED',
  divine: '#A855F7',
};

interface MeditationSession {
  id: string;
  name: string;
  sanskrit?: string;
  type: 'mindfulness' | 'mantra' | 'visualization' | 'breathwork' | 'chakra';
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  instructions: string[];
  benefits: string[];
  chakra?: string;
  mantra?: string;
}

interface PranayamaExercise {
  id: string;
  name: string;
  sanskrit: string;
  technique: 'ujjayi' | 'kapalabhati' | 'anulom-vilom' | 'bhramari' | 'bhastrika';
  duration: number;
  description: string;
  steps: string[];
  benefits: string[];
  cautions?: string[];
}

interface SpiritualJournalEntry {
  id: string;
  date: string;
  type: 'reflection' | 'gratitude' | 'intention' | 'insight';
  title: string;
  content: string;
  mood: 'peaceful' | 'centered' | 'confused' | 'inspired' | 'searching';
  practices: string[];
}

interface VedicWisdom {
  id: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  meaning: string;
  source: string;
  context: string;
  reflection: string;
}

const SpiritScreen = () => {
  const navigation = useNavigation();
  const { actions } = useAppData();
  const { userProfile, pillarScores, sessions } = useAppDataSelectors();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const omAnim = useRef(new Animated.Value(1)).current;
  const chakraAnim = useRef(new Animated.Value(0)).current;
  
  // State
  const [selectedTab, setSelectedTab] = useState<'meditation' | 'pranayama' | 'journal' | 'wisdom'>('meditation');
  const [activeMeditation, setActiveMeditation] = useState<MeditationSession | null>(null);
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [isMediating, setIsMediating] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [currentJournalEntry, setCurrentJournalEntry] = useState<Partial<SpiritualJournalEntry>>({});
  const [activePranayama, setActivePranayama] = useState<PranayamaExercise | null>(null);
  const [pranayamaTimer, setPranayamaTimer] = useState(0);
  const [isPracticingPranayama, setIsPracticingPranayama] = useState(false);

  // Mock spiritual metrics
  const [spiritualMetrics] = useState({
    consciousnessLevel: 73,
    meditationStreak: 18,
    totalMeditationTime: 245, // minutes
    chakraBalance: 78,
    spiritualSessions: sessions.filter(s => s.pillar === 'spirit').length,
    innerPeace: 85,
    spiritualGrowth: 91,
  });

  // Journal entries
  const [journalEntries, setJournalEntries] = useState<SpiritualJournalEntry[]>([
    {
      id: 'journal-1',
      date: new Date().toISOString(),
      type: 'reflection',
      title: 'Morning Meditation Insights',
      content: 'During today\'s practice, I experienced a deeper sense of connection with my inner self. The mantra resonated strongly.',
      mood: 'peaceful',
      practices: ['Mantra Meditation', 'Pranayama']
    }
  ]);

  // Meditation sessions library
  const meditationSessions: MeditationSession[] = [
    {
      id: 'om-meditation',
      name: 'Om Meditation',
      sanskrit: 'ॐ ध्यान',
      type: 'mantra',
      duration: 15,
      difficulty: 'beginner',
      description: 'Sacred sound meditation using the primordial Om mantra for spiritual awakening',
      instructions: [
        'Sit comfortably with spine straight and eyes closed',
        'Take three deep breaths to center yourself',
        'Begin chanting "Om" slowly and deeply',
        'Feel the vibration in your chest and head',
        'Continue for the entire duration',
        'End with three minutes of silent contemplation'
      ],
      benefits: ['Spiritual awakening', 'Mind clarity', 'Divine connection'],
      mantra: 'ॐ (Om)'
    },
    {
      id: 'chakra-meditation',
      name: 'Seven Chakra Meditation',
      sanskrit: 'सप्त चक्र ध्यान',
      type: 'chakra',
      duration: 21,
      difficulty: 'intermediate',
      description: 'Complete chakra balancing meditation for energy alignment and spiritual harmony',
      instructions: [
        'Lie down comfortably or sit in meditation pose',
        'Visualize red light at the base of your spine (Muladhara)',
        'Move up to orange light at lower abdomen (Svadhisthana)',
        'Continue through all seven chakras with their colors',
        'Spend 3 minutes on each chakra',
        'End with golden light filling your entire being'
      ],
      benefits: ['Energy balance', 'Chakra alignment', 'Spiritual harmony'],
      chakra: 'All Seven Chakras'
    },
    {
      id: 'trataka-meditation',
      name: 'Trataka - Candle Gazing',
      sanskrit: 'त्राटक ध्यान',
      type: 'visualization',
      duration: 12,
      difficulty: 'intermediate',
      description: 'Ancient concentration practice using candle flame for developing focus and inner vision',
      instructions: [
        'Sit 3 feet away from a lit candle in a dark room',
        'Gaze steadily at the flame without blinking',
        'When eyes water, close them and visualize the flame',
        'Hold the inner image as long as possible',
        'Open eyes and repeat the gazing',
        'Practice builds concentration and psychic abilities'
      ],
      benefits: ['Enhanced concentration', 'Psychic development', 'Third eye activation'],
      chakra: 'Ajna (Third Eye)'
    },
    {
      id: 'loving-kindness',
      name: 'Metta - Loving Kindness',
      sanskrit: 'मैत्री ध्यान',
      type: 'mindfulness',
      duration: 18,
      difficulty: 'beginner',
      description: 'Compassion meditation to cultivate universal love and kindness for all beings',
      instructions: [
        'Sit comfortably and center your breathing',
        'Begin with yourself: "May I be happy, may I be peaceful"',
        'Extend to loved ones: "May you be happy, may you be peaceful"',
        'Include neutral people in your life',
        'Embrace difficult relationships with forgiveness',
        'Expand to all beings in the universe'
      ],
      benefits: ['Compassion cultivation', 'Emotional healing', 'Universal love'],
      chakra: 'Anahata (Heart)'
    },
    {
      id: 'silent-meditation',
      name: 'Vipassana - Silent Awareness',
      sanskrit: 'विपश्यना ध्यान',
      type: 'mindfulness',
      duration: 25,
      difficulty: 'advanced',
      description: 'Deep insight meditation for developing pure awareness and wisdom',
      instructions: [
        'Sit in stable meditation posture',
        'Observe breath without controlling it',
        'Notice thoughts, feelings, sensations without attachment',
        'Return to breath awareness when mind wanders',
        'Cultivate equanimity toward all experiences',
        'Rest in pure awareness itself'
      ],
      benefits: ['Deep insight', 'Wisdom development', 'Liberation from suffering'],
      chakra: 'Sahasrara (Crown)'
    }
  ];

  // Pranayama exercises
  const pranayamaExercises: PranayamaExercise[] = [
    {
      id: 'ujjayi',
      name: 'Ujjayi Pranayama',
      sanskrit: 'उज्जायी प्राणायाम',
      technique: 'ujjayi',
      duration: 10,
      description: 'Ocean breath - calming breathwork that sounds like ocean waves',
      steps: [
        'Sit comfortably with spine erect',
        'Breathe through nose only',
        'Slightly constrict throat to create soft sound',
        'Inhale slowly making gentle "ocean" sound',
        'Exhale slowly with same sound',
        'Continue rhythmically for duration'
      ],
      benefits: ['Calms nervous system', 'Reduces stress', 'Enhances concentration'],
      cautions: ['Avoid if you have low blood pressure']
    },
    {
      id: 'kapalabhati',
      name: 'Kapalabhati Pranayama',
      sanskrit: 'कपालभाति प्राणायाम',
      technique: 'kapalabhati',
      duration: 8,
      description: 'Skull shining breath - energizing practice that purifies the mind',
      steps: [
        'Sit in comfortable meditative pose',
        'Take a deep breath in',
        'Forcefully exhale through nose by contracting abdomen',
        'Allow natural passive inhalation',
        'Repeat 20-30 rapid exhalations per round',
        'Practice 3 rounds with rest between'
      ],
      benefits: ['Energizes mind', 'Purifies nadis', 'Enhances focus'],
      cautions: ['Avoid during pregnancy', 'Stop if feeling dizzy']
    },
    {
      id: 'anulom-vilom',
      name: 'Anulom Vilom',
      sanskrit: 'अनुलोम विलोम',
      technique: 'anulom-vilom',
      duration: 12,
      description: 'Alternate nostril breathing for balancing the nervous system',
      steps: [
        'Use right thumb to close right nostril',
        'Inhale through left nostril for 4 counts',
        'Close left with ring finger, release right',
        'Exhale through right nostril for 4 counts',
        'Inhale right, switch, exhale left',
        'Continue alternating for duration'
      ],
      benefits: ['Balances nervous system', 'Harmonizes brain hemispheres', 'Reduces anxiety'],
      cautions: ['Practice gently', 'Don\'t press nostrils too hard']
    },
    {
      id: 'bhramari',
      name: 'Bhramari Pranayama',
      sanskrit: 'भ्रामरी प्राणायाम',
      technique: 'bhramari',
      duration: 6,
      description: 'Humming bee breath - creates internal vibrations for peace',
      steps: [
        'Sit comfortably and close your eyes',
        'Place thumbs in ears, fingers over closed eyes',
        'Inhale slowly through nose',
        'While exhaling, make humming "Om" sound',
        'Focus on the vibration in your head',
        'Repeat 5-10 times'
      ],
      benefits: ['Calms mind', 'Reduces stress', 'Enhances meditation'],
      cautions: ['Avoid if you have ear infections']
    }
  ];

  // Daily Vedic wisdom
  const dailyWisdom: VedicWisdom[] = [
    {
      id: 'wisdom-1',
      sanskrit: 'तत् त्वम् असि',
      transliteration: 'Tat tvam asi',
      translation: 'That thou art',
      meaning: 'You are That (Divine consciousness)',
      source: 'Chandogya Upanishad',
      context: 'One of the four great Mahavakyas (great statements) revealing the ultimate truth',
      reflection: 'This profound teaching reminds us of our true divine nature, beyond all temporary identifications'
    },
    {
      id: 'wisdom-2',
      sanskrit: 'सर्वं खल्विदं ब्रह्म',
      transliteration: 'Sarvam khalvidam brahma',
      translation: 'All this is indeed Brahman',
      meaning: 'Everything in existence is Divine consciousness',
      source: 'Chandogya Upanishad',
      context: 'Teaching about the unity of all existence in Divine consciousness',
      reflection: 'When we see divinity in everything, our perspective transforms completely'
    },
    {
      id: 'wisdom-3',
      sanskrit: 'अहं ब्रह्मास्मि',
      transliteration: 'Aham brahmasmi',
      translation: 'I am Brahman',
      meaning: 'I am the Divine consciousness',
      source: 'Brihadaranyaka Upanishad',
      context: 'Recognition of one\'s true nature as infinite consciousness',
      reflection: 'This realization dissolves the ego and reveals our unlimited essential nature'
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

    // Om symbol breathing animation
    const omBreathing = Animated.loop(
      Animated.sequence([
        Animated.timing(omAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(omAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    omBreathing.start();

    // Chakra rotation animation
    const chakraRotation = Animated.loop(
      Animated.timing(chakraAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    chakraRotation.start();

    return () => {
      omBreathing.stop();
      chakraRotation.stop();
    };
  }, []);

  // Meditation timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isMediating && meditationTimer > 0) {
      interval = setInterval(() => {
        setMeditationTimer(timer => {
          if (timer <= 1) {
            handleMeditationComplete();
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMediating, meditationTimer]);

  // Pranayama timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPracticingPranayama && pranayamaTimer > 0) {
      interval = setInterval(() => {
        setPranayamaTimer(timer => {
          if (timer <= 1) {
            handlePranayamaComplete();
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPracticingPranayama, pranayamaTimer]);

  // Handlers
  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home' as never);
    }
  }, [navigation]);

  const startMeditation = useCallback(async (session: MeditationSession) => {
    setActiveMeditation(session);
    setMeditationTimer(session.duration * 60); // Convert to seconds
    setIsMediating(true);
    
    // Add session start
    await actions.addSession({
      pillar: 'spirit',
      type: 'practice',
      duration: 0, // Will update on completion
      date: new Date().toISOString(),
      score: 0, // Will update on completion
      mood: 'good',
      notes: `Started ${session.name} meditation`
    });

    Alert.alert(
      '🕉️ Meditation Beginning',
      `${session.name} practice is starting. Find a quiet space and prepare your heart.`,
      [{ text: 'Begin 🧘‍♂️', style: 'default' }]
    );
  }, [actions]);

  const handleMeditationComplete = useCallback(async () => {
    if (!activeMeditation) return;

    setIsMediating(false);
    const session = activeMeditation;
    setActiveMeditation(null);
    setMeditationTimer(0);

    // Add completion session
    await actions.addSession({
      pillar: 'spirit',
      type: 'practice',
      duration: session.duration,
      date: new Date().toISOString(),
      score: 85 + Math.floor(Math.random() * 15),
      mood: 'excellent',
      notes: `Completed ${session.name} meditation`
    });

    // Check for achievements
    const spiritSessionsCount = sessions.filter(s => s.pillar === 'spirit').length + 1;
    if (spiritSessionsCount === 1) {
      await actions.addAchievement({
        title: '🕉️ Spiritual Journey Begins',
        description: 'Completed your first spiritual practice',
        pillar: 'spirit',
        rarity: 'common'
      });
    }

    if (session.duration >= 20) {
      await actions.addAchievement({
        title: '🧘‍♂️ Deep Meditation Master',
        description: 'Completed a 20+ minute meditation session',
        pillar: 'spirit',
        rarity: 'rare'
      });
    }

    if (session.type === 'mantra') {
      await actions.addAchievement({
        title: '📿 Mantra Practitioner',
        description: 'Mastered the sacred art of mantra meditation',
        pillar: 'spirit',
        rarity: 'rare'
      });
    }

    Alert.alert(
      '✨ Meditation Complete',
      `Namaste! You have completed ${session.name}. Your consciousness has expanded and your spirit is nourished.`,
      [{ text: 'Om Shanti 🙏', style: 'default' }]
    );
  }, [activeMeditation, actions, sessions]);

  const stopMeditation = useCallback(() => {
    Alert.alert(
      'End Meditation?',
      'Are you sure you want to end your current meditation practice?',
      [
        { text: 'Continue', style: 'cancel' },
        {
          text: 'End',
          style: 'destructive',
          onPress: () => {
            setIsMediating(false);
            setActiveMeditation(null);
            setMeditationTimer(0);
          }
        }
      ]
    );
  }, []);

  const startPranayama = useCallback(async (exercise: PranayamaExercise) => {
    setActivePranayama(exercise);
    setPranayamaTimer(exercise.duration * 60);
    setIsPracticingPranayama(true);
    
    Alert.alert(
      '🌬️ Pranayama Practice',
      `${exercise.name} is beginning. Prepare to work with your life force energy.`,
      [{ text: 'Begin Breathing', style: 'default' }]
    );
  }, []);

  const handlePranayamaComplete = useCallback(async () => {
    if (!activePranayama) return;

    setIsPracticingPranayama(false);
    const exercise = activePranayama;
    setActivePranayama(null);
    setPranayamaTimer(0);

    await actions.addSession({
      pillar: 'spirit',
      type: 'practice',
      duration: exercise.duration,
      date: new Date().toISOString(),
      score: 80 + Math.floor(Math.random() * 20),
      mood: 'excellent',
      notes: `Completed ${exercise.name} pranayama`
    });

    Alert.alert(
      '🌬️ Pranayama Complete',
      `Excellent! ${exercise.name} practice is complete. Your prana is balanced and flowing harmoniously.`,
      [{ text: 'Pranayam 🙏', style: 'default' }]
    );
  }, [activePranayama, actions]);

  const openJournalModal = useCallback(() => {
    setCurrentJournalEntry({
      id: `journal-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'reflection',
      practices: []
    });
    setShowJournalModal(true);
  }, []);

  const saveJournalEntry = useCallback(async () => {
    if (!currentJournalEntry.title || !currentJournalEntry.content) {
      Alert.alert('Complete Entry', 'Please add both a title and content for your spiritual reflection.');
      return;
    }

    const newEntry: SpiritualJournalEntry = {
      id: currentJournalEntry.id || `journal-${Date.now()}`,
      date: currentJournalEntry.date || new Date().toISOString(),
      type: currentJournalEntry.type || 'reflection',
      title: currentJournalEntry.title,
      content: currentJournalEntry.content,
      mood: currentJournalEntry.mood || 'peaceful',
      practices: currentJournalEntry.practices || []
    };

    setJournalEntries(prev => [newEntry, ...prev.slice(0, 19)]); // Keep last 20 entries

    // Add session
    await actions.addSession({
      pillar: 'spirit',
      type: 'practice',
      duration: 5,
      date: new Date().toISOString(),
      score: 75 + Math.floor(Math.random() * 25),
      mood: 'good',
      notes: `Spiritual journaling: ${newEntry.title}`
    });

    setShowJournalModal(false);
    setCurrentJournalEntry({});
    
    Alert.alert(
      '📔 Journal Saved',
      'Your spiritual reflection has been recorded. May your insights guide your journey.',
      [{ text: 'Blessed be 🙏', style: 'default' }]
    );
  }, [currentJournalEntry, actions]);

  // Render functions
  const renderHeader = () => (
    <LinearGradient
      colors={[Colors.spirit, Colors.sacred]}
      style={styles.header}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Spirit Pillar</Text>
        <Text style={styles.headerSubtitle}>Spiritual Wellness • आध्यात्मिक कल्याण</Text>
      </View>

      <Animated.View style={[styles.headerOm, { transform: [{ scale: omAnim }] }]}>
        <Text style={styles.omSymbol}>🕉️</Text>
      </Animated.View>
    </LinearGradient>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {[
        { key: 'meditation', label: 'Meditation', icon: 'leaf' },
        { key: 'pranayama', label: 'Pranayama', icon: 'cloud' },
        { key: 'journal', label: 'Journal', icon: 'journal' },
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
            color={selectedTab === tab.key ? Colors.spirit : Colors.textSecondary} 
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

  const renderActivePractice = () => {
    const isActive = isMediating || isPracticingPranayama;
    const activeSession = activeMeditation || activePranayama;
    const timer = isMediating ? meditationTimer : pranayamaTimer;
    const stopHandler = isMediating ? stopMeditation : () => setIsPracticingPranayama(false);
    
    if (!isActive || !activeSession) return null;

    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    return (
      <View style={styles.activePracticeContainer}>
        <LinearGradient
          colors={[Colors.spirit, Colors.sacred]}
          style={styles.activePracticeCard}
        >
          <View style={styles.activePracticeHeader}>
            <Text style={styles.activePracticeTitle}>{activeSession.name}</Text>
            {'sanskrit' in activeSession && activeSession.sanskrit && (
              <Text style={styles.activePracticeSanskrit}>{activeSession.sanskrit}</Text>
            )}
            <TouchableOpacity style={styles.stopButton} onPress={stopHandler}>
              <Ionicons name="stop" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </Text>
          </View>

          <Text style={styles.practiceInstructions}>
            {isMediating ? 'Focus on your breath and let thoughts pass like clouds' : 
             'Follow the breathing rhythm and feel your prana flowing'}
          </Text>

          <View style={styles.practiceIndicators}>
            <View style={styles.breathingIndicator}>
              <Text style={styles.breathingText}>
                {isMediating ? '🧘‍♂️ Meditating' : '🌬️ Breathing'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderSpiritualMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>Spiritual Metrics</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Ionicons name="trending-up" size={24} color={Colors.spirit} />
          <Text style={styles.metricValue}>{spiritualMetrics.consciousnessLevel}</Text>
          <Text style={styles.metricLabel}>Consciousness</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="flame" size={24} color={Colors.warning} />
          <Text style={styles.metricValue}>{spiritualMetrics.meditationStreak}</Text>
          <Text style={styles.metricLabel}>Day Streak</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="time" size={24} color={Colors.success} />
          <Text style={styles.metricValue}>{spiritualMetrics.totalMeditationTime}m</Text>
          <Text style={styles.metricLabel}>Total Time</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="radio-button-on" size={24} color={Colors.sacred} />
          <Text style={styles.metricValue}>{spiritualMetrics.chakraBalance}</Text>
          <Text style={styles.metricLabel}>Chakra Balance</Text>
        </View>
      </View>
    </View>
  );

  const renderMeditationLibrary = () => (
    <View style={styles.meditationContainer}>
      <Text style={styles.sectionTitle}>Meditation Library</Text>
      <Text style={styles.sectionSubtitle}>ध्यान • Sacred practices for consciousness expansion</Text>
      
      {meditationSessions.map(session => (
        <TouchableOpacity
          key={session.id}
          style={styles.sessionCard}
          onPress={() => startMeditation(session)}
          disabled={isMediating || isPracticingPranayama}
        >
          <View style={styles.sessionHeader}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionName}>{session.name}</Text>
              {session.sanskrit && (
                <Text style={styles.sessionSanskrit}>{session.sanskrit}</Text>
              )}
              <Text style={styles.sessionDescription}>{session.description}</Text>
            </View>
            <View style={styles.sessionMeta}>
              <Text style={styles.sessionDuration}>{session.duration}min</Text>
              <Text style={styles.sessionDifficulty}>
                {session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}
              </Text>
              <View style={[styles.typeBadge, { backgroundColor: getTypeColor(session.type) }]}>
                <Text style={styles.typeText}>{session.type.toUpperCase()}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.sessionBenefits}>
            {session.benefits.slice(0, 3).map((benefit, index) => (
              <Text key={index} style={styles.benefitTag}>{benefit}</Text>
            ))}
          </View>

          {session.chakra && (
            <View style={styles.chakraInfo}>
              <Ionicons name="radio-button-on" size={16} color={Colors.sacred} />
              <Text style={styles.chakraText}>{session.chakra}</Text>
            </View>
          )}

          <View style={styles.sessionFooter}>
            <Text style={styles.instructionCount}>
              {session.instructions.length} steps
            </Text>
            <Ionicons name="play-circle" size={32} color={Colors.spirit} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPranayamaLibrary = () => (
    <View style={styles.pranayamaContainer}>
      <Text style={styles.sectionTitle}>Pranayama Library</Text>
      <Text style={styles.sectionSubtitle}>प्राणायाम • Sacred breathwork for life force cultivation</Text>
      
      {pranayamaExercises.map(exercise => (
        <TouchableOpacity
          key={exercise.id}
          style={styles.pranayamaCard}
          onPress={() => startPranayama(exercise)}
          disabled={isMediating || isPracticingPranayama}
        >
          <View style={styles.pranayamaHeader}>
            <View style={styles.pranayamaInfo}>
              <Text style={styles.pranayamaName}>{exercise.name}</Text>
              <Text style={styles.pranayamaSanskrit}>{exercise.sanskrit}</Text>
              <Text style={styles.pranayamaDescription}>{exercise.description}</Text>
            </View>
            <View style={styles.pranayamaMeta}>
              <Text style={styles.pranayamaDuration}>{exercise.duration}min</Text>
              <Ionicons name="cloud" size={24} color={Colors.accent} />
            </View>
          </View>
          
          <View style={styles.pranayamaSteps}>
            <Text style={styles.stepsTitle}>Technique:</Text>
            {exercise.steps.slice(0, 3).map((step, index) => (
              <Text key={index} style={styles.stepItem}>
                {index + 1}. {step}
              </Text>
            ))}
            {exercise.steps.length > 3 && (
              <Text style={styles.moreSteps}>+{exercise.steps.length - 3} more steps</Text>
            )}
          </View>

          <View style={styles.pranayamaBenefits}>
            {exercise.benefits.map((benefit, index) => (
              <Text key={index} style={styles.pranayamaBenefit}>{benefit}</Text>
            ))}
          </View>

          {exercise.cautions && exercise.cautions.length > 0 && (
            <View style={styles.cautionInfo}>
              <Ionicons name="warning" size={14} color={Colors.warning} />
              <Text style={styles.cautionText}>{exercise.cautions[0]}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSpiritualJournal = () => (
    <View style={styles.journalContainer}>
      <View style={styles.journalHeader}>
        <Text style={styles.sectionTitle}>Spiritual Journal</Text>
        <TouchableOpacity style={styles.addJournalButton} onPress={openJournalModal}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addJournalText}>New Entry</Text>
        </TouchableOpacity>
      </View>

      {journalEntries.length === 0 ? (
        <View style={styles.emptyJournal}>
          <Ionicons name="journal" size={48} color={Colors.textSecondary} />
          <Text style={styles.emptyJournalText}>Begin your spiritual journey</Text>
          <Text style={styles.emptyJournalSubtext}>Document your insights, revelations, and spiritual growth</Text>
        </View>
      ) : (
        journalEntries.slice(0, 5).map(entry => (
          <View key={entry.id} style={styles.journalEntryCard}>
            <View style={styles.entryHeader}>
              <View style={styles.entryInfo}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entryDate}>
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={[styles.typeBadge, { backgroundColor: getJournalTypeColor(entry.type) }]}>
                <Text style={styles.typeText}>{entry.type.toUpperCase()}</Text>
              </View>
            </View>
            
            <Text style={styles.entryContent} numberOfLines={3}>
              {entry.content}
            </Text>
            
            <View style={styles.entryMeta}>
              <Text style={styles.entryMood}>
                Mood: {entry.mood === 'peaceful' ? '☮️ Peaceful' :
                      entry.mood === 'centered' ? '🎯 Centered' :
                      entry.mood === 'confused' ? '❓ Confused' :
                      entry.mood === 'inspired' ? '✨ Inspired' : '🔍 Searching'}
              </Text>
              {entry.practices.length > 0 && (
                <Text style={styles.entryPractices}>
                  Practices: {entry.practices.join(', ')}
                </Text>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderVedicWisdom = () => (
    <View style={styles.wisdomContainer}>
      <Text style={styles.sectionTitle}>Vedic Wisdom</Text>
      <Text style={styles.sectionSubtitle}>महावाक्य • Great teachings from ancient scriptures</Text>
      
      {dailyWisdom.map(wisdom => (
        <View key={wisdom.id} style={styles.wisdomCard}>
          <View style={styles.wisdomHeader}>
            <Text style={styles.wisdomSanskrit}>{wisdom.sanskrit}</Text>
            <Text style={styles.wisdomTransliteration}>{wisdom.transliteration}</Text>
          </View>
          
          <View style={styles.wisdomTranslation}>
            <Text style={styles.translationText}>"{wisdom.translation}"</Text>
            <Text style={styles.meaningText}>{wisdom.meaning}</Text>
          </View>
          
          <View style={styles.wisdomSource}>
            <Text style={styles.sourceText}>— {wisdom.source}</Text>
            <Text style={styles.contextText}>{wisdom.context}</Text>
          </View>
          
          <View style={styles.wisdomReflection}>
            <Text style={styles.reflectionTitle}>Reflection:</Text>
            <Text style={styles.reflectionText}>{wisdom.reflection}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.contemplateButton}
            onPress={async () => {
              await actions.addSession({
                pillar: 'spirit',
                type: 'practice',
                duration: 10,
                date: new Date().toISOString(),
                score: 85 + Math.floor(Math.random() * 15),
                mood: 'excellent',
                notes: `Contemplated Vedic wisdom: ${wisdom.transliteration}`
              });

              Alert.alert(
                '📿 Wisdom Contemplated',
                'You have meditated on this sacred teaching. May its truth illuminate your path.',
                [{ text: 'Hari Om 🙏', style: 'default' }]
              );
            }}
          >
            <Text style={styles.contemplateButtonText}>Contemplate</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'meditation':
        return (
          <>
            {renderSpiritualMetrics()}
            {renderMeditationLibrary()}
          </>
        );
      case 'pranayama':
        return renderPranayamaLibrary();
      case 'journal':
        return renderSpiritualJournal();
      case 'wisdom':
        return renderVedicWisdom();
      default:
        return renderMeditationLibrary();
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mantra': return Colors.warning + '20';
      case 'chakra': return Colors.sacred + '20';
      case 'visualization': return Colors.accent + '20';
      case 'mindfulness': return Colors.success + '20';
      case 'breathwork': return Colors.spirit + '20';
      default: return Colors.textSecondary + '20';
    }
  };

  const getJournalTypeColor = (type: string) => {
    switch (type) {
      case 'reflection': return Colors.spirit + '20';
      case 'gratitude': return Colors.warning + '20';
      case 'intention': return Colors.accent + '20';
      case 'insight': return Colors.sacred + '20';
      default: return Colors.textSecondary + '20';
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {renderHeader()}
          {renderActivePractice()}
          {renderTabBar()}
          <ScrollView 
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
          >
            {renderTabContent()}
          </ScrollView>
        </Animated.View>

        {/* Spiritual Journal Modal */}
        <Modal
          visible={showJournalModal}
          animationType="slide"
          onRequestClose={() => setShowJournalModal(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowJournalModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Spiritual Reflection</Text>
              <TouchableOpacity onPress={saveJournalEntry}>
                <Text style={styles.modalSave}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Entry Type */}
              <Text style={styles.modalSectionTitle}>Entry Type</Text>
              <View style={styles.typeOptions}>
                {(['reflection', 'gratitude', 'intention', 'insight'] as const).map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      currentJournalEntry.type === type && styles.typeOptionSelected
                    ]}
                    onPress={() => setCurrentJournalEntry(prev => ({ ...prev, type }))}
                  >
                    <Text style={styles.typeLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Title */}
              <Text style={styles.modalSectionTitle}>Title</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="What wisdom emerged today?"
                value={currentJournalEntry.title}
                onChangeText={(title) => setCurrentJournalEntry(prev => ({ ...prev, title }))}
              />

              {/* Content */}
              <Text style={styles.modalSectionTitle}>Reflection</Text>
              <TextInput
                style={styles.contentInput}
                placeholder="Share your spiritual insights, experiences, or questions..."
                multiline
                numberOfLines={6}
                value={currentJournalEntry.content}
                onChangeText={(content) => setCurrentJournalEntry(prev => ({ ...prev, content }))}
              />

              {/* Mood */}
              <Text style={styles.modalSectionTitle}>Current State</Text>
              <View style={styles.moodOptions}>
                {(['peaceful', 'centered', 'confused', 'inspired', 'searching'] as const).map(mood => (
                  <TouchableOpacity
                    key={mood}
                    style={[
                      styles.moodOption,
                      currentJournalEntry.mood === mood && styles.moodOptionSelected
                    ]}
                    onPress={() => setCurrentJournalEntry(prev => ({ ...prev, mood }))}
                  >
                    <Text style={styles.moodEmoji}>
                      {mood === 'peaceful' ? '☮️' :
                       mood === 'centered' ? '🎯' :
                       mood === 'confused' ? '❓' :
                       mood === 'inspired' ? '✨' : '🔍'}
                    </Text>
                    <Text style={styles.moodLabel}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Practices */}
              <Text style={styles.modalSectionTitle}>Practices (Optional)</Text>
              <TextInput
                style={styles.practicesInput}
                placeholder="Which spiritual practices did you engage in? (comma separated)"
                value={(currentJournalEntry.practices || []).join(', ')}
                onChangeText={(text) => setCurrentJournalEntry(prev => ({ 
                  ...prev, 
                  practices: text.split(',').map(item => item.trim()).filter(Boolean)
                }))}
              />
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

// Comprehensive styles for SpiritScreen
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
  headerOm: {
    padding: 8,
  },
  omSymbol: {
    fontSize: 32,
  },

  // Active Practice
  activePracticeContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  activePracticeCard: {
    borderRadius: 16,
    padding: 20,
  },
  activePracticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activePracticeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  activePracticeSanskrit: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
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
  practiceInstructions: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  practiceIndicators: {
    alignItems: 'center',
  },
  breathingIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  breathingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  tabActive: {
    backgroundColor: Colors.spiritLight,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: Colors.spirit,
  },

  // Scroll Content
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },

  // Common Sections
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

  // Spiritual Metrics
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
    textAlign: 'center',
  },

  // Meditation Library
  meditationContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sessionCard: {
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
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
    marginRight: 16,
  },
  sessionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  sessionSanskrit: {
    fontSize: 14,
    color: Colors.spirit,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  sessionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sessionMeta: {
    alignItems: 'flex-end',
  },
  sessionDuration: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.spirit,
  },
  sessionDifficulty: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
  },
  sessionBenefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  benefitTag: {
    fontSize: 12,
    color: Colors.spirit,
    backgroundColor: Colors.spiritLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chakraInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  chakraText: {
    fontSize: 12,
    color: Colors.sacred,
    fontWeight: '600',
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instructionCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  // Pranayama Library
  pranayamaContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  pranayamaCard: {
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
  pranayamaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pranayamaInfo: {
    flex: 1,
    marginRight: 16,
  },
  pranayamaName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  pranayamaSanskrit: {
    fontSize: 14,
    color: Colors.accent,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  pranayamaDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  pranayamaMeta: {
    alignItems: 'center',
    gap: 4,
  },
  pranayamaDuration: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  pranayamaSteps: {
    marginBottom: 16,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  stepItem: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  moreSteps: {
    fontSize: 12,
    color: Colors.accent,
    fontStyle: 'italic',
    marginTop: 4,
  },
  pranayamaBenefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  pranayamaBenefit: {
    fontSize: 12,
    color: Colors.accent,
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cautionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '20',
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  cautionText: {
    fontSize: 12,
    color: Colors.warning,
    flex: 1,
  },

  // Spiritual Journal
  journalContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addJournalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.spirit,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addJournalText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyJournal: {
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
  emptyJournalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyJournalSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  journalEntryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  entryInfo: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  entryDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  entryContent: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  entryMeta: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  entryMood: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  entryPractices: {
    fontSize: 12,
    color: Colors.spirit,
  },

  // Vedic Wisdom
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
    alignItems: 'center',
    marginBottom: 16,
  },
  wisdomSanskrit: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.sacred,
    textAlign: 'center',
    marginBottom: 8,
  },
  wisdomTransliteration: {
    fontSize: 16,
    color: Colors.spirit,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  wisdomTranslation: {
    alignItems: 'center',
    marginBottom: 16,
  },
  translationText: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  meaningText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  wisdomSource: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sourceText: {
    fontSize: 14,
    color: Colors.spirit,
    fontWeight: '600',
    marginBottom: 4,
  },
  contextText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  wisdomReflection: {
    backgroundColor: Colors.spiritLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  reflectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.spirit,
    marginBottom: 8,
  },
  reflectionText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  contemplateButton: {
    backgroundColor: Colors.sacred,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  contemplateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.spirit,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    marginTop: 20,
  },

  // Entry Type Options
  typeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.spiritLight,
    backgroundColor: Colors.surface,
  },
  typeOptionSelected: {
    borderColor: Colors.spirit,
    backgroundColor: Colors.spiritLight,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },

  // Text Inputs
  titleInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  contentInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    textAlignVertical: 'top',
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  practicesInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Mood Options
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
  },
  moodOptionSelected: {
    borderColor: Colors.spirit,
    backgroundColor: Colors.spiritLight,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
});

export default SpiritScreen;
