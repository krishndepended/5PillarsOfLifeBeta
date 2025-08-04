// src/utils/SafeNavigation.ts - SAFE NAVIGATION HELPERS
export const safeNavigate = (navigation: any, screenName: string, params: any = {}) => {
  if (navigation && typeof navigation.navigate === 'function') {
    try {
      navigation.navigate(screenName, params);
    } catch (error) {
      console.warn('Navigation failed:', error);
    }
  } else {
    console.warn('Navigation object is undefined or invalid. Navigation prevented.');
  }
};

export const safeGet = (obj: any, path: string, defaultValue: any = undefined) => {
  try {
    const paths = path.split('.');
    let current = obj;
    for (const p of paths) {
      if (current && typeof current === 'object' && p in current) {
        current = current[p];
      } else {
        return defaultValue;
      }
    }
    return current;
  } catch (error) {
    console.warn('Safe get error:', error);
    return defaultValue;
  }
};

export const safeAccessRouteParams = (route: any, key: string, defaultValue: any = null) => {
  return safeGet(route, `params.${key}`, defaultValue);
};
