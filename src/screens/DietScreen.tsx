// src/screens/DietScreen.tsx - COMPLETE INDIAN VEGETARIAN NUTRITIONAL OPTIMIZATION SYSTEM
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Animated,
  Dimensions,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDataSelectors, useAppData } from '../context/AppDataContext';
import { usePerformanceOptimization, PerformanceMonitor } from '../hooks/usePerformanceOptimization';
import NotificationManager from '../utils/NotificationManager';

const { width } = Dimensions.get('window');

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  diet: '#10B981',
  warning: '#F59E0B',
  spirit: '#8B5CF6',
};

interface NutritionalMetrics {
  proteinIntake: number;
  vitaminBalance: number;
  mineralContent: number;
  fiberConsumption: number;
  hydrationLevel: number;
  metabolicHealth: number;
}

interface IndianMeal {
  id: string;
  name: string;
  region: 'North Indian' | 'South Indian' | 'Bengali' | 'Gujarati' | 'Punjabi' | 'Maharashtrian';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: string[];
  nutritionalBenefits: string[];
  preparationTime: number;
  calories: number;
  protein: number;
  ayurvedicProperties: {
    dosha: 'Vata' | 'Pitta' | 'Kapha' | 'Tridoshic';
    taste: string[];
    effect: string;
  };
}

interface RegionalCuisine {
  region: string;
  specialties: string[];
  staples: string[];
  healthBenefits: string[];
}

const DietScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const { actions } = useAppData();
  const { pillarScores, userProfile } = useAppDataSelectors();
  const { measurePerformance } = usePerformanceOptimization();
  const notificationManager = NotificationManager.getInstance();

  const [nutritionalMetrics, setNutritionalMetrics] = useState<NutritionalMetrics>({
    proteinIntake: 85,
    vitaminBalance: 78,
    mineralContent: 82,
    fiberConsumption: 88,
    hydrationLevel: 75,
    metabolicHealth: 80
  });

  const [recommendedMeal, setRecommendedMeal] = useState<IndianMeal | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('North Indian');
  const [mealPlanActive, setMealPlanActive] = useState(false);
  const [waterIntake, setWaterIntake] = useState(6); // glasses of water
  const [dailyNutritionGoal, setDailyNutritionGoal] = useState(85);

  useEffect(() => {
    const measurement = measurePerformance('DietScreen');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      measurement.end();
    });

    startNutritionAnimation();
    initializeDietOptimization();
  }, [fadeAnim]);

  const startNutritionAnimation = () => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    pulse.start();
  };

  const initializeDietOptimization = async () => {
    try {
      generateIndianMealRecommendation();
      updateNutritionalMetrics();
      checkDietAchievements();
    } catch (error) {
      console.error('Error initializing diet optimization:', error);
    }
  };

  const generateIndianMealRecommendation = () => {
    const currentScore = pillarScores.diet;
    const timeOfDay = new Date().getHours();
    
    let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    if (timeOfDay < 10) mealType = 'breakfast';
    else if (timeOfDay < 16) mealType = 'lunch';
    else if (timeOfDay < 19) mealType = 'snack';
    else mealType = 'dinner';

    const indianMeals: IndianMeal[] = [
      // North Indian Meals
      {
        id: 'rajma-chawal',
        name: 'Rajma Chawal with Cucumber Raita',
        region: 'North Indian',
        mealType: 'lunch',
        ingredients: ['Red kidney beans', 'Basmati rice', 'Onions', 'Tomatoes', 'Ginger-garlic', 'Cumin', 'Coriander', 'Cucumber', 'Yogurt', 'Mint'],
        nutritionalBenefits: ['High protein from rajma', 'Complex carbohydrates', 'Probiotics from yogurt', 'Fiber for digestion', 'Iron and folate'],
        preparationTime: 45,
        calories: 380,
        protein: 18,
        ayurvedicProperties: {
          dosha: 'Kapha',
          taste: ['Sweet', 'Astringent'],
          effect: 'Grounding and nourishing'
        }
      },
      {
        id: 'chole-bhature',
        name: 'Chole with Whole Wheat Kulcha',
        region: 'Punjabi',
        mealType: 'lunch',
        ingredients: ['Chickpeas', 'Whole wheat flour', 'Onions', 'Tomatoes', 'Garam masala', 'Amchur', 'Coriander', 'Green chilies'],
        nutritionalBenefits: ['Plant protein from chickpeas', 'B-vitamins', 'Fiber for gut health', 'Magnesium and potassium'],
        preparationTime: 60,
        calories: 420,
        protein: 16,
        ayurvedicProperties: {
          dosha: 'Vata',
          taste: ['Sweet', 'Pungent'],
          effect: 'Energizing and warming'
        }
      },
      // South Indian Meals
      {
        id: 'sambar-rice',
        name: 'Sambar Rice with Coconut Chutney',
        region: 'South Indian',
        mealType: 'lunch',
        ingredients: ['Toor dal', 'Rice', 'Drumstick', 'Okra', 'Tomato', 'Tamarind', 'Curry leaves', 'Coconut', 'Green chilies'],
        nutritionalBenefits: ['Complete amino acids', 'Vitamin C from vegetables', 'Healthy fats from coconut', 'Antioxidants from spices'],
        preparationTime: 40,
        calories: 340,
        protein: 14,
        ayurvedicProperties: {
          dosha: 'Tridoshic',
          taste: ['Sour', 'Pungent', 'Sweet'],
          effect: 'Digestive and balancing'
        }
      },
      {
        id: 'idli-sambar',
        name: 'Steamed Idli with Sambar & Chutney',
        region: 'South Indian',
        mealType: 'breakfast',
        ingredients: ['Black gram dal', 'Rice', 'Toor dal', 'Vegetables', 'Coconut', 'Curry leaves', 'Mustard seeds'],
        nutritionalBenefits: ['Fermented probiotics', 'Easy digestion', 'B-vitamins from fermentation', 'Low in calories'],
        preparationTime: 30,
        calories: 280,
        protein: 12,
        ayurvedicProperties: {
          dosha: 'Kapha',
          taste: ['Sweet', 'Astringent'],
          effect: 'Light and nourishing'
        }
      },
      // Bengali Meals
      {
        id: 'dal-bhaat-aloo',
        name: 'Masoor Dal, Steamed Rice & Aloo Posto',
        region: 'Bengali',
        mealType: 'lunch',
        ingredients: ['Red lentils', 'Rice', 'Potatoes', 'Poppy seeds', 'Turmeric', 'Mustard oil', 'Panch phoron'],
        nutritionalBenefits: ['Complete protein profile', 'Healthy omega-3 from mustard oil', 'Calcium from poppy seeds', 'Complex carbs'],
        preparationTime: 35,
        calories: 360,
        protein: 15,
        ayurvedicProperties: {
          dosha: 'Vata',
          taste: ['Sweet', 'Bitter'],
          effect: 'Calming and nutritive'
        }
      },
      // Gujarati Meals
      {
        id: 'gujarati-thali',
        name: 'Gujarati Thali - Dal, Sabzi, Roti',
        region: 'Gujarati',
        mealType: 'lunch',
        ingredients: ['Mixed lentils', 'Seasonal vegetables', 'Whole wheat', 'Jaggery', 'Sesame seeds', 'Peanuts', 'Yogurt'],
        nutritionalBenefits: ['Balanced macro nutrients', 'Natural sugars from jaggery', 'Healthy fats from nuts', 'Digestive spices'],
        preparationTime: 50,
        calories: 400,
        protein: 17,
        ayurvedicProperties: {
          dosha: 'Tridoshic',
          taste: ['Sweet', 'Sour', 'Salty'],
          effect: 'Harmonizing and satisfying'
        }
      }
    ];

    // Filter meals by current meal type and region preference
    const filteredMeals = indianMeals.filter(meal => 
      meal.mealType === mealType || meal.region === selectedRegion
    );
    
    const selectedMeal = filteredMeals.length > 0 
      ? filteredMeals[Math.floor(Math.random() * filteredMeals.length)]
      : indianMeals[0];

    setRecommendedMeal(selectedMeal);
  };

  const updateNutritionalMetrics = () => {
    setNutritionalMetrics(prev => ({
      proteinIntake: Math.max(70, Math.min(100, prev.proteinIntake + (Math.random() - 0.2) * 4)),
      vitaminBalance: Math.max(65, Math.min(100, prev.vitaminBalance + (Math.random() - 0.3) * 5)),
      mineralContent: Math.max(70, Math.min(100, prev.mineralContent + (Math.random() - 0.1) * 3)),
      fiberConsumption: Math.max(75, Math.min(100, prev.fiberConsumption + (Math.random() - 0.2) * 4)),
      hydrationLevel: Math.max(60, Math.min(100, prev.hydrationLevel + (Math.random() - 0.4) * 6)),
      metabolicHealth: Math.max(70, Math.min(95, prev.metabolicHealth + (Math.random() - 0.2) * 3))
    }));
  };

  const checkDietAchievements = async () => {
    const achievements = [];
    
    if (pillarScores.diet >= 90) {
      achievements.push('Nutritional Excellence Master');
    }
    
    if (nutritionalMetrics.proteinIntake >= 90) {
      achievements.push('Plant Protein Champion');
    }
    
    if (waterIntake >= 8) {
      achievements.push('Hydration Hero');
    }

    for (const achievement of achievements) {
      await notificationManager.scheduleAchievementNotification(achievement, 'diet');
    }
  };

  const startMealPlan = async () => {
    if (!recommendedMeal) return;
    
    setMealPlanActive(true);
    
    const improvement = Math.floor(Math.random() * 5) + 2;
    const newScore = Math.min(100, pillarScores.diet + improvement);
    actions.updatePillarScore('diet', newScore);

    actions.addSession({
      pillar: 'diet',
      duration: 0, // Instant nutrition tracking
      improvement: improvement
    });

    await notificationManager.scheduleAchievementNotification(
      `Healthy Meal Logged: +${improvement}% Nutritional Optimization`,
      'diet'
    );

    Alert.alert(
      '🥗 Meal Plan Activated!',
      `Excellent choice! ${recommendedMeal.name} will boost your nutrition by ${improvement}%. Your body will thank you!`,
      [{ text: 'Nutritious!', style: 'default' }]
    );
    
    setTimeout(() => setMealPlanActive(false), 3000);
  };

  const addWaterIntake = () => {
    if (waterIntake < 12) {
      setWaterIntake(prev => prev + 1);
      
      if (waterIntake + 1 === 8) {
        Alert.alert('💧 Hydration Goal Reached!', 'Excellent! You\'ve met your daily hydration goal.');
      }
    }
  };

  const renderNutritionalMetrics = () => (
    <PerformanceMonitor>
      <View style={styles.nutritionalSection}>
        <Text style={styles.sectionTitle}>Nutritional Metrics</Text>
        
        <View style={styles.metricsGrid}>
          {[
            { label: 'Protein', value: nutritionalMetrics.proteinIntake, icon: 'fitness', color: Colors.diet },
            { label: 'Vitamins', value: nutritionalMetrics.vitaminBalance, icon: 'leaf', color: Colors.success },
            { label: 'Fiber', value: nutritionalMetrics.fiberConsumption, icon: 'nutrition', color: Colors.warning },
            { label: 'Hydration', value: nutritionalMetrics.hydrationLevel, icon: 'water', color: Colors.accent }
          ].map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: metric.color }]}>
                <Ionicons name={metric.icon as any} size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{metric.value}%</Text>
              <View style={styles.metricBar}>
                <Animated.View 
                  style={[
                    styles.metricBarFill, 
                    { 
                      width: `${metric.value}%`, 
                      backgroundColor: metric.color,
                      opacity: pulseAnim.interpolate({
                        inputRange: [1, 1.1],
                        outputRange: [0.8, 1]
                      })
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </PerformanceMonitor>
  );

  const renderIndianMealRecommendation = () => (
    <PerformanceMonitor>
      <View style={styles.mealSection}>
        <Text style={styles.sectionTitle}>AI Recommended Indian Meal</Text>

        {recommendedMeal && (
          <View style={styles.mealCard}>
            <LinearGradient
              colors={[Colors.diet, '#059669']}
              style={styles.mealGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{recommendedMeal.name}</Text>
                <Text style={styles.mealRegion}>
                  {recommendedMeal.region} • {recommendedMeal.calories} cal • {recommendedMeal.protein}g protein
                </Text>
                <Text style={styles.ayurvedicInfo}>
                  {recommendedMeal.ayurvedicProperties.dosha} balancing • {recommendedMeal.ayurvedicProperties.effect}
                </Text>
              </View>

              {mealPlanActive ? (
                <Animated.View style={[styles.mealActivated, { transform: [{ scale: pulseAnim }] }]}>
                  <Ionicons name="checkmark-circle" size={32} color="#FFFFFF" />
                  <Text style={styles.activatedText}>Added!</Text>
                </Animated.View>
              ) : (
                <TouchableOpacity
                  style={styles.startMealButton}
                  onPress={startMealPlan}
                >
                  <Ionicons name="restaurant" size={24} color="#FFFFFF" />
                  <Text style={styles.startMealText}>Add to Plan</Text>
                </TouchableOpacity>
              )}
            </LinearGradient>

            <View style={styles.mealDetails}>
              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>Key Ingredients:</Text>
                <Text style={styles.detailText}>
                  {recommendedMeal.ingredients.slice(0, 4).join(', ')}
                  {recommendedMeal.ingredients.length > 4 && ` +${recommendedMeal.ingredients.length - 4} more`}
                </Text>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>Health Benefits:</Text>
                {recommendedMeal.nutritionalBenefits.slice(0, 2).map((benefit, index) => (
                  <Text key={index} style={styles.benefitText}>• {benefit}</Text>
                ))}
              </View>
              
              <View style={styles.ayurvedicCard}>
                <Text style={styles.ayurvedicTitle}>Ayurvedic Properties</Text>
                <Text style={styles.ayurvedicDetail}>
                  Tastes: {recommendedMeal.ayurvedicProperties.taste.join(', ')}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </PerformanceMonitor>
  );

  const renderDietOptimizationScore = () => (
    <PerformanceMonitor>
      <View style={styles.scoreSection}>
        <LinearGradient
          colors={[Colors.diet, '#059669']}
          style={styles.scoreGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.scoreHeader}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Ionicons name="restaurant" size={32} color="#FFFFFF" />
            </Animated.View>
            <Text style={styles.scoreTitle}>Diet Optimization</Text>
          </View>
          <Text style={styles.scoreValue}>{pillarScores.diet}%</Text>
          <Text style={styles.scoreSubtitle}>Indian Vegetarian Nutrition Level</Text>
          
          <View style={styles.nutritionIndicator}>
            <Ionicons name="leaf" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.nutritionText}>
              Plant-based protein: {nutritionalMetrics.proteinIntake}% - Excellent diversity
            </Text>
          </View>

          <View style={styles.nutritionStats}>
            <View style={styles.nutritionStat}>
              <Text style={styles.nutritionStatValue}>{nutritionalMetrics.metabolicHealth}</Text>
              <Text style={styles.nutritionStatLabel}>Metabolism</Text>
            </View>
            <View style={styles.nutritionStat}>
              <Text style={styles.nutritionStatValue}>{waterIntake}</Text>
              <Text style={styles.nutritionStatLabel}>Water (glasses)</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </PerformanceMonitor>
  );

  const renderHydrationTracker = () => (
    <PerformanceMonitor>
      <View style={styles.hydrationSection}>
        <Text style={styles.sectionTitle}>Daily Hydration Tracker</Text>
        
        <View style={styles.hydrationCard}>
          <View style={styles.hydrationHeader}>
            <Ionicons name="water" size={24} color={Colors.accent} />
            <Text style={styles.hydrationTitle}>Water Intake Goal: 8 glasses</Text>
          </View>
          
          <View style={styles.waterGlasses}>
            {Array.from({ length: 8 }).map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.waterGlass,
                  index < waterIntake && styles.waterGlassFilled
                ]}
                onPress={addWaterIntake}
              >
                <Ionicons 
                  name="water" 
                  size={16} 
                  color={index < waterIntake ? Colors.accent : Colors.textSecondary} 
                />
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.hydrationStatus}>
            {waterIntake}/8 glasses • {waterIntake >= 8 ? 'Goal achieved!' : `${8 - waterIntake} more to go`}
          </Text>
          
          <TouchableOpacity style={styles.addWaterButton} onPress={addWaterIntake}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addWaterText}>Add Glass</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PerformanceMonitor>
  );

  const renderRegionalCuisines = () => (
    <PerformanceMonitor>
      <View style={styles.regionalSection}>
        <Text style={styles.sectionTitle}>Explore Indian Regional Cuisines</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.regionalScroll}>
          {[
            { name: 'North Indian', color: '#EF4444', specialties: ['Rajma', 'Chole', 'Dal Makhani'] },
            { name: 'South Indian', color: '#10B981', specialties: ['Sambar', 'Rasam', 'Avial'] },
            { name: 'Bengali', color: '#F59E0B', specialties: ['Macher Jhol', 'Posto', 'Shukto'] },
            { name: 'Gujarati', color: '#8B5CF6', specialties: ['Dhokla', 'Undhiyu', 'Thepla'] },
            { name: 'Punjabi', color: '#EC4899', specialties: ['Sarson Ka Saag', 'Makki Roti'] }
          ].map((cuisine, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.cuisineCard,
                { backgroundColor: `${cuisine.color}15` },
                selectedRegion === cuisine.name && styles.cuisineCardSelected
              ]}
              onPress={() => {
                setSelectedRegion(cuisine.name);
                generateIndianMealRecommendation();
              }}
            >
              <View style={[styles.cuisineIcon, { backgroundColor: cuisine.color }]}>
                <Ionicons name="restaurant" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.cuisineName}>{cuisine.name}</Text>
              <Text style={styles.cuisineSpecialties}>
                {cuisine.specialties.slice(0, 2).join(', ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </PerformanceMonitor>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Diet Optimization</Text>
          <Text style={styles.headerSubtitle}>Indian Vegetarian Nutrition</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings" size={20} color={Colors.diet} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderDietOptimizationScore()}
        {renderNutritionalMetrics()}
        {renderIndianMealRecommendation()}
        {renderHydrationTracker()}
        {renderRegionalCuisines()}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  scoreSection: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  scoreGradient: {
    padding: 24,
    alignItems: 'center',
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  scoreSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  nutritionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  nutritionText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  nutritionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  nutritionStat: {
    alignItems: 'center',
  },
  nutritionStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nutritionStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  nutritionalSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 56) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  metricBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  mealSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  mealCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  mealGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mealRegion: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  ayurvedicInfo: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontStyle: 'italic',
  },
  startMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startMealText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '600',
  },
  mealActivated: {
    alignItems: 'center',
  },
  activatedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  mealDetails: {
    padding: 16,
  },
  detailSection: {
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  benefitText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  ayurvedicCard: {
    backgroundColor: `${Colors.warning}15`,
    padding: 12,
    borderRadius: 8,
  },
  ayurvedicTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.warning,
    marginBottom: 4,
  },
  ayurvedicDetail: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  hydrationSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  hydrationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  hydrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hydrationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  waterGlasses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  waterGlass: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  waterGlassFilled: {
    backgroundColor: `${Colors.accent}20`,
    borderColor: Colors.accent,
  },
  hydrationStatus: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  addWaterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addWaterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  regionalSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  regionalScroll: {
    paddingVertical: 8,
  },
  cuisineCard: {
    width: 120,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  cuisineCardSelected: {
    borderWidth: 2,
    borderColor: Colors.diet,
  },
  cuisineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cuisineName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  cuisineSpecialties: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 12,
  },
});

export default React.memo(DietScreen);
