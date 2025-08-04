// src/components/SafeScrollView.tsx - COMPLETELY FIXED VERSION
import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Platform,
  ViewStyle,
  ScrollViewProps,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shadowPresets } from '../utils/shadowStyles';

interface SafeScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: string;
  headerComponent?: React.ReactNode;
  footerComponent?: React.ReactNode;
  enableSafeArea?: boolean;
  paddingHorizontal?: number;
}

const SafeScrollView: React.FC<SafeScrollViewProps> = ({
  children,
  contentContainerStyle,
  backgroundColor = '#F8FAFC',
  headerComponent,
  footerComponent,
  enableSafeArea = true,
  paddingHorizontal = 20,
  style,
  ...scrollViewProps
}) => {
  const insets = useSafeAreaInsets();
  const Container = enableSafeArea ? SafeAreaView : View;

  return (
    <Container style={[styles.container, { backgroundColor }]}>
      {/* Fixed Header Outside ScrollView */}
      {headerComponent && (
        <View style={[styles.headerContainer, { paddingTop: enableSafeArea ? 0 : insets.top }]}>
          {headerComponent}
        </View>
      )}

      {/* Main Scrollable Content */}
      <ScrollView
        style={[styles.scrollView, { pointerEvents: 'auto' }, style]}
        contentContainerStyle={[
          {
            paddingHorizontal: paddingHorizontal,
            paddingTop: 20,
            paddingBottom: Math.max(insets.bottom + 40, 60),
          },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        overScrollMode="always"
        alwaysBounceVertical={true}
        {...scrollViewProps}
      >
        {children}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Footer Outside ScrollView */}
      {footerComponent && (
        <View style={[styles.footerContainer, { paddingBottom: enableSafeArea ? 0 : insets.bottom }]}>
          {footerComponent}
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    ...shadowPresets.small,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
  },
  footerContainer: {
    backgroundColor: '#FFFFFF',
    ...shadowPresets.small,
    zIndex: 1000,
  },
});

export default SafeScrollView;
