// src/screens/DietScreen.tsx - COMPREHENSIVE NUTRITIONAL WELLNESS & AYURVEDIC DIET
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
  Image,
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
  diet: '#10B981',
  dietLight: '#ECFDF5',
  vata: '#8B4513',
  pitta: '#FF6B35',
  kapha: '#228B22',
};

interface Recipe {
  id: string;
  name: string;
  sanskrit?: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage';
  cuisine: 'north-indian' | 'south-indian' | 'ayurvedic' | 'modern';
  prepTime: number; // minutes
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  ayurvedicProperties: {
    taste: string[]; // Sweet, Sour, Salty, Pungent, Bitter, Astringent
    energy: 'heating' | 'cooling' | 'neutral';
    effect: 'vata-balancing' | 'pitta-balancing' | 'kapha-balancing' | 'tridoshic';
    season: string[];
  };
  healthBenefits: string[];
  image?: string;
}

interface MealEntry {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItems: Array<{
    name: string;
    quantity: string;
    calories: number;
  }>;
  totalCalories: number;
  mood: 'energized' | 'satisfied' | 'heavy' | 'light' | 'bloated';
  digestion: 'excellent' | 'good' | 'okay' | 'poor';
  notes?: string;
}

interface DoshaAssessment {
  vata: number;
  pitta: number;
  kapha: number;
  dominant: 'vata' | 'pitta' | 'kapha' | 'dual' | 'tridoshic';
  recommendations: string[];
}

interface SeasonalGuidance {
  season: 'spring' | 'summer' | 'monsoon' | 'autumn' | 'winter';
  dosha: 'vata' | 'pitta' | 'kapha';
  foods: {
    favor: string[];
    avoid: string[];
  };
  spices: string[];
  cookingMethods: string[];
  generalTips: string[];
}

