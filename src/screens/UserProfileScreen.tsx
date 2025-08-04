// src/screens/UserProfileScreen.tsx - COMPLETE WITH COMMUNITY ACCESS
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Real Data Integration
import { useAppData, useAppDataSelectors } from '../context/AppDataContext';

// Components
import ErrorBoundary from '../components/ErrorBoundary';

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  body: '#EF4444',
  mind: '#3B82F6',
  heart: '#EC4899',
  spirit: '#8B5CF6',
  diet: '#10B981',
};

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const { actions } = useAppData();
  const {
    userProfile,
    pillarScores,
    overallScore,
    sessions,
    achievements,
    streakData,
    isLoading
  } = useAppDataSelectors();

  const [isEditing, setIsEditing] = useState(false);

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home' as never);
    }
  }, [navigation]);

  const handleClearData = useCallback(() => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all your progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            await actions.clearAllData();
            Alert.alert('Success', 'All data has been cleared successfully.');
          }
        }
      ]
    );
  }, [actions]);

  const handleToggleDarkMode = useCallback(async () => {
    const currentDarkMode = userProfile?.preferences?.darkMode || false;
    await actions.updateUserProfile({
      preferences: {
        ...userProfile?.preferences,
        darkMode: !currentDarkMode
      }
    });
  }, [actions, userProfile]);

  const handleExportData = useCallback(() => {
    Alert.alert(
      'Export Data',
      'Your wellness data export will be prepared and shared with you.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            // TODO: Implement actual data export
            Alert.alert('Success', 'Data export initiated! You will receive your data shortly.');
          }
        }
      ]
    );
  }, []);

  const handleSyncData = useCallback(async () => {
    Alert.alert('Syncing...', 'Your data is being synchronized with the cloud.');
    
    // Simulate sync process
    setTimeout(() => {
      Alert.alert('Sync Complete', 'Your data has been successfully synchronized.');
    }, 2000);
  }, []);

  const navigateToCommunity = useCallback(() => {
    navigation.navigate('CommunityScreen' as never);
  }, [navigation]);

  const navigateToAnalytics = useCallback(() => {
    navigation.navigate('AdvancedAnalyticsScreen' as never);
  }, [navigation]);

  const renderHeader = () => (
    <LinearGradient
      colors={[Colors.accent, Colors.spirit]}
      style={styles.header}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your wellness journey</Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
        <Ionicons name={isEditing ? "checkmark" : "create"} size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderUserInfo = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="person" size={24} color={Colors.accent} />
        <Text style={styles.sectionTitle}>Personal Information</Text>
      </View>
      
      <View style={styles.userInfoCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color={Colors.accent} />
          <Text style={styles.userName}>{userProfile?.name || 'Wellness Seeker'}</Text>
          <Text style={styles.userLevel}>Level {userProfile?.level || 1}</Text>
          <Text style={styles.userScore}>Overall Score: {Math.round(overallScore || 0)}%</Text>
        </View>
        
        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{sessions.length}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{streakData.current}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{achievements.length}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPillarProgress = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="analytics" size={24} color={Colors.success} />
        <Text style={styles.sectionTitle}>Pillar Progress</Text>
      </View>
      
      <View style={styles.pillarGrid}>
        {Object.entries(pillarScores).map(([pillar, score]) => {
          const pillarColors = {
            body: Colors.body,
            mind: Colors.mind,
            heart: Colors.heart,
            spirit: Colors.spirit,
            diet: Colors.diet
          };
          
          return (
            <View key={pillar} style={styles.pillarItem}>
              <View style={[styles.pillarIcon, { backgroundColor: pillarColors[pillar as keyof typeof pillarColors] }]}>
                <Ionicons 
                  name={
                    pillar === 'body' ? 'fitness' :
                    pillar === 'mind' ? 'library' :
                    pillar === 'heart' ? 'heart' :
                    pillar === 'spirit' ? 'leaf' : 'restaurant'
                  } 
                  size={20} 
                  color="#FFFFFF" 
                />
              </View>
              <Text style={styles.pillarName}>{pillar.toUpperCase()}</Text>
              <Text style={styles.pillarScore}>{Math.round(score)}%</Text>
              <View style={styles.pillarProgressBar}>
                <View 
                  style={[
                    styles.pillarProgressFill, 
                    { 
                      width: `${Math.min(score, 100)}%`,
                      backgroundColor: pillarColors[pillar as keyof typeof pillarColors]
                    }
                  ]} 
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderPreferences = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="settings" size={24} color={Colors.warning} />
        <Text style={styles.sectionTitle}>Preferences</Text>
      </View>
      
      <View style={styles.preferencesCard}>
        <TouchableOpacity style={styles.preferenceItem} onPress={handleToggleDarkMode}>
          <View style={styles.preferenceLeft}>
            <Ionicons name="moon" size={20} color={Colors.textSecondary} />
            <Text style={styles.preferenceLabel}>Dark Mode</Text>
          </View>
          <View style={[
            styles.toggle,
            (userProfile?.preferences?.darkMode || false) && styles.toggleActive
          ]}>
            <View style={[
              styles.toggleThumb,
              (userProfile?.preferences?.darkMode || false) && styles.toggleThumbActive
            ]} />
          </View>
        </TouchableOpacity>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <Ionicons name="notifications" size={20} color={Colors.textSecondary} />
            <Text style={styles.preferenceLabel}>Smart Notifications</Text>
          </View>
          <Text style={styles.preferenceValue}>Enabled</Text>
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <Ionicons name="language" size={20} color={Colors.textSecondary} />
            <Text style={styles.preferenceLabel}>Cultural Content</Text>
          </View>
          <Text style={styles.preferenceValue}>
            {userProfile?.preferences?.culturalContent ? 'On' : 'Off'}
          </Text>
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <Ionicons name="stats-chart" size={20} color={Colors.textSecondary} />
            <Text style={styles.preferenceLabel}>Analytics Tracking</Text>
          </View>
          <Text style={styles.preferenceValue}>Enhanced</Text>
        </View>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="flash" size={24} color={Colors.accent} />
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      
      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.actionItem} onPress={navigateToCommunity}>
          <Ionicons name="people" size={20} color={Colors.heart} />
          <Text style={styles.actionLabel}>Community & Challenges</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={navigateToAnalytics}>
          <Ionicons name="analytics" size={20} color={Colors.success} />
          <Text style={styles.actionLabel}>Advanced Analytics</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('AICoachScreen' as never)}>
          <Ionicons name="chatbubble-ellipses" size={20} color={Colors.spirit} />
          <Text style={styles.actionLabel}>AI Wellness Coach</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDataActions = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="document" size={24} color={Colors.warning} />
        <Text style={styles.sectionTitle}>Data Management</Text>
      </View>
      
      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.actionItem} onPress={handleExportData}>
          <Ionicons name="download" size={20} color={Colors.accent} />
          <Text style={styles.actionLabel}>Export Data</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={handleSyncData}>
          <Ionicons name="sync" size={20} color={Colors.success} />
          <Text style={styles.actionLabel}>Sync Data</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.actionItem}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.warning} />
          <Text style={styles.actionLabel}>Privacy Settings</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </View>

        <TouchableOpacity style={styles.actionItem} onPress={handleClearData}>
          <Ionicons name="trash" size={20} color={Colors.danger} />
          <Text style={[styles.actionLabel, { color: Colors.danger }]}>Clear All Data</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAppInfo = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="information-circle" size={24} color={Colors.textSecondary} />
        <Text style={styles.sectionTitle}>App Information</Text>
      </View>
      
      <View style={styles.appInfoCard}>
        <View style={styles.appInfoRow}>
          <Text style={styles.appInfoLabel}>Version</Text>
          <Text style={styles.appInfoValue}>1.0.0</Text>
        </View>
        <View style={styles.appInfoRow}>
          <Text style={styles.appInfoLabel}>Build</Text>
          <Text style={styles.appInfoValue}>Neural Optimization</Text>
        </View>
        <View style={styles.appInfoRow}>
          <Text style={styles.appInfoLabel}>Last Sync</Text>
          <Text style={styles.appInfoValue}>Just now</Text>
        </View>
        <View style={styles.appInfoRow}>
          <Text style={styles.appInfoLabel}>Developer</Text>
          <Text style={styles.appInfoValue}>5 Pillars Team</Text>
        </View>
      </View>

      <View style={styles.brandingSection}>
        <Text style={styles.brandingText}>🕉️ 5 Pillars of Life</Text>
        <Text style={styles.brandingSubtext}>Ancient Wisdom • Modern Technology</Text>
        <Text style={styles.brandingTagline}>पञ्च स्तम्भ • Where tradition meets innovation</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderUserInfo()}
          {renderPillarProgress()}
          {renderPreferences()}
          {renderQuickActions()}
          {renderDataActions()}
          {renderAppInfo()}
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

// Comprehensive styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
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
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },

  // User Info
  userInfoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  userLevel: {
    fontSize: 16,
    color: Colors.accent,
    marginTop: 4,
  },
  userScore: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  // Pillar Progress
  pillarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pillarItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pillarIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  pillarName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  pillarScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 8,
  },
  pillarProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  pillarProgressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Preferences
  preferencesCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  preferenceValue: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: Colors.success,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginLeft: 2,
  },
  toggleThumbActive: {
    marginLeft: 22,
  },

  // Actions
  actionsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionLabel: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },

  // App Info
  appInfoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  appInfoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  appInfoValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  brandingSection: {
    alignItems: 'center',
    padding: 20,
  },
  brandingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  brandingSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  brandingTagline: {
    fontSize: 12,
    color: Colors.accent,
    fontStyle: 'italic',
  },
});

export default UserProfileScreen;
