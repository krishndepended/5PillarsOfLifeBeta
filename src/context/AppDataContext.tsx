// src/context/AppDataContext.tsx - COMPLETE REAL DATA INTEGRATION WITH PERSISTENCE
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Storage Keys
const STORAGE_KEYS = {
  USER_PROFILE: '@5pillars_user_profile',
  PILLAR_SCORES: '@5pillars_pillar_scores',
  SESSION_DATA: '@5pillars_session_data',
  AI_INSIGHTS: '@5pillars_ai_insights',
  ANALYTICS: '@5pillars_analytics',
  SESSION_HISTORY: '@5pillars_session_history',
  ACHIEVEMENTS: '@5pillars_achievements',
  PREFERENCES: '@5pillars_preferences'
};

// Enhanced Types
interface UserProfile {
  name: string;
  email: string;
  level: number;
  streak: number;
  totalSessions: number;
  joinedDate: string;
  lastActiveDate: string;
  preferences: {
    notifications: boolean;
    reminderTime: string;
    preferredPillars: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
}

interface PillarScores {
  body: number;
  mind: number;
  heart: number;
  spirit: number;
  diet: number;
}

interface SessionData {
  completedToday: number;
  todaySessions: number;
  totalTime: number;
  weeklyGoal: number;
  currentWeekProgress: number;
  lastSessionDate: string;
}

interface SessionHistory {
  id: string;
  pillar: string;
  duration: number;
  improvement: number;
  date: string;
  type: 'training' | 'meditation' | 'workout' | 'nutrition';
  notes?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  pillar: string;
  unlockedDate: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  pillar: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionPlan: string[];
  createdDate: string;
  isActive: boolean;
}

interface AppState {
  userProfile: UserProfile;
  pillarScores: PillarScores;
  sessionData: SessionData;
  aiInsights: AIInsight[];
  analytics: any;
  sessionHistory: SessionHistory[];
  achievements: Achievement[];
  isLoading: boolean;
  isInitialized: boolean;
  lastDataSync: string;
}

// Action Types
type AppAction = 
  | { type: 'INITIALIZE_APP'; payload: Partial<AppState> }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'UPDATE_PILLAR_SCORE'; payload: { pillar: keyof PillarScores; score: number } }
  | { type: 'ADD_SESSION'; payload: { pillar: string; duration: number; improvement: number; type?: string } }
  | { type: 'SET_AI_INSIGHTS'; payload: AIInsight[] }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'UPDATE_SESSION_DATA'; payload: Partial<SessionData> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SYNC_DATA' }
  | { type: 'RESET_DATA' };

// Initial State
const initialState: AppState = {
  userProfile: {
    name: 'Neural Optimizer',
    email: '',
    level: 1,
    streak: 0,
    totalSessions: 0,
    joinedDate: new Date().toISOString(),
    lastActiveDate: new Date().toISOString(),
    preferences: {
      notifications: true,
      reminderTime: '09:00',
      preferredPillars: [],
      difficulty: 'beginner'
    }
  },
  pillarScores: {
    body: 65,
    mind: 70,
    heart: 68,
    spirit: 72,
    diet: 75
  },
  sessionData: {
    completedToday: 0,
    todaySessions: 0,
    totalTime: 0,
    weeklyGoal: 21, // 3 sessions per day × 7 days
    currentWeekProgress: 0,
    lastSessionDate: ''
  },
  aiInsights: [],
  analytics: {},
  sessionHistory: [],
  achievements: [],
  isLoading: false,
  isInitialized: false,
  lastDataSync: ''
};

