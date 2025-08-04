// src/constants/DesignSystem.tsx
import { Platform } from 'react-native';

export const Colors = {
  // Primary Palette
  neonGreen: '#00FF88',
  neonBlue: '#00AAFF',
  neonPurple: '#AA55FF',
  neonRed: '#FF4444',
  neonYellow: '#FFD700',
  neonPink: '#FF6B9D',

  // Neutral Palette
  surface: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#F1F5F9',
    dark: '#0F172A',
    darker: '#020617',
  },

  // Glass Effects
  glass: {
    light: 'rgba(255, 255, 255, 0.18)',
    medium: 'rgba(255, 255, 255, 0.25)',
    dark: 'rgba(0, 0, 0, 0.15)',
    accent: 'rgba(0, 255, 136, 0.1)',
  },

  // Gradients
  gradients: {
    primary: ['#00FF88', '#00AAFF'],
    secondary: ['#AA55FF', '#FF6B9D'],
    surface: ['#F8FAFC', '#E2E8F0'],
    dark: ['#1E293B', '#0F172A'],
    glow: ['rgba(0, 255, 136, 0.3)', 'transparent'],
  },
};

export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  families: {
    mono: Platform.select({
      ios: 'SF Mono',
      android: 'monospace',
      web: 'SF Mono, Consolas, monospace',
      default: 'monospace',
    }),
    sans: Platform.select({
      ios: 'SF Pro Display',
      android: 'sans-serif',
      web: 'SF Pro Display, -apple-system, system-ui, sans-serif',
      default: 'sans-serif',
    }),
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
};

export const Shadows = {
  sm: Platform.select({
    web: '0 1px 2px rgba(0, 0, 0, 0.05)',
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
  }),
  
  md: Platform.select({
    web: '0 4px 6px rgba(0, 0, 0, 0.1)',
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 6,
    },
  }),
  
  lg: Platform.select({
    web: '0 10px 15px rgba(0, 0, 0, 0.1)',
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 10,
    },
  }),
  
  xl: Platform.select({
    web: '0 20px 25px rgba(0, 0, 0, 0.15)',
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.15,
      shadowRadius: 25,
      elevation: 15,
    },
  }),

  glow: Platform.select({
    web: '0 0 20px rgba(0, 255, 136, 0.4)',
    default: {
      shadowColor: '#00FF88',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 8,
    },
  }),
};
