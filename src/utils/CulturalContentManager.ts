// src/utils/CulturalContentManager.ts - AUTHENTIC INDIAN WISDOM DATABASE
import { safeGet } from './SafeNavigation';

export interface SanskritWisdom {
  id: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  meaning: string;
  modernApplication: string;
  source: string;
  pillar: string;
  mood: 'morning' | 'afternoon' | 'evening' | 'any';
}

export interface IndianRecipe {
  id: string;
  name: string;
  region: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ayurvedicProperties: {
    dosha: 'vata' | 'pitta' | 'kapha' | 'tridoshic';
    season: string[];
    benefits: string[];
  };
  ingredients: {
    name: string;
    quantity: string;
    ayurvedicProperty: string;
  }[];
  instructions: string[];
  culturalSignificance: string;
  nutritionalBenefits: string[];
  prepTime: number;
  cookTime: number;
  serves: number;
}

export interface CulturalPractice {
  id: string;
  name: string;
  sanskrit: string;
  description: string;
  instructions: string[];
  benefits: string[];
  bestTime: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pillar: string;
  culturalContext: string;
  modernRelevance: string;
}

export interface AyurvedicGuidance {
  id: string;
  title: string;
  season: 'spring' | 'summer' | 'monsoon' | 'autumn' | 'winter';
  dosha: 'vata' | 'pitta' | 'kapha';
  recommendations: {
    diet: string[];
    lifestyle: string[];
    practices: string[];
    avoid: string[];
  };
  explanation: string;
  timePeriod: string;
}

export interface CulturalStory {
  id: string;
  title: string;
  category: 'mythology' | 'philosophy' | 'history' | 'wisdom';
  story: string;
  moralLesson: string;
  practicalApplication: string;
  relatedPillar: string;
  characters: string[];
  readingTime: number;
}

class CulturalContentManager {
  private static instance: CulturalContentManager;
  
  // Sanskrit Wisdom Database
  private sanskritWisdom: SanskritWisdom[] = [
    {
      id: 'bgeeta_1',
      sanskrit: 'योगः कर्मसु कौशलम्',
      transliteration: 'Yogaḥ karmasu kauśalam',
      translation: 'Yoga is skill in action',
      meaning: 'True yoga lies in performing all actions with complete awareness and skill, without attachment to results.',
      modernApplication: 'Apply mindful excellence to your work, relationships, and daily activities. Focus on the process, not just outcomes.',
      source: 'Bhagavad Gita 2.50',
      pillar: 'spirit',
      mood: 'morning'
    },
    {
      id: 'upanishad_1',
      sanskrit: 'सत्यमेव जयते',
      transliteration: 'Satyameva jayate',
      translation: 'Truth alone triumphs',
      meaning: 'Ultimate victory belongs to truth. Living authentically and honestly leads to lasting success and peace.',
      modernApplication: 'Practice radical honesty with yourself and others. Authentic living creates genuine confidence and relationships.',
      source: 'Mundaka Upanishad 3.1.6',
      pillar: 'heart',
      mood: 'any'
    },
    {
      id: 'ayurveda_1',
      sanskrit: 'शरीरं खलु धर्म साधनम्',
      transliteration: 'Śarīraṃ khalu dharma sādhanam',
      translation: 'The body is indeed the means of dharma',
      meaning: 'Your physical body is the sacred vehicle through which you fulfill your life purpose and spiritual growth.',
      modernApplication: 'Treat your body with reverence. Exercise, nutrition, and self-care are spiritual practices.',
      source: 'Ayurvedic Texts',
      pillar: 'body',
      mood: 'morning'
    },
    {
      id: 'vedas_1',
      sanskrit: 'विद्या ददाति विनयं',
      transliteration: 'Vidyā dadāti vinayaṃ',
      translation: 'Knowledge gives humility',
      meaning: 'True learning makes one humble. The more we know, the more we realize how much we don\'t know.',
      modernApplication: 'Approach learning with curiosity and humility. Intelligence without wisdom leads to arrogance.',
      source: 'Vedic Literature',
      pillar: 'mind',
      mood: 'afternoon'
    },
    {
      id: 'food_wisdom_1',
      sanskrit: 'अन्नं ब्रह्म',
      transliteration: 'Annaṃ brahma',
      translation: 'Food is divine',
      meaning: 'Food contains the creative energy of the universe. Eating is a sacred act of receiving life force.',
      modernApplication: 'Practice grateful, mindful eating. Choose foods that nourish both body and consciousness.',
      source: 'Taittiriya Upanishad',
      pillar: 'diet',
      mood: 'any'
    },
    {
      id: 'evening_wisdom_1',
      sanskrit: 'शान्तिः शान्तिः शान्तिः',
      transliteration: 'Śāntiḥ śāntiḥ śāntiḥ',
      translation: 'Peace, peace, peace',
      meaning: 'Triple invocation of peace - for body, mind, and spirit. Complete tranquility in all dimensions of being.',
      modernApplication: 'End your day by cultivating peace in your physical body, mental thoughts, and spiritual awareness.',
      source: 'Upanishads',
      pillar: 'spirit',
      mood: 'evening'
    }
  ];