// Enhanced Reducer with Real Data Logic
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'INITIALIZE_APP':
      return {
        ...state,
        ...action.payload,
        isInitialized: true,
        isLoading: false
      };

    case 'UPDATE_USER_PROFILE':
      const updatedProfile = { ...state.userProfile, ...action.payload };
      return {
        ...state,
        userProfile: updatedProfile
      };

    case 'UPDATE_PILLAR_SCORE':
      const { pillar, score } = action.payload;
      const newScores = { ...state.pillarScores, [pillar]: Math.min(100, Math.max(0, score)) };
      
      // Calculate level based on overall score
      const overallScore = Object.values(newScores).reduce((sum, s) => sum + s, 0) / 5;
      const newLevel = Math.floor(overallScore / 10) + 1;
      
      return {
        ...state,
        pillarScores: newScores,
        userProfile: {
          ...state.userProfile,
          level: newLevel,
          lastActiveDate: new Date().toISOString()
        }
      };

    case 'ADD_SESSION':
      const today = new Date().toDateString();
      const isToday = state.sessionData.lastSessionDate === today;
      
      // Create session history entry
      const newSession: SessionHistory = {
        id: `session_${Date.now()}`,
        pillar: action.payload.pillar,
        duration: action.payload.duration,
        improvement: action.payload.improvement,
        date: new Date().toISOString(),
        type: (action.payload.type as any) || 'training'
      };

      // Update pillar score based on improvement
      const pillarKey = action.payload.pillar as keyof PillarScores;
      const currentScore = state.pillarScores[pillarKey] || 0;
      const improvedScore = Math.min(100, currentScore + action.payload.improvement);

      // Calculate streak
      const lastSessionDate = new Date(state.sessionData.lastSessionDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = state.userProfile.streak;
      if (!isToday) {
        if (lastSessionDate.toDateString() === yesterday.toDateString()) {
          newStreak += 1; // Continue streak
        } else if (state.sessionData.lastSessionDate === '') {
          newStreak = 1; // First session
        } else {
          newStreak = 1; // Streak broken, restart
        }
      }

      return {
        ...state,
        pillarScores: {
          ...state.pillarScores,
          [pillarKey]: improvedScore
        },
        sessionData: {
          ...state.sessionData,
          completedToday: isToday ? state.sessionData.completedToday + 1 : 1,
          todaySessions: isToday ? state.sessionData.todaySessions + 1 : 1,
          totalTime: state.sessionData.totalTime + action.payload.duration,
          currentWeekProgress: state.sessionData.currentWeekProgress + 1,
          lastSessionDate: today
        },
        userProfile: {
          ...state.userProfile,
          totalSessions: state.userProfile.totalSessions + 1,
          streak: newStreak,
          lastActiveDate: new Date().toISOString()
        },
        sessionHistory: [newSession, ...state.sessionHistory].slice(0, 100) // Keep last 100 sessions
      };

    case 'SET_AI_INSIGHTS':
      return {
        ...state,
        aiInsights: action.payload.map(insight => ({
          ...insight,
          createdDate: insight.createdDate || new Date().toISOString(),
          isActive: true
        }))
      };

    case 'ADD_ACHIEVEMENT':
      // Check if achievement already exists
      const existingAchievement = state.achievements.find(a => a.title === action.payload.title);
      if (existingAchievement) return state;

      return {
        ...state,
        achievements: [action.payload, ...state.achievements]
      };

    case 'UPDATE_SESSION_DATA':
      return {
        ...state,
        sessionData: { ...state.sessionData, ...action.payload }
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SYNC_DATA':
      return {
        ...state,
        lastDataSync: new Date().toISOString()
      };

    case 'RESET_DATA':
      return {
        ...initialState,
        isInitialized: true
      };

    default:
      return state;
  }
};

// Context
const AppDataContext = createContext<{
  state: AppState;
  actions: {
    updateUserProfile: (profile: Partial<UserProfile>) => void;
    updatePillarScore: (pillar: keyof PillarScores, score: number) => void;
    addSession: (session: { pillar: string; duration: number; improvement: number; type?: string }) => void;
    setAIInsights: (insights: AIInsight[]) => void;
    addAchievement: (achievement: Achievement) => void;
    updateSessionData: (data: Partial<SessionData>) => void;
    syncData: () => void;
    resetData: () => void;
  };
} | null>(null);

// Storage Helper Functions
const saveToStorage = async (key: string, data: any) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

const loadFromStorage = async (key: string) => {
  try {
    if (Platform.OS === 'web') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } else {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return null;
  }
};

