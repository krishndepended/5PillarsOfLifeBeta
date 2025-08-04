// src/components/IndianRecipeCard.tsx - AUTHENTIC RECIPE DISPLAY
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Modal,
  ScrollView,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CulturalContentManager, { IndianRecipe } from '../utils/CulturalContentManager';
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
};

interface IndianRecipeCardProps {
  category?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  compact?: boolean;
}

const IndianRecipeCard: React.FC<IndianRecipeCardProps> = ({
  category,
  compact = false
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [recipes, setRecipes] = useState<IndianRecipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<IndianRecipe | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const culturalManager = CulturalContentManager.getInstance();

  useEffect(() => {
    const currentHour = new Date().getHours();
    let mealCategory: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'lunch';
    
    if (currentHour < 10) mealCategory = 'breakfast';
    else if (currentHour < 16) mealCategory = 'lunch';
    else if (currentHour < 20) mealCategory = 'dinner';
    else mealCategory = 'snack';

    const finalCategory = category || mealCategory;
    const recipeList = culturalManager.getRecipeRecommendations(finalCategory);
    setRecipes(recipeList);

    PremiumAnimations.createFadeAnimation(fadeAnim, 1, 800).start();
  }, [category]);

  const handleRecipePress = (recipe: IndianRecipe) => {
    HapticFeedback.medium();
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  const handleCloseModal = () => {
    HapticFeedback.light();
    setShowRecipeModal(false);
    setSelectedRecipe(null);
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'vata': return '#8B5CF6';
      case 'pitta': return '#EF4444';
      case 'kapha': return '#10B981';
      case 'tridoshic': return '#F59E0B';
      default: return Colors.diet;
    }
  };

  const renderRecipeItem = ({ item, index }: { item: IndianRecipe; index: number }) => (
    <Animated.View
      style={[
        styles.recipeItem,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30 * (index + 1), 0],
            })
          }]
        }
      ]}
    >
      <TouchableOpacity
        style={styles.recipeCard}
        onPress={() => handleRecipePress(item)}
        onPressIn={() => HapticFeedback.light()}
      >
        <LinearGradient
          colors={[getDoshaColor(item.ayurvedicProperties.dosha), `${getDoshaColor(item.ayurvedicProperties.dosha)}CC`]}
          style={styles.recipeGradient}
        >
          <View style={styles.recipeHeader}>
            <Ionicons name="restaurant" size={24} color="#FFFFFF" />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>{item.name}</Text>
              <Text style={styles.recipeRegion}>{item.region} • {item.category}</Text>
            </View>
            <View style={styles.doshaIndicator}>
              <Text style={styles.doshaText}>{item.ayurvedicProperties.dosha.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.recipeDescription} numberOfLines={2}>
            {item.culturalSignificance}
          </Text>

          <View style={styles.recipeFooter}>
            <View style={styles.timeInfo}>
              <Ionicons name="time" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.timeText}>{item.prepTime + item.cookTime} min</Text>
            </View>
            <View style={styles.servingInfo}>
              <Ionicons name="people" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.servingText}>Serves {item.serves}</Text>
            </View>
            <View style={styles.benefits}>
              <Text style={styles.benefitText} numberOfLines={1}>
                {item.ayurvedicProperties.benefits.slice(0, 2).join(', ')}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderRecipeModal = () => {
    if (!selectedRecipe) return null;

    return (
      <Modal
        visible={showRecipeModal}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={[getDoshaColor(selectedRecipe.ayurvedicProperties.dosha), `${getDoshaColor(selectedRecipe.ayurvedicProperties.dosha)}CC`]}
            style={styles.modalHeader}
          >
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.modalHeaderInfo}>
              <Text style={styles.modalRecipeName}>{selectedRecipe.name}</Text>
              <Text style={styles.modalRecipeRegion}>
                {selectedRecipe.region} • {selectedRecipe.category.charAt(0).toUpperCase() + selectedRecipe.category.slice(1)}
              </Text>
            </View>
          </LinearGradient>

          <ScrollView style={styles.modalContent} contentContainerStyle={styles.modalScrollContent}>
            {/* Cultural Significance */}
            <View style={styles.significanceSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="leaf" size={20} color={Colors.success} />
                <Text style={styles.sectionTitle}>Cultural Significance</Text>
              </View>
              <Text style={styles.significanceText}>{selectedRecipe.culturalSignificance}</Text>
            </View>

            {/* Ayurvedic Properties */}
            <View style={styles.ayurvedicSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="medical" size={20} color={getDoshaColor(selectedRecipe.ayurvedicProperties.dosha)} />
                <Text style={styles.sectionTitle}>Ayurvedic Properties</Text>
              </View>
              <View style={styles.doshaInfo}>
                <Text style={styles.doshaLabel}>Dosha Balance:</Text>
                <View style={[styles.doshaBadge, { backgroundColor: getDoshaColor(selectedRecipe.ayurvedicProperties.dosha) }]}>
                  <Text style={styles.doshaText}>{selectedRecipe.ayurvedicProperties.dosha.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.benefitsList}>
                {selectedRecipe.ayurvedicProperties.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Ingredients */}
            <View style={styles.ingredientsSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="list" size={20} color={Colors.warning} />
                <Text style={styles.sectionTitle}>Sacred Ingredients</Text>
              </View>
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientName}>
                    {ingredient.name} - {ingredient.quantity}
                  </Text>
                  <Text style={styles.ingredientProperty}>
                    Ayurvedic: {ingredient.ayurvedicProperty}
                  </Text>
                </View>
              ))}
            </View>

            {/* Instructions */}
            <View style={styles.instructionsSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="clipboard" size={20} color={Colors.accent} />
                <Text style={styles.sectionTitle}>Cooking Instructions</Text>
              </View>
              {selectedRecipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>

            {/* Nutritional Benefits */}
            <View style={styles.nutritionSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="fitness" size={20} color={Colors.success} />
                <Text style={styles.sectionTitle}>Health Benefits</Text>
              </View>
              <View style={styles.nutritionList}>
                {selectedRecipe.nutritionalBenefits.map((benefit, index) => (
                  <View key={index} style={styles.nutritionItem}>
                    <Ionicons name="nutrition" size={16} color={Colors.success} />
                    <Text style={styles.nutritionText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  if (recipes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="restaurant" size={24} color={Colors.diet} />
        <Text style={styles.loadingText}>Loading sacred recipes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="restaurant" size={24} color={Colors.diet} />
        <Text style={styles.headerTitle}>Authentic Indian Recipes</Text>
        <Text style={styles.headerSubtitle}>
          {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Recommended for now'}
        </Text>
      </View>

      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recipeList}
      />

      {renderRecipeModal()}
    </View>
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
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  recipeList: {
    paddingRight: 16,
  },
  recipeItem: {
    marginRight: 16,
    width: 280,
  },
  recipeCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  recipeGradient: {
    padding: 16,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recipeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  recipeRegion: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  doshaIndicator: {
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
  recipeDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    marginBottom: 12,
  },
  recipeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  servingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servingText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  benefits: {
    flex: 1,
    alignItems: 'flex-end',
  },
  benefitText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
  },
  closeButton: {
    padding: 4,
    marginRight: 16,
  },
  modalHeaderInfo: {
    flex: 1,
  },
  modalRecipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalRecipeRegion: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
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
  significanceSection: {
    marginBottom: 24,
  },
  significanceText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  ayurvedicSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: `${Colors.success}10`,
    borderRadius: 12,
  },
  doshaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doshaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  doshaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientsSection: {
    marginBottom: 24,
  },
  ingredientItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  ingredientProperty: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  instructionsSection: {
    marginBottom: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  nutritionSection: {
    marginBottom: 24,
  },
  nutritionList: {
    gap: 8,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutritionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
});

export default IndianRecipeCard;
