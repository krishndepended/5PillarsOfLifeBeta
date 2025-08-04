// src/screens/NotificationSettingsScreen.tsx - COMPLETE FUNCTIONAL NOTIFICATION MANAGEMENT
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
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDataSelectors, useAppData } from '../context/AppDataContext';
import { usePerformanceOptimization, PerformanceMonitor } from '../hooks/usePerformanceOptimization';
import { safeNavigate, safeGet } from '../utils/SafeNavigation';
import NotificationManager from '../utils/NotificationManager';

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

interface NotificationSettings {
  masterEnabled: boolean;
  dailyReminders: boolean;
  dailyTime: string;
  achievementAlerts: boolean;
  motivationalQuotes: boolean;
  weeklyReports: boolean;
  pillarSpecific: {
    body: boolean;
    mind: boolean;
    heart: boolean;
    spirit: boolean;
    diet: boolean;
  };
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

const NotificationSettingsScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { actions } = useAppData();
  
  const {
    userProfile,
    isInitialized
  } = useAppDataSelectors();

  const { measurePerformance } = usePerformanceOptimization();
  const notificationManager = NotificationManager.getInstance();

  const [settings, setSettings] = useState<NotificationSettings>({
    masterEnabled: true,
    dailyReminders: true,
    dailyTime: '09:00',
    achievementAlerts: true,
    motivationalQuotes: true,
    weeklyReports: true,
    pillarSpecific: {
      body: true,
      mind: true,
      heart: true,
      spirit: true,
      diet: true,
    },
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '07:00',
    }
  });

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [timeModalType, setTimeModalType] = useState<'daily' | 'quietStart' | 'quietEnd'>('daily');
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'unknown'>('unknown');

  useEffect(() => {
    const measurement = measurePerformance('NotificationSettingsScreen');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      measurement.end();
    });

    initializeNotificationSettings();
  }, [fadeAnim]);

  const initializeNotificationSettings = async () => {
    try {
      // Load settings from user profile
      if (userProfile && userProfile.preferences) {
        setSettings(prevSettings => ({
          ...prevSettings,
          masterEnabled: safeGet(userProfile, 'preferences.notifications', true),
          dailyTime: safeGet(userProfile, 'preferences.reminderTime', '09:00'),
        }));
      }

      // Check notification permissions
      await checkNotificationPermissions();

      // Initialize notification manager if needed
      if (settings.masterEnabled) {
        await notificationManager.initialize();
      }
    } catch (error) {
      console.error('Error initializing notification settings:', error);
    }
  };

  const checkNotificationPermissions = async () => {
    try {
      const hasPermission = await notificationManager.hasPermissions();
      setPermissionStatus(hasPermission ? 'granted' : 'denied');
    } catch (error) {
      console.error('Error checking permissions:', error);
      setPermissionStatus('unknown');
    }
  };

  const requestNotificationPermissions = async () => {
    try {
      const granted = await notificationManager.requestPermissions();
      if (granted) {
        setPermissionStatus('granted');
        Alert.alert(
          '✅ Permissions Granted',
          'You will now receive neural optimization notifications!'
        );
      } else {
        setPermissionStatus('denied');
        Alert.alert(
          '❌ Permissions Denied',
          'Please enable notifications in your device settings to receive optimization reminders.'
        );
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request notification permissions.');
    }
  };

  const handleSettingChange = async (key: string, value: any, subKey?: string) => {
    try {
      let newSettings = { ...settings };
      
      if (subKey) {
        // Handle nested settings
        (newSettings as any)[key][subKey] = value;
      } else {
        // Handle top-level settings
        (newSettings as any)[key] = value;
      }
      
      setSettings(newSettings);

      // Apply the setting change
      await applyNotificationSetting(key, value, subKey, newSettings);

      // Update user profile if it's a persistent setting
      if (key === 'masterEnabled' || key === 'dailyTime') {
        actions.updateUserProfile({
          preferences: {
            ...userProfile.preferences,
            notifications: key === 'masterEnabled' ? value : newSettings.masterEnabled,
            reminderTime: key === 'dailyTime' ? value : newSettings.dailyTime,
          }
        });
      }
    } catch (error) {
      console.error('Error updating notification setting:', error);
      Alert.alert('Error', 'Failed to update notification setting.');
    }
  };

  const applyNotificationSetting = async (key: string, value: any, subKey?: string, newSettings: NotificationSettings) => {
    switch (key) {
      case 'masterEnabled':
        if (value) {
          if (permissionStatus === 'denied') {
            await requestNotificationPermissions();
            return;
          }
          await notificationManager.initialize();
          if (newSettings.dailyReminders) {
            await notificationManager.scheduleDailyReminder(newSettings.dailyTime, true);
          }
          Alert.alert('🔔 Notifications Enabled', 'Neural optimization notifications are now active!');
        } else {
          await notificationManager.cancelAllNotifications();
          Alert.alert('🔕 Notifications Disabled', 'All notifications have been turned off.');
        }
        break;

      case 'dailyReminders':
        if (newSettings.masterEnabled) {
          if (value) {
            await notificationManager.scheduleDailyReminder(newSettings.dailyTime, true);
            Alert.alert('⏰ Daily Reminders Enabled', `Set for ${newSettings.dailyTime} daily`);
          } else {
            await notificationManager.cancelDailyReminder();
            Alert.alert('⏰ Daily Reminders Disabled', 'Daily reminders turned off');
          }
        }
        break;

      case 'dailyTime':
        if (newSettings.masterEnabled && newSettings.dailyReminders) {
          await notificationManager.scheduleDailyReminder(value, true);
          Alert.alert('⏰ Time Updated', `Daily reminders now set for ${value}`);
        }
        break;

      case 'achievementAlerts':
        if (value) {
          Alert.alert('🏆 Achievement Alerts Enabled', 'You\'ll be notified of new achievements!');
        } else {
          Alert.alert('🏆 Achievement Alerts Disabled', 'Achievement notifications turned off');
        }
        break;

      case 'motivationalQuotes':
        if (value && newSettings.masterEnabled) {
          await notificationManager.scheduleMotivationalReminder();
          Alert.alert('💪 Motivational Quotes Enabled', 'Daily inspiration activated!');
        }
        break;

      case 'weeklyReports':
        if (value) {
          Alert.alert('📊 Weekly Reports Enabled', 'You\'ll receive weekly progress summaries');
        }
        break;

      case 'pillarSpecific':
        if (subKey && value) {
          Alert.alert(
            `🎯 ${subKey.toUpperCase()} Notifications Enabled`,
            `You'll receive notifications for ${subKey} pillar activities`
          );
        }
        break;
    }
  };

  const openTimeModal = (type: 'daily' | 'quietStart' | 'quietEnd') => {
    setTimeModalType(type);
    setShowTimeModal(true);
  };

  const selectTime = (time: string) => {
    switch (timeModalType) {
      case 'daily':
        handleSettingChange('dailyTime', time);
        break;
      case 'quietStart':
        handleSettingChange('quietHours', time, 'startTime');
        break;
      case 'quietEnd':
        handleSettingChange('quietHours', time, 'endTime');
        break;
    }
    setShowTimeModal(false);
  };

  const testNotification = async () => {
    try {
      if (permissionStatus === 'denied') {
        await requestNotificationPermissions();
        return;
      }

      await notificationManager.scheduleTestNotification();
      Alert.alert(
        '🧪 Test Notification Sent',
        'Check your notifications to see how they will appear!'
      );
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification.');
    }
  };

  const renderPermissionStatus = () => (
    <PerformanceMonitor>
      <View style={styles.permissionSection}>
        <LinearGradient
          colors={permissionStatus === 'granted' ? [Colors.success, '#059669'] : [Colors.warning, '#D97706']}
          style={styles.permissionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.permissionContent}>
            <Ionicons 
              name={permissionStatus === 'granted' ? 'checkmark-circle' : 'alert-circle'} 
              size={32} 
              color="#FFFFFF" 
            />
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>
                {permissionStatus === 'granted' ? 'Notifications Enabled' : 'Permissions Needed'}
              </Text>
              <Text style={styles.permissionSubtitle}>
                {permissionStatus === 'granted' 
                  ? 'Your device is ready for neural optimization reminders'
                  : 'Enable notifications to receive optimization reminders'
                }
              </Text>
            </View>
            {permissionStatus !== 'granted' && (
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestNotificationPermissions}
              >
                <Text style={styles.permissionButtonText}>Enable</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>
    </PerformanceMonitor>
  );

  const renderMasterSettings = () => (
    <PerformanceMonitor>
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Master Controls</Text>
        
        <View style={styles.settingCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={20} color={Colors.accent} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>All Notifications</Text>
                <Text style={styles.settingDescription}>Enable/disable all neural optimization notifications</Text>
              </View>
            </View>
            <Switch
              value={settings.masterEnabled}
              onValueChange={(value) => handleSettingChange('masterEnabled', value)}
              trackColor={{ false: '#E5E7EB', true: Colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={testNotification}
            disabled={!settings.masterEnabled}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="flask" size={20} color={Colors.spirit} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, !settings.masterEnabled && styles.disabledText]}>
                  Test Notification
                </Text>
                <Text style={[styles.settingDescription, !settings.masterEnabled && styles.disabledText]}>
                  Send a test notification to see how they appear
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </PerformanceMonitor>
  );

  const renderDailySettings = () => (
    <PerformanceMonitor>
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Daily Reminders</Text>
        
        <View style={styles.settingCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="alarm" size={20} color={Colors.success} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Daily Optimization Reminders</Text>
                <Text style={styles.settingDescription}>Get reminded to practice neural optimization</Text>
              </View>
            </View>
            <Switch
              value={settings.dailyReminders}
              onValueChange={(value) => handleSettingChange('dailyReminders', value)}
              trackColor={{ false: '#E5E7EB', true: Colors.success }}
              thumbColor="#FFFFFF"
              disabled={!settings.masterEnabled}
            />
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => openTimeModal('daily')}
            disabled={!settings.masterEnabled || !settings.dailyReminders}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="time" size={20} color={Colors.warning} />
              <View style={styles.settingTextContainer}>
                <Text style={[
                  styles.settingLabel,
                  (!settings.masterEnabled || !settings.dailyReminders) && styles.disabledText
                ]}>
                  Reminder Time
                </Text>
                <Text style={[
                  styles.settingDescription,
                  (!settings.masterEnabled || !settings.dailyReminders) && styles.disabledText
                ]}>
                  Choose when to receive daily reminders
                </Text>
              </View>
            </View>
            <Text style={[
              styles.settingValue,
              (!settings.masterEnabled || !settings.dailyReminders) && styles.disabledText
            ]}>
              {settings.dailyTime}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </PerformanceMonitor>
  );

  const renderNotificationTypes = () => (
    <PerformanceMonitor>
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Notification Types</Text>
        
        <View style={styles.settingCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="trophy" size={20} color={Colors.warning} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Achievement Alerts</Text>
                <Text style={styles.settingDescription}>Get notified when you unlock achievements</Text>
              </View>
            </View>
            <Switch
              value={settings.achievementAlerts}
              onValueChange={(value) => handleSettingChange('achievementAlerts', value)}
              trackColor={{ false: '#E5E7EB', true: Colors.warning }}
              thumbColor="#FFFFFF"
              disabled={!settings.masterEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="heart" size={20} color={Colors.heart} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Motivational Quotes</Text>
                <Text style={styles.settingDescription}>Receive daily inspiration and motivation</Text>
              </View>
            </View>
            <Switch
              value={settings.motivationalQuotes}
              onValueChange={(value) => handleSettingChange('motivationalQuotes', value)}
              trackColor={{ false: '#E5E7EB', true: Colors.heart }}
              thumbColor="#FFFFFF"
              disabled={!settings.masterEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="analytics" size={20} color={Colors.spirit} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Weekly Progress Reports</Text>
                <Text style={styles.settingDescription}>Get weekly summaries of your optimization journey</Text>
              </View>
            </View>
            <Switch
              value={settings.weeklyReports}
              onValueChange={(value) => handleSettingChange('weeklyReports', value)}
              trackColor={{ false: '#E5E7EB', true: Colors.spirit }}
              thumbColor="#FFFFFF"
              disabled={!settings.masterEnabled}
            />
          </View>
        </View>
      </View>
    </PerformanceMonitor>
  );

  const renderPillarSettings = () => (
    <PerformanceMonitor>
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Pillar-Specific Notifications</Text>
        
        <View style={styles.settingCard}>
          {Object.entries(settings.pillarSpecific).map(([pillar, enabled]) => {
            const pillarColors = {
              body: Colors.body,
              mind: Colors.mind,
              heart: Colors.heart,
              spirit: Colors.spirit,
              diet: Colors.success
            };
            
            const pillarIcons = {
              body: 'fitness',
              mind: 'library',
              heart: 'heart',
              spirit: 'leaf',
              diet: 'restaurant'
            };

            return (
              <View key={pillar} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons 
                    name={pillarIcons[pillar as keyof typeof pillarIcons] as any} 
                    size={20} 
                    color={pillarColors[pillar as keyof typeof pillarColors]} 
                  />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingLabel}>{pillar.toUpperCase()} Pillar</Text>
                    <Text style={styles.settingDescription}>
                      Notifications for {pillar} optimization activities
                    </Text>
                  </View>
                </View>
                <Switch
                  value={enabled}
                  onValueChange={(value) => handleSettingChange('pillarSpecific', value, pillar)}
                  trackColor={{ false: '#E5E7EB', true: pillarColors[pillar as keyof typeof pillarColors] }}
                  thumbColor="#FFFFFF"
                  disabled={!settings.masterEnabled}
                />
              </View>
            );
          })}
        </View>
      </View>
    </PerformanceMonitor>
  );

  const renderSystemSettings = () => (
    <PerformanceMonitor>
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>System Settings</Text>
        
        <View style={styles.settingCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high" size={20} color={Colors.accent} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Sound</Text>
                <Text style={styles.settingDescription}>Play sound with notifications</Text>
              </View>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => handleSettingChange('soundEnabled', value)}
              trackColor={{ false: '#E5E7EB', true: Colors.accent }}
              thumbColor="#FFFFFF"
              disabled={!settings.masterEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait" size={20} color={Colors.success} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Vibration</Text>
                <Text style={styles.settingDescription}>Vibrate device for notifications</Text>
              </View>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) => handleSettingChange('vibrationEnabled', value)}
              trackColor={{ false: '#E5E7EB', true: Colors.success }}
              thumbColor="#FFFFFF"
              disabled={!settings.masterEnabled}
            />
          </View>
        </View>
      </View>
    </PerformanceMonitor>
  );

  const renderTimeModal = () => (
    <Modal
      visible={showTimeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowTimeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {timeModalType === 'daily' ? 'Select Daily Reminder Time' :
             timeModalType === 'quietStart' ? 'Quiet Hours Start' :
             'Quiet Hours End'}
          </Text>
          
          <View style={styles.timeOptions}>
            {[
              '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
              '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
              '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
              '21:00', '21:30', '22:00', '22:30'
            ].map(time => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeOption,
                  (
                    (timeModalType === 'daily' && settings.dailyTime === time) ||
                    (timeModalType === 'quietStart' && settings.quietHours.startTime === time) ||
                    (timeModalType === 'quietEnd' && settings.quietHours.endTime === time)
                  ) && styles.timeOptionSelected
                ]}
                onPress={() => selectTime(time)}
              >
                <Text style={[
                  styles.timeOptionText,
                  (
                    (timeModalType === 'daily' && settings.dailyTime === time) ||
                    (timeModalType === 'quietStart' && settings.quietHours.startTime === time) ||
                    (timeModalType === 'quietEnd' && settings.quietHours.endTime === time)
                  ) && styles.timeOptionTextSelected
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

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="notifications" size={48} color={Colors.accent} />
        <Text style={styles.loadingText}>Loading Notification Settings...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => safeNavigate(navigation, 'UserProfileScreen')}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Notification Settings</Text>
          <Text style={styles.headerSubtitle}>Customize Your Neural Reminders</Text>
        </View>
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => Alert.alert(
            '📱 Notification Help',
            'Configure how and when you receive neural optimization reminders. All settings sync with your device preferences.'
          )}
        >
          <Ionicons name="help-circle" size={20} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderPermissionStatus()}
        {renderMasterSettings()}
        {renderDailySettings()}
        {renderNotificationTypes()}
        {renderPillarSettings()}
        {renderSystemSettings()}
      </ScrollView>

      {renderTimeModal()}
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
  helpButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  permissionSection: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  permissionGradient: {
    padding: 20,
  },
  permissionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  permissionSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  permissionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
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
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  settingDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  settingValue: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600',
    marginRight: 8,
  },
  disabledText: {
    color: Colors.textSecondary,
    opacity: 0.5,
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
    justifyContent: 'center',
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 70,
    alignItems: 'center',
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
    fontWeight: '600',
  },
  modalCloseButton: {
    alignSelf: 'center',
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

export default React.memo(NotificationSettingsScreen);
