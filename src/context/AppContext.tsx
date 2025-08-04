// src/context/AppContext.tsx - SIMPLIFIED FOR DEBUGGING
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Platform } from 'react-native';

interface AppState {
  isLoading: boolean;
  isOnboarded: boolean;
  preferences: {
    sessionReminders: boolean;
    reminderTime: string;
  };
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<any>;
  actions: {
    updatePreferences: (data: any) => void;
  };
}

const initialState: AppState = {
  isLoading: false,
  isOnboarded: true, // Skip onboarding for now
  preferences: {
    sessionReminders: false, // Disable for debugging
    reminderTime: '07:00',
  },
};

const appReducer = (state: AppState, action: any): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_PREFERENCES':
      return { 
        ...state, 
        preferences: { ...state.preferences, ...action.payload }
      };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    updatePreferences: (data: any) => {
      dispatch({ type: 'UPDATE_PREFERENCES', payload: data });
    },
  };

  // Remove complex useEffect for now
  useEffect(() => {
    // Simulate loading completion
    setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 100);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
