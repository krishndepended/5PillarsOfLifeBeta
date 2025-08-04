// src/screens/CalorieCalculatorScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions, Platform, Animated, Modal, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import GlassPanel from '../components/GlassPanel';

const { width } = Dimensions.get('window');

const Colors = {
  neonGreen: '#00FF88',
  neonBlue: '#00AAFF',
  neonPurple: '#AA55FF',
  neonRed: '#FF4444',
  neonYellow: '#FFD700',
  neonPink: '#FF6B9D',
  surface: { secondary: '#F8FAFC' }
};

interface MacroProfile {
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

interface NutritionalGoals {
  calories: number;
  macros: MacroProfile;
  hydration: number;
  mealTiming: string[];
}

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  category: string;
}

const CalorieCalculatorScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('calculator');
  const [userStats, setUserStats] = useState({
    age: '',
    height: '',
    weight: '',
    gender: 'male',
    activityLevel: '1.375',
    goal: 'maintain'
  });
  const [results, setResults] = useState<NutritionalGoals | null>(null);
  const [dailyLog, setDailyLog] = useState<FoodItem[]>([]);
  const [showFoodDatabase, setShowFoodDatabase] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const activityLevels = {
    '1.2': 'Sedentary (office job)',
    '1.375': 'Light activity (1-3 days/week)',
    '1.55': 'Moderate activity (3-5 days/week)',
    '1.725': 'Very active (6-7 days/week)',
    '1.9': 'Extremely active (2x/day, intense)'
  };

  const goals = {
    'lose': { name: 'Weight Loss', modifier: -0.2, color: Colors.neonRed },
    'maintain': { name: 'Maintain Weight', modifier: 0, color: Colors.neonGreen },
    'gain': { name: 'Muscle Gain', modifier: 0.15, color: Colors.neonBlue }
  };

  const foodDatabase: FoodItem[] = [
    { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, category: 'Protein' },
    { name: 'Brown Rice (100g)', calories: 111, protein: 2.6, carbs: 22, fats: 0.9, fiber: 1.8, category: 'Carbs' },
    { name: 'Avocado (100g)', calories: 160, protein: 2, carbs: 9, fats: 15, fiber: 7, category: 'Fats' },
    { name: 'Broccoli (100g)', calories: 34, protein: 2.8, carbs: 7, fats: 0.4, fiber: 2.6, category: 'Vegetables' },
    { name: 'Almonds (30g)', calories: 170, protein: 6, carbs: 6, fats: 15, fiber: 4, category: 'Nuts' },
    { name: 'Greek Yogurt (100g)', calories: 59, protein: 10, carbs: 3.6, fats: 0.4, fiber: 0, category: 'Protein' },
    { name: 'Quinoa (100g)', calories: 120, protein: 4.4, carbs: 22, fats: 1.9, fiber: 2.8, category: 'Carbs' },
    { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fats: 13, fiber: 0, category: 'Protein' },
    { name: 'Sweet Potato (100g)', calories: 86, protein: 1.6, carbs: 20, fats: 0.1, fiber: 3, category: 'Carbs' },
    { name: 'Spinach (100g)', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2, category: 'Vegetables' }
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const calculateNutrition = () => {
    const { age, height, weight, gender, activityLevel, goal } = userStats;
    
    if (!age || !height || !weight) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    // Enhanced BMR calculation (Mifflin-St Jeor Equation)
    const ageNum = parseInt(age);
    const heightNum = parseInt(height);
    const weightNum = parseInt(weight);
    const activityFactor = parseFloat(activityLevel);

    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    const tdee = bmr * activityFactor;
    const goalModifier = goals[goal].modifier;
    const calories = Math.round(tdee * (1 + goalModifier));

    // Advanced macro calculation based on goal
    let proteinRatio, carbRatio, fatRatio;
    
    switch (goal) {
      case 'lose':
        proteinRatio = 0.35; // Higher protein for muscle preservation
        fatRatio = 0.25;
        carbRatio = 0.40;
        break;
      case 'gain':
        proteinRatio = 0.25; // Balanced for muscle building
        fatRatio = 0.20;
        carbRatio = 0.55;
        break;
      default: // maintain
        proteinRatio = 0.30;
        fatRatio = 0.25;
        carbRatio = 0.45;
    }

    const macros: MacroProfile = {
      protein: Math.round((calories * proteinRatio) / 4), // 4 cal per gram
      carbs: Math.round((calories * carbRatio) / 4), // 4 cal per gram
      fats: Math.round((calories * fatRatio) / 9), // 9 cal per gram
      fiber: Math.round(calories / 1000 * 14) // 14g per 1000 calories
    };

    // Neural optimization meal timing
    const mealTiming = [
      '7:00 AM - High protein breakfast',
      '10:00 AM - Pre-workout snack',
      '12:30 PM - Balanced lunch',
      '3:30 PM - Post-workout protein',
      '6:30 PM - Light dinner',
      '9:00 PM - Casein protein (if needed)'
    ];

    const nutritionalGoals: NutritionalGoals = {
      calories,
      macros,
      hydration: Math.round(weightNum * 0.035), // 35ml per kg body weight
      mealTiming
    };

    setResults(nutritionalGoals);
  };

  const addFoodToLog = (food: FoodItem) => {
    setDailyLog(prev => [...prev, food]);
    setShowFoodDatabase(false);
  };

  const removeFoodFromLog = (index: number) => {
    setDailyLog(prev => prev.filter((_, i) => i !== index));
  };

  const getTotalNutrition = () => {
    return dailyLog.reduce((total, food) => ({
      calories: total.calories + food.calories,
      protein: total.protein + food.protein,
      carbs: total.carbs + food.carbs,
      fats: total.fats + food.fats,
      fiber: total.fiber + food.fiber
    }), { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const macroChartData = results ? [
    { name: 'Protein', population: results.macros.protein, color: Colors.neonRed, legendFontColor: '#333' },
    { name: 'Carbs', population: results.macros.carbs, color: Colors.neonBlue, legendFontColor: '#333' },
    { name: 'Fats', population: results.macros.fats, color: Colors.neonYellow, legendFontColor: '#333' }
  ] : [];

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{title}</Text>
    </TouchableOpacity>
  );

  const MacroCard = ({ title, current, target, unit, color }) => (
    <GlassPanel style={[styles.macroCard, { borderTopColor: color, borderTopWidth: 3 }]}>
      <Text style={styles.macroTitle}>{title}</Text>
      <Text style={[styles.macroValue, { color }]}>{current}{unit}</Text>
      <Text style={styles.macroTarget}>Goal: {target}{unit}</Text>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { 
              width: `${getProgressPercentage(current, target)}%`,
              backgroundColor: color
            }
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {getProgressPercentage(current, target)}% Complete
      </Text>
    </GlassPanel>
  );

  const renderCalculatorTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <GlassPanel style={styles.inputPanel}>
        <Text style={styles.sectionTitle}>📊 Personal Information</Text>
        
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age (years)</Text>
            <TextInput
              style={styles.input}
              value={userStats.age}
              onChangeText={(text) => setUserStats(prev => ({ ...prev, age: text }))}
              keyboardType="numeric"
              placeholder="30"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={userStats.weight}
              onChangeText={(text) => setUserStats(prev => ({ ...prev, weight: text }))}
              keyboardType="numeric"
              placeholder="70"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={userStats.height}
            onChangeText={(text) => setUserStats(prev => ({ ...prev, height: text }))}
            keyboardType="numeric"
            placeholder="175"
          />
        </View>

        <View style={styles.selectorGroup}>
          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.genderSelector}>
            <TouchableOpacity
              style={[styles.genderButton, userStats.gender === 'male' && styles.genderButtonActive]}
              onPress={() => setUserStats(prev => ({ ...prev, gender: 'male' }))}
            >
              <Text style={[styles.genderText, userStats.gender === 'male' && styles.genderTextActive]}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, userStats.gender === 'female' && styles.genderButtonActive]}
              onPress={() => setUserStats(prev => ({ ...prev, gender: 'female' }))}
            >
              <Text style={[styles.genderText, userStats.gender === 'female' && styles.genderTextActive]}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.selectorGroup}>
          <Text style={styles.inputLabel}>Activity Level</Text>
          {Object.entries(activityLevels).map(([value, label]) => (
            <TouchableOpacity
              key={value}
              style={[styles.activityOption, userStats.activityLevel === value && styles.activityOptionActive]}
              onPress={() => setUserStats(prev => ({ ...prev, activityLevel: value }))}
            >
              <Text style={[styles.activityText, userStats.activityLevel === value && styles.activityTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.selectorGroup}>
          <Text style={styles.inputLabel}>Goal</Text>
          {Object.entries(goals).map(([key, goal]) => (
            <TouchableOpacity
              key={key}
              style={[styles.goalOption, userStats.goal === key && styles.goalOptionActive]}
              onPress={() => setUserStats(prev => ({ ...prev, goal: key }))}
            >
              <View style={[styles.goalIndicator, { backgroundColor: goal.color }]} />
              <Text style={[styles.goalText, userStats.goal === key && styles.goalTextActive]}>
                {goal.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={calculateNutrition}>
          <Ionicons name="calculator" size={20} color="#000" />
          <Text style={styles.calculateButtonText}>CALCULATE NUTRITION</Text>
        </TouchableOpacity>
      </GlassPanel>

      {results && (
        <>
          {/* Results Summary */}
          <GlassPanel style={styles.resultsPanel}>
            <Text style={styles.sectionTitle}>🎯 Your Neural Nutrition Plan</Text>
            
            <View style={styles.calorieDisplay}>
              <Text style={styles.calorieValue}>{results.calories}</Text>
              <Text style={styles.calorieLabel}>Daily Calories</Text>
            </View>

            <View style={styles.macroSummary}>
              <View style={styles.macroItem}>
                <Text style={[styles.macroNumber, { color: Colors.neonRed }]}>{results.macros.protein}g</Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={[styles.macroNumber, { color: Colors.neonBlue }]}>{results.macros.carbs}g</Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={[styles.macroNumber, { color: Colors.neonYellow }]}>{results.macros.fats}g</Text>
                <Text style={styles.macroLabel}>Fats</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={[styles.macroNumber, { color: Colors.neonGreen }]}>{results.macros.fiber}g</Text>
                <Text style={styles.macroLabel}>Fiber</Text>
              </View>
            </View>
          </GlassPanel>

          {/* Macro Distribution Chart */}
          <GlassPanel style={styles.chartPanel}>
            <Text style={styles.sectionTitle}>📈 Macro Distribution</Text>
            <PieChart
              data={macroChartData}
              width={width - 64}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </GlassPanel>

          {/* Neural Timing */}
          <GlassPanel style={styles.timingPanel}>
            <Text style={styles.sectionTitle}>⏰ Neural Optimization Timing</Text>
            {results.mealTiming.map((timing, index) => (
              <View key={index} style={styles.timingItem}>
                <Ionicons name="time" size={16} color={Colors.neonBlue} />
                <Text style={styles.timingText}>{timing}</Text>
              </View>
            ))}
          </GlassPanel>

          {/* Hydration Guide */}
          <GlassPanel style={styles.hydrationPanel}>
            <Text style={styles.sectionTitle}>💧 Daily Hydration Target</Text>
            <View style={styles.hydrationDisplay}>
              <Ionicons name="water" size={32} color={Colors.neonBlue} />
              <Text style={styles.hydrationValue}>{results.hydration}L</Text>
              <Text style={styles.hydrationLabel}>Water per day</Text>
            </View>
            <Text style={styles.hydrationTip}>
              💡 Drink 500ml upon waking, 250ml before each meal, and sip throughout the day
            </Text>
          </GlassPanel>
        </>
      )}
    </ScrollView>
  );

  const renderTrackingTab = () => {
    const totalNutrition = getTotalNutrition();
    
    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {results && (
          <View style={styles.macroGrid}>
            <MacroCard
              title="Calories"
              current={totalNutrition.calories}
              target={results.calories}
              unit=""
              color={Colors.neonGreen}
            />
            <MacroCard
              title="Protein"
              current={Math.round(totalNutrition.protein)}
              target={results.macros.protein}
              unit="g"
              color={Colors.neonRed}
            />
            <MacroCard
              title="Carbs"
              current={Math.round(totalNutrition.carbs)}
              target={results.macros.carbs}
              unit="g"
              color={Colors.neonBlue}
            />
            <MacroCard
              title="Fats"
              current={Math.round(totalNutrition.fats)}
              target={results.macros.fats}
              unit="g"
              color={Colors.neonYellow}
            />
          </View>
        )}

        {/* Add Food Button */}
        <GlassPanel style={styles.addFoodPanel}>
          <TouchableOpacity 
            style={styles.addFoodButton} 
            onPress={() => setShowFoodDatabase(true)}
          >
            <Ionicons name="add-circle" size={24} color={Colors.neonGreen} />
            <Text style={styles.addFoodText}>ADD FOOD</Text>
          </TouchableOpacity>
        </GlassPanel>

        {/* Food Log */}
        <GlassPanel style={styles.foodLogPanel}>
          <Text style={styles.sectionTitle}>🍽️ Today's Food Log</Text>
          {dailyLog.length === 0 ? (
            <Text style={styles.emptyLogText}>No foods logged yet. Tap "ADD FOOD" to start tracking!</Text>
          ) : (
            dailyLog.map((food, index) => (
              <View key={index} style={styles.foodLogItem}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodStats}>
                    {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fats}g fat
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeFoodFromLog(index)}>
                  <Ionicons name="trash" size={20} color={Colors.neonRed} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </GlassPanel>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {/* Header */}
        <GlassPanel style={{ marginHorizontal: 16, marginTop: 40 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={Colors.neonGreen} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>NUTRITION OPTIMIZER</Text>
            <Ionicons name="nutrition" size={24} color={Colors.neonGreen} />
          </View>
        </GlassPanel>

        {/* Tab Navigation */}
        <GlassPanel style={{ marginHorizontal: 16, marginTop: 16 }}>
          <View style={styles.tabNavigation}>
            <TabButton
              title="Calculator"
              isActive={activeTab === 'calculator'}
              onPress={() => setActiveTab('calculator')}
            />
            <TabButton
              title="Food Tracking"
              isActive={activeTab === 'tracking'}
              onPress={() => setActiveTab('tracking')}
            />
          </View>
        </GlassPanel>

        {/* Tab Content */}
        {activeTab === 'calculator' ? renderCalculatorTab() : renderTrackingTab()}

        {/* Food Database Modal */}
        <Modal visible={showFoodDatabase} animationType="slide" presentationStyle="pageSheet">
          <View style={styles.modalContainer}>
            <GlassPanel style={{ marginTop: 50, marginHorizontal: 16 }}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowFoodDatabase(false)}>
                  <Ionicons name="close" size={24} color={Colors.neonGreen} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Food Database</Text>
                <View style={{ width: 24 }} />
              </View>
            </GlassPanel>

            <GlassPanel style={{ marginHorizontal: 16, marginTop: 16 }}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search foods..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </GlassPanel>

            <ScrollView style={styles.foodList}>
              {filteredFoods.map((food, index) => (
                <GlassPanel key={index} style={{ marginHorizontal: 16, marginBottom: 12 }}>
                  <TouchableOpacity
                    style={styles.foodItem}
                    onPress={() => addFoodToLog(food)}
                  >
                    <View style={styles.foodDetails}>
                      <Text style={styles.foodItemName}>{food.name}</Text>
                      <Text style={styles.foodCategory}>{food.category}</Text>
                      <Text style={styles.foodNutrition}>
                        {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fats}g fat
                      </Text>
                    </View>
                    <Ionicons name="add" size={24} color={Colors.neonGreen} />
                  </TouchableOpacity>
                </GlassPanel>
              ))}
            </ScrollView>
          </View>
        </Modal>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neonGreen,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
    letterSpacing: 2,
  },
  tabNavigation: {
    flexDirection: 'row',
    padding: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabButtonActive: {
    backgroundColor: Colors.neonGreen,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  tabTextActive: {
    color: '#000',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  inputPanel: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neonBlue,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    flex: 1,
    marginRight: 8,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectorGroup: {
    marginBottom: 20,
  },
  genderSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  genderButtonActive: {
    backgroundColor: Colors.neonGreen,
    borderColor: Colors.neonGreen,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  genderTextActive: {
    color: '#000',
  },
  activityOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activityOptionActive: {
    backgroundColor: `${Colors.neonBlue}20`,
    borderColor: Colors.neonBlue,
  },
  activityText: {
    fontSize: 14,
    color: '#666',
  },
  activityTextActive: {
    color: Colors.neonBlue,
    fontWeight: '600',
  },
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  goalOptionActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: Colors.neonGreen,
  },
  goalIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  goalText: {
    fontSize: 14,
    color: '#666',
  },
  goalTextActive: {
    color: '#333',
    fontWeight: '600',
  },
  calculateButton: {
    backgroundColor: Colors.neonGreen,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  resultsPanel: {
    padding: 20,
    marginBottom: 20,
  },
  calorieDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.neonGreen,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  calorieLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  macroSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  macroLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  chartPanel: {
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  timingPanel: {
    padding: 20,
    marginBottom: 20,
  },
  timingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  hydrationPanel: {
    padding: 20,
    marginBottom: 20,
  },
  hydrationDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  hydrationValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.neonBlue,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
    marginTop: 8,
  },
  hydrationLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  hydrationTip: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  macroCard: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
  },
  macroTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
    marginBottom: 4,
  },
  macroTarget: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  addFoodPanel: {
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  addFoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.neonGreen}20`,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.neonGreen,
  },
  addFoodText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.neonGreen,
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  foodLogPanel: {
    padding: 20,
    marginBottom: 20,
  },
  emptyLogText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  foodLogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  foodStats: {
    fontSize: 12,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.surface.secondary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neonGreen,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  foodList: {
    flex: 1,
    padding: 16,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  foodDetails: {
    flex: 1,
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  foodCategory: {
    fontSize: 12,
    color: Colors.neonBlue,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
  foodNutrition: {
    fontSize: 12,
    color: '#666',
  },
});

export default CalorieCalculatorScreen;