  // Indian Recipe Database
  private indianRecipes: IndianRecipe[] = [
    {
      id: 'dal_tadka',
      name: 'Dal Tadka (Spiced Lentils)',
      region: 'North India',
      category: 'lunch',
      ayurvedicProperties: {
        dosha: 'tridoshic',
        season: ['all'],
        benefits: ['Grounding', 'Protein-rich', 'Easy to digest', 'Balancing']
      },
      ingredients: [
        { name: 'Moong dal (split yellow lentils)', quantity: '1 cup', ayurvedicProperty: 'Easy to digest, cooling' },
        { name: 'Turmeric powder', quantity: '1/2 tsp', ayurvedicProperty: 'Anti-inflammatory, purifying' },
        { name: 'Cumin seeds', quantity: '1 tsp', ayurvedicProperty: 'Digestive, warming' },
        { name: 'Mustard seeds', quantity: '1/2 tsp', ayurvedicProperty: 'Stimulating, warming' },
        { name: 'Asafoetida (hing)', quantity: 'pinch', ayurvedicProperty: 'Digestive, anti-flatulent' },
        { name: 'Fresh ginger', quantity: '1 inch piece', ayurvedicProperty: 'Digestive fire, warming' },
        { name: 'Green chilies', quantity: '2', ayurvedicProperty: 'Stimulating metabolism' },
        { name: 'Ghee', quantity: '2 tbsp', ayurvedicProperty: 'Nourishing, lubricating' },
        { name: 'Fresh cilantro', quantity: '1/4 cup', ayurvedicProperty: 'Cooling, detoxifying' }
      ],
      instructions: [
        'Wash and soak moong dal for 30 minutes',
        'Boil dal with turmeric, ginger, and 3 cups water until soft (15-20 minutes)',
        'In a pan, heat ghee and add cumin and mustard seeds',
        'When seeds splutter, add asafoetida and green chilies',
        'Pour this tadka (tempering) over the cooked dal',
        'Simmer for 5 minutes, garnish with cilantro',
        'Serve hot with rice or roti'
      ],
      culturalSignificance: 'Dal is considered the soul of Indian cuisine. This simple dish represents the philosophy of finding richness in simplicity and nourishment in humble ingredients.',
      nutritionalBenefits: [
        'High protein content for muscle building',
        'Rich in fiber for digestive health',
        'Low glycemic index for stable blood sugar',
        'Contains folate and iron',
        'Easily digestible plant protein'
      ],
      prepTime: 15,
      cookTime: 25,
      serves: 4
    },
    {
      id: 'khichdi_ayurvedic',
      name: 'Ayurvedic Khichdi',
      region: 'All India',
      category: 'lunch',
      ayurvedicProperties: {
        dosha: 'tridoshic',
        season: ['monsoon', 'winter', 'recovery'],
        benefits: ['Deeply nourishing', 'Easy digestion', 'Detoxifying', 'Grounding']
      },
      ingredients: [
        { name: 'Basmati rice', quantity: '1/2 cup', ayurvedicProperty: 'Sweet, cooling, grounding' },
        { name: 'Moong dal', quantity: '1/2 cup', ayurvedicProperty: 'Easy to digest, protein-rich' },
        { name: 'Ghee', quantity: '2 tbsp', ayurvedicProperty: 'Ojas-building, lubricating' },
        { name: 'Cumin seeds', quantity: '1 tsp', ayurvedicProperty: 'Digestive fire enhancer' },
        { name: 'Fresh ginger', quantity: '1 inch', ayurvedicProperty: 'Warming, anti-nausea' },
        { name: 'Turmeric', quantity: '1/2 tsp', ayurvedicProperty: 'Anti-inflammatory, purifying' },
        { name: 'Rock salt', quantity: 'to taste', ayurvedicProperty: 'Grounding, mineral-rich' },
        { name: 'Seasonal vegetables', quantity: '1 cup chopped', ayurvedicProperty: 'Varies by vegetable' }
      ],
      instructions: [
        'Wash rice and dal together until water runs clear',
        'Heat ghee in pressure cooker, add cumin seeds',
        'Add ginger, turmeric, then rice and dal',
        'Add 4-5 cups water, salt, and seasonal vegetables',
        'Pressure cook for 3-4 whistles',
        'Let pressure release naturally',
        'Serve hot with a dollop of ghee'
      ],
      culturalSignificance: 'Khichdi is considered the ultimate comfort food in Ayurveda. It\'s often the first solid food given to babies and the go-to meal during illness, representing nurturing care and healing.',
      nutritionalBenefits: [
        'Complete protein from rice-lentil combination',
        'Easy on digestive system',
        'Rich in B-vitamins and minerals',
        'Helps reset digestive fire',
        'Balances all three doshas'
      ],
      prepTime: 10,
      cookTime: 20,
      serves: 3
    },
    {
      id: 'coconut_chutney',
      name: 'Fresh Coconut Chutney',
      region: 'South India',
      category: 'snack',
      ayurvedicProperties: {
        dosha: 'pitta',
        season: ['summer', 'spring'],
        benefits: ['Cooling', 'Hydrating', 'Probiotic when fermented', 'Soothing']
      },
      ingredients: [
        { name: 'Fresh coconut', quantity: '1 cup grated', ayurvedicProperty: 'Cooling, nourishing, sweet' },
        { name: 'Green chilies', quantity: '2-3', ayurvedicProperty: 'Digestive, warming' },
        { name: 'Fresh ginger', quantity: '1/2 inch', ayurvedicProperty: 'Digestive, warming' },
        { name: 'Roasted chana dal', quantity: '1 tbsp', ayurvedicProperty: 'Grounding, protein' },
        { name: 'Curry leaves', quantity: '8-10', ayurvedicProperty: 'Digestive, aromatic' },
        { name: 'Mustard seeds', quantity: '1/2 tsp', ayurvedicProperty: 'Warming, stimulating' },
        { name: 'Coconut oil', quantity: '1 tsp', ayurvedicProperty: 'Cooling, antimicrobial' }
      ],
      instructions: [
        'Blend coconut, green chilies, ginger, and chana dal with little water',
        'Make smooth paste, add salt to taste',
        'Heat coconut oil in small pan',
        'Add mustard seeds, when they splutter, add curry leaves',
        'Pour tempering over chutney',
        'Serve fresh with dosa, idli, or vegetables'
      ],
      culturalSignificance: 'Coconut chutney represents the coastal wisdom of using every part of the coconut tree. It\'s a daily staple that provides cooling energy in tropical climates.',
      nutritionalBenefits: [
        'Medium-chain fatty acids for quick energy',
        'Natural electrolytes for hydration',
        'Antimicrobial properties',
        'Rich in fiber and minerals',
        'Cooling effect on body'
      ],
      prepTime: 10,
      cookTime: 5,
      serves: 4
    }
  ];

