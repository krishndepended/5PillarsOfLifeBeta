interface PillarRecommendation {
  pillar: string;
  timeWindow: string;
  neurogenesisLevel: number;
  recommendations: string[];
  activities: string[];
  neuroscience: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  chakraActivation: string;
}

const pillarIntelligence = {
  getCurrentRecommendations(): PillarRecommendation[] {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 11) {
      // Morning BDNF Peak
      return [
        {
          pillar: 'MIND',
          timeWindow: 'MORNING BDNF PEAK',
          neurogenesisLevel: 95,
          recommendations: [
            'START: Complex learning tasks now - brain is 40% more receptive',
            'FOCUS: New skill acquisition and memory formation',
            'ENGAGE: Problem-solving and creative thinking',
            'AVOID: Passive consumption - use this peak wisely'
          ],
          activities: [
            'Sanskrit verse memorization',
            'Technical skill practice',
            'Strategic planning',
            'Creative writing'
          ],
          neuroscience: 'BDNF production peaks 40% higher during morning hours, creating optimal conditions for neuroplasticity, memory consolidation, and new neural pathway formation',
          urgency: 'HIGH',
          chakraActivation: 'AJNA (Third Eye) - Peak wisdom absorption time'
        },
        {
          pillar: 'BODY',
          timeWindow: 'CORTISOL ENERGY PEAK',
          neurogenesisLevel: 88,
          recommendations: [
            'UTILIZE: Natural energy surge for physical challenges',
            'FOCUS: Strength building and endurance training',
            'PRACTICE: Yoga sequences or calisthenics',
            'ALIGN: Movement with breath awareness'
          ],
          activities: [
            'Surya Namaskara sequence',
            'High-intensity interval training',
            'Strength training routine',
            'Dynamic yoga flow'
          ],
          neuroscience: 'Natural cortisol peak provides optimal energy for physical performance, muscle protein synthesis, and motor skill development',
          urgency: 'HIGH',
          chakraActivation: 'MULADHARA (Root) - Physical foundation strengthening'
        }
      ];
    } else if (hour >= 18 && hour < 22) {
      // Evening Serotonin Peak
      return [
        {
          pillar: 'HEART',
          timeWindow: 'SEROTONIN EMOTIONAL PEAK',
          neurogenesisLevel: 92,
          recommendations: [
            'PROCESS: Daily emotional experiences and relationships',
            'PRACTICE: Gratitude and loving-kindness meditation',
            'CONNECT: Deep conversations with loved ones',
            'REFLECT: On compassion and emotional growth'
          ],
          activities: [
            'Gratitude journaling practice',
            'Heart-opening meditation',
            'Family connection time',
            'Forgiveness work'
          ],
          neuroscience: 'Evening serotonin surge enhances emotional processing, empathy, and social bonding while supporting memory consolidation of emotional experiences',
          urgency: 'HIGH',
          chakraActivation: 'ANAHATA (Heart) - Peak love and compassion time'
        },
        {
          pillar: 'SPIRIT',
          timeWindow: 'TRANSCENDENCE OPTIMAL',
          neurogenesisLevel: 85,
          recommendations: [
            'EXPLORE: Meditation and contemplative practices',
            'CONNECT: With higher purpose and meaning',
            'PRACTICE: Surrender and letting go exercises',
            'ENGAGE: In spiritual study and reflection'
          ],
          activities: [
            'Evening meditation practice',
            'Spiritual text study',
            'Prayer or mantra chanting',
            'Nature connection ritual'
          ],
          neuroscience: 'Reduced cortisol and increased melatonin production creates optimal conditions for transcendent experiences and spiritual insights',
          urgency: 'HIGH',
          chakraActivation: 'SAHASRARA (Crown) - Divine connection peak'
        }
      ];
    }
    
    // Default recommendations for other times
    return this.getBalancedRecommendations(hour);
  },

  getBalancedRecommendations(hour: number): PillarRecommendation[] {
    return [
      {
        pillar: 'DIET',
        timeWindow: 'DIGESTIVE OPTIMIZATION',
        neurogenesisLevel: 70,
        recommendations: [
          'FOCUS: Mindful eating and nutritional awareness',
          'PRACTICE: Conscious meal preparation',
          'MONITOR: Energy levels and food responses',
          'HYDRATE: Maintain optimal fluid balance'
        ],
        activities: [
          'Mindful meal preparation',
          'Hydration tracking',
          'Nutritional planning',
          'Digestive breathing exercises'
        ],
        neuroscience: 'Stable insulin levels support consistent brain function and neurotransmitter production throughout the day',
        urgency: 'MEDIUM',
        chakraActivation: 'MANIPURA (Solar Plexus) - Digestive fire balance'
      }
    ];
  },

  getPillarGuidance(pillarName: string): PillarRecommendation | null {
    const recommendations = this.getCurrentRecommendations();
    return recommendations.find(rec => rec.pillar === pillarName.toUpperCase()) || null;
  }
};

export default pillarIntelligence;