// Provider Component
export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app data from storage
  useEffect(() => {
    initializeAppData();
  }, []);

  // Auto-save data when state changes
  useEffect(() => {
    if (state.isInitialized) {
      saveAppData();
    }
  }, [state.userProfile, state.pillarScores, state.sessionData, state.sessionHistory, state.achievements]);

  const initializeAppData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Load all data from storage
      const [
        userProfile,
        pillarScores,
        sessionData,
        aiInsights,
        sessionHistory,
        achievements
      ] = await Promise.all([
        loadFromStorage(STORAGE_KEYS.USER_PROFILE),
        loadFromStorage(STORAGE_KEYS.PILLAR_SCORES),
        loadFromStorage(STORAGE_KEYS.SESSION_DATA),
        loadFromStorage(STORAGE_KEYS.AI_INSIGHTS),
        loadFromStorage(STORAGE_KEYS.SESSION_HISTORY),
        loadFromStorage(STORAGE_KEYS.ACHIEVEMENTS)
      ]);

      // Initialize with loaded data or defaults
      dispatch({
        type: 'INITIALIZE_APP',
        payload: {
          userProfile: userProfile || initialState.userProfile,
          pillarScores: pillarScores || initialState.pillarScores,
          sessionData: sessionData || initialState.sessionData,
          aiInsights: aiInsights || [],
          sessionHistory: sessionHistory || [],
          achievements: achievements || []
        }
      });

      console.log('✅ App data initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing app data:', error);
      dispatch({ type: 'INITIALIZE_APP', payload: {} });
    }
  };

  const saveAppData = async () => {
    try {
      await Promise.all([
        saveToStorage(STORAGE_KEYS.USER_PROFILE, state.userProfile),
        saveToStorage(STORAGE_KEYS.PILLAR_SCORES, state.pillarScores),
        saveToStorage(STORAGE_KEYS.SESSION_DATA, state.sessionData),
        saveToStorage(STORAGE_KEYS.AI_INSIGHTS, state.aiInsights),
        saveToStorage(STORAGE_KEYS.SESSION_HISTORY, state.sessionHistory),
        saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, state.achievements)
      ]);
      
      dispatch({ type: 'SYNC_DATA' });
    } catch (error) {
      console.error('❌ Error saving app data:', error);
    }
  };

  // Action handlers
  const actions = {
    updateUserProfile: (profile: Partial<UserProfile>) => {
      dispatch({ type: 'UPDATE_USER_PROFILE', payload: profile });
    },

    updatePillarScore: (pillar: keyof PillarScores, score: number) => {
      dispatch({ type: 'UPDATE_PILLAR_SCORE', payload: { pillar, score } });
    },

    addSession: (session: { pillar: string; duration: number; improvement: number; type?: string }) => {
      dispatch({ type: 'ADD_SESSION', payload: session });
      
      // Check for achievements
      setTimeout(() => {
        checkAndAddAchievements(state);
      }, 100);
    },

    setAIInsights: (insights: AIInsight[]) => {
      dispatch({ type: 'SET_AI_INSIGHTS', payload: insights });
    },

    addAchievement: (achievement: Achievement) => {
      dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
    },

    updateSessionData: (data: Partial<SessionData>) => {
      dispatch({ type: 'UPDATE_SESSION_DATA', payload: data });
    },

    syncData: () => {
      saveAppData();
    },

    resetData: () => {
      dispatch({ type: 'RESET_DATA' });
      // Clear storage
      Object.values(STORAGE_KEYS).forEach(key => {
        if (Platform.OS === 'web') {
          localStorage.removeItem(key);
        } else {
          AsyncStorage.removeItem(key);
        }
      });
    }
  };

  // Achievement checking logic
  const checkAndAddAchievements = (currentState: AppState) => {
    const achievements: Achievement[] = [];
    
    // Streak achievements
    if (currentState.userProfile.streak === 7) {
      achievements.push({
        id: `achievement_${Date.now()}_1`,
        title: 'Week Warrior',
        description: 'Completed 7 consecutive days of optimization',
        pillar: 'overall',
        unlockedDate: new Date().toISOString(),
        rarity: 'common'
      });
    }
    
    if (currentState.userProfile.streak === 30) {
      achievements.push({
        id: `achievement_${Date.now()}_2`,
        title: 'Monthly Master',
        description: 'Achieved 30-day optimization streak',
        pillar: 'overall',
        unlockedDate: new Date().toISOString(),
        rarity: 'rare'
      });
    }

    // Session count achievements
    if (currentState.userProfile.totalSessions === 50) {
      achievements.push({
        id: `achievement_${Date.now()}_3`,
        title: 'Half Century',
        description: 'Completed 50 optimization sessions',
        pillar: 'overall',
        unlockedDate: new Date().toISOString(),
        rarity: 'common'
      });
    }

    // Pillar mastery achievements
    Object.entries(currentState.pillarScores).forEach(([pillar, score]) => {
      if (score >= 90) {
        achievements.push({
          id: `achievement_${Date.now()}_${pillar}`,
          title: `${pillar.toUpperCase()} Mastery`,
          description: `Achieved 90%+ optimization in ${pillar} pillar`,
          pillar,
          unlockedDate: new Date().toISOString(),
          rarity: 'epic'
        });
      }
    });

    // Add achievements
    achievements.forEach(achievement => {
      dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
    });
  };

  return (
    <AppDataContext.Provider value={{ state, actions }}>
      {children}
    </AppDataContext.Provider>
  );
};

// Custom hooks
export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
};

export const useAppDataSelectors = () => {
  const { state } = useAppData();
  
  // Calculate derived values
  const overallScore = Math.round(
    Object.values(state.pillarScores).reduce((sum, score) => sum + score, 0) / 5
  );

  const weeklyProgress = Math.min(100, (state.sessionData.currentWeekProgress / state.sessionData.weeklyGoal) * 100);

  const recentSessions = state.sessionHistory.slice(0, 10);

  const activeInsights = state.aiInsights.filter(insight => insight.isActive);

  return {
    // Direct state
    ...state,
    
    // Calculated values
    overallScore,
    weeklyProgress,
    recentSessions,
    activeInsights,
    
    // Utility functions
    getSessionsByPillar: (pillar: string) => 
      state.sessionHistory.filter(session => session.pillar === pillar),
    
    getPillarTrend: (pillar: keyof PillarScores) => {
      const pillarSessions = state.sessionHistory
        .filter(session => session.pillar === pillar)
        .slice(0, 5);
      
      if (pillarSessions.length < 2) return 'stable';
      
      const recent = pillarSessions.slice(0, 3).reduce((sum, s) => sum + s.improvement, 0);
      const older = pillarSessions.slice(3).reduce((sum, s) => sum + s.improvement, 0);
      
      if (recent > older * 1.2) return 'improving';
      if (recent < older * 0.8) return 'declining';
      return 'stable';
    }
  };
};

export default AppDataContext;
