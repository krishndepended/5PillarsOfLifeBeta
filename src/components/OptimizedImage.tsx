// src/components/OptimizedImage.tsx - PERFORMANCE OPTIMIZED IMAGE COMPONENT
import React, { useState, memo } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, ImageProps } from 'react-native';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  source: { uri: string } | number;
  placeholder?: React.ReactNode;
  fallback?: React.ReactNode;
  cacheKey?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  source,
  placeholder,
  fallback,
  style,
  cacheKey,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (error && fallback) {
    return <>{fallback}</>;
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        {...props}
        source={source}
        style={[StyleSheet.absoluteFillObject, style]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        resizeMode="cover"
      />
      {loading && (
        <View style={styles.loadingContainer}>
          {placeholder || <ActivityIndicator size="small" color="#3B82F6" />}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
});
export default OptimizedImage;