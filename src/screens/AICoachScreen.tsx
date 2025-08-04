// src/screens/AICoachScreen.tsx - COMPLETE AI COACHING SYSTEM
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
  Alert,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDataSelectors, useAppData } from '../context/AppDataContext';
import { usePerformanceOptimization, PerformanceMonitor } from '../hooks/usePerformanceOptimization';
import AdvancedAIEngine from '../utils/AdvancedAIEngine';
import NotificationManager from '../utils/NotificationManager';

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

interface CoachingSession {
  id: string;
  title: string;
  type: 'analysis' | 'guidance' | 'planning' | 'motivation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  personalizedMessage: string;
  actionSteps: string[];
  expectedOutcome: string;
  pillarFocus: string[];
  confidenceLevel: number;
  estimatedDuration: string;
}

interface AIPersonality {
  name: string;
  style: 'motivational' | 'analytical' | 'supportive' | 'challenging';
  greeting: string;
  expertise: string[];
}

interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  message: string;
  timestamp: Date;
}

const AICoachScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const { actions } = useAppData();
  const { 
    pillarScores, 
    userProfile, 
    sessionData, 
    aiInsights 
  } = useAppDataSelectors();
  const { measurePerformance } = usePerformanceOptimization();
  const aiEngine = AdvancedAIEngine.getInstance();
  const notificationManager = NotificationManager.getInstance();

  const [activeCoachingSession, setActiveCoachingSession] = useState<CoachingSession | null>(null);
  const [coachPersonality, setCoachPersonality] = useState<AIPersonality | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isCoachingActive, setIsCoachingActive] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const measurement = measurePerformance('AICoachScreen');
    
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
          duration: 2000,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    pulse.start();

    initializeAICoach();
  }, [fadeAnim]);

  const initializeAICoach = async () => {
    try {
      // Generate AI coach personality based on user preferences
      generateCoachPersonality();
      
      // Create personalized coaching session
      generateCoachingSession();
      
      // Initialize conversation
      setTimeout(() => {
        initializeCoachConversation();
      }, 1000);
      
    } catch (error) {
      console.error('Error initializing AI Coach:', error);
    }
  };

  const generateCoachPersonality = () => {
    const personalities: AIPersonality[] = [
      {
        name: 'Sage',
        style: 'analytical',
        greeting: 'Welcome! I\'ve analyzed your neural patterns and I\'m excited to guide your optimization journey.',
        expertise: ['Pattern Analysis', 'Cognitive Enhancement', 'Performance Optimization']
      },
      {
        name: 'Spark',
        style: 'motivational',
        greeting: 'You\'re doing amazing work! Let\'s unlock your full potential together!',
        expertise: ['Motivation', 'Goal Achievement', 'Breakthrough Performance']
      },
      {
        name: 'Zen',
        style: 'supportive',
        greeting: 'I\'m here to support you with compassion and wisdom on your growth journey.',
        expertise: ['Emotional Balance', 'Mindfulness', 'Holistic Wellness']
      },
      {
        name: 'Phoenix',
        style: 'challenging',
        greeting: 'Ready to push your limits? I see incredible potential waiting to be unleashed.',
        expertise: ['Transformation', 'Resilience Building', 'Peak Performance']
      }
    ];

    // Select personality based on user's current pillar strengths
    const strongestPillar = Object.entries(pillarScores)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0][0];
    
    let selectedPersonality: AIPersonality;
    
    switch (strongestPillar) {
      case 'mind':
        selectedPersonality = personalities[0]; // Sage - Analytical
        break;
      case 'body':
        selectedPersonality = personalities[1]; // Spark - Motivational
        break;
      case 'heart':
        selectedPersonality = personalities[2]; // Zen - Supportive
        break;
      case 'spirit':
        selectedPersonality = personalities[2]; // Zen - Supportive
        break;
      default:
        selectedPersonality = personalities[3]; // Phoenix - Challenging
    }

    setCoachPersonality(selectedPersonality);
  };

  const generateCoachingSession = () => {
    const userContext = {
      totalSessions: userProfile.totalSessions,
      currentStreak: userProfile.streak,
      preferredTime: '09:00',
      completionRate: sessionData.completedToday / (sessionData.todaySessions || 1),
      pillarPreferences: Object.entries(pillarScores)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 2)
        .map(([pillar]) => pillar),
      previousSuccess: {},
      learningStyle: 'mixed' as const,
      motivationType: 'achievement' as const
    };

    // Generate AI recommendations using the existing engine
    const recommendations = aiEngine.analyzeNeuralPatterns(
      pillarScores,
      [], // Session history
      userProfile,
      userContext
    );

    if (recommendations.length > 0) {
      const topRecommendation = recommendations[0];
      
      const coachingSession: CoachingSession = {
        id: `coaching-${Date.now()}`,
        title: `Personalized Coaching: ${topRecommendation.title}`,
        type: 'guidance',
        priority: topRecommendation.priority,
        personalizedMessage: generatePersonalizedMessage(topRecommendation),
        actionSteps: topRecommendation.actionPlan,
        expectedOutcome: `Expected improvement: +${topRecommendation.estimatedImpact}% in ${topRecommendation.pillar} pillar`,
        pillarFocus: [topRecommendation.pillar],
        confidenceLevel: topRecommendation.confidence,
        estimatedDuration: topRecommendation.timeToResult
      };

      setActiveCoachingSession(coachingSession);
    }
  };

  const generatePersonalizedMessage = (recommendation: any): string => {
    const messages = {
      high: [
        `I've noticed some concerning patterns in your ${recommendation.pillar} optimization. Let's address this immediately to get you back on track.`,
        `Your ${recommendation.pillar} pillar needs urgent attention. I've created a focused plan to help you recover quickly.`
      ],
      medium: [
        `Great progress overall! I see an opportunity to significantly boost your ${recommendation.pillar} performance.`,
        `You're doing well, but I've identified a key area where we can accelerate your ${recommendation.pillar} growth.`
      ],
      low: [
        `Excellent work on your optimization journey! Let's fine-tune your ${recommendation.pillar} pillar for even better results.`,
        `You're performing wonderfully! Here's an advanced technique to enhance your ${recommendation.pillar} mastery.`
      ]
    };

    const priorityMessages = messages[recommendation.priority as keyof typeof messages] || messages.medium;
    return priorityMessages[Math.floor(Math.random() * priorityMessages.length)];
  };

  const initializeCoachConversation = () => {
    if (!coachPersonality) return;

    const welcomeMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'ai',
      message: coachPersonality.greeting,
      timestamp: new Date()
    };

    const analysisMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      type: 'ai',
      message: `I've analyzed your progress across all 5 pillars. Your overall neural optimization score is ${Math.round(Object.values(pillarScores).reduce((a, b) => (a as number) + (b as number), 0) / 5)}%. I'm particularly impressed with your ${userProfile.streak}-day consistency streak!`,
      timestamp: new Date()
    };

    setChatMessages([welcomeMessage, analysisMessage]);
  };

  const sendMessage = () => {
    if (!userInput.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      message: userInput.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.message);
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        type: 'ai',
        message: aiResponse,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const askQuickQuestion = (question: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      message: question,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(question);
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        type: 'ai',
        message: aiResponse,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('improve') || lowerQuestion.includes('better')) {
      const weakestPillar = Object.entries(pillarScores)
        .sort(([,a], [,b]) => (a as number) - (b as number))[0];
      
      return `Based on your current data, I recommend focusing on your ${weakestPillar[0]} pillar (${weakestPillar[1]}%). Start with 15-minute daily sessions and track your progress. Your ${Object.entries(pillarScores).sort(([,a], [,b]) => (b as number) - (a as number))[0][0]} pillar is performing excellently at ${Object.entries(pillarScores).sort(([,a], [,b]) => (b as number) - (a as number))[0][1]}%!`;
    }
    
    if (lowerQuestion.includes('motivation') || lowerQuestion.includes('stuck')) {
      return `I see you've completed ${userProfile.totalSessions} sessions with a ${userProfile.streak}-day streak! That's incredible dedication. Remember, every expert was once a beginner. Your consistency is building neural pathways that will serve you for life. Small consistent actions create extraordinary results.`;
    }
    
    if (lowerQuestion.includes('diet') || lowerQuestion.includes('nutrition')) {
      return `Your diet pillar is at ${pillarScores.diet}%. I recommend focusing on traditional Indian vegetarian meals like dal-chawal with seasonal vegetables. The combination provides complete proteins and supports your overall optimization. Try incorporating more leafy greens and reducing processed foods.`;
    }
    
    if (lowerQuestion.includes('meditation') || lowerQuestion.includes('spiritual')) {
      return `Your spirit pillar shows great potential at ${pillarScores.spirit}%. Try starting with 10-minute mindfulness sessions focusing on breath awareness. Progress gradually to longer practices. The key is consistency over duration - your brain adapts better with regular practice.`;
    }
    
    if (lowerQuestion.includes('exercise') || lowerQuestion.includes('workout')) {
      return `Your body pillar is at ${pillarScores.body}%. I suggest a balanced approach: 3 days strength training, 2 days cardio, and 2 days recovery/yoga. Listen to your body and focus on form over intensity. Recovery is where the magic happens!`;
    }

    if (lowerQuestion.includes('stress') || lowerQuestion.includes('overwhelmed')) {
      return `I understand feeling overwhelmed. Your heart pillar at ${pillarScores.heart}% suggests working on emotional balance. Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8. This activates your parasympathetic nervous system and reduces stress hormones.`;
    }
    
    // Default response with personalized insights
    return `That's a great question! Based on your current optimization patterns, I suggest focusing on consistency across all pillars. Your strongest area is ${Object.entries(pillarScores).sort(([,a], [,b]) => (b as number) - (a as number))[0][0]} at ${Object.entries(pillarScores).sort(([,a], [,b]) => (b as number) - (a as number))[0][1]}%, which is excellent! Use this strength to support growth in other areas.`;
  };

  const startCoachingSession = async () => {
    if (!activeCoachingSession) return;
    
    setIsCoachingActive(true);
    
    // Add coaching session to actual session data
    actions.addSession({
      pillar: activeCoachingSession.pillarFocus[0] || 'overall',
      duration: 0,
      improvement: 0
    });

    // Schedule notification for coaching reminder
    await notificationManager.scheduleAchievementNotification(
      `AI Coaching Session Started: ${activeCoachingSession.title}`,
      activeCoachingSession.pillarFocus[0] || 'overall'
    );
    
    Alert.alert(
      '🤖 AI Coaching Started!',
      `Beginning personalized coaching session: ${activeCoachingSession.title}. I'll guide you through each step.`,
      [{ text: 'Let\'s Begin!', style: 'default' }]
    );
    
    // Add coaching start message
    const coachingMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'ai',
      message: `🎯 Coaching Session Active!\n\n${activeCoachingSession.personalizedMessage}\n\nLet's work through this together. Ask me anything about the action steps!`,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, coachingMessage]);
  };

  const renderCoachPersonality = () => (
    <PerformanceMonitor>
      <View style={styles.personalitySection}>
        <LinearGradient
          colors={[Colors.spirit, '#A855F7']}
          style={styles.personalityGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.personalityInfo}>
            <Animated.View style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
              <Ionicons name="extension-puzzle" size={32} color="#FFFFFF" />
            </Animated.View>
            <View style={styles.personalityDetails}>
              <Text style={styles.coachName}>AI Coach: {coachPersonality?.name}</Text>
              <Text style={styles.coachStyle}>{coachPersonality?.style.toUpperCase()} APPROACH</Text>
              <Text style={styles.coachExpertise}>
                Expertise: {coachPersonality?.expertise.join(' • ')}
              </Text>
            </View>
          </View>
          <View style={styles.confidenceIndicator}>
            <Text style={styles.confidenceText}>
              Analysis Confidence: {activeCoachingSession ? Math.round(activeCoachingSession.confidenceLevel * 100) : 92}%
            </Text>
          </View>
        </LinearGradient>
      </View>
    </PerformanceMonitor>
  );

  const renderCoachingSession = () => (
    <PerformanceMonitor>
      <View style={styles.sessionSection}>
        <Text style={styles.sectionTitle}>Personalized Coaching Session</Text>
        
        {activeCoachingSession && (
          <View style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <View style={[styles.priorityDot, { 
                backgroundColor: activeCoachingSession.priority === 'high' ? Colors.warning : 
                                 activeCoachingSession.priority === 'critical' ? '#EF4444' : Colors.success 
              }]} />
              <Text style={styles.sessionTitle}>{activeCoachingSession.title}</Text>
            </View>
            
            <Text style={styles.sessionMessage}>{activeCoachingSession.personalizedMessage}</Text>
            
            <View style={styles.actionStepsContainer}>
              <Text style={styles.actionStepsTitle}>Recommended Action Steps:</Text>
              {activeCoachingSession.actionSteps.map((step, index) => (
                <View key={index} style={styles.actionStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.actionStepText}>{step}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.outcomeContainer}>
              <Text style={styles.outcomeTitle}>Expected Outcome:</Text>
              <Text style={styles.outcomeText}>{activeCoachingSession.expectedOutcome}</Text>
              <Text style={styles.durationText}>Duration: {activeCoachingSession.estimatedDuration}</Text>
            </View>
            
            {!isCoachingActive ? (
              <TouchableOpacity
                style={styles.startCoachingButton}
                onPress={startCoachingSession}
              >
                <Ionicons name="play" size={20} color="#FFFFFF" />
                <Text style={styles.startCoachingText}>Start Coaching Session</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.coachingActiveIndicator}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.coachingActiveText}>Coaching Session Active</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </PerformanceMonitor>
  );

  const renderAIChat = () => (
    <PerformanceMonitor>
      <View style={styles.chatSection}>
        <Text style={styles.sectionTitle}>Chat with Your AI Coach</Text>
        
        <ScrollView 
          style={styles.chatContainer} 
          contentContainerStyle={styles.chatPadding}
          showsVerticalScrollIndicator={false}
          ref={(ref) => ref?.scrollToEnd({ animated: true })}
        >
          {chatMessages.map((message) => (
            <View 
              key={message.id} 
              style={[
                styles.messageContainer, 
                message.type === 'ai' ? styles.aiMessage : styles.userMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                message.type === 'ai' ? styles.aiMessageText : styles.userMessageText
              ]}>
                {message.message}
              </Text>
              <Text style={styles.messageTime}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}
          
          {isTyping && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          )}
        </ScrollView>
        
        <View style={styles.quickQuestions}>
          <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
          <View style={styles.questionButtons}>
            {[
              'How can I improve?',
              'I need motivation',
              'Diet suggestions?',
              'Meditation tips?',
              'Exercise advice?',
              'Feeling stressed'
            ].map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.questionButton}
                onPress={() => askQuickQuestion(question)}
              >
                <Text style={styles.questionButtonText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Ask your AI coach anything..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!userInput.trim() || isTyping) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!userInput.trim() || isTyping}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
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
          <Text style={styles.headerTitle}>AI Coach</Text>
          <Text style={styles.headerSubtitle}>Personalized Neural Guidance</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings" size={20} color={Colors.spirit} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderCoachPersonality()}
        {renderCoachingSession()}
        {renderAIChat()}
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
  personalitySection: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  personalityGradient: {
    padding: 20,
  },
  personalityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  personalityDetails: {
    flex: 1,
  },
  coachName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  coachStyle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  coachExpertise: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  confidenceIndicator: {
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  sessionSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sessionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  sessionMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionStepsContainer: {
    backgroundColor: `${Colors.accent}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  actionStepsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  actionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionStepText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  outcomeContainer: {
    backgroundColor: `${Colors.success}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  outcomeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  outcomeText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  durationText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
  },
  startCoachingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.spirit,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  startCoachingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  coachingActiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  coachingActiveText: {
    color: Colors.success,
    fontSize: 16,
    fontWeight: '600',
  },
  chatSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  chatContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    height: 250,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chatPadding: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: `${Colors.spirit}15`,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: `${Colors.accent}15`,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  aiMessageText: {
    color: Colors.text,
  },
  userMessageText: {
    color: Colors.text,
  },
  messageTime: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
    opacity: 0.7,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.spirit,
    opacity: 0.7,
  },
  quickQuestions: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  questionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  questionButton: {
    backgroundColor: `${Colors.accent}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${Colors.accent}30`,
  },
  questionButtonText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: Colors.spirit,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.5,
  },
});

export default React.memo(AICoachScreen);
