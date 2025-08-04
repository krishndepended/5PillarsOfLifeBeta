// src/context/ThemeContext.tsx - COMPLETE DARK MODE SYSTEM
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';

interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  body: string;
  mind: string;
  heart: string;
  spirit: string;
  diet: string;
  border: string;
  shadow: string;
  overlay: string;
}

interface Theme {
  isDark: boolean;
  colors: ThemeColors;
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    card: '#FFFFFF',
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
    border: '#E5E7EB',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    background: '#0F172A',
    surface: '#1E293B',
    card: '#334155',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    accent: '#60A5FA',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    body: '#F87171',
    mind: '#60A5FA',
    heart: '#F472B6',
    spirit: '#A78BFA',
    diet: '#34D399',
    border: '#475569',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('user_theme');
      if (savedTheme !== null) {
        const isDark = JSON.parse(savedTheme);
        setTheme(isDark ? darkTheme : lightTheme);
      } else {
        // Use system theme as default
        const systemTheme = Appearance.getColorScheme();
        setTheme(systemTheme === 'dark' ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme.isDark ? lightTheme : darkTheme;
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('user_theme', JSON.stringify(newTheme.isDark));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setThemeMode = async (isDark: boolean) => {
    const newTheme = isDark ? darkTheme : lightTheme;
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('user_theme', JSON.stringify(isDark));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme-aware styled components helper
export const createThemedStyles = (styleFunction: (theme: Theme) => any) => {
  return (theme: Theme) => styleFunction(theme);
};
