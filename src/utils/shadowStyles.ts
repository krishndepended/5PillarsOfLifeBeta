// src/utils/shadowStyles.ts - UNIVERSAL SHADOW UTILITY
import { Platform } from 'react-native';

export const createShadowStyle = (
  elevation: number,
  shadowColor: string = '#000',
  opacity: number = 0.1
) => {
  return Platform.select({
    web: {
      boxShadow: `0px ${elevation}px ${elevation * 2}px rgba(0, 0, 0, ${opacity})`,
    },
    default: {
      shadowColor,
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: opacity,
      shadowRadius: elevation * 2,
      elevation,
    },
  });
};

export const shadowPresets = {
  small: createShadowStyle(2, '#000', 0.05),
  medium: createShadowStyle(4, '#000', 0.08),
  large: createShadowStyle(8, '#000', 0.15),
  extraLarge: createShadowStyle(16, '#000', 0.25),
};
