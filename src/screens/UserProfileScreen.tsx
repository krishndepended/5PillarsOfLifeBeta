// src/screens/UserProfileScreen.tsx - COMPLETE FUNCTIONAL PROFILE WITH REAL SETTINGS
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Animated,
  Switch,
  Alert,
  TextInput,
  Modal,
  Share
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDataSelectors, useAppData } from '../context/AppDataContext';
import { usePerformanceOptimization, PerformanceMonitor } from '../hooks/usePerformanceOptimization';
import { safeNavigate, safeGet } from '../utils/SafeNavigation';
import NotificationManager from '../utils/NotificationManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Colors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  spirit: '#8B5CF6',
  heart: '#EC4899',
};

interface UserSettings {
  notifications: boolean;
  reminderTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  preferredPillars: string[];
  autoSync: boolean;
  darkMode: boolean;
  language: string;
  weeklyGoal: number;
}

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { actions } = useAppData();
  
  // SAFE ACCESS: Use selectors with error boundaries
  const {
    userProfile,
    pillarScores,
    sessionData,
    achievements,
    sessionHistory,
    isInitialized
  } = useAppDataSelectors();

  const { measurePerformance } = usePerformanceOptimization();
  const notificationManager = NotificationManager.getInstance();

  // Enhanced state management
  const [localSettings, setLocalSettings] = useState<UserSettings>({
    notifications: true,
    reminderTime: '09:00',
    difficulty: 'beginner',
    preferredPillars: [],
    autoSync: true,
    darkMode: false,
    language: 'en',
    weeklyGoal: 21
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const measurement = measurePerformance('UserProfileScreen');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      measurement.end();
    });

    // Initialize settings from user profile
    initializeSettings();
  }, [fadeAnim, userProfile]);

  const initializeSettings = () => {
    if (userProfile && userProfile.preferences) {
      setLocalSettings({
        notifications: safeGet(userProfile, 'preferences.notifications', true),
        reminderTime: safeGet(userProfile, 'preferences.reminderTime', '09:00'),
        difficulty: safeGet(userProfile, 'preferences.difficulty', 'beginner'),
        preferredPillars: safeGet(userProfile, 'preferences.preferredPillars', []),
        autoSync: safeGet(userProfile, 'preferences.autoSync', true),
        darkMode: safeGet(userProfile, 'preferences.darkMode', false),
        language: safeGet(userProfile, 'preferences.language', 'en'),
        weeklyGoal: safeGet(sessionData, 'weeklyGoal', 21)
      });
      setTempName(safeGet(userProfile, 'name', 'Neural Optimizer'));
    }
  };

  // FUNCTIONAL HANDLERS: Real settings that affect app behavior
  const handleSettingChange = async (key: keyof UserSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    
    try {
      // Update in global state
      if (actions && actions.updateUserProfile) {
        actions.updateUserProfile({
          preferences: {
            ...userProfile.preferences,
            [key]: value
          }
        });
      }

      // Handle specific setting changes
      switch (key) {
        case 'notifications':
          await handleNotificationToggle(value);
          break;
        case 'reminderTime':
          await handleReminderTimeChange(value);
          break;
        case 'weeklyGoal':
          await handleWeeklyGoalChange(value);
          break;
        case 'difficulty':
          await handleDifficultyChange(value);
          break;
        case 'preferredPillars':
          await handlePreferredPillarsChange(value);
          break;
      }
    } catch (error) {
      console.warn('Failed to update setting:', error);
      Alert.alert('Error', 'Failed to update setting. Please try again.');
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        await notificationManager.initialize();
        await notificationManager.scheduleDailyReminder(localSettings.reminderTime, true);
        Alert.alert('✅ Notifications Enabled', 'You will receive daily optimization reminders.');
      } else {
        await notificationManager.cancelAllNotifications();
        Alert.alert('🔕 Notifications Disabled', 'Daily reminders have been turned off.');
      }
    } catch (error) {
      console.error('Notification toggle error:', error);
    }
  };

  const handleReminderTimeChange = async (time: string) => {
    try {
      if (localSettings.notifications) {
        await notificationManager.scheduleDailyReminder(time, true);
        Alert.alert('⏰ Reminder Updated', `Daily reminders set for ${time}`);
      }
    } catch (error) {
      console.error('Reminder time change error:', error);
    }
  };

  const handleWeeklyGoalChange = async (goal: number) => {
    try {
      if (actions && actions.updateSessionData) {
        actions.updateSessionData({ weeklyGoal: goal });
      }
      Alert.alert('🎯 Goal Updated', `Weekly goal set to ${goal} sessions`);
    } catch (error) {
      console.error('Weekly goal change error:', error);
    }
  };

  const handleDifficultyChange = async (difficulty: string) => {
    Alert.alert(
      '🎚️ Difficulty Updated', 
      `AI recommendations will now be adjusted for ${difficulty} level training.`
    );
  };

  const handlePreferredPillarsChange = async (pillars: string[]) => {
    Alert.alert(
      '🎯 Preferences Updated', 
      `AI will prioritize recommendations for: ${pillars.join(', ')}`
    );
  };

  const handleNameChange = () => {
    if (tempName.trim()) {
      actions.updateUserProfile({ name: tempName.trim() });
      setIsEditingName(false);
      Alert.alert('✅ Name Updated', `Profile name changed to ${tempName.trim()}`);
    }
  };

  // DATA EXPORT FUNCTIONALITY
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const exportData = {
        userProfile: userProfile,
        pillarScores: pillarScores,
        sessionData: sessionData,
        sessionHistory: sessionHistory.slice(0, 50), // Last 50 sessions
        achievements: achievements,
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0'
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      
      if (Platform.OS === 'web') {
        // Web: Download as file
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `5PillarsOfLife_Export_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
      } else {
        // Mobile: Share functionality
        await Share.share({
          message: jsonString,
          title: '5 Pillars of Life - Data Export',
        });
      }

      Alert.alert('📤 Export Successful', 'Your neural optimization data has been exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('❌ Export Failed', 'Unable to export data. Please try again.');
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

  // DATA IMPORT FUNCTIONALITY
  const handleImportData = () => {
    Alert.alert(
      '📥 Import Data',
      'Import functionality will be available in the next update. Currently, you can restore data from manual backups through the settings.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  // CLOUD SYNC FUNCTIONALITY
  const handleCloudSync = async () => {
    Alert.alert(
      '☁️ Cloud Sync',
      'Cloud synchronization will be available in the premium version. Your data is currently stored locally and can be exported.',
      [
        { text: 'Export Data', onPress: () => setShowExportModal(true) },
        { text: 'OK', style: 'cancel' }
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      '⚠️ Reset All Data',
      'This will permanently delete all your progress, sessions, and achievements. This action cannot be undone.\n\nAre you sure you want to reset everything?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export First', 
          onPress: () => setShowExportModal(true),
          style: 'default'
        },
        { 
          text: 'Reset Everything', 
          style: 'destructive',
          onPress: () => {
            if (actions && actions.resetData) {
              actions.resetData();
              Alert.alert('✅ Reset Complete', 'All data has been reset. Starting fresh neural optimization journey!');
              safeNavigate(navigation, 'Home');
            }
          }
        }
      ]
    );
  };

  // SAFE RENDER: Show loading if not initialized
  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="person" size={48} color={Colors.accent} />
        <Text style={styles.loadingText}>Loading Neural Profile...</Text>
      </View>
    );
  }

  const renderProfileHeader = () => (
    <PerformanceMonitor>
      <View style={styles.profileHeader}>
        <LinearGradient
          colors={[Colors.accent, Colors.spirit]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </View>
            <View style={styles.profileDetails}>
              {isEditingName ? (
                <View style={styles.nameEditContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={tempName}
                    onChangeText={setTempName}
                    onSubmitEditing={handleNameChange}
                    onBlur={handleNameChange}
                    autoFocus
                    maxLength={30}
                  />
                </View>
              ) : (
                <TouchableOpacity onPress={() => setIsEditingName(true)}>
                  <Text style={styles.profileName}>
                    {safeGet(userProfile, 'name', 'Neural Optimizer')} ✏️
                  </Text>
                </TouchableOpacity>
              )}
              <Text style={styles.profileLevel}>Level {safeGet(userProfile, 'level', 1)} Neural Optimizer</Text>
              <Text style={styles.profileStats}>
                {safeGet(userProfile, 'totalSessions', 0)} sessions • {safeGet(userProfile, 'streak', 0)}-day streak
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </PerformanceMonitor>
  );

  const renderFunctionalSettings = () => (
    <PerformanceMonitor>
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Neural Optimization Settings</Text>
        
        <View style={styles.settingCard}>
          {/* Notifications Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={20} color={Colors.accent} />
              <Text style={styles.settingLabel}>Smart Notifications</Text>
            </View>
            <Switch
              value={localSettings.notifications}
              onValueChange={(value) => handleSettingChange('notifications', value)}
              trackColor={{ false: '#E5E7EB', true: Colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Reminder Time */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowTimeModal(true)}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="time" size={20} color={Colors.success} />
              <Text style={styles.settingLabel}>Daily Reminder Time</Text>
            </View>
            <Text style={styles.settingValue}>{localSettings.reminderTime}</Text>
          </TouchableOpacity>

          {/* Difficulty Level */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              const difficulties = ['beginner', 'intermediate', 'advanced'];
              const currentIndex = difficulties.indexOf(localSettings.difficulty);
              const nextIndex = (currentIndex + 1) % difficulties.length;
              handleSettingChange('difficulty', difficulties[nextIndex]);
            }}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="fitness" size={20} color={Colors.warning} />
              <Text style={styles.settingLabel}>AI Difficulty Level</Text>
            </View>
            <Text style={[styles.settingValue, { textTransform: 'capitalize' }]}>
              {localSettings.difficulty}
            </Text>
          </TouchableOpacity>

          {/* Weekly Goal */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              const goals = [14, 21, 28, 35];
              const currentIndex = goals.indexOf(localSettings.weeklyGoal);
              const nextIndex = (currentIndex + 1) % goals.length;
              handleSettingChange('weeklyGoal', goals[nextIndex]);
            }}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="target" size={20} color={Colors.heart} />
              <Text style={styles.settingLabel}>Weekly Goal</Text>
            </View>
            <Text style={styles.settingValue}>{localSettings.weeklyGoal} sessions</Text>
          </TouchableOpacity>

          {/* Auto Sync */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="sync" size={20} color={Colors.spirit} />
              <Text style={styles.settingLabel}>Auto Sync Data</Text>
            </View>
            <Switch
              value={localSettings.autoSync}
              onValueChange={(value) => handleSettingChange('autoSync', value)}
              trackColor={{ false: '#E5E7EB', true: Colors.spirit }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>
    </PerformanceMonitor>
  );

  const renderDataManagement = () => (
    <PerformanceMonitor>
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => setShowExportModal(true)}
        >
          <Ionicons name="download" size={20} color={Colors.accent} />
          <Text style={styles.actionText}>Export All Data</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleImportData}
        >
          <Ionicons name="cloud-upload" size={20} color={Colors.success} />
          <Text style={styles.actionText}>Import Data</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleCloudSync}
        >
          <Ionicons name="cloud" size={20} color={Colors.spirit} />
          <Text style={styles.actionText}>Cloud Sync</Text>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PREMIUM</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.dangerButton]} 
          onPress={handleResetData}
        >
          <Ionicons name="refresh" size={20} color="#EF4444" />
          <Text style={[styles.actionText, styles.dangerText]}>Reset All Data</Text>
          <Ionicons name="chevron-forward" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </PerformanceMonitor>
  );

  const renderStatsOverview = () => (
    <PerformanceMonitor>
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Neural Optimization Stats</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color={Colors.warning} />
            <Text style={styles.statValue}>{achievements.length}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color={Colors.accent} />
            <Text style={styles.statValue}>{sessionHistory.length}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="flash" size={24} color={Colors.success} />
            <Text style={styles.statValue}>
              {Math.round(Object.values(pillarScores).reduce((a, b) => (a as number) + (b as number), 0) / 5)}%
            </Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color={Colors.heart} />
            <Text style={styles.statValue}>
              {Math.floor((Date.now() - new Date(safeGet(userProfile, 'joinedDate', Date.now())).getTime()) / (1000 * 60 * 60 * 24))}
            </Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
        </View>
      </View>
    </PerformanceMonitor>
  );

  // Time Selection Modal
  const renderTimeModal = () => (
    <Modal
      visible={showTimeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowTimeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Daily Reminder Time</Text>
          
          <View style={styles.timeOptions}>
            {['06:00', '07:00', '08:00', '09:00', '10:00', '18:00', '19:00', '20:00'].map(time => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeOption,
                  localSettings.reminderTime === time && styles.timeOptionSelected
                ]}
                onPress={() => {
                  handleSettingChange('reminderTime', time);
                  setShowTimeModal(false);
                }}
              >
                <Text style={[
                  styles.timeOptionText,
                  localSettings.reminderTime === time && styles.timeOptionTextSelected
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowTimeModal(false)}
          >
            <Text style={styles.modalCloseText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Export Confirmation Modal
  const renderExportModal = () => (
    <Modal
      visible={showExportModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowExportModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Ionicons name="download" size={32} color={Colors.accent} />
          <Text style={styles.modalTitle}>Export Neural Data</Text>
          <Text style={styles.modalText}>
            Export your complete 5 Pillars optimization data including:
          </Text>
          
          <View style={styles.exportList}>
            <Text style={styles.exportItem}>✅ User profile and preferences</Text>
            <Text style={styles.exportItem}>✅ All pillar scores and progress</Text>
            <Text style={styles.exportItem}>✅ Session history (last 50 sessions)</Text>
            <Text style={styles.exportItem}>✅ Achievements and milestones</Text>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowExportModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={handleExportData}
              disabled={isExporting}
            >
              <Text style={styles.modalConfirmText}>
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => safeNavigate(navigation, 'Home')}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Neural Profile</Text>
          <Text style={styles.headerSubtitle}>Settings & Data Management</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => safeNavigate(navigation, 'NotificationSettingsScreen')}
        >
          <Ionicons name="settings" size={20} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderProfileHeader()}
        {renderStatsOverview()}
        {renderFunctionalSettings()}
        {renderDataManagement()}
      </ScrollView>

      {renderTimeModal()}
      {renderExportModal()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
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
  profileHeader: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nameEditContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    minWidth: 150,
  },
  profileLevel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  profileStats: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  statsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  settingsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  settingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  actionsSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  premiumText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  dangerText: {
    color: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeOptionSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  timeOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  timeOptionTextSelected: {
    color: '#FFFFFF',
  },
  exportList: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  exportItem: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalCloseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  modalCloseText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

export default React.memo(UserProfileScreen);