const DietScreen = () => {
  const navigation = useNavigation();
  const { actions } = useAppData();
  const { userProfile, pillarScores, sessions } = useAppDataSelectors();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const leafAnim = useRef(new Animated.Value(0)).current;
  
  // State
  const [selectedTab, setSelectedTab] = useState<'nutrition' | 'recipes' | 'dosha' | 'seasonal'>('nutrition');
  const [showMealModal, setShowMealModal] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<Partial<MealEntry>>({});
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  
  // Mock nutrition data
  const [nutritionMetrics] = useState({
    dailyCalories: 1847,
    targetCalories: 2000,
    protein: 78, // grams
    carbs: 220,
    fat: 65,
    fiber: 28,
    water: 6, // glasses
    targetWater: 8,
    digestiveHealth: 82,
    doshaBalance: 75,
  });

  // Mock dosha assessment
  const [doshaProfile] = useState<DoshaAssessment>({
    vata: 35,
    pitta: 45,
    kapha: 20,
    dominant: 'pitta',
    recommendations: [
      'Favor cooling foods and drinks',
      'Reduce spicy, oily, and fried foods',
      'Eat regular meals at consistent times',
      'Include sweet, bitter, and astringent tastes'
    ]
  });

  // Recent meal entries
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([
    {
      id: 'meal-1',
      date: new Date().toISOString(),
      mealType: 'breakfast',
      foodItems: [
        { name: 'Upma', quantity: '1 bowl', calories: 180 },
        { name: 'Coconut Chutney', quantity: '2 tbsp', calories: 45 },
        { name: 'Green Tea', quantity: '1 cup', calories: 2 }
      ],
      totalCalories: 227,
      mood: 'energized',
      digestion: 'excellent',
      notes: 'Traditional South Indian breakfast felt perfect'
    }
  ]);

  // Recipe library
  const recipeLibrary: Recipe[] = [
    {
      id: 'khichdi',
      name: 'Ayurvedic Khichdi',
      sanskrit: 'खिचड़ी',
      category: 'lunch',
      cuisine: 'ayurvedic',
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      difficulty: 'easy',
      description: 'Perfect tridoshic meal - easily digestible comfort food that balances all doshas',
      ingredients: [
        '1 cup basmati rice',
        '1/2 cup mung dal (split yellow)',
        '1 tsp ghee',
        '1/2 tsp cumin seeds',
        '1/4 tsp turmeric',
        '1 inch ginger, chopped',
        '2 cups water',
        'Salt to taste',
        'Fresh cilantro for garnish'
      ],
      instructions: [
        'Wash rice and dal thoroughly until water runs clear',
        'Heat ghee in pressure cooker, add cumin seeds',
        'Add ginger, turmeric, rice, and dal',
        'Add water and salt, pressure cook for 3 whistles',
        'Let pressure release naturally',
        'Garnish with cilantro and serve hot'
      ],
      nutritionalInfo: {
        calories: 245,
        protein: 8.5,
        carbs: 45,
        fat: 3,
        fiber: 4.5
      },
      ayurvedicProperties: {
        taste: ['Sweet', 'Astringent'],
        energy: 'neutral',
        effect: 'tridoshic',
        season: ['All seasons']
      },
      healthBenefits: [
        'Easy digestion',
        'Detoxifying',
        'Balances all doshas',
        'Provides sustained energy'
      ]
    },
    {
      id: 'dal-tadka',
      name: 'Dal Tadka',
      sanskrit: 'दाल तड़का',
      category: 'lunch',
      cuisine: 'north-indian',
      prepTime: 10,
      cookTime: 25,
      servings: 4,
      difficulty: 'easy',
      description: 'Protein-rich lentil curry with aromatic tempering - soul food of India',
      ingredients: [
        '1 cup toor dal (split pigeon peas)',
        '2 tbsp ghee',
        '1 tsp cumin seeds',
        '2 dried red chilies',
        '1 onion, chopped',
        '2 tomatoes, chopped',
        '1 tsp ginger-garlic paste',
        '1/2 tsp turmeric',
        '1 tsp coriander powder',
        'Salt to taste',
        'Fresh cilantro'
      ],
      instructions: [
        'Pressure cook dal with turmeric and salt',
        'Heat ghee, add cumin and red chilies',
        'Add onions, cook until golden',
        'Add ginger-garlic paste, tomatoes, spices',
        'Cook until tomatoes break down',
        'Add cooked dal, simmer 5 minutes',
        'Garnish with cilantro'
      ],
      nutritionalInfo: {
        calories: 195,
        protein: 12,
        carbs: 28,
        fat: 5,
        fiber: 8
      },
      ayurvedicProperties: {
        taste: ['Sweet', 'Astringent', 'Pungent'],
        energy: 'heating',
        effect: 'vata-balancing',
        season: ['Winter', 'Monsoon']
      },
      healthBenefits: [
        'High protein content',
        'Good for muscle building',
        'Aids digestion',
        'Balances Vata dosha'
      ]
    },
    {
      id: 'golden-milk',
      name: 'Golden Milk (Turmeric Latte)',
      sanskrit: 'हल्दी दूध',
      category: 'beverage',
      cuisine: 'ayurvedic',
      prepTime: 5,
      cookTime: 10,
      servings: 1,
      difficulty: 'easy',
      description: 'Ancient healing drink with anti-inflammatory properties - perfect before bed',
      ingredients: [
        '1 cup milk (dairy or plant-based)',
        '1/2 tsp turmeric powder',
        '1/4 tsp cinnamon',
        'Pinch of black pepper',
        '1 tsp ghee or coconut oil',
        '1 tsp honey (add after cooling)',
        '1/4 tsp ginger powder'
      ],
      instructions: [
        'Heat milk in a saucepan over medium heat',
        'Add turmeric, cinnamon, pepper, and ginger',
        'Whisk well to prevent lumps',
        'Add ghee and simmer for 3-4 minutes',
        'Strain into a cup',
        'Add honey when cooled slightly',
        'Drink warm before bedtime'
      ],
      nutritionalInfo: {
        calories: 140,
        protein: 8,
        carbs: 12,
        fat: 6,
        fiber: 0.5
      },
      ayurvedicProperties: {
        taste: ['Sweet', 'Pungent', 'Bitter'],
        energy: 'heating',
        effect: 'tridoshic',
        season: ['Winter', 'Monsoon']
      },
      healthBenefits: [
        'Anti-inflammatory',
        'Boosts immunity',
        'Aids sleep',
        'Supports joint health'
      ]
    },
    {
      id: 'coconut-rice',
      name: 'Coconut Rice',
      sanskrit: 'नारियल चावल',
      category: 'lunch',
      cuisine: 'south-indian',
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      difficulty: 'medium',
      description: 'Fragrant South Indian rice dish with coconut - cooling and nourishing',
      ingredients: [
        '2 cups cooked basmati rice',
        '1 fresh coconut, grated',
        '2 tbsp coconut oil',
        '1 tsp mustard seeds',
        '1 tsp urad dal',
        '2 dried red chilies',
        '10-12 curry leaves',
        '2 green chilies, slit',
        '1/4 cup cashews',
        '1/4 cup raisins',
        'Salt to taste'
      ],
      instructions: [
        'Extract thick coconut milk from grated coconut',
        'Heat oil, add mustard seeds and urad dal',
        'Add red chilies, curry leaves, green chilies',
        'Add cashews and raisins, fry lightly',
        'Add coconut milk, bring to boil',
        'Add cooked rice and salt, mix gently',
        'Simmer for 5 minutes, serve hot'
      ],
      nutritionalInfo: {
        calories: 320,
        protein: 6,
        carbs: 42,
        fat: 14,
        fiber: 3
      },
      ayurvedicProperties: {
        taste: ['Sweet', 'Astringent'],
        energy: 'cooling',
        effect: 'pitta-balancing',
        season: ['Summer', 'Spring']
      },
      healthBenefits: [
        'Cooling effect',
        'Easy digestion',
        'Good for Pitta constitution',
        'Provides healthy fats'
      ]
    }
  ];

  // Seasonal guidance
  const seasonalGuidance: SeasonalGuidance[] = [
    {
      season: 'winter',
      dosha: 'vata',
      foods: {
        favor: ['Warm cooked foods', 'Root vegetables', 'Nuts and seeds', 'Warming spices', 'Hot beverages'],
        avoid: ['Cold foods', 'Raw vegetables', 'Frozen foods', 'Carbonated drinks', 'Dry crackers']
      },
      spices: ['Ginger', 'Cinnamon', 'Cardamom', 'Cloves', 'Black pepper'],
      cookingMethods: ['Steaming', 'Stewing', 'Slow cooking', 'Warm preparations'],
      generalTips: [
        'Eat warm, moist, and oily foods',
        'Follow regular meal times',
        'Drink warm water throughout the day',
        'Include healthy fats like ghee and oils'
      ]
    },
    {
      season: 'summer',
      dosha: 'pitta',
      foods: {
        favor: ['Cooling foods', 'Sweet fruits', 'Leafy greens', 'Cucumber', 'Coconut water'],
        avoid: ['Spicy foods', 'Fermented foods', 'Citrus fruits', 'Hot beverages', 'Fried foods']
      },
      spices: ['Coriander', 'Fennel', 'Mint', 'Rose petals', 'Cardamom'],
      cookingMethods: ['Steaming', 'Boiling', 'Raw preparations', 'Light sautéing'],
      generalTips: [
        'Eat cooling and hydrating foods',
        'Avoid overeating',
        'Drink plenty of cool (not ice-cold) water',
        'Include sweet, bitter, and astringent tastes'
      ]
    },
    {
      season: 'monsoon',
      dosha: 'kapha',
      foods: {
        favor: ['Light foods', 'Warm spices', 'Bitter vegetables', 'Herbal teas', 'Cooked grains'],
        avoid: ['Heavy foods', 'Dairy excess', 'Sweet foods', 'Cold drinks', 'Oily foods']
      },
      spices: ['Turmeric', 'Ginger', 'Black pepper', 'Mustard seeds', 'Fenugreek'],
      cookingMethods: ['Grilling', 'Roasting', 'Light sautéing', 'Steaming'],
      generalTips: [
        'Eat light and easily digestible foods',
        'Use warming spices',
        'Avoid overeating',
        'Drink warm herbal teas'
      ]
    }
  ];

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

    // Floating leaf animation
    const leafFloat = Animated.loop(
      Animated.sequence([
        Animated.timing(leafAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(leafAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    leafFloat.start();

    return () => leafFloat.stop();
  }, []);

  // Handlers
  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home' as never);
    }
  }, [navigation]);

  const openMealModal = useCallback(() => {
    setCurrentMeal({
      id: `meal-${Date.now()}`,
      date: new Date().toISOString(),
      mealType: 'breakfast',
      foodItems: []
    });
    setShowMealModal(true);
  }, []);

  const saveMealEntry = useCallback(async () => {
    if (!currentMeal.foodItems || currentMeal.foodItems.length === 0) {
      Alert.alert('Add Food Items', 'Please add at least one food item to your meal.');
      return;
    }

    const totalCalories = currentMeal.foodItems.reduce((sum, item) => sum + item.calories, 0);
    
    const newEntry: MealEntry = {
      id: currentMeal.id || `meal-${Date.now()}`,
      date: currentMeal.date || new Date().toISOString(),
      mealType: currentMeal.mealType || 'breakfast',
      foodItems: currentMeal.foodItems,
      totalCalories,
      mood: currentMeal.mood || 'satisfied',
      digestion: currentMeal.digestion || 'good',
      notes: currentMeal.notes || ''
    };

    setMealEntries(prev => [newEntry, ...prev.slice(0, 19)]); // Keep last 20 entries

    // Add session
    await actions.addSession({
      pillar: 'diet',
      type: 'practice',
      duration: 5,
      date: new Date().toISOString(),
      score: 75 + Math.floor(Math.random() * 25),
      mood: 'good',
      notes: `Logged ${newEntry.mealType}: ${newEntry.totalCalories} calories`
    });

    // Check for achievements
    const dietSessionsCount = sessions.filter(s => s.pillar === 'diet').length + 1;
    if (dietSessionsCount === 1) {
      await actions.addAchievement({
        title: '🍽️ Nutrition Journey Begins',
        description: 'Started tracking your nutritional wellness',
        pillar: 'diet',
        rarity: 'common'
      });
    }

    if (totalCalories > 0 && totalCalories < 300 && newEntry.mood === 'satisfied') {
      await actions.addAchievement({
        title: '🌿 Mindful Eating',
        description: 'Practiced portion control and mindful consumption',
        pillar: 'diet',
        rarity: 'rare'
      });
    }

    setShowMealModal(false);
    setCurrentMeal({});
    
    Alert.alert(
      '🍽️ Meal Logged!',
      `Your ${newEntry.mealType} has been recorded. Keep nourishing your body mindfully.`,
      [{ text: 'Annam Brahma 🙏', style: 'default' }]
    );
  }, [currentMeal, actions, sessions]);

  const openRecipeModal = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  }, []);

  const addRecipeToMeal = useCallback(async (recipe: Recipe) => {
    await actions.addSession({
      pillar: 'diet',
      type: 'practice',
      duration: recipe.cookTime + recipe.prepTime,
      date: new Date().toISOString(),
      score: 80 + Math.floor(Math.random() * 20),
      mood: 'satisfied',
      notes: `Prepared ${recipe.name} - ${recipe.ayurvedicProperties.effect}`
    });

    if (recipe.ayurvedicProperties.effect === 'tridoshic') {
      await actions.addAchievement({
        title: '⚖️ Dosha Master',
        description: 'Prepared a perfectly balanced tridoshic meal',
        pillar: 'diet',
        rarity: 'rare'
      });
    }

    setShowRecipeModal(false);
    Alert.alert(
      '🍳 Recipe Added!',
      `${recipe.name} has been prepared! This ${recipe.ayurvedicProperties.effect} meal will nourish your body beautifully.`,
      [{ text: 'Delicious! 😋', style: 'default' }]
    );
  }, [actions]);

  // Render functions
  const renderHeader = () => (
    <LinearGradient
      colors={[Colors.diet, '#059669']}
      style={styles.header}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Diet Pillar</Text>
        <Text style={styles.headerSubtitle}>Nutritional Wellness • पोषण कल्याण</Text>
      </View>

      <Animated.View 
        style={[
          styles.headerLeaf, 
          { 
            transform: [
              { 
                translateY: leafAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10]
                })
              }
            ] 
          }
        ]}
      >
        <Text style={styles.leafSymbol}>🌿</Text>
      </Animated.View>
    </LinearGradient>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {[
        { key: 'nutrition', label: 'Nutrition', icon: 'restaurant' },
        { key: 'recipes', label: 'Recipes', icon: 'book' },
        { key: 'dosha', label: 'Dosha', icon: 'fitness' },
        { key: 'seasonal', label: 'Seasonal', icon: 'leaf' }
      ].map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, selectedTab === tab.key && styles.tabActive]}
          onPress={() => setSelectedTab(tab.key as any)}
        >
          <Ionicons 
            name={tab.icon as any} 
            size={20} 
            color={selectedTab === tab.key ? Colors.diet : Colors.textSecondary} 
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

  const renderNutritionMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>Today's Nutrition</Text>
      <View style={styles.calorieCard}>
        <LinearGradient
          colors={[Colors.diet, '#059669']}
          style={styles.calorieGradient}
        >
          <View style={styles.calorieHeader}>
            <Text style={styles.calorieTitle}>Daily Calories</Text>
            <Text style={styles.calorieValue}>
              {nutritionMetrics.dailyCalories} / {nutritionMetrics.targetCalories}
            </Text>
          </View>
          <View style={styles.calorieProgress}>
            <View 
              style={[
                styles.calorieProgressFill, 
                { width: `${(nutritionMetrics.dailyCalories / nutritionMetrics.targetCalories) * 100}%` }
              ]} 
            />
          </View>
        </LinearGradient>
      </View>

      <View style={styles.macroGrid}>
        <View style={styles.macroCard}>
          <Ionicons name="fitness" size={24} color={Colors.danger} />
          <Text style={styles.macroValue}>{nutritionMetrics.protein}g</Text>
          <Text style={styles.macroLabel}>Protein</Text>
        </View>
        <View style={styles.macroCard}>
          <Ionicons name="nutrition" size={24} color={Colors.warning} />
          <Text style={styles.macroValue}>{nutritionMetrics.carbs}g</Text>
          <Text style={styles.macroLabel}>Carbs</Text>
        </View>
        <View style={styles.macroCard}>
          <Ionicons name="water" size={24} color={Colors.accent} />
          <Text style={styles.macroValue}>{nutritionMetrics.fat}g</Text>
          <Text style={styles.macroLabel}>Fat</Text>
        </View>
        <View style={styles.macroCard}>
          <Ionicons name="leaf" size={24} color={Colors.diet} />
          <Text style={styles.macroValue}>{nutritionMetrics.fiber}g</Text>
          <Text style={styles.macroLabel}>Fiber</Text>
        </View>
      </View>

      <View style={styles.hydrationCard}>
        <Text style={styles.hydrationTitle}>Hydration</Text>
        <View style={styles.waterGlasses}>
          {Array.from({ length: nutritionMetrics.targetWater }, (_, index) => (
            <Ionicons 
              key={index}
              name={index < nutritionMetrics.water ? "water" : "water-outline"} 
              size={24} 
              color={index < nutritionMetrics.water ? Colors.accent : Colors.textSecondary} 
            />
          ))}
        </View>
        <Text style={styles.hydrationCount}>
          {nutritionMetrics.water} / {nutritionMetrics.targetWater} glasses
        </Text>
      </View>
    </View>
  );

  const renderMealTracking = () => (
    <View style={styles.mealContainer}>
      <View style={styles.mealHeader}>
        <Text style={styles.sectionTitle}>Meal Tracking</Text>
        <TouchableOpacity style={styles.addMealButton} onPress={openMealModal}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addMealText}>Log Meal</Text>
        </TouchableOpacity>
      </View>

      {mealEntries.length === 0 ? (
        <View style={styles.emptyMeals}>
          <Ionicons name="restaurant" size={48} color={Colors.textSecondary} />
          <Text style={styles.emptyMealsText}>Start tracking your nutrition</Text>
          <Text style={styles.emptyMealsSubtext}>Log your first meal to begin your wellness journey</Text>
        </View>
      ) : (
        mealEntries.slice(0, 5).map(entry => (
          <View key={entry.id} style={styles.mealEntryCard}>
            <View style={styles.mealEntryHeader}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealType}>
                  {entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)}
                </Text>
                <Text style={styles.mealDate}>
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.mealCalories}>
                <Text style={styles.caloriesText}>{entry.totalCalories}</Text>
                <Text style={styles.caloriesLabel}>calories</Text>
              </View>
            </View>
            
            <View style={styles.foodItems}>
              {entry.foodItems.slice(0, 3).map((food, index) => (
                <Text key={index} style={styles.foodItem}>
                  • {food.name} ({food.quantity})
                </Text>
              ))}
              {entry.foodItems.length > 3 && (
                <Text style={styles.moreFoods}>+{entry.foodItems.length - 3} more items</Text>
              )}
            </View>
            
            <View style={styles.mealMeta}>
              <Text style={styles.moodText}>
                Mood: {entry.mood === 'energized' ? '⚡ Energized' :
                      entry.mood === 'satisfied' ? '😊 Satisfied' :
                      entry.mood === 'heavy' ? '😴 Heavy' :
                      entry.mood === 'light' ? '🪶 Light' : '🤢 Bloated'}
              </Text>
              <Text style={styles.digestionText}>
                Digestion: {entry.digestion === 'excellent' ? '🌟 Excellent' :
                          entry.digestion === 'good' ? '✅ Good' :
                          entry.digestion === 'okay' ? '🤷 Okay' : '😣 Poor'}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderRecipeLibrary = () => (
    <View style={styles.recipeContainer}>
      <Text style={styles.sectionTitle}>Ayurvedic Recipe Library</Text>
      <Text style={styles.sectionSubtitle}>आहार • Traditional recipes for optimal health</Text>
      
      {recipeLibrary.map(recipe => (
        <TouchableOpacity
          key={recipe.id}
          style={styles.recipeCard}
          onPress={() => openRecipeModal(recipe)}
        >
          <View style={styles.recipeHeader}>
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              {recipe.sanskrit && (
                <Text style={styles.recipeSanskrit}>{recipe.sanskrit}</Text>
              )}
              <Text style={styles.recipeDescription}>{recipe.description}</Text>
            </View>
            <View style={styles.recipeMeta}>
              <Text style={styles.recipeTime}>{recipe.prepTime + recipe.cookTime}min</Text>
              <Text style={styles.recipeServings}>{recipe.servings} servings</Text>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(recipe.difficulty) }]}>
                <Text style={styles.difficultyText}>{recipe.difficulty.toUpperCase()}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.nutritionInfo}>
            <Text style={styles.caloriesPerServing}>{recipe.nutritionalInfo.calories} cal/serving</Text>
            <Text style={styles.macroInfo}>
              P: {recipe.nutritionalInfo.protein}g | C: {recipe.nutritionalInfo.carbs}g | F: {recipe.nutritionalInfo.fat}g
            </Text>
          </View>

          <View style={styles.ayurvedicInfo}>
            <View style={[styles.doshaEffect, { backgroundColor: getDoshaColor(recipe.ayurvedicProperties.effect) }]}>
              <Text style={styles.doshaText}>{recipe.ayurvedicProperties.effect.toUpperCase()}</Text>
            </View>
            <Text style={styles.energyText}>
              Energy: {recipe.ayurvedicProperties.energy}
            </Text>
            <Text style={styles.tasteText}>
              Tastes: {recipe.ayurvedicProperties.taste.join(', ')}
            </Text>
          </View>

          <View style={styles.healthBenefits}>
            {recipe.healthBenefits.slice(0, 3).map((benefit, index) => (
              <Text key={index} style={styles.benefitTag}>{benefit}</Text>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDoshaProfile = () => (
    <View style={styles.doshaContainer}>
      <Text style={styles.sectionTitle}>Your Dosha Profile</Text>
      <Text style={styles.sectionSubtitle}>दोष • Constitutional analysis for personalized nutrition</Text>
      
      <View style={styles.doshaChart}>
        <Text style={styles.dominantDosha}>
          Dominant: {doshaProfile.dominant.charAt(0).toUpperCase() + doshaProfile.dominant.slice(1)}
        </Text>
        
        <View style={styles.doshaDistribution}>
          <View style={styles.doshaBar}>
            <Text style={styles.doshaName}>Vata (Air + Space)</Text>
            <View style={styles.doshaProgressBar}>
              <View 
                style={[
                  styles.doshaProgress, 
                  { 
                    width: `${doshaProfile.vata}%`,
                    backgroundColor: Colors.vata 
                  }
                ]} 
              />
            </View>
            <Text style={styles.doshaPercentage}>{doshaProfile.vata}%</Text>
          </View>
          
          <View style={styles.doshaBar}>
            <Text style={styles.doshaName}>Pitta (Fire + Water)</Text>
            <View style={styles.doshaProgressBar}>
              <View 
                style={[
                  styles.doshaProgress, 
                  { 
                    width: `${doshaProfile.pitta}%`,
                    backgroundColor: Colors.pitta 
                  }
                ]} 
              />
            </View>
            <Text style={styles.doshaPercentage}>{doshaProfile.pitta}%</Text>
          </View>
          
          <View style={styles.doshaBar}>
            <Text style={styles.doshaName}>Kapha (Water + Earth)</Text>
            <View style={styles.doshaProgressBar}>
              <View 
                style={[
                  styles.doshaProgress, 
                  { 
                    width: `${doshaProfile.kapha}%`,
                    backgroundColor: Colors.kapha 
                  }
                ]} 
              />
            </View>
            <Text style={styles.doshaPercentage}>{doshaProfile.kapha}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.recommendationsCard}>
        <Text style={styles.recommendationsTitle}>Personalized Recommendations</Text>
        {doshaProfile.recommendations.map((rec, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.recommendationText}>{rec}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'monsoon';
    if (month === 11 || month === 0 || month === 1) return 'winter';
    return 'autumn';
  };

  const renderSeasonalGuidance = () => {
    const currentSeason = getCurrentSeason();
    const guidance = seasonalGuidance.find(g => g.season === currentSeason) || seasonalGuidance[0];
    
    return (
      <View style={styles.seasonalContainer}>
        <Text style={styles.sectionTitle}>Seasonal Nutrition Guidance</Text>
        <Text style={styles.sectionSubtitle}>ऋतुचर्या • Eating in harmony with nature's rhythms</Text>
        
        <View style={styles.currentSeasonCard}>
          <LinearGradient
            colors={getSeasonColors(guidance.season)}
            style={styles.seasonGradient}
          >
            <Text style={styles.seasonTitle}>
              {guidance.season.charAt(0).toUpperCase() + guidance.season.slice(1)} Season
            </Text>
            <Text style={styles.seasonDosha}>
              {guidance.dosha.charAt(0).toUpperCase() + guidance.dosha.slice(1)} Dominant Period
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.guidanceSection}>
          <Text style={styles.guidanceTitle}>🍽️ Foods to Favor</Text>
          <View style={styles.foodTags}>
            {guidance.foods.favor.map((food, index) => (
              <Text key={index} style={styles.favorFood}>{food}</Text>
            ))}
          </View>
        </View>

        <View style={styles.guidanceSection}>
          <Text style={styles.guidanceTitle}>🚫 Foods to Avoid</Text>
          <View style={styles.foodTags}>
            {guidance.foods.avoid.map((food, index) => (
              <Text key={index} style={styles.avoidFood}>{food}</Text>
            ))}
          </View>
        </View>

        <View style={styles.guidanceSection}>
          <Text style={styles.guidanceTitle}>🌶️ Beneficial Spices</Text>
          <View style={styles.foodTags}>
            {guidance.spices.map((spice, index) => (
              <Text key={index} style={styles.spiceTag}>{spice}</Text>
            ))}
          </View>
        </View>

        <View style={styles.guidanceSection}>
          <Text style={styles.guidanceTitle}>🔥 Cooking Methods</Text>
          <View style={styles.cookingMethods}>
            {guidance.cookingMethods.map((method, index) => (
              <View key={index} style={styles.methodItem}>
                <Ionicons name="checkmark" size={16} color={Colors.success} />
                <Text style={styles.methodText}>{method}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.generalTips}>
          <Text style={styles.tipsTitle}>💡 General Tips</Text>
          {guidance.generalTips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'nutrition':
        return (
          <>
            {renderNutritionMetrics()}
            {renderMealTracking()}
          </>
        );
      case 'recipes':
        return renderRecipeLibrary();
      case 'dosha':
        return renderDoshaProfile();
      case 'seasonal':
        return renderSeasonalGuidance();
      default:
        return renderNutritionMetrics();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return Colors.success + '20';
      case 'medium': return Colors.warning + '20';
      case 'hard': return Colors.danger + '20';
      default: return Colors.textSecondary + '20';
    }
  };

  const getDoshaColor = (effect: string) => {
    if (effect.includes('vata')) return Colors.vata + '20';
    if (effect.includes('pitta')) return Colors.pitta + '20';
    if (effect.includes('kapha')) return Colors.kapha + '20';
    return Colors.diet + '20';
  };

  const getSeasonColors = (season: string) => {
    switch (season) {
      case 'spring': return [Colors.success, '#059669'];
      case 'summer': return [Colors.warning, '#D97706'];
      case 'monsoon': return [Colors.accent, '#2563EB'];
      case 'autumn': return [Colors.danger, '#DC2626'];
      case 'winter': return [Colors.spirit, '#7C3AED'];
      default: return [Colors.diet, '#059669'];
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

        {/* Meal Entry Modal */}
        <Modal
          visible={showMealModal}
          animationType="slide"
          onRequestClose={() => setShowMealModal(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowMealModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Log Your Meal</Text>
              <TouchableOpacity onPress={saveMealEntry}>
                <Text style={styles.modalSave}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Meal Type */}
              <Text style={styles.modalSectionTitle}>Meal Type</Text>
              <View style={styles.mealTypeOptions}>
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.mealTypeOption,
                      currentMeal.mealType === type && styles.mealTypeSelected
                    ]}
                    onPress={() => setCurrentMeal(prev => ({ ...prev, mealType: type }))}
                  >
                    <Text style={styles.mealTypeLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Simplified Food Entry */}
              <Text style={styles.modalSectionTitle}>Food Items</Text>
              <TextInput
                style={styles.foodInput}
                placeholder="Enter foods eaten (e.g., 'Rice 1 bowl 200 cal, Dal 1 cup 150 cal')"
                multiline
                numberOfLines={3}
                value={(currentMeal.foodItems || []).map(item => 
                  `${item.name} ${item.quantity} ${item.calories} cal`
                ).join(', ')}
                onChangeText={(text) => {
                  const items = text.split(',').map(item => {
                    const parts = item.trim().split(' ');
                    const calories = parseInt(parts[parts.length - 2]) || 0;
                    const quantity = parts[parts.length - 3] || '1';
                    const name = parts.slice(0, -2).join(' ') || 'Food item';
                    return { name, quantity, calories };
                  }).filter(item => item.name !== 'Food item');
                  setCurrentMeal(prev => ({ ...prev, foodItems: items }));
                }}
              />

              {/* Mood */}
              <Text style={styles.modalSectionTitle}>How do you feel?</Text>
              <View style={styles.moodOptions}>
                {(['energized', 'satisfied', 'heavy', 'light', 'bloated'] as const).map(mood => (
                  <TouchableOpacity
                    key={mood}
                    style={[
                      styles.moodOption,
                      currentMeal.mood === mood && styles.moodOptionSelected
                    ]}
                    onPress={() => setCurrentMeal(prev => ({ ...prev, mood }))}
                  >
                    <Text style={styles.moodEmoji}>
                      {mood === 'energized' ? '⚡' :
                       mood === 'satisfied' ? '😊' :
                       mood === 'heavy' ? '😴' :
                       mood === 'light' ? '🪶' : '🤢'}
                    </Text>
                    <Text style={styles.moodLabel}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Digestion */}
              <Text style={styles.modalSectionTitle}>Digestion</Text>
              <View style={styles.digestionOptions}>
                {(['excellent', 'good', 'okay', 'poor'] as const).map(digestion => (
                  <TouchableOpacity
                    key={digestion}
                    style={[
                      styles.digestionOption,
                      currentMeal.digestion === digestion && styles.digestionSelected
                    ]}
                    onPress={() => setCurrentMeal(prev => ({ ...prev, digestion }))}
                  >
                    <Text style={styles.digestionLabel}>{digestion.charAt(0).toUpperCase() + digestion.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Notes */}
              <Text style={styles.modalSectionTitle}>Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Any observations about this meal?"
                multiline
                numberOfLines={2}
                value={currentMeal.notes}
                onChangeText={(notes) => setCurrentMeal(prev => ({ ...prev, notes }))}
              />
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* Recipe Detail Modal */}
        <Modal
          visible={showRecipeModal}
          animationType="slide"
          onRequestClose={() => setShowRecipeModal(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowRecipeModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedRecipe?.name}</Text>
              <TouchableOpacity onPress={() => selectedRecipe && addRecipeToMeal(selectedRecipe)}>
                <Text style={styles.modalSave}>Cook</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {selectedRecipe && (
                <>
                  {selectedRecipe.sanskrit && (
                    <Text style={styles.recipeModalSanskrit}>{selectedRecipe.sanskrit}</Text>
                  )}
                  <Text style={styles.recipeModalDescription}>{selectedRecipe.description}</Text>
                  
                  <View style={styles.recipeModalMeta}>
                    <Text style={styles.recipeModalTime}>⏱️ {selectedRecipe.prepTime + selectedRecipe.cookTime} min</Text>
                    <Text style={styles.recipeModalServings}>🍽️ {selectedRecipe.servings} servings</Text>
                    <Text style={styles.recipeModalCalories}>🔥 {selectedRecipe.nutritionalInfo.calories} cal/serving</Text>
                  </View>

                  <Text style={styles.ingredientsTitle}>Ingredients</Text>
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <Text key={index} style={styles.ingredientItem}>• {ingredient}</Text>
                  ))}

                  <Text style={styles.instructionsTitle}>Instructions</Text>
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <Text key={index} style={styles.instructionItem}>
                      {index + 1}. {instruction}
                    </Text>
                  ))}

                  <View style={styles.ayurvedicProperties}>
                    <Text style={styles.propertiesTitle}>Ayurvedic Properties</Text>
                    <Text style={styles.propertyText}>Effect: {selectedRecipe.ayurvedicProperties.effect}</Text>
                    <Text style={styles.propertyText}>Energy: {selectedRecipe.ayurvedicProperties.energy}</Text>
                    <Text style={styles.propertyText}>Tastes: {selectedRecipe.ayurvedicProperties.taste.join(', ')}</Text>
                  </View>

                  <View style={styles.healthBenefitsModal}>
                    <Text style={styles.benefitsTitle}>Health Benefits</Text>
                    {selectedRecipe.healthBenefits.map((benefit, index) => (
                      <Text key={index} style={styles.benefitItem}>✓ {benefit}</Text>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

// Comprehensive styles for DietScreen
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
  headerLeaf: {
    padding: 8,
  },
  leafSymbol: {
    fontSize: 32,
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
    backgroundColor: Colors.dietLight,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: Colors.diet,
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
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },

  // Nutrition Metrics
  metricsContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  calorieCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  calorieGradient: {
    padding: 20,
  },
  calorieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calorieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  calorieValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  calorieProgress: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  calorieProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  macroCard: {
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
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 8,
  },
  macroLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  hydrationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  hydrationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  waterGlasses: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  hydrationCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // Meal Tracking
  mealContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.diet,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addMealText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyMeals: {
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
  emptyMealsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMealsSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  mealEntryCard: {
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
  mealEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  mealDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  mealCalories: {
    alignItems: 'flex-end',
  },
  caloriesText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.diet,
  },
  caloriesLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  foodItems: {
    marginBottom: 12,
  },
  foodItem: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  moreFoods: {
    fontSize: 12,
    color: Colors.diet,
    fontStyle: 'italic',
  },
  mealMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  moodText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  digestionText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  // Recipe Library
  recipeContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  recipeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recipeInfo: {
    flex: 1,
    marginRight: 16,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  recipeSanskrit: {
    fontSize: 14,
    color: Colors.diet,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  recipeMeta: {
    alignItems: 'flex-end',
  },
  recipeTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.diet,
  },
  recipeServings: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
  },
  nutritionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  caloriesPerServing: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.warning,
  },
  macroInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  ayurvedicInfo: {
    marginBottom: 12,
  },
  doshaEffect: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  doshaText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
  },
  energyText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  tasteText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  healthBenefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  benefitTag: {
    fontSize: 12,
    color: Colors.success,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  // Dosha Profile
  doshaContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  doshaChart: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  dominantDosha: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  doshaDistribution: {
    gap: 16,
  },
  doshaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doshaName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    width: 120,
  },
  doshaProgressBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  doshaProgress: {
    height: '100%',
    borderRadius: 6,
  },
  doshaPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    width: 40,
    textAlign: 'right',
  },
  recommendationsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },

  // Seasonal Guidance
  seasonalContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  currentSeasonCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  seasonGradient: {
    padding: 20,
    alignItems: 'center',
  },
  seasonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  seasonDosha: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  guidanceSection: {
    marginBottom: 20,
  },
  guidanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  foodTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  favorFood: {
    fontSize: 12,
    color: Colors.success,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  avoidFood: {
    fontSize: 12,
    color: Colors.danger,
    backgroundColor: Colors.danger + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  spiceTag: {
    fontSize: 12,
    color: Colors.warning,
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cookingMethods: {
    gap: 8,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  methodText: {
    fontSize: 14,
    color: Colors.text,
  },
  generalTips: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: Colors.diet,
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
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
    color: Colors.diet,
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

  // Meal Modal
  mealTypeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  mealTypeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.dietLight,
    backgroundColor: Colors.surface,
  },
  mealTypeSelected: {
    borderColor: Colors.diet,
    backgroundColor: Colors.dietLight,
  },
  mealTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  foodInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    textAlignVertical: 'top',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
  },
  moodOptionSelected: {
    borderColor: Colors.diet,
    backgroundColor: Colors.dietLight,
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
  digestionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  digestionOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.dietLight,
    backgroundColor: Colors.surface,
  },
  digestionSelected: {
    borderColor: Colors.diet,
    backgroundColor: Colors.dietLight,
  },
  digestionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  notesInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    textAlignVertical: 'top',
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Recipe Modal
  recipeModalSanskrit: {
    fontSize: 18,
    color: Colors.diet,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 12,
  },
  recipeModalDescription: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  recipeModalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  recipeModalTime: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  recipeModalServings: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  recipeModalCalories: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    marginTop: 20,
  },
  ingredientItem: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    marginTop: 20,
  },
  instructionItem: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  ayurvedicProperties: {
    backgroundColor: Colors.dietLight,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  propertiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.diet,
    marginBottom: 8,
  },
  propertyText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  healthBenefitsModal: {
    marginTop: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  benefitItem: {
    fontSize: 14,
    color: Colors.success,
    marginBottom: 6,
  },
});

export default DietScreen;