  // Cultural Practices Database
  private culturalPractices: CulturalPractice[] = [
    {
      id: 'surya_namaskara',
      name: 'Surya Namaskara (Sun Salutation)',
      sanskrit: 'सूर्य नमस्कार',
      description: 'A flowing sequence of 12 yoga postures performed to honor the sun, the source of all energy and life.',
      instructions: [
        'Stand in Pranamasana (Prayer pose) facing east',
        'Hasta Uttanasana (Upward salute) - raise arms overhead',
        'Uttanasana (Standing forward bend) - fold forward',
        'Ashwa Sanchalanasana (Low lunge) - step back right leg',
        'Dandasana (Plank pose) - step back left leg',
        'Ashtanga Namaskara (Eight-point salutation) - lower down',
        'Bhujangasana (Cobra pose) - lift chest',
        'Adho Mukha Svanasana (Downward dog) - lift hips',
        'Ashwa Sanchalanasana (Low lunge) - step forward right leg',
        'Uttanasana (Standing forward bend) - step forward left leg',
        'Hasta Uttanasana (Upward salute) - rise with arms overhead',
        'Pranamasana (Prayer pose) - return to center'
      ],
      benefits: [
        'Energizes entire body',
        'Improves flexibility and strength',
        'Enhances cardiovascular health',
        'Balances nervous system',
        'Connects with natural rhythms',
        'Develops discipline and focus'
      ],
      bestTime: 'Early morning, facing east',
      duration: 10,
      difficulty: 'beginner',
      pillar: 'body',
      culturalContext: 'Ancient Vedic practice of honoring the sun as the visible form of divine consciousness. Performed at dawn to align with cosmic energy.',
      modernRelevance: 'Perfect morning routine combining physical exercise, breath awareness, and spiritual connection. Ideal for busy lifestyles.'
    },
    {
      id: 'pranayama_basic',
      name: 'Anuloma Viloma (Alternate Nostril Breathing)',
      sanskrit: 'अनुलोम विलोम',
      description: 'A balancing breath practice that harmonizes the left and right hemispheres of the brain and balances the nervous system.',
      instructions: [
        'Sit comfortably with spine straight',
        'Use right thumb to close right nostril',
        'Inhale slowly through left nostril for 4 counts',
        'Close left nostril with ring finger, release thumb',
        'Exhale through right nostril for 4 counts',
        'Inhale through right nostril for 4 counts',
        'Close right nostril, release left nostril',
        'Exhale through left nostril for 4 counts',
        'This completes one round - practice 5-10 rounds'
      ],
      benefits: [
        'Balances nervous system',
        'Reduces stress and anxiety',
        'Improves concentration',
        'Enhances lung capacity',
        'Harmonizes brain hemispheres',
        'Prepares mind for meditation'
      ],
      bestTime: 'Morning or evening, empty stomach',
      duration: 10,
      difficulty: 'beginner',
      pillar: 'mind',
      culturalContext: 'Classical pranayama technique from ancient yogic texts. Represents the balance of solar (Pingala) and lunar (Ida) energies.',
      modernRelevance: 'Scientifically proven to activate parasympathetic nervous system, perfect for managing modern stress and improving focus.'
    },
    {
      id: 'meditation_om',
      name: 'Om Chanting Meditation',
      sanskrit: 'ॐ ध्यान',
      description: 'Chanting the sacred syllable Om to connect with universal consciousness and achieve inner stillness.',
      instructions: [
        'Sit in comfortable meditation posture',
        'Close eyes and take few deep breaths',
        'Inhale deeply, prepare to chant',
        'Chant "A-U-M" slowly, feeling vibrations',
        '"A" resonates in abdomen (4 counts)',
        '"U" resonates in chest (4 counts)',
        '"M" resonates in head (4 counts)',
        'Follow with silence (4 counts)',
        'Repeat for 108 times or 10-20 minutes',
        'End with few moments of silence'
      ],
      benefits: [
        'Calms mind and emotions',
        'Reduces stress and anxiety',
        'Improves concentration',
        'Connects with higher consciousness',
        'Balances energy centers (chakras)',
        'Enhances spiritual awareness'
      ],
      bestTime: 'Early morning or evening',
      duration: 15,
      difficulty: 'beginner',
      pillar: 'spirit',
      culturalContext: 'Om is considered the primordial sound of creation in Vedic tradition. It represents the cosmic vibration that underlies all existence.',
      modernRelevance: 'Sound therapy benefits proven by neuroscience. Creates coherent brain wave patterns and reduces cortisol levels.'
    }
  ];

