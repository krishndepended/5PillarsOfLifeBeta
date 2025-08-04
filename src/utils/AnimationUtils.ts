// src/utils/AnimationUtils.ts - PREMIUM ANIMATION SYSTEM
import { Animated, Easing, Platform } from 'react-native';

export class PremiumAnimations {
  // Smooth scale animation with bounce
  static createScaleAnimation(
    animatedValue: Animated.Value,
    toValue: number = 1.05,
    duration: number = 150
  ) {
    return Animated.spring(animatedValue, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: Platform.OS !== 'web',
    });
  }

  // Smooth fade with custom easing
  static createFadeAnimation(
    animatedValue: Animated.Value,
    toValue: number = 1,
    duration: number = 300
  ) {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94), // Premium easing curve
      useNativeDriver: Platform.OS !== 'web',
    });
  }

  // Smooth slide animation
  static createSlideAnimation(
    animatedValue: Animated.Value,
    toValue: number,
    duration: number = 250
  ) {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });
  }

  // Progress bar fill animation
  static createProgressAnimation(
    animatedValue: Animated.Value,
    toValue: number,
    duration: number = 1200
  ) {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false, // Layout animation
    });
  }

  // Particle burst animation
  static createParticleBurst(particles: Animated.Value[], delay: number = 0) {
    const animations = particles.map((particle, index) => 
      Animated.sequence([
        Animated.delay(delay + (index * 50)),
        Animated.timing(particle, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: Platform.OS !== 'web',
        })
      ])
    );
    
    return Animated.stagger(50, animations);
  }

  // Pulse animation for call-to-action
  static createPulseAnimation(animatedValue: Animated.Value) {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.08,
          duration: 1500,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
  }

  // Shimmer loading animation
  static createShimmerAnimation(animatedValue: Animated.Value) {
    return Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
  }

  // Success celebration animation
  static createSuccessAnimation(
    scaleValue: Animated.Value,
    rotateValue: Animated.Value
  ) {
    return Animated.parallel([
      Animated.sequence([
        Animated.spring(scaleValue, {
          toValue: 1.3,
          tension: 100,
          friction: 5,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: Platform.OS !== 'web',
        })
      ]),
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web',
      })
    ]);
  }
}

// Haptic feedback utility
export class HapticFeedback {
  static light() {
    if (Platform.OS === 'ios') {
      // iOS haptic feedback would go here
      console.log('Light haptic feedback');
    } else if (Platform.OS === 'android') {
      // Android haptic feedback would go here
      console.log('Light haptic feedback');
    }
  }

  static medium() {
    if (Platform.OS === 'ios') {
      console.log('Medium haptic feedback');
    } else if (Platform.OS === 'android') {
      console.log('Medium haptic feedback');
    }
  }

  static success() {
    if (Platform.OS === 'ios') {
      console.log('Success haptic feedback');
    } else if (Platform.OS === 'android') {
      console.log('Success haptic feedback');
    }
  }
}

export default PremiumAnimations;
