// src/components/ScreenWrapper.tsx - CREATE THIS FILE
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: any;
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  backgroundColor?: string;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  headerComponent,
  footerComponent,
  backgroundColor = '#F8FAFC'
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {/* Fixed Header Outside ScrollView */}
      {headerComponent && (
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
          {headerComponent}
        </View>
      )}
      
      {/* Main Content Area */}
      <View style={styles.contentArea}>
        {children}
      </View>
      
      {/* Fixed Footer Outside ScrollView */}
      {footerComponent && (
        <View style={[styles.footerContainer, { paddingBottom: insets.bottom }]}>
          {footerComponent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 1000,
  },
  contentArea: {
    flex: 1,
  },
  footerContainer: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 1000,
  },
});

export default ScreenWrapper;