  // Ayurvedic Seasonal Guidance
  private ayurvedicGuidance: AyurvedicGuidance[] = [
    {
      id: 'winter_guidance',
      title: 'Winter Wellness (Shishira & Sheeta Ritu)',
      season: 'winter',
      dosha: 'vata',
      recommendations: {
        diet: [
          'Warm, cooked foods like khichdi and dal',
          'Healthy fats - ghee, sesame oil, nuts',
          'Warming spices - ginger, cinnamon, black pepper',
          'Hot herbal teas - tulsi, ginger, cardamom',
          'Sweet fruits - dates, figs, cooked apples'
        ],
        lifestyle: [
          'Keep regular sleep schedule, sleep early',
          'Daily oil massage (abhyanga) with sesame oil',
          'Wear warm, natural fabrics',
          'Practice gentle, grounding yoga',
          'Spend time in sunlight when possible'
        ],
        practices: [
          'Pranayama to generate internal heat',
          'Meditation for mental stability',
          'Gentle exercise to maintain circulation',
          'Self-massage to nourish tissues',
          'Gratitude practices for emotional warmth'
        ],
        avoid: [
          'Cold drinks and ice',
          'Raw foods and salads',
          'Excessive travel and activity',
          'Late nights and irregular routines',
          'Dry, light foods without oil'
        ]
      },
      explanation: 'Winter aggravates Vata dosha due to cold, dry, and windy qualities. Focus on warmth, oil, routine, and grounding practices.',
      timePeriod: 'December to February'
    }
  ];

