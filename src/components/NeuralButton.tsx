// src/components/NeuralButton.tsx - COMPLETELY FIXED VERSION
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { shadowPresets } from '../utils/shadowStyles';

interface NeuralButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
}

const NeuralButton: React.FC<NeuralButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
}) => {
  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return ['#3B82F6', '#1D4ED8'];
      case 'secondary':
        return ['#6B7280', '#374151'];
      case 'accent':
        return ['#8B5CF6', '#7C3AED'];
      default:
        return ['#3B82F6', '#1D4ED8'];
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 };
      case 'medium':
        return { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32, fontSize: 18 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16 };
    }
  };

  const buttonSize = getButtonSize();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : 'auto' },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={[
          styles.gradient,
          {
            paddingVertical: buttonSize.paddingVertical,
            paddingHorizontal: buttonSize.paddingHorizontal,
          },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[styles.buttonText, { fontSize: buttonSize.fontSize }]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    ...shadowPresets.medium,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif',
  },
});

export default NeuralButton;
