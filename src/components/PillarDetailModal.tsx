import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import pillarIntelligence from '../services/pillarIntelligence';

interface PillarDetailModalProps {
  visible: boolean;
  onClose: () => void;
  pillar: string;
  neurogenesisOptimal: boolean;
}

const PillarDetailModal: React.FC<PillarDetailModalProps> = ({ 
  visible, 
  onClose, 
  pillar, 
  neurogenesisOptimal 
}) => {
  const guidance = pillarIntelligence.getPillarGuidance(pillar);
  
  const getPillarColor = (pillarName: string): string => {
    const colors: { [key: string]: string } = {
      'BODY': '#FF4444',
      'MIND': '#00AAFF', 
      'HEART': '#FF6B9D',
      'SPIRIT': '#AA55FF',
      'DIET': '#22DD22'
    };
    return colors[pillarName.toUpperCase()] || '#00FF88';
  };

  const getPillarDescription = (pillarName: string): string => {
    const descriptions: { [key: string]: string } = {
      'BODY': 'Physical foundation for spiritual growth through movement, strength, and vitality',
      'MIND': 'Cognitive development through learning, focus, and intellectual expansion',
      'HEART': 'Emotional intelligence, compassion, relationships, and love cultivation',
      'SPIRIT': 'Divine connection, transcendence, purpose, and inner wisdom',
      'DIET': 'Sacred nourishment for optimal energy, clarity, and physical wellness'
    };
    return descriptions[pillarName.toUpperCase()] || '';
  };

  const getPillarBenefits = (pillarName: string): string[] => {
    const benefits: { [key: string]: string[] } = {
      'BODY': [
        'Enhanced physical strength and endurance',
        'Improved energy levels and vitality',
        'Better stress resilience and recovery',
        'Increased mind-body connection awareness',
        'Stronger immune system function'
      ],
      'MIND': [
        'Enhanced cognitive flexibility and learning',
        'Improved memory and information processing',
        'Greater mental clarity and focus',
        'Increased problem-solving abilities',
        'Enhanced creative thinking capacity'
      ],
      'HEART': [
        'Deeper emotional intelligence and empathy',
        'Stronger relationship bonds and connections',
        'Increased self-compassion and acceptance',
        'Enhanced ability to give and receive love',
        'Greater emotional regulation and balance'
      ],
      'SPIRIT': [
        'Deeper sense of purpose and meaning',
        'Enhanced connection to transcendent experiences',
        'Greater inner peace and equanimity',
        'Increased intuitive wisdom and guidance',
        'Stronger alignment with higher values'
      ],
      'DIET': [
        'Optimal energy levels throughout the day',
        'Enhanced cognitive function and clarity',
        'Improved digestive health and comfort',
        'Stronger immune system response',
        'Better mood stability and emotional balance'
      ]
    };
    return benefits[pillarName.toUpperCase()] || [];
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Terminal Header */}
          <View style={[styles.modalHeader, { borderTopColor: getPillarColor(pillar) }]}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#00FF88" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{pillar} INFORMATION TERMINAL</Text>
            <View style={styles.statusIndicator}>
              <View style={[
                styles.statusDot, 
                { backgroundColor: neurogenesisOptimal ? '#00FF88' : '#FFB800' }
              ]} />
            </View>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Pillar Overview */}
            <View style={styles.overviewSection}>
              <Text style={[styles.pillarName, { color: getPillarColor(pillar) }]}>
                {pillar}
              </Text>
              <Text style={styles.pillarDescription}>
                {getPillarDescription(pillar)}
              </Text>
            </View>

            {/* Current Recommendations */}
            {guidance && (
              <View style={styles.recommendationsSection}>
                <Text style={styles.sectionTitle}>CURRENT RECOMMENDATIONS</Text>
                <View style={[styles.timeWindow, { borderColor: getPillarColor(pillar) }]}>
                  <Text style={styles.timeWindowTitle}>
                    {guidance.timeWindow} • LEVEL {guidance.neurogenesisLevel}%
                  </Text>
                  <Text style={styles.urgencyBadge}>
                    PRIORITY: {guidance.urgency}
                  </Text>
                </View>
                
                {guidance.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={styles.recommendationText}>• {rec}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Neuroscience Insight */}
            {guidance && (
              <View style={styles.neuroscienceSection}>
                <Text style={styles.sectionTitle}>NEUROSCIENCE INSIGHT</Text>
                <Text style={styles.neuroscienceText}>
                  {guidance.neuroscience}
                </Text>
                <Text style={styles.chakraInfo}>
                  CHAKRA ACTIVATION: {guidance.chakraActivation}
                </Text>
              </View>
            )}

            {/* Suggested Activities */}
            {guidance && (
              <View style={styles.activitiesSection}>
                <Text style={styles.sectionTitle}>OPTIMAL ACTIVITIES NOW</Text>
                <View style={styles.activitiesGrid}>
                  {guidance.activities.map((activity, index) => (
                    <View key={index} style={styles.activityCard}>
                      <Text style={styles.activityText}>{activity}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Long-term Benefits */}
            <View style={styles.benefitsSection}>
              <Text style={styles.sectionTitle}>PILLAR DEVELOPMENT BENEFITS</Text>
              {getPillarBenefits(pillar).map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color={getPillarColor(pillar)} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            {/* Implementation Guide */}
            <View style={styles.implementationSection}>
              <Text style={styles.sectionTitle}>IMPLEMENTATION PROTOCOL</Text>
              <View style={styles.protocolSteps}>
                <View style={styles.protocolStep}>
                  <Text style={styles.stepNumber}>01</Text>
                  <Text style={styles.stepText}>
                    Review current recommendations based on neurogenesis timing
                  </Text>
                </View>
                <View style={styles.protocolStep}>
                  <Text style={styles.stepNumber}>02</Text>
                  <Text style={styles.stepText}>
                    Choose 1-2 activities that resonate with your current state
                  </Text>
                </View>
                <View style={styles.protocolStep}>
                  <Text style={styles.stepNumber}>03</Text>
                  <Text style={styles.stepText}>
                    Use focus timer to maintain dedicated attention
                  </Text>
                </View>
                <View style={styles.protocolStep}>
                  <Text style={styles.stepNumber}>04</Text>
                  <Text style={styles.stepText}>
                    Journal your experience and insights afterward
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: getPillarColor(pillar) }]}
              onPress={onClose}
            >
              <Ionicons name="play" size={20} color="#000" />
              <Text style={[styles.actionButtonText, { color: '#000' }]}>
                START {pillar} SESSION
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terminal Footer */}
          <View style={styles.modalFooter}>
            <Text style={styles.footerText}>
              {pillar} OPTIMIZATION PROTOCOL • 
              {neurogenesisOptimal ? ' PEAK NEUROGENESIS ACTIVE' : ' STANDARD MODE'}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    width: '95%',
    maxWidth: 450,
    maxHeight: '90%',
    borderWidth: 2,
    borderColor: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    borderTopWidth: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00FF88',
    fontFamily: 'monospace',
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },
  statusIndicator: {
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  overviewSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  pillarName: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 3,
    marginBottom: 8,
  },
  pillarDescription: {
    fontSize: 14,
    color: '#CCC',
    textAlign: 'center',
    lineHeight: 20,
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00FF88',
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginBottom: 12,
  },
  timeWindow: {
    borderWidth: 2,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#0A0A0A',
  },
  timeWindowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  urgencyBadge: {
    fontSize: 10,
    color: '#FFB800',
    fontFamily: 'monospace',
    fontWeight: '600',
    marginTop: 4,
  },
  recommendationItem: {
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 12,
    color: '#CCC',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  neuroscienceSection: {
    backgroundColor: '#0A0A0A',
    borderRadius: 6,
    padding: 16,
    marginBottom: 24,
  },
  neuroscienceText: {
    fontSize: 12,
    color: '#CCC',
    lineHeight: 18,
    marginBottom: 12,
  },
  chakraInfo: {
    fontSize: 10,
    color: '#AA55FF',
    fontFamily: 'monospace',
    fontWeight: '600',
    letterSpacing: 1,
  },
  activitiesSection: {
    marginBottom: 24,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityCard: {
    backgroundColor: '#333',
    borderRadius: 4,
    padding: 8,
    flex: 1,
    minWidth: '45%',
  },
  activityText: {
    fontSize: 11,
    color: '#CCC',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 12,
    color: '#CCC',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  implementationSection: {
    marginBottom: 24,
  },
  protocolSteps: {
    gap: 12,
  },
  protocolStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00FF88',
    fontFamily: 'monospace',
    width: 30,
  },
  stepText: {
    fontSize: 12,
    color: '#CCC',
    flex: 1,
    lineHeight: 16,
  },
  actionButtons: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 6,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  modalFooter: {
    backgroundColor: '#0A0A0A',
    padding: 12,
    alignItems: 'center',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  footerText: {
    fontSize: 10,
    color: '#00FF88',
    fontFamily: 'monospace',
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default PillarDetailModal;
