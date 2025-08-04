// src/screens/OnboardingScreen.tsx - INTERACTIVE NEURAL EDUCATION
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
  Platform, Animated, SafeAreaView, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  // Pillar colors
  body: '#EF4444',
  mind: '#3B82F6',
  heart: '#EC4899',
  spirit: '#8B5CF6',
  diet: '#10B981',
  // Onboarding colors
  primary: '#8B5CF6',
  secondary: '#EC4899',
};

const OnboardingScreen = ({ navigation }) => {
  const { dispatch, actions } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState({
    name: '',
    experience: '',
    goals: [],
    preferredTime: '',
    difficulty: 'Beginner'
  });

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, [currentStep]);

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome to 5 Pillars',
      subtitle: 'Neural Optimization Platform',
      component: WelcomeStep
    },
    {
      id: 'science',
      title: 'The Science',
      subtitle: 'Understanding Neuroplasticity',
      component: ScienceStep
    },
    {
      id: 'pillars',
      title: 'The 5 Pillars',
      subtitle: 'Your Neural Foundation',
      component: PillarsStep
    },
    {
      id: 'personalization',
      title: 'Personalization',
      subtitle: 'Tailored to Your Journey',
      component: PersonalizationStep
    },
    {
      id: 'goals',
      title: 'Set Your Goals',
      subtitle: 'Define Your Neural Targets',
      component: GoalsStep
    },
    {
      id: 'ready',
      title: 'Ready to Begin',
      subtitle: 'Your Neural Journey Starts Now',
      component: ReadyStep
    }
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    // Update user profile with onboarding data
    actions.updateProfile({
      name: userResponses.name || 'Neural Explorer'
    });
    
    actions.updatePreferences({
      reminderTime: userResponses.preferredTime || '07:00',
      difficultyLevel: userResponses.difficulty
    });

    actions.updateGoals({
      weeklySessionTarget: userResponses.goals.includes('consistency') ? 7 : 5,
      targetNeuralScore: userResponses.goals.includes('mastery') ? 95 : 80
    });

    dispatch({ type: 'MARK_ONBOARDED' });
    navigation.replace('HomeScreen');
  };

  function WelcomeStep() {
    return (
      <View style={styles.stepContainer}>
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          style={styles.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: fadeAnim }] }]}>
            <Ionicons name="brain" size={80} color="#FFFFFF" />
          </Animated.View>
          
          <Text style={styles.heroTitle}>5 Pillars of Life</Text>
          <Text style={styles.heroSubtitle}>Neural Optimization Platform</Text>
          
          <Text style={styles.heroDescription}>
            Unlock your brain's potential through scientifically-backed neural optimization. 
            Transform your mind, body, heart, spirit, and diet into pillars of excellence.
          </Text>
        </LinearGradient>

        <View style={styles.welcomeFeatures}>
          <FeatureItem 
            icon="analytics" 
            title="AI-Powered Insights" 
            description="Personalized recommendations based on your neural patterns"
          />
          <FeatureItem 
            icon="trending-up" 
            title="Progress Tracking" 
            description="Beautiful analytics showing your optimization journey"
          />
          <FeatureItem 
            icon="target" 
            title="Goal Achievement" 
            description="Set and achieve meaningful neural development milestones"
          />
        </View>
      </View>
    );
  }

  function ScienceStep() {
    return (
      <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepTitle}>The Science of Neuroplasticity</Text>
        
        <View style={styles.scienceCard}>
          <Ionicons name="bulb" size={32} color={Colors.accent} />
          <Text style={styles.scienceTitle}>Your Brain Can Change</Text>
          <Text style={styles.scienceText}>
            Neuroplasticity is your brain's ability to reorganize and form new neural connections. 
            This means you can literally rewire your brain for better performance, happiness, and health.
          </Text>
        </View>

        <View style={styles.scienceCard}>
          <Ionicons name="fitness" size={32} color={Colors.body} />
          <Text style={styles.scienceTitle}>Exercise = Brain Growth</Text>
          <Text style={styles.scienceText}>
            Physical exercise increases BDNF (Brain-Derived Neurotrophic Factor) by up to 300%, 
            promoting the growth of new neurons and strengthening existing connections.
          </Text>
        </View>

        <View style={styles.scienceCard}>
          <Ionicons name="leaf" size={32} color={Colors.spirit} />
          <Text style={styles.scienceTitle}>Meditation Reshapes Your Brain</Text>
          <Text style={styles.scienceText}>
            Regular meditation increases cortical thickness, improves attention, and reduces 
            activity in the default mode network by 30%.
          </Text>
        </View>

        <View style={styles.neuralFactBox}>
          <Text style={styles.factTitle}>🧠 Neural Fact</Text>
          <Text style={styles.factText}>
            Your brain generates approximately 700-1000 new neurons every day in the hippocampus, 
            the region responsible for learning and memory.
          </Text>
        </View>
      </ScrollView>
    );
  }

  function PillarsStep() {
    const pillars = [
      { name: 'BODY', icon: 'fitness', color: Colors.body, description: 'Physical optimization for neural growth' },
      { name: 'MIND', icon: 'library', color: Colors.mind, description: 'Cognitive enhancement and focus training' },
      { name: 'HEART', icon: 'heart', color: Colors.heart, description: 'Emotional intelligence and coherence' },
      { name: 'SPIRIT', icon: 'leaf', color: Colors.spirit, description: 'Consciousness expansion and awareness' },
      { name: 'DIET', icon: 'restaurant', color: Colors.diet, description: 'Nutritional fuel for your brain' }
    ];

    return (
      <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepTitle}>The 5 Pillars of Neural Excellence</Text>
        <Text style={styles.stepSubtitle}>
          Each pillar represents a fundamental aspect of neural optimization. 
          Together, they create a comprehensive system for brain enhancement.
        </Text>

        {pillars.map((pillar, index) => (
          <Animated.View 
            key={pillar.name}
            style={[
              styles.pillarCard,
              { 
                transform: [{ translateY: slideAnim }],
                opacity: fadeAnim
              }
            ]}
          >
            <View style={[styles.pillarIcon, { backgroundColor: `${pillar.color}15` }]}>
              <Ionicons name={pillar.icon as any} size={32} color={pillar.color} />
            </View>
            <View style={styles.pillarContent}>
              <Text style={styles.pillarName}>{pillar.name}</Text>
              <Text style={styles.pillarDescription}>{pillar.description}</Text>
            </View>
          </Animated.View>
        ))}

        <View style={styles.synergyBox}>
          <Text style={styles.synergyTitle}>🔗 Synergistic Effect</Text>
          <Text style={styles.synergyText}>
            The magic happens when all 5 pillars work together. Our AI identifies 
            correlations between pillars and creates personalized optimization pathways.
          </Text>
        </View>
      </ScrollView>
    );
  }

  function PersonalizationStep() {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Tell Us About Yourself</Text>
        <Text style={styles.stepSubtitle}>
          This helps us personalize your neural optimization journey
        </Text>

        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>What's your name?</Text>
          <TouchableOpacity style={styles.inputField}>
            <Text style={styles.inputText}>
              {userResponses.name || 'Tap to enter your name'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.formLabel}>Experience with neural optimization?</Text>
          {['Complete Beginner', 'Some Experience', 'Advanced'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                userResponses.experience === option && styles.selectedOption
              ]}
              onPress={() => setUserResponses(prev => ({ ...prev, experience: option }))}
            >
              <Text style={[
                styles.optionText,
                userResponses.experience === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.formLabel}>Preferred session time?</Text>
          {['Morning (6-9 AM)', 'Afternoon (12-3 PM)', 'Evening (6-9 PM)'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                userResponses.preferredTime === option && styles.selectedOption
              ]}
              onPress={() => setUserResponses(prev => ({ ...prev, preferredTime: option }))}
            >
              <Text style={[
                styles.optionText,
                userResponses.preferredTime === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  function GoalsStep() {
    const goalOptions = [
      { id: 'focus', title: 'Improve Focus', description: 'Enhance concentration and attention' },
      { id: 'stress', title: 'Reduce Stress', description: 'Better emotional regulation and calm' },
      { id: 'energy', title: 'Increase Energy', description: 'More vitality and mental clarity' },
      { id: 'creativity', title: 'Boost Creativity', description: 'Enhanced innovative thinking' },
      { id: 'memory', title: 'Better Memory', description: 'Improved retention and recall' },
      { id: 'consistency', title: 'Build Consistency', description: 'Develop daily optimization habits' }
    ];

    return (
      <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepTitle}>What Are Your Goals?</Text>
        <Text style={styles.stepSubtitle}>
          Select all that apply. We'll customize your experience to match your objectives.
        </Text>

        {goalOptions.map(goal => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalCard,
              userResponses.goals.includes(goal.id) && styles.selectedGoal
            ]}
            onPress={() => {
              setUserResponses(prev => ({
                ...prev,
                goals: prev.goals.includes(goal.id)
                  ? prev.goals.filter(g => g !== goal.id)
                  : [...prev.goals, goal.id]
              }));
            }}
          >
            <View style={styles.goalContent}>
              <Text style={[
                styles.goalTitle,
                userResponses.goals.includes(goal.id) && styles.selectedGoalTitle
              ]}>
                {goal.title}
              </Text>
              <Text style={styles.goalDescription}>{goal.description}</Text>
            </View>
            {userResponses.goals.includes(goal.id) && (
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  function ReadyStep() {
    return (
      <View style={styles.stepContainer}>
        <LinearGradient
          colors={[Colors.success, Colors.accent]}
          style={styles.readyGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={{ transform: [{ scale: fadeAnim }] }}>
            <Ionicons name="rocket" size={64} color="#FFFFFF" />
          </Animated.View>
          
          <Text style={styles.readyTitle}>You're All Set!</Text>
          <Text style={styles.readySubtitle}>
            Your personalized neural optimization journey is ready to begin
          </Text>
        </LinearGradient>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Your Profile Summary:</Text>
          
          <View style={styles.summaryItem}>
            <Ionicons name="person" size={20} color={Colors.primary} />
            <Text style={styles.summaryText}>
              {userResponses.name || 'Neural Explorer'} • {userResponses.experience || 'Beginner'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="time" size={20} color={Colors.primary} />
            <Text style={styles.summaryText}>
              Preferred time: {userResponses.preferredTime || 'Morning'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="target" size={20} color={Colors.primary} />
            <Text style={styles.summaryText}>
              {userResponses.goals.length} goals selected for optimization
            </Text>
          </View>
        </View>

        <View style={styles.nextStepsContainer}>
          <Text style={styles.nextStepsTitle}>What's Next:</Text>
          <Text style={styles.nextStepsText}>
            • AI will analyze your preferences{'\n'}
            • Personalized pillar recommendations{'\n'}
            • Smart session scheduling{'\n'}
            • Progress tracking begins immediately
          </Text>
        </View>
      </View>
    );
  }

  function FeatureItem({ icon, title, description }) {
    return (
      <View style={styles.featureItem}>
        <View style={styles.featureIcon}>
          <Ionicons name={icon} size={24} color={Colors.primary} />
        </View>
        <View style={styles.featureContent}>
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.featureDescription}>{description}</Text>
        </View>
      </View>
    );
  }

  const CurrentStepComponent = onboardingSteps[currentStep].component;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} of {onboardingSteps.length}
          </Text>
        </View>

        {/* Step Content */}
        <Animated.View 
          style={[
            styles.contentContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <CurrentStepComponent />
        </Animated.View>

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
              <Ionicons name="arrow-back" size={20} color={Colors.textSecondary} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
            <Text style={styles.nextButtonText}>
              {currentStep === onboardingSteps.length - 1 ? 'Begin Journey' : 'Continue'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.textSecondary + '20',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroGradient: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif',
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  welcomeFeatures: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif',
  },
  stepSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  scienceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  scienceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  scienceText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  neuralFactBox: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  factTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  factText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  pillarCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  pillarIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pillarContent: {
    flex: 1,
  },
  pillarName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif',
  },
  pillarDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  synergyBox: {
    backgroundColor: Colors.success + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  synergyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.success,
    marginBottom: 8,
  },
  synergyText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  formContainer: {
    gap: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.textSecondary + '20',
  },
  inputText: {
    fontSize: 16,
    color: Colors.text,
  },
  optionButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.textSecondary + '20',
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.textSecondary + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedGoal: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '10',
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  selectedGoalTitle: {
    color: Colors.success,
  },
  goalDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  readyGradient: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
  },
  readyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  readySubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  summaryContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  summaryText: {
    fontSize: 16,
    color: Colors.text,
  },
  nextStepsContainer: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  nextStepsText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default OnboardingScreen;
