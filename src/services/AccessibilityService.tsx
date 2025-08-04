// src/services/AccessibilityService.tsx - ACCESSIBILITY EXCELLENCE
import React from 'react';
import { AccessibilityInfo, findNodeHandle, UIManager } from 'react-native';

interface AccessibilityProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: any;
  accessibilityValue?: any;
}

class AccessibilityService {
  private static instance: AccessibilityService;

  public static getInstance(): AccessibilityService {
    if (!AccessibilityService.instance) {
      AccessibilityService.instance = new AccessibilityService();
    }
    return AccessibilityService.instance;
  }

  // Check if screen reader is enabled
  async isScreenReaderEnabled(): Promise<boolean> {
    try {
      return await AccessibilityInfo.isScreenReaderEnabled();
    } catch (error) {
      console.error('Error checking screen reader status:', error);
      return false;
    }
  }

  // Announce message to screen reader
  announceForAccessibility(message: string) {
    AccessibilityInfo.announceForAccessibility(message);
  }

  // Focus on specific element
  focusOnElement(ref: any) {
    if (ref && ref.current) {
      const reactTag = findNodeHandle(ref.current);
      if (reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    }
  }

  // Generate accessibility props for common components
  getPillarAccessibilityProps(pillarName: string, score: number, sessions: number): AccessibilityProps {
    return {
      accessible: true,
      accessibilityRole: 'button',
      accessibilityLabel: `${pillarName} pillar`,
      accessibilityHint: `Navigate to ${pillarName} pillar. Current score is ${score} percent with ${sessions} completed sessions. Double tap to open.`,
      accessibilityState: { selected: false },
      accessibilityValue: { text: `${score} percent progress` }
    };
  }

  getScoreAccessibilityProps(score: number, label: string): AccessibilityProps {
    return {
      accessible: true,
      accessibilityRole: 'text',
      accessibilityLabel: `${label} score`,
      accessibilityValue: { text: `${score} percent` },
      accessibilityHint: `Your current ${label} score is ${score} percent`
    };
  }

  getProgressAccessibilityProps(current: number, target: number, label: string): AccessibilityProps {
    const percentage = Math.round((current / target) * 100);
    return {
      accessible: true,
      accessibilityRole: 'progressbar',
      accessibilityLabel: `${label} progress`,
      accessibilityValue: { 
        min: 0, 
        max: target, 
        now: current,
        text: `${current} of ${target}, ${percentage} percent complete`
      },
      accessibilityHint: `Progress indicator showing ${current} out of ${target} ${label}`
    };
  }

  getAchievementAccessibilityProps(title: string, description: string, rarity: string): AccessibilityProps {
    return {
      accessible: true,
      accessibilityRole: 'button',
      accessibilityLabel: `Achievement: ${title}`,
      accessibilityHint: `${description}. This is a ${rarity} achievement. Double tap to share or view details.`,
      accessibilityState: { selected: false }
    };
  }

  getNavigationAccessibilityProps(screenName: string, description?: string): AccessibilityProps {
    return {
      accessible: true,
      accessibilityRole: 'button',
      accessibilityLabel: `Navigate to ${screenName}`,
      accessibilityHint: description ? `${description}. Double tap to navigate.` : `Double tap to go to ${screenName}`,
      accessibilityState: { selected: false }
    };
  }

  // High contrast mode detection
  async isHighContrastEnabled(): Promise<boolean> {
    try {
      return await AccessibilityInfo.isAccessibilityServiceEnabled();
    } catch (error) {
      console.error('Error checking high contrast mode:', error);
      return false;
    }
  }

  // Reduce motion preference
  async isReduceMotionEnabled(): Promise<boolean> {
    try {
      return await AccessibilityInfo.isReduceMotionEnabled();
    } catch (error) {
      console.error('Error checking reduce motion preference:', error);
      return false;
    }
  }

  // Large text scale
  getTextScale(): Promise<number> {
    return new Promise((resolve) => {
      AccessibilityInfo.getRecommendedTimeoutMillis(5000, (timeout) => {
        // Estimate text scale based on timeout adjustments
        const scale = timeout > 5000 ? 1.5 : 1.0;
        resolve(scale);
      });
    });
  }
}

export default AccessibilityService;

// Accessibility hooks
export const useAccessibility = () => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = React.useState(false);
  const [isHighContrast, setIsHighContrast] = React.useState(false);
  const [isReduceMotion, setIsReduceMotion] = React.useState(false);
  const [textScale, setTextScale] = React.useState(1.0);

  const accessibilityService = AccessibilityService.getInstance();

  React.useEffect(() => {
    const checkAccessibilitySettings = async () => {
      const screenReader = await accessibilityService.isScreenReaderEnabled();
      const highContrast = await accessibilityService.isHighContrastEnabled();
      const reduceMotion = await accessibilityService.isReduceMotionEnabled();
      const scale = await accessibilityService.getTextScale();

      setIsScreenReaderEnabled(screenReader);
      setIsHighContrast(highContrast);
      setIsReduceMotion(reduceMotion);
      setTextScale(scale);
    };

    checkAccessibilitySettings();

    // Listen for accessibility changes
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );

    return () => {
      screenReaderListener?.remove();
    };
  }, []);

  return {
    isScreenReaderEnabled,
    isHighContrast,
    isReduceMotion,
    textScale,
    announceForAccessibility: accessibilityService.announceForAccessibility,
    focusOnElement: accessibilityService.focusOnElement,
    getPillarAccessibilityProps: accessibilityService.getPillarAccessibilityProps,
    getScoreAccessibilityProps: accessibilityService.getScoreAccessibilityProps,
    getProgressAccessibilityProps: accessibilityService.getProgressAccessibilityProps,
    getAchievementAccessibilityProps: accessibilityService.getAchievementAccessibilityProps,
    getNavigationAccessibilityProps: accessibilityService.getNavigationAccessibilityProps,
  };
};
