// src/components/FirstTimeExperience.tsx - WELCOME TUTORIAL OVERLAY
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  spirit: '#8B5CF6',
};

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  position: { x: number; y: number };
  icon: string;
}

interface FirstTimeExperienceProps {
  visible: boolean;
  onComplete: () => void;
}

const FirstTimeExperience: React.FC<FirstTimeExperienceProps> = ({
  visible,
  onComplete
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to 5PillarsOfLife! 🎉',
      description: 'Your journey to holistic wellness and neural optimization starts here. Let me show you around!',
      position: { x: width * 0.5, y: height * 0.3 },
      icon: 'sparkles'
    },
    {
      id: 'score',
      title: 'Your Neural Score',
      description: 'This shows your overall optimization level across all 5 pillars. Watch it grow as you practice!',
      position: { x: width * 0.5, y: height * 0.25 },
      icon: 'flash'
    },
    {
      id: 'ai_insights',
      title: 'AI Insights & Coaching',
      description: 'Tap these cards to get personalized guidance from your AI coach. Each insight has detailed steps!',
      position: { x: width * 0.5, y: height * 0.45 },
      icon: 'extension-puzzle'
    },
    {
      id: 'pillars',
      title: 'The 5 Pillars',
      description: 'Body, Mind, Heart, Spirit, and Diet - tap any pillar to start your optimization journey!',
      position: { x: width * 0.5, y: height * 0.65 },
      icon: 'library'
    },
    {
      id: 'actions',
      title: 'Quick Actions',
      description: 'Access your AI coach and analytics anytime. Your neural optimization data is always available!',
      position: { x: width * 0.5, y: height * 0.8 },
      icon: 'rocket'
    },
    {
      id: 'complete',
      title: 'You\'re Ready! 🚀',
      description: 'Start with a 5-minute session or morning check-in. Remember: consistency creates transformation!',
      position: { x: width * 0.5, y: height * 0.5 },
      icon: 'trophy'
    }
  ];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: Platform.OS !== 'web',
        })
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible, currentStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      // Animate out current step
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        })
      ]).start(() => {
        setCurrentStep(currentStep + 1);
        // Animate in next step
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: Platform.OS !== 'web',
          })
        ]).start();
      });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!visible) return null;

  const currentStepData = tutorialSteps[currentStep];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onComplete}
    >
      <View style={styles.overlay}>
        {/* Tutorial Card */}
        <Animated.View 
          style={[
            styles.tutorialCard,
            {
              top: currentStepData.position.y - 100,
              left: currentStepData.position.x - (width * 0.4),
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={[Colors.spirit, '#A855F7']}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name={currentStepData.icon as any} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.stepIndicator}>
                <Text style={styles.stepText}>{currentStep + 1}/{tutorialSteps.length}</Text>
              </View>
            </View>
            
            <Text style={styles.tutorialTitle}>{currentStepData.title}</Text>
            <Text style={styles.tutorialDescription}>{currentStepData.description}</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>Skip Tour</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {currentStep === tutorialSteps.length - 1 ? 'Start Journey!' : 'Next'}
                </Text>
                <Ionicons 
                  name={currentStep === tutorialSteps.length - 1 ? 'rocket' : 'chevron-forward'} 
                  size={16} 
                  color={Colors.spirit} 
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Progress Dots */}
        <View style={styles.progressDots}>
          {tutorialSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.progressDotActive,
                index < currentStep && styles.progressDotCompleted
              ]}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  tutorialCard: {
    position: 'absolute',
    width: width * 0.8,
    maxWidth: 320,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tutorialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tutorialDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: 8,
  },
  skipButtonText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.spirit,
  },
  progressDots: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
    transform: [{ scale: 1.2 }],
  },
  progressDotCompleted: {
    backgroundColor: Colors.success,
  },
});

export default FirstTimeExperience;
