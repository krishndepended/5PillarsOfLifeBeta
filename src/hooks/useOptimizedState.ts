// src/hooks/useOptimizedState.ts - PREVENT MEMORY LEAKS AND OPTIMIZE STATE
import { useState, useEffect, useRef, useCallback } from 'react';

// Optimized state hook that prevents memory leaks
export const useOptimizedState = <T>(initialValue: T) => {
  const [state, setState] = useState<T>(initialValue);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const setStateIfMounted = useCallback((value: T | ((prev: T) => T)) => {
    if (isMountedRef.current) {
      setState(value);
    }
  }, []);

  return [state, setStateIfMounted] as const;
};

// Debounced state for performance optimization
export const useDebouncedState = <T>(initialValue: T, delay: number = 300) => {
  const [state, setState] = useOptimizedState(initialValue);
  const [debouncedState, setDebouncedState] = useOptimizedState(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedState(state);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state, delay, setDebouncedState]);

  return [debouncedState, setState] as const;
};

// Optimized async data fetching
export const useOptimizedAsyncData = <T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useOptimizedState<T | null>(null);
  const [loading, setLoading] = useOptimizedState(false);
  const [error, setError] = useOptimizedState<Error | null>(null);
  const abortControllerRef = useRef<AbortController>();

  const fetchData = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, setData, setLoading, setError]);

  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};
