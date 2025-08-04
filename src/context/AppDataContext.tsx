// src/context/AppDataContext.tsx - COMPLETE REAL DATA SYSTEM
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Enhanced Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: number;
  totalSessions: number;
  streak: number;
  longestStreak: number;
  joinDate: string;
  lastActiveDate: string;
  preferences: {
    onboardingCompleted: boolean;
    hasSeenTutorial: boolean;
    culturalContent: boolean;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    preferredPillars: string[];
    reminderTime: string;
    darkMode: boolean;
  };
  stats: {
    totalMinutes: number;
    averageSessionLength: number;
    favoriteTimeOfDay: string;
    mostUsedPillar: string;
    consistencyScore: number;
  };
}

export interface SessionData {
  id: string;
  pillar: string;
  type: 'meditation' | 'exercise' | 'practice' | 'checkin';
  duration: number; // minutes
  date: string;
  score: number; // 1-100
  mood: 'excellent' | 'good' | 'okay' | 'low';
  notes?: string;
  achievements?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  pillar: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedDate: string;
  progress?: number; // for multi-step achievements
  isNew?: boolean;
}

export interface PillarProgress {
  body: number;
  mind: number;
  heart: number;
  spirit: number;
  diet: number;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  pillar: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  actionPlan: string[];
  dateGenerated: string;
  isRead?: boolean;
}

export interface AppState {
  userProfile: UserProfile | null;
  pillarScores: PillarProgress;
  sessions: SessionData[];
  achievements: Achievement[];
  aiInsights: AIInsight[];
  dailyGoals: {
    sessionTarget: number;
    minutesTarget: number;
    completed: boolean;
  };
  streakData: {
    current: number;
    longest: number;
    todayCompleted: boolean;
  };
  isLoading: boolean;
  isInitialized: boolean;
  lastSyncDate: string | null;
}

type AppAction = 
  | { type: 'INIT_SUCCESS'; payload: Partial<AppState> }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'ADD_SESSION'; payload: SessionData }
  | { type: 'UPDATE_PILLAR_SCORES'; payload: Partial<PillarProgress> }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'ADD_AI_INSIGHT'; payload: AIInsight }
  | { type: 'MARK_INSIGHT_READ'; payload: string }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SYNC_COMPLETE'; payload: string };

// Initial State
const initialState: AppState = {
  userProfile: null,
  pillarScores: { body: 0, mind: 0, heart: 0, spirit: 0, diet: 0 },
  sessions: [],
  achievements: [],
  aiInsights: [],
  dailyGoals: {
    sessionTarget: 3,
    minutesTarget: 30,
    completed: false
  },
  streakData: {
    current: 0,
    longest: 0,
    todayCompleted: false
  },
  isLoading: true,
  isInitialized: false,
  lastSyncDate: null
};

// Storage Keys
const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  SESSIONS: 'sessions',
  ACHIEVEMENTS: 'achievements',
  PILLAR_SCORES: 'pillar_scores',
  AI_INSIGHTS: 'ai_insights',
  APP_STATE: 'app_state'
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'INIT_SUCCESS':
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        isInitialized: true
      };
    
    case 'UPDATE_USER_PROFILE':
      const updatedProfile = state.userProfile ? 
        { ...state.userProfile, ...action.payload } : 
        action.payload as UserProfile;
      return {
        ...state,
        userProfile: updatedProfile
      };
    
    case 'ADD_SESSION':
      const newSessions = [...state.sessions, action.payload];
      const todayCompleted = checkTodayGoalCompleted(newSessions, state.dailyGoals);
      return {
        ...state,
        sessions: newSessions,
        dailyGoals: {
          ...state.dailyGoals,
          completed: todayCompleted
        },
        streakData: {
          ...state.streakData,
          todayCompleted: todayCompleted
        }
      };
    
    case 'UPDATE_PILLAR_SCORES':
      return {
        ...state,
        pillarScores: { ...state.pillarScores, ...action.payload }
      };
    
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        achievements: [{ ...action.payload, isNew: true }, ...state.achievements]
      };
    
    case 'ADD_AI_INSIGHT':
      return {
        ...state,
        aiInsights: [action.payload, ...state.aiInsights.slice(0, 9)] // Keep max 10
      };
    
    case 'MARK_INSIGHT_READ':
      return {
        ...state,
        aiInsights: state.aiInsights.map(insight => 
          insight.id === action.payload ? { ...insight, isRead: true } : insight
        )
      };
    
    case 'UPDATE_STREAK':
      return {
        ...state,
        streakData: {
          ...state.streakData,
          current: action.payload,
          longest: Math.max(state.streakData.longest, action.payload)
        }
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SYNC_COMPLETE':
      return { ...state, lastSyncDate: action.payload };
    
    default:
      return state;
  }
}

