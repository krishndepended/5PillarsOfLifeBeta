// src/components/SeasonalGuidanceCard.tsx - AYURVEDIC SEASONAL WISDOM
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Modal,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CulturalContentManager, { AyurvedicGuidance } from '../utils/CulturalContentManager';
import { PremiumAnimations, HapticFeedback } from '../utils/AnimationUtils';

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  diet: '#10B981',
  spirit: '#8B5CF6',
};

const SeasonalGuidanceCard: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [guidance, setGuidance] = useState<AyurvedicGuidance | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const culturalManager = CulturalContentManager.getInstance();

  useEffect(() => {
    const seasonalGuidance = culturalManager.getCurrentSeasonalGuidance();
    setGuidance(seasonalGuidance);

    PremiumAnimations.createFadeAnimation(fadeAnim, 1, 800).start();
  }, []);

  const handlePress = () => {
    HapticFeedback.light();
    
    Animated.sequence([
      PremiumAnimations.createScaleAnimation(scaleAnim, 0.95, 100),
      PremiumAnimations.createScaleAnimation(scaleAnim, 1, 100)
    ]).start(() => {
      setShowDetailModal(true);
    });
  };

  const handleCloseModal = () => {
    HapticFeedback.light();
    setShowDetailModal(false);
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'spring': return Colors.success;
      case 'summer': return Colors.warning;
      case 'monsoon': return Colors.accent;
      case 'autumn': return '#D97706';
      case 'winter': return Colors.spirit;
      default: return Colors.accent;
    }
  };

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'spring': return 'leaf';
      case 'summer': return 'sunny';
      case 'monsoon': return 'rainy';
      case 'autumn': return 'leaf-outline';
      case 'winter': return 'snow';
      default: return 'partly-sunny';
    }
  };

  const renderDetailModal = () => {
    if (!guidance) return null;

    return (
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={[getSeasonColor(guidance.season), `${getSeasonColor(guidance.season)}CC`]}
              style={styles.modalHeader}
            >
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Ayurvedic Seasonal Guidance</Text>
              <View style={styles.seasonBadge}>
                <Ionicons name={getSeasonIcon(guidance.season) as any} size={16} color="#FFFFFF" />
                <Text style={styles.seasonBadgeText}>{guidance.season.toUpperCase()}</Text>
              </View>
            </LinearGradient>

            <ScrollView style={styles.modalContent} contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.explanationSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="book" size={20} color={Colors.spirit} />
                  <Text style={styles.sectionTitle}>Ayurvedic Wisdom</Text>
                </View>
                <Text style={styles.explanationText}>{guidance.explanation}</Text>
                <Text style={styles.timePeriod}>Active Period: {guidance.timePeriod}</Text>
              </View>

              <View style={styles.recommendationsSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="restaurant" size={20} color={Colors.diet} />
                  <Text style={styles.sectionTitle}>Dietary Recommendations</Text>
                </View>
                <View style={styles.recommendationsList}>
                  {guidance.recommendations.diet.map((item, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                      <Text style={styles.recommendationText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.recommendationsSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="home" size={20} color={Colors.warning} />
                  <Text style={styles.sectionTitle}>Lifestyle Practices</Text>
                </View>
                <View style={styles.recommendationsList}>
                  {guidance.recommendations.lifestyle.map((item, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Ionicons name="star" size={16} color={Colors.warning} />
                      <Text style={styles.recommendationText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.recommendationsSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="leaf" size={20} color={Colors.spirit} />
                  <Text style={styles.sectionTitle}>Sacred Practices</Text>
                </View>
                <View style={styles.recommendationsList}>
                  {guidance.recommendations.practices.map((item, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Ionicons name="flower" size={16} color={Colors.spirit} />
                      <Text style={styles.recommendationText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.avoidSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="close-circle" size={20} color="#EF4444" />
                  <Text style={styles.sectionTitle}>What to Avoid</Text>
                </View>
                <View style={styles.avoidList}>
                  {guidance.recommendations.avoid.map((item, index) => (
                    <View key={index} style={styles.avoidItem}>
                      <Ionicons name="remove-circle" size={16} color="#EF4444" />
                      <Text style={styles.avoidText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  if (!guidance) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="partly-sunny" size={24} color={Colors.warning} />
        <Text style={styles.loadingText}>Loading seasonal guidance...</Text>
      </View>
    );
  }

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <TouchableOpacity style={styles.card} onPress={handlePress}>
          <LinearGradient
            colors={[getSeasonColor(guidance.season), `${getSeasonColor(guidance.season)}CC`]}
            style={styles.gradient}
          >
            <View style={styles.header}>
              <Ionicons name={getSeasonIcon(guidance.season) as any} size={24} color="rgba(255,255,255,0.9)" />
              <Text style={styles.headerTitle}>Seasonal Ayurveda</Text>
              <View style={styles.doshaBadge}>
                <Text style={styles.doshaText}>{guidance.dosha.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.content}>
              <Text style={styles.title}>{guidance.title}</Text>
              <Text style={styles.timePeriod}>{guidance.timePeriod}</Text>
              <Text style={styles.explanation} numberOfLines={2}>
                {guidance.explanation}
              </Text>
              
              <View style={styles.footer}>
                <View style={styles.recommendationCount}>
                  <Ionicons name="restaurant" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.countText}>{guidance.recommendations.diet.length} diet tips</Text>
                </View>
                <Text style={styles.tapHint}>Tap for full guidance</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      {renderDetailModal()}
    </>
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
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  card: {
    borderRadius: 16,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 8,
  },
  doshaBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  doshaText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  timePeriod: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 12,
  },
  explanation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  recommendationCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  tapHint: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    padding: 4,
    marginRight: 12,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seasonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  seasonBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
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
  explanationSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: `${Colors.spirit}10`,
    borderRadius: 12,
  },
  explanationText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 8,
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  recommendationsList: {
    gap: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  avoidSection: {
    marginBottom: 24,
  },
  avoidList: {
    gap: 8,
  },
  avoidItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avoidText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
});

export default SeasonalGuidanceCard;
