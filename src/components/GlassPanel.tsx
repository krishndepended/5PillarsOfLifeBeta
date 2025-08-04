// src/components/GlassPanel.tsx - COMPLETELY FIXED VERSION
import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { shadowPresets } from '../utils/shadowStyles';

interface GlassPanelProps {
  children: React.ReactNode;
  intensity?: number;
  style?: ViewStyle;
  backgroundColor?: string;
}

const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  intensity = 80,
  style,
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
}) => {
  if (Platform.OS === 'web') {
    // Web fallback
    return (
      <View style={[
        styles.webGlassPanel, 
        { backgroundColor, pointerEvents: 'auto' }, 
        style
      ]}>
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      style={[styles.glassPanel, { pointerEvents: 'auto' }, style]}
    >
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  glassPanel: {
    borderRadius: 16,
    overflow: 'hidden',
    ...shadowPresets.large,
  },
  webGlassPanel: {
    borderRadius: 16,
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    ...shadowPresets.large,
  },
});

export default GlassPanel;
