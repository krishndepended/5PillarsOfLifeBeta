// src/services/HapticService.tsx
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export class HapticService {
  private static instance: HapticService;
  private isEnabled: boolean = true;

  public static getInstance(): HapticService {
    if (!HapticService.instance) {
      HapticService.instance = new HapticService();
    }
    return HapticService.instance;
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Light tap feedback
  light(): void {
    if (!this.isEnabled || Platform.OS === 'web') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  // Medium tap feedback
  medium(): void {
    if (!this.isEnabled || Platform.OS === 'web') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  // Heavy tap feedback
  heavy(): void {
    if (!this.isEnabled || Platform.OS === 'web') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  // Success feedback
  success(): void {
    if (!this.isEnabled || Platform.OS === 'web') return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  // Warning feedback
  warning(): void {
    if (!this.isEnabled || Platform.OS === 'web') return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  // Error feedback
  error(): void {
    if (!this.isEnabled || Platform.OS === 'web') return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  // Selection feedback (for pickers, tabs, etc.)
  selection(): void {
    if (!this.isEnabled || Platform.OS === 'web') return;
    Haptics.selectionAsync();
  }

  // Neural-specific feedback patterns
  neuralActivation(): void {
    if (!this.isEnabled || Platform.OS === 'web') return;
    // Double tap pattern for neural activation
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 100);
  }

  neuralComplete(): void {
    if (!this.isEnabled || Platform.OS === 'web') return;
    // Success pattern with emphasis
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 150);
  }

  pillarOptimal(): void {
    if (!this.isEnabled || Platform.OS === 'web') return;
    // Triple light tap pattern for optimal state
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, i * 100);
    }
  }
}
