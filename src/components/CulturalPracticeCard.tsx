// src/components/CulturalPracticeCard.tsx - TRADITIONAL PRACTICE DISPLAY
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Modal,
  ScrollView,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CulturalContentManager, { CulturalPractice } from '../utils/CulturalContentManager';
import { PremiumAnimations, HapticFeedback } from '../utils/AnimationUtils';

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  spirit: '#8B5CF6',
  body: '#EF4444',
  mind: '#3B82F6',
  heart: '#EC4899',
};

interface CulturalPracticeCardProps {
  pillar?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  onPracticeComplete?: (practiceId: string) => void;
}

const CulturalPracticeCard: React.FC<CulturalPracticeCardProps> = ({
  pillar,
  difficulty = 'beginner',
  onPracticeComplete
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [practices, setPractices] = useState<CulturalPractice[]>([]);
  const [selectedPractice, setSelectedPractice] = useState<CulturalPractice | null>(null);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const culturalManager = CulturalContentManager.getInstance();

  useEffect(() => {
    const practiceList = pillar 
      ? culturalManager.getPracticeForPillar(pillar, difficulty)
      : culturalManager.getPracticeForPillar('spirit', difficulty); // Default to spirit practices
    
    setPractices(practiceList);
    PremiumAnimations.createFadeAnimation(fadeAnim, 1, 800).start();
  }, [pillar, difficulty]);

  const handlePracticePress = (practice: CulturalPractice) => {
    HapticFeedback.medium();
    setSelectedPractice(practice);
    setCurrentStep(0);
    setPracticeStarted(false);
    setShowPracticeModal(true);
  };

  const handleStartPractice = () => {
    HapticFeedback.success();
    setPracticeStarted(true);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (selectedPractice && currentStep < selectedPractice.instructions.length - 1) {
      HapticFeedback.light();
      setCurrentStep(currentStep + 1);
    } else {
      handleCompletePractice();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      HapticFeedback.light();
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompletePractice = () => {
    if (selectedPractice) {
      HapticFeedback.success();
      
      // Award achievement
      if (onPracticeComplete) {
        onPracticeComplete(selectedPractice.id);
      }
      
      // Close modal with celebration
      setTimeout(() => {
        setShowPracticeModal(false);
        setSelectedPractice(null);
        setPracticeStarted(false);
        setCurrentStep(0);
      }, 1500);
    }
  };

  const handleCloseModal = () => {
    HapticFeedback.light();
    setShowPracticeModal(false);
    setSelectedPractice(null);
    setPracticeStarted(false);
    setCurrentStep(0);
  };

  const getPillarColor = (practiceType: string) => {
    switch (practiceType) {
      case 'body': return Colors.body;
      case 'mind': return Colors.mind;
      case 'heart': return Colors.heart;
      case 'spirit': return Colors.spirit;
      default: return Colors.accent;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return Colors.success;
      case 'intermediate': return Colors.warning;
      case 'advanced': return Colors.body;
      default: return Colors.success;
    }
  };

  const renderPracticeItem = ({ item, index }: { item: CulturalPractice; index: number }) => (
    <Animated.View
      style={[
        styles.practiceItem,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30 * (index + 1), 0],
            })
          }]
        }
      ]}
    >
      <TouchableOpacity
        style={styles.practiceCard}
        onPress={() => handlePracticePress(item)}
        onPressIn={() => HapticFeedback.light()}
      >
        <LinearGradient
          colors={[getPillarColor(item.pillar), `${getPillarColor(item.pillar)}CC`]}
          style={styles.practiceGradient}
        >
          <View style={styles.practiceHeader}>
            <View style={styles.practiceIcon}>
              <Ionicons 
                name={item.pillar === 'body' ? 'fitness' : 
                     item.pillar === 'mind' ? 'library' :
                     item.pillar === 'heart' ? 'heart' : 'leaf'} 
                size={24} 
                color="#FFFFFF" 
              />
            </View>
            <View style={styles.practiceInfo}>
              <Text style={styles.practiceName}>{item.name}</Text>
              <Text style={styles.practiceSanskrit}>{item.sanskrit}</Text>
            </View>
            <View style={styles.difficultyBadge}>
              <View style={[styles.difficultyIndicator, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                <Text style={styles.difficultyText}>{item.difficulty.charAt(0).toUpperCase()}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.practiceDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.practiceFooter}>
            <View style={styles.timeInfo}>
              <Ionicons name="time" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.timeText}>{item.duration} min</Text>
            </View>
            <View style={styles.benefitsInfo}>
              <Ionicons name="checkmark-circle" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.benefitsText}>{item.benefits.length} benefits</Text>
            </View>
            <View style={styles.bestTimeInfo}>
              <Ionicons name="sunny" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.bestTimeText}>{item.bestTime.split(',')[0]}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderPracticeModal = () => {
    if (!selectedPractice) return null;

    return (
      <Modal
        visible={showPracticeModal}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={[getPillarColor(selectedPractice.pillar), `${getPillarColor(selectedPractice.pillar)}CC`]}
            style={styles.modalHeader}
          >
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.modalHeaderInfo}>
              <Text style={styles.modalPracticeName}>{selectedPractice.name}</Text>
              <Text style={styles.modalPracticeSanskrit}>{selectedPractice.sanskrit}</Text>
            </View>
            <View style={styles.modalDifficultyBadge}>
              <Text style={styles.modalDifficultyText}>{selectedPractice.difficulty.toUpperCase()}</Text>
            </View>
          </LinearGradient>

          <ScrollView style={styles.modalContent} contentContainerStyle={styles.modalScrollContent}>
            {!practiceStarted ? (
              // Practice Overview
              <>
                <View style={styles.overviewSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="information-circle" size={20} color={Colors.accent} />
                    <Text style={styles.sectionTitle}>Sacred Practice Overview</Text>
                  </View>
                  <Text style={styles.overviewText}>{selectedPractice.description}</Text>
                </View>

                <View style={styles.culturalContextSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="book" size={20} color={Colors.spirit} />
                    <Text style={styles.sectionTitle}>Cultural Context</Text>
                  </View>
                  <Text style={styles.contextText}>{selectedPractice.culturalContext}</Text>
                </View>

                <View style={styles.modernRelevanceSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="rocket" size={20} color={Colors.success} />
                    <Text style={styles.sectionTitle}>Modern Relevance</Text>
                  </View>
                  <Text style={styles.relevanceText}>{selectedPractice.modernRelevance}</Text>
                </View>

                <View style={styles.benefitsSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="star" size={20} color={Colors.warning} />
                    <Text style={styles.sectionTitle}>Benefits</Text>
                  </View>
                  <View style={styles.benefitsList}>
                    {selectedPractice.benefits.map((benefit, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                        <Text style={styles.benefitText}>{benefit}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.practiceInfoSection}>
                  <View style={styles.infoRow}>
                    <Ionicons name="time" size={20} color={Colors.accent} />
                    <Text style={styles.infoText}>Duration: {selectedPractice.duration} minutes</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="sunny" size={20} color={Colors.warning} />
                    <Text style={styles.infoText}>Best Time: {selectedPractice.bestTime}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="trophy" size={20} color={getPillarColor(selectedPractice.pillar)} />
                    <Text style={styles.infoText}>Pillar: {selectedPractice.pillar.toUpperCase()}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.startButton} onPress={handleStartPractice}>
                  <LinearGradient
                    colors={[getPillarColor(selectedPractice.pillar), `${getPillarColor(selectedPractice.pillar)}CC`]}
                    style={styles.startButtonGradient}
                  >
                    <Ionicons name="play-circle" size={24} color="#FFFFFF" />
                    <Text style={styles.startButtonText}>Begin Sacred Practice</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              // Practice Steps
              <>
                <View style={styles.progressSection}>
                  <Text style={styles.progressText}>Step {currentStep + 1} of {selectedPractice.instructions.length}</Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${((currentStep + 1) / selectedPractice.instructions.length) * 100}%`,
                          backgroundColor: getPillarColor(selectedPractice.pillar)
                        }
                      ]} 
                    />
                  </View>
                </View>

                <View style={styles.currentStepSection}>
                  <View style={styles.stepHeader}>
                    <View style={[styles.stepNumber, { backgroundColor: getPillarColor(selectedPractice.pillar) }]}>
                      <Text style={styles.stepNumberText}>{currentStep + 1}</Text>
                    </View>
                    <Text style={styles.stepTitle}>Practice Step</Text>
                  </View>
                  <Text style={styles.stepInstruction}>{selectedPractice.instructions[currentStep]}</Text>
                </View>

                {currentStep === selectedPractice.instructions.length - 1 && (
                  <View style={styles.completionSection}>
                    <Ionicons name="star" size={32} color={Colors.warning} />
                    <Text style={styles.completionText}>You're about to complete this sacred practice!</Text>
                  </View>
                )}

                <View style={styles.navigationButtons}>
                  {currentStep > 0 && (
                    <TouchableOpacity style={styles.prevButton} onPress={handlePrevStep}>
                      <Ionicons name="chevron-back" size={20} color={Colors.textSecondary} />
                      <Text style={styles.prevButtonText}>Previous</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={[styles.nextButton, { backgroundColor: getPillarColor(selectedPractice.pillar) }]} 
                    onPress={handleNextStep}
                  >
                    <Text style={styles.nextButtonText}>
                      {currentStep === selectedPractice.instructions.length - 1 ? 'Complete Practice' : 'Next Step'}
                    </Text>
                    <Ionicons 
                      name={currentStep === selectedPractice.instructions.length - 1 ? 'checkmark-circle' : 'chevron-forward'} 
                      size={20} 
                      color="#FFFFFF" 
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  if (practices.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="leaf" size={24} color={Colors.spirit} />
        <Text style={styles.loadingText}>Loading sacred practices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="leaf" size={24} color={getPillarColor(pillar || 'spirit')} />
        <Text style={styles.headerTitle}>Traditional Practices</Text>
        <Text style={styles.headerSubtitle}>
          {pillar ? `${pillar.charAt(0).toUpperCase() + pillar.slice(1)} Pillar` : 'Spiritual Practices'} • {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Text>
      </View>

      <FlatList
        data={practices}
        renderItem={renderPracticeItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.practiceList}
      />

      {renderPracticeModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  container: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  practiceList: {
    paddingRight: 16,
  },
  practiceItem: {
    marginRight: 16,
    width: 300,
  },
  practiceCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  practiceGradient: {
    padding: 16,
  },
  practiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  practiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  practiceInfo: {
    flex: 1,
  },
  practiceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  practiceSanskrit: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
    marginTop: 2,
  },
  difficultyBadge: {
    alignItems: 'center',
  },
  difficultyIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  practiceDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    marginBottom: 12,
  },
  practiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  benefitsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitsText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  bestTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestTimeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
  },
  closeButton: {
    padding: 4,
    marginRight: 16,
  },
  modalHeaderInfo: {
    flex: 1,
  },
  modalPracticeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalPracticeSanskrit: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
    marginTop: 4,
  },
  modalDifficultyBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalDifficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  overviewSection: {
    marginBottom: 24,
  },
  overviewText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  culturalContextSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: `${Colors.spirit}10`,
    borderRadius: 12,
  },
  contextText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  modernRelevanceSection: {
    marginBottom: 24,
  },
  relevanceText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  practiceInfoSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
    fontWeight: '500',
  },
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  
  // Practice steps styles
  progressSection: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  currentStepSection: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: Colors.background,
    borderRadius: 12,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  stepInstruction: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  completionSection: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: `${Colors.warning}10`,
    borderRadius: 12,
  },
  completionText: {
    fontSize: 16,
    color: Colors.warning,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  prevButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 4,
  },
});

export default CulturalPracticeCard;