// Helper Functions
const checkTodayGoalCompleted = (sessions: SessionData[], goals: any): boolean => {
  const today = new Date().toDateString();
  const todaySessions = sessions.filter(s => new Date(s.date).toDateString() === today);
  
  const sessionCount = todaySessions.length;
  const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  
  return sessionCount >= goals.sessionTarget && totalMinutes >= goals.minutesTarget;
};

// Context
interface AppDataContextType {
  state: AppState;
  actions: {
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
    addSession: (session: Omit<SessionData, 'id'>) => Promise<void>;
    updatePillarScores: (scores: Partial<PillarProgress>) => Promise<void>;
    addAchievement: (achievement: Omit<Achievement, 'id' | 'unlockedDate'>) => Promise<void>;
    addAIInsight: (insight: Omit<AIInsight, 'id' | 'dateGenerated'>) => Promise<void>;
    markInsightRead: (insightId: string) => Promise<void>;
    calculateStreak: () => Promise<void>;
    syncData: () => Promise<void>;
    clearAllData: () => Promise<void>;
  };
}

const AppDataContext = createContext<AppDataContextType | null>(null);

// Provider Component
export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize data from storage
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Load all data from AsyncStorage
      const [userProfile, sessions, achievements, pillarScores, aiInsights] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.SESSIONS),
        AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS),
        AsyncStorage.getItem(STORAGE_KEYS.PILLAR_SCORES),
        AsyncStorage.getItem(STORAGE_KEYS.AI_INSIGHTS)
      ]);

      const loadedState: Partial<AppState> = {
        userProfile: userProfile ? JSON.parse(userProfile) : createDefaultUser(),
        sessions: sessions ? JSON.parse(sessions) : [],
        achievements: achievements ? JSON.parse(achievements) : [],
        pillarScores: pillarScores ? JSON.parse(pillarScores) : { body: 0, mind: 0, heart: 0, spirit: 0, diet: 0 },
        aiInsights: aiInsights ? JSON.parse(aiInsights) : []
      };

      dispatch({ type: 'INIT_SUCCESS', payload: loadedState });
      
      // Calculate streak and update profile stats
      await calculateStreak();
      
    } catch (error) {
      console.error('Error initializing data:', error);
      // Initialize with default user if error
      dispatch({ 
        type: 'INIT_SUCCESS', 
        payload: { userProfile: createDefaultUser() } 
      });
    }
  };

  const createDefaultUser = (): UserProfile => ({
    id: `user_${Date.now()}`,
    name: 'Wellness Seeker',
    email: '',
    level: 1,
    totalSessions: 0,
    streak: 0,
    longestStreak: 0,
    joinDate: new Date().toISOString(),
    lastActiveDate: new Date().toISOString(),
    preferences: {
      onboardingCompleted: false,
      hasSeenTutorial: false,
      culturalContent: true,
      difficulty: 'beginner',
      preferredPillars: [],
      reminderTime: '09:00',
      darkMode: false
    },
    stats: {
      totalMinutes: 0,
      averageSessionLength: 0,
      favoriteTimeOfDay: 'morning',
      mostUsedPillar: 'spirit',
      consistencyScore: 0
    }
  });

  // Actions
  const actions = {
    updateUserProfile: async (updates: Partial<UserProfile>) => {
      dispatch({ type: 'UPDATE_USER_PROFILE', payload: updates });
      
      if (state.userProfile) {
        const updatedProfile = { ...state.userProfile, ...updates };
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedProfile));
      }
    },

    addSession: async (sessionData: Omit<SessionData, 'id'>) => {
      const session: SessionData = {
        ...sessionData,
        id: `session_${Date.now()}`
      };

      dispatch({ type: 'ADD_SESSION', payload: session });
      
      // Update storage
      const updatedSessions = [...state.sessions, session];
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));
      
      // Update pillar scores based on session
      const pillarBoost = calculatePillarBoost(session);
      await actions.updatePillarScores({ [session.pillar]: pillarBoost });
      
      // Check for achievements
      await checkSessionAchievements(session);
    },

    updatePillarScores: async (scores: Partial<PillarProgress>) => {
      dispatch({ type: 'UPDATE_PILLAR_SCORES', payload: scores });
      
      const updatedScores = { ...state.pillarScores, ...scores };
      await AsyncStorage.setItem(STORAGE_KEYS.PILLAR_SCORES, JSON.stringify(updatedScores));
    },

    addAchievement: async (achievementData: Omit<Achievement, 'id' | 'unlockedDate'>) => {
      const achievement: Achievement = {
        ...achievementData,
        id: `achievement_${Date.now()}`,
        unlockedDate: new Date().toISOString()
      };

      dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
      
      const updatedAchievements = [achievement, ...state.achievements];
      await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(updatedAchievements));
    },

    addAIInsight: async (insightData: Omit<AIInsight, 'id' | 'dateGenerated'>) => {
      const insight: AIInsight = {
        ...insightData,
        id: `insight_${Date.now()}`,
        dateGenerated: new Date().toISOString()
      };

      dispatch({ type: 'ADD_AI_INSIGHT', payload: insight });
      
      const updatedInsights = [insight, ...state.aiInsights.slice(0, 9)];
      await AsyncStorage.setItem(STORAGE_KEYS.AI_INSIGHTS, JSON.stringify(updatedInsights));
    },

    markInsightRead: async (insightId: string) => {
      dispatch({ type: 'MARK_INSIGHT_READ', payload: insightId });
      
      const updatedInsights = state.aiInsights.map(insight => 
        insight.id === insightId ? { ...insight, isRead: true } : insight
      );
      await AsyncStorage.setItem(STORAGE_KEYS.AI_INSIGHTS, JSON.stringify(updatedInsights));
    },

    calculateStreak: async () => {
      const streak = calculateCurrentStreak(state.sessions);
      dispatch({ type: 'UPDATE_STREAK', payload: streak });
      
      // Update user profile with new streak
      if (state.userProfile) {
        await actions.updateUserProfile({ 
          streak,
          longestStreak: Math.max(state.userProfile.longestStreak, streak)
        });
      }
    },

    syncData: async () => {
      // TODO: Implement cloud sync
      dispatch({ type: 'SYNC_COMPLETE', payload: new Date().toISOString() });
    },

    clearAllData: async () => {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE),
        AsyncStorage.removeItem(STORAGE_KEYS.SESSIONS),
        AsyncStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS),
        AsyncStorage.removeItem(STORAGE_KEYS.PILLAR_SCORES),
        AsyncStorage.removeItem(STORAGE_KEYS.AI_INSIGHTS)
      ]);
      
      dispatch({ 
        type: 'INIT_SUCCESS', 
        payload: { 
          ...initialState, 
          userProfile: createDefaultUser(),
          isLoading: false,
          isInitialized: true
        } 
      });
    }
  };

  // Helper functions
  const calculatePillarBoost = (session: SessionData): number => {
    const baseBoost = Math.min(session.duration * 0.5, 10); // Max 10 points per session
    const scoreMultiplier = session.score / 100;
    const currentScore = state.pillarScores[session.pillar as keyof PillarProgress] || 0;
    
    // Diminishing returns as pillar score gets higher
    const diminishingFactor = Math.max(0.1, 1 - (currentScore / 200));
    
    return Math.round(baseBoost * scoreMultiplier * diminishingFactor);
  };

  const calculateCurrentStreak = (sessions: SessionData[]): number => {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = sessions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dayString = currentDate.toDateString();
      const hasSessionToday = sortedSessions.some(session => 
        new Date(session.date).toDateString() === dayString
      );
      
      if (hasSessionToday) {
        streak++;
      } else if (i > 0) { // Allow today to be incomplete
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  const checkSessionAchievements = async (session: SessionData) => {
    const achievements = [];
    
    // First session achievement
    if (state.sessions.length === 0) {
      achievements.push({
        title: 'First Steps',
        description: 'Completed your first session!',
        pillar: 'overall',
        rarity: 'common' as const
      });
    }
    
    // Pillar-specific achievements
    const pillarSessions = state.sessions.filter(s => s.pillar === session.pillar).length + 1;
    if (pillarSessions === 5 || pillarSessions === 10 || pillarSessions === 25) {
      achievements.push({
        title: `${session.pillar.charAt(0).toUpperCase() + session.pillar.slice(1)} Devotee`,
        description: `Completed ${pillarSessions} ${session.pillar} sessions`,
        pillar: session.pillar,
        rarity: pillarSessions >= 25 ? 'epic' as const : pillarSessions >= 10 ? 'rare' as const : 'common' as const
      });
    }
    
    // Duration achievements
    if (session.duration >= 30 && !state.achievements.some(a => a.title === 'Marathon Meditator')) {
      achievements.push({
        title: 'Marathon Meditator',
        description: 'Completed a 30+ minute session',
        pillar: session.pillar,
        rarity: 'rare' as const
      });
    }
    
    // Add all achievements
    for (const achievement of achievements) {
      await actions.addAchievement(achievement);
    }
  };

  return (
    <AppDataContext.Provider value={{ state, actions }}>
      {children}
    </AppDataContext.Provider>
  );
};

// Custom Hooks
export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
};

export const useAppDataSelectors = () => {
  const { state } = useAppData();
  
  return {
    userProfile: state.userProfile,
    pillarScores: state.pillarScores,
    overallScore: Object.values(state.pillarScores).reduce((sum, score) => sum + score, 0) / 5,
    sessions: state.sessions,
    todaySessions: state.sessions.filter(s => 
      new Date(s.date).toDateString() === new Date().toDateString()
    ),
    achievements: state.achievements,
    newAchievements: state.achievements.filter(a => a.isNew),
    aiInsights: state.aiInsights,
    unreadInsights: state.aiInsights.filter(i => !i.isRead),
    dailyGoals: state.dailyGoals,
    streakData: state.streakData,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    lastSyncDate: state.lastSyncDate
  };
};
