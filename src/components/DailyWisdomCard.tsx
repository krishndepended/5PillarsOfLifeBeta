// src/components/DailyWisdomCard.tsx - BEAUTIFUL WISDOM DISPLAY
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
import CulturalContentManager, { SanskritWisdom } from '../utils/CulturalContentManager';
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
};

interface DailyWisdomCardProps {
  pillar?: string;
  compact?: boolean;
}

const DailyWisdomCard: React.FC<DailyWisdomCardProps> = ({
  pillar,
  compact = false
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [wisdom, setWisdom] = useState<SanskritWisdom | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const culturalManager = CulturalContentManager.getInstance();

  useEffect(() => {
    // Get wisdom based on time of day
    const hour = new Date().getHours();
    let mood: 'morning' | 'afternoon' | 'evening' = 'morning';
    
    if (hour >= 12 && hour < 17) mood = 'afternoon';
    else if (hour >= 17) mood = 'evening';
    
    const dailyWisdom = culturalManager.getDailyWisdom(pillar, mood);
    setWisdom(dailyWisdom);

    // Animate in
    PremiumAnimations.createFadeAnimation(fadeAnim, 1, 800).start();
  }, [pillar]);

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

  if (!wisdom) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="book" size={24} color={Colors.spirit} />
        <Text style={styles.loadingText}>Loading wisdom...</Text>
      </View>
    );
  }

  const renderCompactCard = () => (
    <Animated.View
      style={[
        styles.compactContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <TouchableOpacity style={styles.compactCard} onPress={handlePress}>
        <LinearGradient
          colors={[Colors.spirit, '#A855F7']}
          style={styles.compactGradient}
        >
          <View style={styles.compactContent}>
            <Ionicons name="book" size={20} color="#FFFFFF" />
            <Text style={styles.compactSanskrit} numberOfLines={1}>
              {wisdom.sanskrit}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.8)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFullCard = () => (
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
          colors={[Colors.spirit, '#A855F7']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Ionicons name="book" size={24} color="rgba(255,255,255,0.9)" />
            <Text style={styles.headerTitle}>Daily Wisdom</Text>
            <View style={styles.sourceBadge}>
              <Text style={styles.sourceText}>Vedic</Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.sanskrit}>{wisdom.sanskrit}</Text>
            <Text style={styles.transliteration}>{wisdom.transliteration}</Text>
            <Text style={styles.translation}>"{wisdom.translation}"</Text>
            
            <View style={styles.footer}>
              <Text style={styles.source}>— {wisdom.source}</Text>
              <Text style={styles.tapHint}>Tap for deeper insight</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderDetailModal = () => (
    <Modal
      visible={showDetailModal}
      transparent
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={[Colors.spirit, '#A855F7']}
            style={styles.modalHeader}
          >
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Vedic Wisdom</Text>
            <View style={styles.modalPillarBadge}>
              <Text style={styles.modalPillarText}>{wisdom.pillar.toUpperCase()}</Text>
            </View>
          </LinearGradient>

          <ScrollView style={styles.modalContent} contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.wisdomSection}>
              <Text style={styles.modalSanskrit}>{wisdom.sanskrit}</Text>
              <Text style={styles.modalTransliteration}>{wisdom.transliteration}</Text>
              <Text style={styles.modalTranslation}>"{wisdom.translation}"</Text>
            </View>

            <View style={styles.meaningSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="bulb" size={20} color={Colors.spirit} />
                <Text style={styles.sectionTitle}>Deep Meaning</Text>
              </View>
              <Text style={styles.meaningText}>{wisdom.meaning}</Text>
            </View>

            <View style={styles.applicationSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="rocket" size={20} color={Colors.success} />
                <Text style={styles.sectionTitle}>Modern Application</Text>
              </View>
              <Text style={styles.applicationText}>{wisdom.modernApplication}</Text>
            </View>

            <View style={styles.sourceSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="library" size={20} color={Colors.warning} />
                <Text style={styles.sectionTitle}>Sacred Source</Text>
              </View>
              <Text style={styles.sourceText}>{wisdom.source}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      {compact ? renderCompactCard() : renderFullCard()}
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
  
  // Compact card styles
  compactContainer: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactCard: {
    borderRadius: 12,
  },
  compactGradient: {
    padding: 12,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compactSanskrit: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },

  // Full card styles
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
  sourceBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sourceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    alignItems: 'center',
  },
  sanskrit: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  transliteration: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 12,
  },
  translation: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  source: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
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
  modalPillarBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalPillarText: {
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
  wisdomSection: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: `${Colors.spirit}10`,
    borderRadius: 12,
  },
  modalSanskrit: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalTransliteration: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalTranslation: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  meaningSection: {
    marginBottom: 24,
  },
  applicationSection: {
    marginBottom: 24,
  },
  sourceSection: {
    marginBottom: 24,
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
  meaningText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  applicationText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});

export default DailyWisdomCard;
