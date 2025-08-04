// src/utils/pillarConfig.ts
export interface PillarConfig {
  name: string;
  sanskrit: string;
  color: string;
  gradients: string[];
  icon: string;
  chakra: string;
  element: string;
  mantra: string;
}

export const PILLAR_CONFIGS: Record<string, PillarConfig> = {
  BODY: {
    name: 'BODY',
    sanskrit: 'काया',
    color: '#FF4444',
    gradients: ['#FF6B6B', '#FF4444', '#CC3333'],
    icon: 'barbell',
    chakra: 'MULADHARA',
    element: 'EARTH',
    mantra: 'LAM',
  },
  MIND: {
    name: 'MIND',
    sanskrit: 'मन',
    color: '#00AAFF',
    gradients: ['#4ECDC4', '#00AAFF', '#0088CC'],
    icon: 'book',
    chakra: 'AJNA',
    element: 'LIGHT',
    mantra: 'AUM',
  },
  HEART: {
    name: 'HEART',
    sanskrit: 'हृदय',
    color: '#FF6B9D',
    gradients: ['#FF8A95', '#FF6B9D', '#E91E63'],
    icon: 'heart',
    chakra: 'ANAHATA',
    element: 'AIR',
    mantra: 'YAM',
  },
  SPIRIT: {
    name: 'SPIRIT',
    sanskrit: 'आत्मा',
    color: '#AA55FF',
    gradients: ['#B794F6', '#AA55FF', '#8B5CF6'],
    icon: 'leaf',
    chakra: 'SAHASRARA',
    element: 'CONSCIOUSNESS',
    mantra: 'OM',
  },
  DIET: {
    name: 'DIET',
    sanskrit: 'आहार',
    color: '#22DD22',
    gradients: ['#4ADE80', '#22DD22', '#16A34A'],
    icon: 'restaurant',
    chakra: 'MANIPURA',
    element: 'FIRE',
    mantra: 'RAM',
  },
};

export const isNeurogenesisOptimal = (pillarName: string): boolean => {
  const hour = new Date().getHours();

  // Morning optimisation (06-11): Body, Mind, Diet
  if (hour >= 6 && hour < 11) {
    return ['BODY', 'MIND', 'DIET'].includes(pillarName);
  }

  // Evening optimisation (18-22): Heart, Spirit
  if (hour >= 18 && hour < 22) {
    return ['HEART', 'SPIRIT'].includes(pillarName);
  }

  return false;
};
