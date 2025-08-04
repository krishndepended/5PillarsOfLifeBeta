// src/services/NavigationService.js - COMPLETE NAVIGATION SYSTEM
import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

class NavigationService {
  navigate(name, params) {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name, params);
    }
  }

  navigateToSession(pillar, sessionData) {
    this.navigate('EnhancedTimerScreen', { pillar, sessionData });
  }

  navigateToAnalytics(tab = 'overview') {
    this.navigate('AnalyticsScreen', { defaultTab: tab });
  }

  navigateToAI(priority = 'all') {
    this.navigate('AIRecommendationsScreen', { defaultFilter: priority });
  }

  navigateToProfile(tab = 'profile') {
    this.navigate('UserProfileScreen', { defaultTab: tab });
  }

  goBack() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }

  reset(routeName) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: routeName }],
        })
      );
    }
  }

  // Deep linking handlers
  handleDeepLink(url) {
    const route = this.parseDeepLink(url);
    if (route) {
      this.navigate(route.screen, route.params);
    }
  }

  parseDeepLink(url) {
    const urlParts = url.replace('5pillarsoflife://', '').split('/');
    const [screen, ...params] = urlParts;

    switch (screen) {
      case 'session':
        return {
          screen: 'EnhancedTimerScreen',
          params: { pillar: params[0]?.toUpperCase() }
        };
      case 'analytics':
        return {
          screen: 'AnalyticsScreen',
          params: { defaultTab: params[0] }
        };
      case 'ai':
        return {
          screen: 'AIRecommendationsScreen',
          params: { defaultFilter: params[0] }
        };
      default:
        return { screen: 'HomeScreen' };
    }
  }
}

export default new NavigationService();
