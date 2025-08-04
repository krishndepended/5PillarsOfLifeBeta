export interface PillarTheme {
  name: string;
  sanskrit: string;
  icon: string;
  baseColor: string;
  gradients: string[];
}

export const PILLAR_THEMES: Record<string, PillarTheme> = {
  BODY: { 
    name: 'BODY', 
    sanskrit: 'काया', 
    icon: 'barbell',
    baseColor: '#FF4444', 
    gradients: ['#FF6B6B', '#FF4444', '#CC3333'] 
  },
  MIND: { 
    name: 'MIND', 
    sanskrit: 'मन', 
    icon: 'book',
    baseColor: '#00AAFF', 
    gradients: ['#4ECDC4', '#00AAFF', '#0088CC'] 
  },
  HEART: { 
    name: 'HEART', 
    sanskrit: 'हृदय', 
    icon: 'heart',
    baseColor: '#FF6B9D', 
    gradients: ['#FF8A95', '#FF6B9D', '#E91E63'] 
  },
  SPIRIT: { 
    name: 'SPIRIT', 
    sanskrit: 'आत्मा', 
    icon: 'leaf',
    baseColor: '#AA55FF', 
    gradients: ['#B794F6', '#AA55FF', '#8B5CF6'] 
  },
  DIET: { 
    name: 'DIET', 
    sanskrit: 'आहार', 
    icon: 'restaurant',
    baseColor: '#22DD22', 
    gradients: ['#4ADE80', '#22DD22', '#16A34A'] 
  },
};

export const isNeurogenesisOptimal = (pillarName: string): boolean => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) {
    return ['MIND', 'BODY', 'DIET'].includes(pillarName);
  } else if (hour >= 18 && hour < 22) {
    return ['HEART', 'SPIRIT'].includes(pillarName);
  }
  return false;
};
