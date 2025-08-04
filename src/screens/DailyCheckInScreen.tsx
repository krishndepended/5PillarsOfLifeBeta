// src/screens/DailyCheckInScreen.tsx - MORNING & EVENING CHECK-IN SYSTEM
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
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
  warning: '#F59E0B',
  spirit: '#8B5CF6',
  heart: '#EC4899',
};

interface CheckInData {
  mood: number; // 1-5 scale
  energy: number; // 1-5 scale
  stress: number; // 1-5 scale
  sleep: number; // 1-5 scale (evening only)
  gratitude: string[];
  intention: string;
  reflection: string; // evening only
  pillarFocus: string[];
}

const DailyCheckInScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { actions } = useAppData();
  const { userProfile, sessionData, isInitialized } = useAppDataSelectors();
  const { measurePerformance } = usePerformanceOptimization();

  // Check-in type: morning or evening
  const checkInType = safeGet(route, 'params.type', 'morning') as 'morning' | 'evening';
  
  const [checkInData, setCheckInData] = useState<CheckInData>({
    mood: 3,
    energy: 3,
    stress: 3,
    sleep: 3,
    gratitude: [],
    intention: '',
    reflection: '',
    pillarFocus: []
  });

  const [currentStep, setCurrentStep] = useState(0);

  const morningSteps = ['mood', 'energy', 'stress', 'intention', 'focus'];
  const eveningSteps = ['mood', 'energy', 'sleep', 'reflection', 'gratitude'];
  
  const steps = checkInType === 'morning' ? morningSteps : eveningSteps;

  useEffect(() => {
    const measurement = measurePerformance('DailyCheckInScreen');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      measurement.end();
    });
  }, [fadeAnim]);

  const updateCheckInData = (key: keyof CheckInData, value: any) => {
    setCheckInData(prev => ({ ...prev, [key]: value }));
  };

  const completeCheckIn = async () => {
    try {
      // Save check-in data
      const checkInEntry = {
        id: `checkin_${Date.now()}`,
        type: checkInType,
        date: new Date().toISOString(),
        data: checkInData,
        timestamp: Date.now()
      };

      // Add as a session for tracking
      actions.addSession({
        pillar: 'overall',
        duration: 5, // 5 minutes for check-in
        improvement: 1,
        type: 'checkin'
      });

      // Add achievement for first check-in
      if (sessionData.completedToday === 0) {
        actions.addAchievement({
          id: `achievement_first_checkin_${Date.now()}`,
          title: `First ${checkInType.charAt(0).toUpperCase() + checkInType.slice(1)} Check-in!`,
          description: `Completed your first daily ${checkInType} reflection`,
          pillar: 'overall',
          unlockedDate: new Date().toISOString(),
          rarity: 'common'
        });
      }

      // Navigate back with success
      safeNavigate(navigation, 'Home', { checkInCompleted: true });
      
    } catch (error) {
      console.error('Error completing check-in:', error);
      safeNavigate(navigation, 'Home');
    }
  };

  const renderMoodStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>How are you feeling?</Text>
      <Text style={styles.stepSubtitle}>Select your current mood</Text>
      
      <View style={styles.moodOptions}>
        {[
          { value: 1, emoji: '😢', label: 'Very Low', color: '#EF4444' },
          { value: 2, emoji: '😕', label: 'Low', color: '#F59E0B' },
          { value: 3, emoji: '😐', label: 'Neutral', color: '#6B7280' },
          { value: 4, emoji: '😊', label: 'Good', color: '#10B981' },
          { value: 5, emoji: '😁', label: 'Excellent', color: '#059669' }
        ].map(mood => (
          <TouchableOpacity
            key={mood.value}
            style={[
              styles.moodOption,
              checkInData.mood === mood.value && styles.moodOptionSelected,
              { borderColor: mood.color }
            ]}
            onPress={() => updateCheckInData('mood', mood.value)}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={[styles.moodLabel, { color: mood.color }]}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEnergyStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Energy Level</Text>
      <Text style={styles.stepSubtitle}>How energetic do you feel?</Text>
      
      <View style={styles.scaleContainer}>
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabel}>Low</Text>
          <Text style={styles.scaleLabel}>High</Text>
        </View>
        
        <View style={styles.scaleOptions}>
          {[1, 2, 3, 4, 5].map(level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.scaleOption,
                checkInData.energy === level && styles.scaleOptionSelected
              ]}
              onPress={() => updateCheckInData('energy', level)}
            >
              <Text style={[
                styles.scaleOptionText,
                checkInData.energy === level && styles.scaleOptionTextSelected
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.batteryIndicator}>
          <Ionicons 
            name="battery-charging" 
            size={32} 
            color={
              checkInData.energy <= 2 ? '#EF4444' :
              checkInData.energy <= 3 ? '#F59E0B' :
              '#10B981'
            } 
          />
        </View>
      </View>
    </View>
  );

  const renderIntentionStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Set Your Intention</Text>
      <Text style={styles.stepSubtitle}>संकल्प - What do you want to focus on today?</Text>
      
      <View style={styles.intentionOptions}>
        {[
          'Practice mindfulness and presence',
          'Cultivate inner peace and calm',
          'Build physical strength and vitality',
          'Expand knowledge and wisdom',
          'Show love and compassion',
          'Nourish my body with healthy choices',
          'Connect with my spiritual nature',
          'Be productive and focused'
        ].map((intention, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.intentionOption,
              checkInData.intention === intention && styles.intentionOptionSelected
            ]}
            onPress={() => updateCheckInData('intention', intention)}
          >
            <Ionicons 
              name={checkInData.intention === intention ? 'radio-button-on' : 'radio-button-off'} 
              size={20} 
              color={checkInData.intention === intention ? Colors.spirit : Colors.textSecondary} 
            />
            <Text style={[
              styles.intentionText,
              checkInData.intention === intention && styles.intentionTextSelected
            ]}>
              {intention}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFocusStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Today's Pillar Focus</Text>
      <Text style={styles.stepSubtitle}>Which pillars will you work on today?</Text>
      
      <View style={styles.pillarGrid}>
        {[
          { key: 'body', label: 'Body', icon: 'fitness', color: '#EF4444' },
          { key: 'mind', label: 'Mind', icon: 'library', color: Colors.accent },
          { key: 'heart', label: 'Heart', icon: 'heart', color: Colors.heart },
          { key: 'spirit', label: 'Spirit', icon: 'leaf', color: Colors.spirit },
          { key: 'diet', label: 'Diet', icon: 'restaurant', color: Colors.success }
        ].map(pillar => (
          <TouchableOpacity
            key={pillar.key}
            style={[
              styles.pillarFocusOption,
              checkInData.pillarFocus.includes(pillar.key) && styles.pillarFocusOptionSelected,
              { borderColor: pillar.color }
            ]}
            onPress={() => {
              const newFocus = checkInData.pillarFocus.includes(pillar.key)
                ? checkInData.pillarFocus.filter(p => p !== pillar.key)
                : [...checkInData.pillarFocus, pillar.key];
              updateCheckInData('pillarFocus', newFocus);
            }}
          >
            <Ionicons 
              name={pillar.icon as any} 
              size={24} 
              color={checkInData.pillarFocus.includes(pillar.key) ? '#FFFFFF' : pillar.color} 
            />
            <Text style={[
              styles.pillarFocusText,
              checkInData.pillarFocus.includes(pillar.key) && styles.pillarFocusTextSelected
            ]}>
              {pillar.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep = () => {
    const step = steps[currentStep];
    
    switch (step) {
      case 'mood':
        return renderMoodStep();
      case 'energy':
        return renderEnergyStep();
      case 'stress':
        return renderEnergyStep(); // Same component, different data
      case 'sleep':
        return renderEnergyStep(); // Same component, different data
      case 'intention':
        return renderIntentionStep();
      case 'focus':
        return renderFocusStep();
      case 'reflection':
        return renderIntentionStep(); // Similar component
      case 'gratitude':
        return renderIntentionStep(); // Similar component
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeCheckIn();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      safeNavigate(navigation, 'Home');
    }
  };

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="sunny" size={48} color={Colors.warning} />
        <Text style={styles.loadingText}>Preparing Daily Check-in...</Text>
      </View>
    );
  }

  return (
    <PerformanceMonitor>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={checkInType === 'morning' ? [Colors.warning, '#FCD34D'] : [Colors.spirit, '#A855F7']}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {checkInType === 'morning' ? '🌅 Morning Check-in' : '🌙 Evening Reflection'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {checkInType === 'morning' ? 'Start your day with intention' : 'Reflect on your day'}
            </Text>
          </View>

          <View style={styles.progressIndicator}>
            <Text style={styles.progressText}>{currentStep + 1}/{steps.length}</Text>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
          {renderStep()}
        </ScrollView>

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? 'Complete Check-in' : 'Next'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
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
  progressIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 20,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  moodOption: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: Colors.surface,
    minWidth: 80,
  },
  moodOptionSelected: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  scaleContainer: {
    alignItems: 'center',
    width: '100%',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 16,
  },
  scaleLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  scaleOptions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  scaleOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  scaleOptionSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent,
  },
  scaleOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  scaleOptionTextSelected: {
    color: '#FFFFFF',
  },
  batteryIndicator: {
    marginTop: 16,
  },
  intentionOptions: {
    width: '100%',
    gap: 12,
  },
  intentionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  intentionOptionSelected: {
    borderColor: Colors.spirit,
    backgroundColor: `${Colors.spirit}15`,
  },
  intentionText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  intentionTextSelected: {
    color: Colors.spirit,
    fontWeight: '500',
  },
  pillarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  pillarFocusOption: {
    width: '42%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: Colors.surface,
  },
  pillarFocusOptionSelected: {
    backgroundColor: Colors.accent,
  },
  pillarFocusText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 8,
  },
  pillarFocusTextSelected: {
    color: '#FFFFFF',
  },
  navigationContainer: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButton: {
    backgroundColor: Colors.spirit,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default React.memo(DailyCheckInScreen);
