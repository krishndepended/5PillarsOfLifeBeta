// src/screens/OnboardingScreen.tsx - COMPLETE ONBOARDING SYSTEM
import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Platform, 
  Animated, 
  Dimensions,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDataSelectors, useAppData } from '../context/AppDataContext';
import { usePerformanceOptimization, PerformanceMonitor } from '../hooks/usePerformanceOptimization';
import { safeNavigate, safeGet } from '../utils/SafeNavigation';

const { width, height } = Dimensions.get('window');

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
};

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  culturalWisdom?: string;
  sanskritTerm?: string;
}

interface UserGoals {
  primaryFocus: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment: number; // minutes per day
  weeklyGoal: number; // sessions per week
  culturalInterest: boolean;
  ayurvedicFocus: boolean;
}

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { actions } = useAppData();
  const { userProfile, isInitialized } = useAppDataSelectors();
  const { measurePerformance } = usePerformanceOptimization();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Onboarding state
  const [currentStep, setCurrentStep] = useState(0);
  const [userGoals, setUserGoals] = useState<UserGoals>({
    primaryFocus: [],
    experienceLevel: 'beginner',
    timeCommitment: 15,
    weeklyGoal: 14,
    culturalInterest: true,
    ayurvedicFocus: false
  });

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to 5PillarsOfLife',
      subtitle: 'Neural Optimization Platform',
      description: 'Discover the ancient wisdom of holistic wellness through modern AI-powered guidance. Your journey to complete life transformation begins now.',
      icon: 'sparkles',
      color: Colors.spirit,
      culturalWisdom: 'पञ्च स्तम्भ जीवन - Five pillars supporting the temple of life',
      sanskritTerm: 'Pancha Stambha Jeevan'
    },
    {
      id: 'body',
      title: 'BODY - Your Physical Temple',
      subtitle: 'शरीरं खलु धर्म साधनम्',
      description: 'Your body is the vehicle for all achievements. Through mindful movement, proper rest, and energy optimization, we build unshakeable physical foundation.',
      icon: 'fitness',
      color: Colors.body,
      culturalWisdom: 'The body is indeed the means of dharma - ancient Vedic wisdom',
      sanskritTerm: 'Sharira Shuddhi'
    },
    {
      id: 'mind',
      title: 'MIND - Your Cognitive Power',
      subtitle: 'मन एव मनुष्याणां कारणं बन्ध मोक्षयोः',
      description: 'The mind is the cause of both bondage and liberation. Through cognitive training and neural optimization, unlock your infinite mental potential.',
      icon: 'library',
      color: Colors.mind,
      culturalWisdom: 'Mind is the cause of both bondage and liberation - Amrita Bindu Upanishad',
      sanskritTerm: 'Manas Shakti'
    },
    {
      id: 'heart',
      title: 'HEART - Your Emotional Intelligence',
      subtitle: 'हृदय में परमात्मा का वास',
      description: 'The supreme consciousness resides in the heart. Cultivate emotional wisdom, empathy, and loving-kindness to connect with your deepest self.',
      icon: 'heart',
      color: Colors.heart,
      culturalWisdom: 'The Supreme Self dwells in the heart - Chandogya Upanishad',
      sanskritTerm: 'Hridaya Gyan'
    },
    {
      id: 'spirit',
      title: 'SPIRIT - Your Consciousness',
      subtitle: 'आत्मा तत्त्वमसि',
      description: 'You are that eternal consciousness. Through meditation, self-inquiry, and spiritual practices, realize your true infinite nature.',
      icon: 'leaf',
      color: Colors.spirit,
      culturalWisdom: 'Thou art That - the great Upanishadic truth',
      sanskritTerm: 'Atma Gyan'
    },
    {
      id: 'diet',
      title: 'DIET - Your Nutritional Wisdom',
      subtitle: 'अन्नं ब्रह्म',
      description: 'Food is Brahman - the creative force. Through authentic Indian vegetarian cuisine and Ayurvedic principles, nourish body and soul.',
      icon: 'restaurant',
      color: Colors.diet,
      culturalWisdom: 'Food is divine energy - Taittiriya Upanishad',
      sanskritTerm: 'Ahara Vidya'
    },
    {
      id: 'goals',
      title: 'Set Your Intentions',
      subtitle: 'संकल्प शक्ति',
      description: 'The power of intention shapes reality. Let\'s personalize your journey based on your goals, experience, and cultural interests.',
      icon: 'target',
      color: Colors.accent,
      culturalWisdom: 'Intention is the seed of all achievement',
      sanskritTerm: 'Sankalpa'
    }
  ];

  useEffect(() => {
    const measurement = measurePerformance('OnboardingScreen');
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      })
    ]).start(() => {
      measurement.end();
    });

    // Update progress animation
    Animated.timing(progressAnim, {
      toValue: (currentStep + 1) / onboardingSteps.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      // Slide out animation
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        setCurrentStep(currentStep + 1);
        slideAnim.setValue(width);
        
        // Slide in animation
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
      });
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      // Slide out animation
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        setCurrentStep(currentStep - 1);
        slideAnim.setValue(-width);
        
        // Slide in animation
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
      });
    }
  };

  const handleSkip = () => {
    // Set basic defaults and complete onboarding
    setUserGoals({
      primaryFocus: ['mind', 'body'],
      experienceLevel: 'beginner',
      timeCommitment: 15,
      weeklyGoal: 14,
      culturalInterest: true,
      ayurvedicFocus: false
    });
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      // Update user profile with onboarding data
      const updatedProfile = {
        name: safeGet(userProfile, 'name', 'Neural Optimizer'),
        preferences: {
          ...safeGet(userProfile, 'preferences', {}),
          difficulty: userGoals.experienceLevel,
          preferredPillars: userGoals.primaryFocus,
          reminderTime: '09:00',
          notifications: true,
          culturalContent: userGoals.culturalInterest,
          ayurvedicFocus: userGoals.ayurvedicFocus,
          onboardingCompleted: true,
          dailyTimeCommitment: userGoals.timeCommitment
        }
      };

      // Update session data with weekly goal
      actions.updateUserProfile(updatedProfile);
      actions.updateSessionData({ 
        weeklyGoal: userGoals.weeklyGoal,
        dailyGoal: Math.ceil(userGoals.weeklyGoal / 7)
      });

      // Add welcome achievement
      actions.addAchievement({
        id: `achievement_welcome_${Date.now()}`,
        title: 'Welcome to 5PillarsOfLife!',
        description: 'Started your neural optimization journey',
        pillar: 'overall',
        unlockedDate: new Date().toISOString(),
        rarity: 'common'
      });

      // Navigate to home with a first-time user experience
      safeNavigate(navigation, 'Home', { firstTime: true });
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      safeNavigate(navigation, 'Home');
    }
  };

  const updateGoals = (key: keyof UserGoals, value: any) => {
    setUserGoals(prev => ({ ...prev, [key]: value }));
  };

  const togglePillarFocus = (pillar: string) => {
    setUserGoals(prev => ({
      ...prev,
      primaryFocus: prev.primaryFocus.includes(pillar)
        ? prev.primaryFocus.filter(p => p !== pillar)
        : [...prev.primaryFocus, pillar]
    }));
  };

  const renderStep = () => {
    const step = onboardingSteps[currentStep];
    
    if (step.id === 'goals') {
      return renderGoalsStep();
    }

    return (
      <Animated.View style={[styles.stepContainer, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.stepContent}>
          <View style={[styles.iconContainer, { backgroundColor: step.color }]}>
            <Ionicons name={step.icon as any} size={48} color="#FFFFFF" />
          </View>
          
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
          <Text style={styles.stepDescription}>{step.description}</Text>
          
          {step.culturalWisdom && (
            <View style={styles.wisdomContainer}>
              <Ionicons name="book" size={16} color={Colors.spirit} />
              <Text style={styles.wisdomText}>{step.culturalWisdom}</Text>
            </View>
          )}
          
          {step.sanskritTerm && (
            <View style={styles.sanskritContainer}>
              <Text style={styles.sanskritLabel}>Sanskrit:</Text>
              <Text style={styles.sanskritTerm}>{step.sanskritTerm}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderGoalsStep = () => (
    <Animated.View style={[styles.stepContainer, { transform: [{ translateX: slideAnim }] }]}>
      <ScrollView style={styles.goalsScrollView} contentContainerStyle={styles.goalsContent}>
        <Text style={styles.goalsTitle}>Personalize Your Journey</Text>
        <Text style={styles.goalsSubtitle}>Help us create the perfect experience for you</Text>

        {/* Primary Focus Selection */}
        <View style={styles.goalSection}>
          <Text style={styles.goalSectionTitle}>Which pillars interest you most?</Text>
          <Text style={styles.goalSectionSubtitle}>Select 1-3 areas to focus on initially</Text>
          
          <View style={styles.pillarGrid}>
            {[
              { key: 'body', label: 'Body', icon: 'fitness', color: Colors.body },
              { key: 'mind', label: 'Mind', icon: 'library', color: Colors.mind },
              { key: 'heart', label: 'Heart', icon: 'heart', color: Colors.heart },
              { key: 'spirit', label: 'Spirit', icon: 'leaf', color: Colors.spirit },
              { key: 'diet', label: 'Diet', icon: 'restaurant', color: Colors.diet }
            ].map(pillar => (
              <TouchableOpacity
                key={pillar.key}
                style={[
                  styles.pillarOption,
                  userGoals.primaryFocus.includes(pillar.key) && styles.pillarOptionSelected,
                  { borderColor: pillar.color }
                ]}
                onPress={() => togglePillarFocus(pillar.key)}
              >
                <Ionicons 
                  name={pillar.icon as any} 
                  size={24} 
                  color={userGoals.primaryFocus.includes(pillar.key) ? '#FFFFFF' : pillar.color} 
                />
                <Text style={[
                  styles.pillarOptionText,
                  userGoals.primaryFocus.includes(pillar.key) && styles.pillarOptionTextSelected
                ]}>
                  {pillar.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Experience Level */}
        <View style={styles.goalSection}>
          <Text style={styles.goalSectionTitle}>What's your wellness experience?</Text>
          
          <View style={styles.experienceOptions}>
            {[
              { value: 'beginner', label: 'Beginner', description: 'New to wellness practices' },
              { value: 'intermediate', label: 'Intermediate', description: 'Some experience with meditation/fitness' },
              { value: 'advanced', label: 'Advanced', description: 'Regular wellness practitioner' }
            ].map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.experienceOption,
                  userGoals.experienceLevel === option.value && styles.experienceOptionSelected
                ]}
                onPress={() => updateGoals('experienceLevel', option.value)}
              >
                <Text style={[
                  styles.experienceOptionLabel,
                  userGoals.experienceLevel === option.value && styles.experienceOptionLabelSelected
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.experienceOptionDesc,
                  userGoals.experienceLevel === option.value && styles.experienceOptionDescSelected
                ]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Commitment */}
        <View style={styles.goalSection}>
          <Text style={styles.goalSectionTitle}>Daily time commitment</Text>
          <Text style={styles.goalSectionSubtitle}>How many minutes per day can you dedicate?</Text>
          
          <View style={styles.timeOptions}>
            {[10, 15, 20, 30, 45].map(minutes => (
              <TouchableOpacity
                key={minutes}
                style={[
                  styles.timeOption,
                  userGoals.timeCommitment === minutes && styles.timeOptionSelected
                ]}
                onPress={() => updateGoals('timeCommitment', minutes)}
              >
                <Text style={[
                  styles.timeOptionText,
                  userGoals.timeCommitment === minutes && styles.timeOptionTextSelected
                ]}>
                  {minutes}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cultural Interest */}
        <View style={styles.goalSection}>
          <Text style={styles.goalSectionTitle}>Cultural Preferences</Text>
          
          <TouchableOpacity
            style={styles.culturalOption}
            onPress={() => updateGoals('culturalInterest', !userGoals.culturalInterest)}
          >
            <View style={styles.culturalOptionContent}>
              <Text style={styles.culturalOptionTitle}>Include Indian Cultural Wisdom</Text>
              <Text style={styles.culturalOptionDesc}>
                Sanskrit terms, Vedic quotes, and traditional practices
              </Text>
            </View>
            <View style={[
              styles.culturalToggle,
              userGoals.culturalInterest && styles.culturalToggleActive
            ]}>
              {userGoals.culturalInterest && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.culturalOption}
            onPress={() => updateGoals('ayurvedicFocus', !userGoals.ayurvedicFocus)}
          >
            <View style={styles.culturalOptionContent}>
              <Text style={styles.culturalOptionTitle}>Ayurvedic Nutrition Focus</Text>
              <Text style={styles.culturalOptionDesc}>
                Dosha balancing, seasonal eating, and traditional remedies
              </Text>
            </View>
            <View style={[
              styles.culturalToggle,
              userGoals.ayurvedicFocus && styles.culturalToggleActive
            ]}>
              {userGoals.ayurvedicFocus && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              })
            }
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {currentStep + 1} of {onboardingSteps.length}
      </Text>
    </View>
  );

  const renderNavigation = () => (
    <View style={styles.navigationContainer}>
      <TouchableOpacity
        style={[styles.navButton, styles.skipButton]}
        onPress={handleSkip}
      >
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.navControls}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={[styles.navButton, styles.backButton]}
            onPress={handleBack}
          >
            <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1 ? 'Start Journey!' : 'Next'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="sparkles" size={48} color={Colors.spirit} />
        <Text style={styles.loadingText}>Preparing Your Journey...</Text>
      </View>
    );
  }

  return (
    <PerformanceMonitor>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={[Colors.background, '#FFFFFF']}
          style={styles.backgroundGradient}
        >
          {renderProgressBar()}
          
          <View style={styles.contentContainer}>
            {renderStep()}
          </View>
          
          {renderNavigation()}
        </LinearGradient>
      </Animated.View>
    </PerformanceMonitor>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  backgroundGradient: {
    flex: 1,
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.spirit,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  stepContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: Colors.spirit,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  wisdomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.spirit}15`,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    maxWidth: '90%',
  },
  wisdomText: {
    fontSize: 14,
    color: Colors.text,
    fontStyle: 'italic',
    marginLeft: 8,
    lineHeight: 20,
  },
  sanskritContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.warning}15`,
    padding: 12,
    borderRadius: 8,
  },
  sanskritLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  sanskritTerm: {
    fontSize: 14,
    color: Colors.warning,
    fontWeight: '600',
  },
  goalsScrollView: {
    flex: 1,
  },
  goalsContent: {
    paddingVertical: 20,
  },
  goalsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  goalsSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  goalSection: {
    marginBottom: 32,
  },
  goalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  goalSectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  pillarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pillarOption: {
    width: '47%',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  pillarOptionSelected: {
    backgroundColor: Colors.accent,
  },
  pillarOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 8,
  },
  pillarOptionTextSelected: {
    color: '#FFFFFF',
  },
  experienceOptions: {
    gap: 12,
  },
  experienceOption: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: Colors.surface,
  },
  experienceOptionSelected: {
    borderColor: Colors.accent,
    backgroundColor: `${Colors.accent}15`,
  },
  experienceOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  experienceOptionLabelSelected: {
    color: Colors.accent,
  },
  experienceOptionDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  experienceOptionDescSelected: {
    color: Colors.accent,
  },
  timeOptions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  timeOption: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
  },
  timeOptionSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent,
  },
  timeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  timeOptionTextSelected: {
    color: '#FFFFFF',
  },
  culturalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: Colors.surface,
    marginBottom: 12,
  },
  culturalOptionContent: {
    flex: 1,
  },
  culturalOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  culturalOptionDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  culturalToggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  culturalToggleActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  skipButton: {
    backgroundColor: 'transparent',
  },
  skipButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  navControls: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    backgroundColor: '#F3F4F6',
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  nextButton: {
    backgroundColor: Colors.spirit,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 4,
  },
});

export default React.memo(OnboardingScreen);
