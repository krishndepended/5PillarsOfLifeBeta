// src/components/UniversalScrollView.tsx - CREATE THIS FILE
import React from 'react';
import { 
  ScrollView, 
  View, 
  StyleSheet, 
  Platform, 
  SafeAreaView 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UniversalScrollViewProps {
  children: React.ReactNode;
  contentContainerStyle?: any;
  style?: any;
  showsVerticalScrollIndicator?: boolean;
  bounces?: boolean;
  enableScrolling?: boolean;
  [key: string]: any;
}

const UniversalScrollView: React.FC<UniversalScrollViewProps> = ({
  children,
  contentContainerStyle,
  style,
  showsVerticalScrollIndicator = false,
  bounces = true,
  enableScrolling = true,
  ...props
}) => {
  const insets = useSafeAreaInsets();

  if (!enableScrolling) {
    return (
      <View style={[styles.container, style]}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingBottom: Math.max(insets.bottom, 20), // Safe bottom padding
          },
          contentContainerStyle
        ]}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        bounces={bounces}
        scrollEventThrottle={16}
        nestedScrollEnabled={true} // Critical for Android[29]
        keyboardShouldPersistTaps="handled"
        {...props}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1, // Use flexGrow instead of flex[2]
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export default UniversalScrollView;
