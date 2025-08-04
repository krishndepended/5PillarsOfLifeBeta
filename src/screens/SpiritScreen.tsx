// src/screens/SpiritScreen.tsx - COMPLETE ADVANCED CONSCIOUSNESS EXPANSION SYSTEM
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
  spirit: '#8B5CF6',
  warning: '#F59E0B',
  heart: '#EC4899',
};

interface SpiritualMetrics {
  consciousnessLevel: number;
  innerPeace: number;
  mindfulness: number;
  spiritualConnection: number;
  purposeClarity: number;
  transcendence: number;
}

interface MeditationSession {
  id: string;
  name: string;
  type: 'mindfulness' | 'transcendental' | 'loving-kindness' | 'chakra' | 'vipassana';
  duration: number;
  technique: string;
  guidedSteps: string[];
  spiritualBenefit: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'master';
}

interface SacredPractice {
  name: string;
  description: string;
  tradition: string;
  benefits: string[];
}

const SpiritScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const meditationAnim = React.useRef(new Animated.Value(0)).current;
  const { actions } = useAppData();
  const { pillarScores, userProfile } = useAppDataSelectors();
  const { measurePerformance } = usePerformanceOptimization();
  const notificationManager = NotificationManager.getInstance();

  const [spiritualMetrics, setSpiritualMetrics] = useState<SpiritualMetrics>({
    consciousnessLevel: 78,
    innerPeace: 85,
    mindfulness: 82,
    spiritualConnection: 75,
    purposeClarity: 80,
    transcendence: 72
  });

  const [activeMeditation, setActiveMeditation] = useState<MeditationSession | null>(null);
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);
  const [currentMeditationPhase, setCurrentMeditationPhase] = useState<'preparation' | 'focus' | 'stillness' | 'integration'>('preparation');
  const [dailyWisdom, setDailyWisdom] = useState<string>('');

  useEffect(() => {
    const measurement = measurePerformance('SpiritScreen');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      measurement.end();
    });

    startMeditationAnimation();
    initializeSpiritualOptimization();
  }, [fadeAnim]);

  const startMeditationAnimation = () => {
    const meditation = Animated.loop(
      Animated.sequence([
        Animated.timing(meditationAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(meditationAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    meditation.start();
  };

  const initializeSpiritualOptimization = async () => {
    try {
      generateMeditationSession();
      generateDailyWisdom();
      updateSpiritualMetrics();
      checkSpiritualAchievements();
    } catch (error) {
      console.error('Error initializing spiritual optimization:', error);
    }
  };

  const generateMeditationSession = () => {
    const currentScore = pillarScores.spirit;
    const userLevel = userProfile.level;
    
    const sessions: MeditationSession[] = [
      {
        id: 'mindfulness-awareness',
        name: 'Mindful Awareness Practice',
        type: 'mindfulness',
        duration: 15,
        technique: 'Present Moment Awareness',
        difficultyLevel: currentScore > 85 ? 'advanced' : 'intermediate',
        spiritualBenefit: 'Cultivates present-moment awareness and reduces mental chatter',
        guidedSteps: [
          'Find a comfortable seated position with spine erect',
          'Close your eyes gently and take three deep breaths',
          'Notice the sensation of breathing without controlling it',
          'When thoughts arise, gently return attention to breath',
          'Expand awareness to include sounds, sensations, emotions',
          'Rest in open awareness without attachment to experiences',
          'End with gratitude for this moment of presence'
        ]
      },
      {
        id: 'chakra-alignment',
        name: 'Chakra Energy Alignment',
        type: 'chakra',
        duration: 20,
        technique: 'Seven Chakra Activation',
        difficultyLevel: currentScore > 80 ? 'advanced' : 'intermediate',
        spiritualBenefit: 'Balances and aligns your energy centers for optimal spiritual flow',
        guidedSteps: [
          'Visualize red light at the base of your spine (Root Chakra)',
          'Orange light below your navel (Sacral Chakra)',
          'Yellow light at your solar plexus (Solar Plexus Chakra)',
          'Green light at your heart center (Heart Chakra)',
          'Blue light at your throat (Throat Chakra)',
          'Indigo light at your third eye (Third Eye Chakra)',
          'Violet light at the crown of your head (Crown Chakra)',
          'Feel all colors spinning in harmony throughout your being'
        ]
      },
      {
        id: 'transcendental-meditation',
        name: 'Transcendental Stillness',
        type: 'transcendental',
        duration: 25,
        technique: 'Beyond Thought Meditation',
        difficultyLevel: currentScore > 90 ? 'master' : 'advanced',
        spiritualBenefit: 'Transcends ordinary consciousness to access pure awareness',
        guidedSteps: [
          'Settle into deep relaxation with effortless breathing',
          'Allow thoughts to come and go without resistance',
          'Rest in the gap between thoughts',
          'Surrender to the natural settling of the mind',
          'Experience the field of pure consciousness',
          'Return gently to waking awareness when ready'
        ]
      }
    ];

    setActiveMeditation(sessions[Math.floor(Math.random() * sessions.length)]);
  };

  const generateDailyWisdom = () => {
    const wisdomQuotes = [
      "The present moment is the only time over which we have dominion. - Thich Nhat Hanh",
      "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it. - Rumi",
      "The cave you fear to enter holds the treasure you seek. - Joseph Campbell",
      "Meditation is not a way of making your mind quiet. It is a way of entering into the quiet that is already there. - Deepak Chopra",
      "The spiritual journey is individual, highly personal. It can't be organized or regulated. - Ram Dass",
      "Peace comes from within. Do not seek it without. - Buddha",
      "The mind is everything. What you think you become. - Buddha",
      "In the depth of winter, I finally learned that within me there lay an invincible summer. - Albert Camus"
    ];
    
    setDailyWisdom(wisdomQuotes[Math.floor(Math.random() * wisdomQuotes.length)]);
  };

  const updateSpiritualMetrics = () => {
    setSpiritualMetrics(prev => ({
      consciousnessLevel: Math.max(65, Math.min(100, prev.consciousnessLevel + (Math.random() - 0.2) * 4)),
      innerPeace: Math.max(70, Math.min(100, prev.innerPeace + (Math.random() - 0.1) * 3)),
      mindfulness: Math.max(70, Math.min(100, prev.mindfulness + (Math.random() - 0.2) * 5)),
      spiritualConnection: Math.max(60, Math.min(100, prev.spiritualConnection + (Math.random() - 0.3) * 6)),
      purposeClarity: Math.max(65, Math.min(100, prev.purposeClarity + (Math.random() - 0.2) * 4)),
      transcendence: Math.max(60, Math.min(95, prev.transcendence + (Math.random() - 0.1) * 3))
    }));
  };

  const checkSpiritualAchievements = async () => {
    const achievements = [];
    
    if (pillarScores.spirit >= 90) {
      achievements.push('Spiritual Mastery Achieved');
    }
    
    if (spiritualMetrics.consciousnessLevel >= 90) {
      achievements.push('Consciousness Expansion Expert');
    }
    
    if (spiritualMetrics.transcendence >= 85) {
      achievements.push('Transcendence Master');
    }

    for (const achievement of achievements) {
      await notificationManager.scheduleAchievementNotification(achievement, 'spirit');
    }
  };

  const startMeditationSession = () => {
    if (!activeMeditation) return;
    
    setIsMeditating(true);
    setMeditationTimer(0);
    setCurrentMeditationPhase('preparation');
    
    // Phase transitions
    const phaseInterval = setInterval(() => {
      setCurrentMeditationPhase(prev => {
        switch (prev) {
          case 'preparation': return 'focus';
          case 'focus': return 'stillness';
          case 'stillness': return 'integration';
          case 'integration': return 'stillness';
          default: return 'focus';
        }
      });
    }, (activeMeditation.duration * 60 * 1000) / 4); // Divide session into 4 phases

    const timer = setInterval(() => {
      setMeditationTimer(prev => prev + 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      clearInterval(phaseInterval);
      completeMeditationSession();
    }, activeMeditation.duration * 60 * 1000);

    Alert.alert(
      '🌟 Meditation Begins',
      `Starting ${activeMeditation.name}. Find your center and journey within.`,
      [{ text: 'Begin Journey', style: 'default' }]
    );
  };

  const completeMeditationSession = async () => {
    if (!activeMeditation) return;

    setIsMeditating(false);
    
    const improvement = Math.floor(Math.random() * 7) + 3;
    const newScore = Math.min(100, pillarScores.spirit + improvement);
    actions.updatePillarScore('spirit', newScore);

    actions.addSession({
      pillar: 'spirit',
      duration: Math.floor(meditationTimer / 60),
      improvement: improvement
    });

    await notificationManager.scheduleAchievementNotification(
      `Meditation Complete: +${improvement}% Spiritual Growth`,
      'spirit'
    );

    Alert.alert(
      '✨ Session Complete',
      `Sacred practice completed! Your spirit pillar expanded by ${improvement}%. Your consciousness continues to evolve.`,
      [{ text: 'Namaste', style: 'default' }]
    );
  };

  const renderSpiritualMetrics = () => (
    <PerformanceMonitor>
      <View style={styles.spiritualSection}>
        <Text style={styles.sectionTitle}>Consciousness Metrics</Text>
        
        <View style={styles.metricsGrid}>
          {[
            { label: 'Consciousness', value: spiritualMetrics.consciousnessLevel, icon: 'eye', color: Colors.spirit },
            { label: 'Inner Peace', value: spiritualMetrics.innerPeace, icon: 'flower', color: Colors.success },
            { label: 'Mindfulness', value: spiritualMetrics.mindfulness, icon: 'leaf', color: Colors.accent },
            { label: 'Transcendence', value: spiritualMetrics.transcendence, icon: 'flash', color: Colors.warning }
          ].map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: metric.color }]}>
                <Ionicons name={metric.icon as any} size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{metric.value}%</Text>
              <View style={styles.metricBar}>
                <Animated.View 
                  style={[
                    styles.metricBarFill, 
                    { 
                      width: `${metric.value}%`, 
                      backgroundColor: metric.color,
                      opacity: meditationAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.7, 1]
                      })
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </PerformanceMonitor>
  );

  const renderMeditationSession = () => (
    <PerformanceMonitor>
      <View style={styles.meditationSection}>
        <Text style={styles.sectionTitle}>Sacred Practice</Text>

        {activeMeditation && (
          <View style={styles.meditationCard}>
            <LinearGradient
              colors={[Colors.spirit, '#A855F7']}
              style={styles.meditationGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.meditationInfo}>
                <Text style={styles.meditationName}>{activeMeditation.name}</Text>
                <Text style={styles.meditationDetails}>
                  {activeMeditation.duration} min • {activeMeditation.technique}
                </Text>
                <Text style={styles.meditationBenefit}>
                  {activeMeditation.spiritualBenefit}
                </Text>
              </View>

              {isMeditating ? (
                <View style={styles.meditationGuide}>
                  <Animated.View 
                    style={[
                      styles.meditationOrb, 
                      { 
                        opacity: meditationAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 1]
                        }),
                        transform: [{ 
                          scale: meditationAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1.2]
                          })
                        }]
                      }
                    ]}
                  >
                    <Ionicons name="leaf" size={32} color="#FFFFFF" />
                  </Animated.View>
                  <Text style={styles.meditationPhase}>
                    {currentMeditationPhase.toUpperCase()}
                  </Text>
                  <Text style={styles.meditationTimerText}>
                    {Math.floor(meditationTimer / 60)}:{(meditationTimer % 60).toString().padStart(2, '0')}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.startMeditationButton}
                  onPress={startMeditationSession}
                >
                  <Ionicons name="leaf" size={24} color="#FFFFFF" />
                  <Text style={styles.startMeditationText}>Begin</Text>
                </TouchableOpacity>
              )}
            </LinearGradient>

            <View style={styles.stepsPreview}>
              <Text style={styles.stepsTitle}>Guided Journey:</Text>
              {activeMeditation.guidedSteps.slice(0, 3).map((step, index) => (
                <Text key={index} style={styles.stepText}>
                  {index + 1}. {step}
                </Text>
              ))}
              {activeMeditation.guidedSteps.length > 3 && (
                <Text style={styles.moreSteps}>
                  +{activeMeditation.guidedSteps.length - 3} more guided steps...
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </PerformanceMonitor>
  );

  const renderSpiritOptimizationScore = () => (
    <PerformanceMonitor>
      <View style={styles.scoreSection}>
        <LinearGradient
          colors={[Colors.spirit, '#A855F7']}
          style={styles.scoreGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.scoreHeader}>
            <Animated.View style={{ 
              opacity: meditationAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.7, 1]
              })
            }}>
              <Ionicons name="leaf" size={32} color="#FFFFFF" />
            </Animated.View>
            <Text style={styles.scoreTitle}>Spirit Expansion</Text>
          </View>
          <Text style={styles.scoreValue}>{pillarScores.spirit}%</Text>
          <Text style={styles.scoreSubtitle}>Consciousness Evolution Level</Text>
          
          <View style={styles.spiritualIndicator}>
            <Ionicons name="flash" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.spiritualText}>
              Transcendence Level: {spiritualMetrics.transcendence}% - Rising consciousness
            </Text>
          </View>

          <View style={styles.spiritualStats}>
            <View style={styles.spiritualStat}>
              <Text style={styles.spiritualStatValue}>{spiritualMetrics.purposeClarity}</Text>
              <Text style={styles.spiritualStatLabel}>Purpose</Text>
            </View>
            <View style={styles.spiritualStat}>
              <Text style={styles.spiritualStatValue}>{spiritualMetrics.spiritualConnection}</Text>
              <Text style={styles.spiritualStatLabel}>Connection</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </PerformanceMonitor>
  );

  const renderDailyWisdom = () => (
    <PerformanceMonitor>
      <View style={styles.wisdomSection}>
        <Text style={styles.sectionTitle}>Daily Spiritual Wisdom</Text>
        <View style={styles.wisdomCard}>
          <View style={styles.wisdomIcon}>
            <Ionicons name="book" size={24} color={Colors.spirit} />
          </View>
          <Text style={styles.wisdomText}>{dailyWisdom}</Text>
          <TouchableOpacity 
            style={styles.reflectButton}
            onPress={() => Alert.alert('🧘‍♂️ Reflection', 'Take a moment to contemplate this wisdom and how it applies to your spiritual journey.')}
          >
            <Text style={styles.reflectButtonText}>Reflect & Contemplate</Text>
          </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Spirit Expansion</Text>
          <Text style={styles.headerSubtitle}>Consciousness & Spiritual Growth</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings" size={20} color={Colors.spirit} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderSpiritOptimizationScore()}
        {renderSpiritualMetrics()}
        {renderMeditationSession()}
        {renderDailyWisdom()}
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
  spiritualIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  spiritualText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  spiritualStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  spiritualStat: {
    alignItems: 'center',
  },
  spiritualStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  spiritualStatLabel: {
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
  spiritualSection: {
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
  meditationSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  meditationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  meditationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  meditationInfo: {
    flex: 1,
  },
  meditationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  meditationDetails: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  meditationBenefit: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    lineHeight: 14,
  },
  startMeditationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startMeditationText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '600',
  },
  meditationGuide: {
    alignItems: 'center',
  },
  meditationOrb: {
    marginBottom: 8,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  meditationPhase: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  meditationTimerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepsPreview: {
    padding: 16,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  stepText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
    lineHeight: 16,
  },
  moreSteps: {
    fontSize: 11,
    color: Colors.spirit,
    fontStyle: 'italic',
    marginTop: 4,
  },
  wisdomSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  wisdomCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  wisdomIcon: {
    marginBottom: 16,
  },
  wisdomText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  reflectButton: {
    backgroundColor: Colors.spirit,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  reflectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default React.memo(SpiritScreen);