  // Cultural Stories Database
  private culturalStories: CulturalStory[] = [
    {
      id: 'arjuna_focus',
      title: 'Arjuna\'s Perfect Focus',
      category: 'mythology',
      story: 'During their training, Guru Dronacharya set up a wooden bird as target for archery practice. He called each prince and asked, "What do you see?" Some said, "I see the tree, the bird, its eyes." Others described the surroundings. When Arjuna\'s turn came, he said, "I see only the eye of the bird, nothing else." Only Arjuna was allowed to shoot, and his arrow pierced exactly through the bird\'s eye.',
      moralLesson: 'True success comes from single-pointed focus. When your attention is completely absorbed in your goal, external distractions disappear.',
      practicalApplication: 'In your daily practice, whether meditation, exercise, or work, train your mind to focus on one thing at a time. Quality of attention matters more than quantity of effort.',
      relatedPillar: 'mind',
      characters: ['Arjuna', 'Dronacharya', 'Pandavas'],
      readingTime: 2
    },
    {
      id: 'hanuman_strength',
      title: 'Hanuman Remembers His Power',
      category: 'mythology',
      story: 'When the search party for Sita reached the ocean, they were dismayed by its vastness. Hanuman sat quietly, having forgotten his immense powers due to a curse. Jambavan, the wise bear, reminded him: "You are the son of Vayu, you can cross any distance, you have strength beyond measure." As soon as Hanuman remembered his true nature, he grew to enormous size and leaped across the ocean.',
      moralLesson: 'We often forget our own capabilities and inner strength. Sometimes we need reminders to reconnect with our inherent power.',
      practicalApplication: 'When facing challenges, remember your past victories and inner resilience. Your potential is often greater than your current self-perception.',
      relatedPillar: 'body',
      characters: ['Hanuman', 'Jambavan', 'Vayu'],
      readingTime: 3
    }
  ];

