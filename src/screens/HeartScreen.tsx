// src/screens/HeartScreen.tsx - CORRECTED VERSION (JSX SYNTAX FIXED)
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
  heart: '#EC4899',
  heartLight: '#FDF2F8',
  spirit: '#8B5CF6',
};

interface MoodEntry {
  id: string;
  date: string;
  mood: 'excellent' | 'good' | 'okay' | 'low' | 'difficult';
  energy: number; // 1-10
  stress: number; // 1-10
  gratitude: string[];
  reflection: string;
  triggers: string[];
}

const HeartScreen = () => {
  const navigation = useNavigation();
  const { actions } = useAppData();
  const { userProfile, pillarScores, sessions } = useAppDataSelectors();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const heartBeatAnim = useRef(new Animated.Value(1)).current;
  
  // State
  const [selectedTab, setSelectedTab] = useState<'journal' | 'assessment' | 'relationships' | 'practices'>('journal');
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [currentMoodEntry, setCurrentMoodEntry] = useState<Partial<MoodEntry>>({});

  // Mock emotional data
  const [emotionalMetrics] = useState({
    overallWellbeing: 78,
    emotionalIntelligence: 82,
    stressLevel: 35, // Lower is better
    gratitudeStreak: 12,
    heartSessions: sessions.filter(s => s.pillar === 'heart').length,
    avgMood: 3.8, // Out of 5
    relationshipScore: 85,
  });

  // Recent mood entries
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    {
      id: 'mood-1',
      date: new Date().toISOString(),
      mood: 'good',
      energy: 7,
      stress: 4,
      gratitude: ['Family time', 'Good health', 'Learning opportunities'],
      reflection: 'Feeling balanced today with moments of joy and minor challenges.',
      triggers: []
    }
  ]);

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

    // Heartbeat animation
    const heartBeatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(heartBeatAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(heartBeatAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    heartBeatLoop.start();

    return () => heartBeatLoop.stop();
  }, []);

  // Handlers
  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home' as never);
    }
  }, [navigation]);

  const openMoodModal = useCallback(() => {
    setCurrentMoodEntry({
      id: `mood-${Date.now()}`,
      date: new Date().toISOString(),
      gratitude: [],
      triggers: []
    });
    setShowMoodModal(true);
  }, []);

  const saveMoodEntry = useCallback(async () => {
    if (!currentMoodEntry.mood) {
      Alert.alert('Please select a mood', 'Choose how you\'re feeling today before saving.');
      return;
    }

    const newEntry: MoodEntry = {
      id: currentMoodEntry.id || `mood-${Date.now()}`,
      date: currentMoodEntry.date || new Date().toISOString(),
      mood: currentMoodEntry.mood,
      energy: currentMoodEntry.energy || 5,
      stress: currentMoodEntry.stress || 5,
      gratitude: currentMoodEntry.gratitude || [],
      reflection: currentMoodEntry.reflection || '',
      triggers: currentMoodEntry.triggers || []
    };

    setMoodEntries(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries

    // Add session
    await actions.addSession({
      pillar: 'heart',
      type: 'practice',
      duration: 5,
      date: new Date().toISOString(),
      score: (currentMoodEntry.mood === 'excellent' ? 95 : 
             currentMoodEntry.mood === 'good' ? 85 :
             currentMoodEntry.mood === 'okay' ? 70 :
             currentMoodEntry.mood === 'low' ? 55 : 40),
      mood: currentMoodEntry.mood,
      notes: `Mood journal: ${currentMoodEntry.reflection}`
    });

    // Check for gratitude achievement
    if (currentMoodEntry.gratitude && currentMoodEntry.gratitude.length >= 3) {
      await actions.addAchievement({
        title: '🙏 Gratitude Master',
        description: 'Practiced gratitude with 3+ appreciations',
        pillar: 'heart',
        rarity: 'common'
      });
    }

    setShowMoodModal(false);
    setCurrentMoodEntry({});
    
    Alert.alert(
      '💖 Mood Logged!',
      'Your emotional check-in has been saved. Thank you for taking care of your heart.',
      [{ text: 'Beautiful!', style: 'default' }]
    );
  }, [currentMoodEntry, actions]);

  // Render functions
  const renderHeader = () => (
    <LinearGradient
      colors={[Colors.heart, '#DB2777']}
      style={styles.header}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Heart Pillar</Text>
        <Text style={styles.headerSubtitle}>Emotional Wellness • भावनात्मक कल्याण</Text>
      </View>

      <Animated.View style={[styles.headerHeart, { transform: [{ scale: heartBeatAnim }] }]}>
        <Ionicons name="heart" size={32} color="#FFFFFF" />
      </Animated.View>
    </LinearGradient>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {[
        { key: 'journal', label: 'Journal', icon: 'journal' },
        { key: 'assessment', label: 'Assessment', icon: 'analytics' },
        { key: 'relationships', label: 'Relations', icon: 'people' },
        { key: 'practices', label: 'Practices', icon: 'heart' }
      ].map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, selectedTab === tab.key && styles.tabActive]}
          onPress={() => setSelectedTab(tab.key as any)}
        >
          <Ionicons 
            name={tab.icon as any} 
            size={20} 
            color={selectedTab === tab.key ? Colors.heart : Colors.textSecondary} 
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

  const renderEmotionalMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>Emotional Wellbeing</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Ionicons name="heart" size={24} color={Colors.heart} />
          <Text style={styles.metricValue}>{emotionalMetrics.overallWellbeing}</Text>
          <Text style={styles.metricLabel}>Overall Score</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="psychology" size={24} color={Colors.spirit} />
          <Text style={styles.metricValue}>{emotionalMetrics.emotionalIntelligence}</Text>
          <Text style={styles.metricLabel}>EQ Score</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="trending-down" size={24} color={Colors.success} />
          <Text style={styles.metricValue}>{emotionalMetrics.stressLevel}%</Text>
          <Text style={styles.metricLabel}>Stress Level</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="star" size={24} color={Colors.warning} />
          <Text style={styles.metricValue}>{emotionalMetrics.gratitudeStreak}</Text>
          <Text style={styles.metricLabel}>Gratitude Days</Text>
        </View>
      </View>
    </View>
  );

  const renderMoodJournal = () => (
    <View style={styles.journalContainer}>
      <View style={styles.journalHeader}>
        <Text style={styles.sectionTitle}>Mood Journal</Text>
        <TouchableOpacity style={styles.addMoodButton} onPress={openMoodModal}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addMoodText}>Log Mood</Text>
        </TouchableOpacity>
      </View>

      {moodEntries.length === 0 ? (
        <View style={styles.emptyJournal}>
          <Ionicons name="journal" size={48} color={Colors.textSecondary} />
          <Text style={styles.emptyJournalText}>Start your emotional journey</Text>
          <Text style={styles.emptyJournalSubtext}>Log your first mood entry to track your heart's wellness</Text>
        </View>
      ) : (
        moodEntries.slice(0, 5).map(entry => (
          <View key={entry.id} style={styles.moodEntryCard}>
            <View style={styles.moodEntryHeader}>
              <View style={styles.moodInfo}>
                <Text style={styles.moodValue}>
                  {entry.mood === 'excellent' ? '😊 Excellent' :
                   entry.mood === 'good' ? '🙂 Good' :
                   entry.mood === 'okay' ? '😐 Okay' :
                   entry.mood === 'low' ? '😔 Low' : '😰 Difficult'}
                </Text>
                <Text style={styles.moodDate}>
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.moodMetrics}>
                <Text style={styles.moodMetric}>Energy: {entry.energy}/10</Text>
                <Text style={styles.moodMetric}>Stress: {entry.stress}/10</Text>
              </View>
            </View>
            
            {entry.reflection && (
              <Text style={styles.moodReflection} numberOfLines={2}>
                {entry.reflection}
              </Text>
            )}
            
            {entry.gratitude.length > 0 && (
              <View style={styles.gratitudeSection}>
                <Text style={styles.gratitudeTitle}>Grateful for:</Text>
                <Text style={styles.gratitudeList}>
                  {entry.gratitude.slice(0, 2).join(', ')}
                  {entry.gratitude.length > 2 && ` +${entry.gratitude.length - 2} more`}
                </Text>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderPlaceholderTab = (title: string, description: string) => (
    <View style={styles.placeholderContainer}>
      <Ionicons name="heart" size={64} color={Colors.textSecondary} />
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderDescription}>{description}</Text>
      <Text style={styles.placeholderNote}>Coming soon in next update!</Text>
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'journal':
        return (
          <>
            {renderEmotionalMetrics()}
            {renderMoodJournal()}
          </>
        );
      case 'assessment':
        return renderPlaceholderTab(
          'Emotional Intelligence Assessment',
          'Discover your emotional strengths and growth areas with comprehensive EQ testing.'
        );
      case 'relationships':
        return renderPlaceholderTab(
          'Relationship Wisdom',
          'Learn ancient practices for building deeper, more meaningful connections with others.'
        );
      case 'practices':
        return renderPlaceholderTab(
          'Heart-Opening Practices',
          'Traditional meditation and compassion exercises to open and nourish your heart.'
        );
      default:
        return renderMoodJournal();
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {renderHeader()}
          {renderTabBar()}
          <ScrollView 
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
          >
            {renderTabContent()}
          </ScrollView>
        </Animated.View>

        {/* CORRECTED MOOD ENTRY MODAL */}
        <Modal
          visible={showMoodModal}
          animationType="slide"
          onRequestClose={() => setShowMoodModal(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowMoodModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>How are you feeling?</Text>
              <TouchableOpacity onPress={saveMoodEntry}>
                <Text style={styles.modalSave}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Mood Selection */}
              <Text style={styles.modalSectionTitle}>Current Mood</Text>
              <View style={styles.moodOptions}>
                {(['excellent', 'good', 'okay', 'low', 'difficult'] as const).map(mood => (
                  <TouchableOpacity
                    key={mood}
                    style={[
                      styles.moodOption,
                      currentMoodEntry.mood === mood && styles.moodOptionSelected
                    ]}
                    onPress={() => setCurrentMoodEntry(prev => ({ ...prev, mood }))}
                  >
                    <Text style={styles.moodEmoji}>
                      {mood === 'excellent' ? '😊' :
                       mood === 'good' ? '🙂' :
                       mood === 'okay' ? '😐' :
                       mood === 'low' ? '😔' : '😰'}
                    </Text>
                    <Text style={styles.moodLabel}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* CORRECTED Energy Slider */}
              <Text style={styles.modalSectionTitle}>Energy Level: {currentMoodEntry.energy || 5}/10</Text>
              <View style={styles.sliderContainer}>
                <TouchableOpacity 
                  style={styles.slider}
                  onPress={(e) => {
                    const x = e.nativeEvent.locationX;
                    const width = 300; // Approximate slider width
                    const value = Math.round((x / width) * 10) + 1;
                    setCurrentMoodEntry(prev => ({ ...prev, energy: Math.max(1, Math.min(10, value)) }));
                  }}
                >
                  <View style={[styles.sliderFill, { width: `${((currentMoodEntry.energy || 5) / 10) * 100}%` }]} />
                </TouchableOpacity>
              </View>

              {/* CORRECTED Stress Slider */}
              <Text style={styles.modalSectionTitle}>Stress Level: {currentMoodEntry.stress || 5}/10</Text>
              <View style={styles.sliderContainer}>
                <TouchableOpacity 
                  style={styles.slider}
                  onPress={(e) => {
                    const x = e.nativeEvent.locationX;
                    const width = 300;
                    const value = Math.round((x / width) * 10) + 1;
                    setCurrentMoodEntry(prev => ({ ...prev, stress: Math.max(1, Math.min(10, value)) }));
                  }}
                >
                  <View style={[styles.sliderFill, { width: `${((currentMoodEntry.stress || 5) / 10) * 100}%`, backgroundColor: Colors.warning }]} />
                </TouchableOpacity>
              </View>

              {/* Reflection */}
              <Text style={styles.modalSectionTitle}>Reflection</Text>
              <TextInput
                style={styles.reflectionInput}
                placeholder="What's on your mind and heart today?"
                multiline
                numberOfLines={4}
                value={currentMoodEntry.reflection}
                onChangeText={(reflection) => setCurrentMoodEntry(prev => ({ ...prev, reflection }))}
              />

              {/* Gratitude */}
              <Text style={styles.modalSectionTitle}>Gratitude (Optional)</Text>
              <TextInput
                style={styles.gratitudeInput}
                placeholder="What are you grateful for today? (comma separated)"
                value={(currentMoodEntry.gratitude || []).join(', ')}
                onChangeText={(text) => setCurrentMoodEntry(prev => ({ 
                  ...prev, 
                  gratitude: text.split(',').map(item => item.trim()).filter(Boolean)
                }))}
              />
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

// Styles
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
  headerHeart: {
    padding: 8,
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
    backgroundColor: Colors.heartLight,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: Colors.heart,
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

  // Emotional Metrics
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

  // Mood Journal
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
  addMoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.heart,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addMoodText: {
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
  moodEntryCard: {
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
  moodEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  moodInfo: {
    flex: 1,
  },
  moodValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  moodDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  moodMetrics: {
    alignItems: 'flex-end',
  },
  moodMetric: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  moodReflection: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  gratitudeSection: {
    backgroundColor: Colors.heartLight,
    padding: 8,
    borderRadius: 8,
  },
  gratitudeTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.heart,
    marginBottom: 4,
  },
  gratitudeList: {
    fontSize: 12,
    color: Colors.text,
  },

  // Placeholder
  placeholderContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 40,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  placeholderNote: {
    fontSize: 12,
    color: Colors.heart,
    fontStyle: 'italic',
    textAlign: 'center',
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
    color: Colors.heart,
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

  // Mood Selection
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    flex: 1,
    marginHorizontal: 4,
  },
  moodOptionSelected: {
    borderColor: Colors.heart,
    backgroundColor: Colors.heartLight,
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

  // Sliders - CORRECTED
  sliderContainer: {
    marginBottom: 20,
  },
  slider: {
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    justifyContent: 'center',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.heart,
    borderRadius: 20,
  },

  // Text Inputs
  reflectionInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    textAlignVertical: 'top',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  gratitudeInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});

export default HeartScreen;