  static getInstance(): CulturalContentManager {
    if (!CulturalContentManager.instance) {
      CulturalContentManager.instance = new CulturalContentManager();
    }
    return CulturalContentManager.instance;
  }

  // Get wisdom based on time and context
  getDailyWisdom(pillar?: string, mood?: 'morning' | 'afternoon' | 'evening'): SanskritWisdom {
    try {
      let filteredWisdom = this.sanskritWisdom;
      
      if (pillar) {
        filteredWisdom = filteredWisdom.filter(w => w.pillar === pillar || w.pillar === 'any');
      }
      
      if (mood) {
        filteredWisdom = filteredWisdom.filter(w => w.mood === mood || w.mood === 'any');
      }
      
      const randomIndex = Math.floor(Math.random() * filteredWisdom.length);
      return filteredWisdom[randomIndex] || this.sanskritWisdom[0];
    } catch (error) {
      console.error('Error getting daily wisdom:', error);
      return this.sanskritWisdom[0];
    }
  }

  // Get recipe recommendations
  getRecipeRecommendations(category?: string, dosha?: string): IndianRecipe[] {
    try {
      let filteredRecipes = this.indianRecipes;
      
      if (category) {
        filteredRecipes = filteredRecipes.filter(r => r.category === category);
      }
      
      if (dosha) {
        filteredRecipes = filteredRecipes.filter(r => 
          r.ayurvedicProperties.dosha === dosha || r.ayurvedicProperties.dosha === 'tridoshic'
        );
      }
      
      return filteredRecipes;
    } catch (error) {
      console.error('Error getting recipe recommendations:', error);
      return this.indianRecipes;
    }
  }

  // Get cultural practice by pillar
  getPracticeForPillar(pillar: string, difficulty?: string): CulturalPractice[] {
    try {
      let practices = this.culturalPractices.filter(p => p.pillar === pillar);
      
      if (difficulty) {
        practices = practices.filter(p => p.difficulty === difficulty);
      }
      
      return practices;
    } catch (error) {
      console.error('Error getting practices:', error);
      return this.culturalPractices;
    }
  }

  // Get seasonal guidance
  getCurrentSeasonalGuidance(): AyurvedicGuidance | null {
    try {
      const month = new Date().getMonth(); // 0-11
      
      if (month >= 11 || month <= 1) return this.ayurvedicGuidance.find(g => g.season === 'winter') || null;
      if (month >= 2 && month <= 4) return this.ayurvedicGuidance.find(g => g.season === 'spring') || null;
      if (month >= 5 && month <= 7) return this.ayurvedicGuidance.find(g => g.season === 'summer') || null;
      if (month >= 8 && month <= 10) return this.ayurvedicGuidance.find(g => g.season === 'autumn') || null;
      
      return null;
    } catch (error) {
      console.error('Error getting seasonal guidance:', error);
      return null;
    }
  }

  // Get inspiring story
  getInspiringStory(pillar?: string): CulturalStory {
    try {
      let stories = this.culturalStories;
      
      if (pillar) {
        const pillarStories = stories.filter(s => s.relatedPillar === pillar);
        if (pillarStories.length > 0) {
          stories = pillarStories;
        }
      }
      
      const randomIndex = Math.floor(Math.random() * stories.length);
      return stories[randomIndex];
    } catch (error) {
      console.error('Error getting story:', error);
      return this.culturalStories[0];
    }
  }

  // Get all content for a pillar
  getPillarContent(pillar: string) {
    return {
      wisdom: this.getDailyWisdom(pillar),
      practices: this.getPracticeForPillar(pillar),
      story: this.getInspiringStory(pillar),
      recipes: this.getRecipeRecommendations(undefined, undefined).filter(r => 
        r.ayurvedicProperties.benefits.some(b => b.toLowerCase().includes(pillar))
      )
    };
  }
}

export default CulturalContentManager;
