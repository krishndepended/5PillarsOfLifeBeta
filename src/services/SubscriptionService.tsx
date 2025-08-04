// src/services/SubscriptionService.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: 'monthly' | 'yearly' | 'lifetime';
  features: Feature[];
  recommended: boolean;
  savings?: string;
}

interface Feature {
  name: string;
  description: string;
  icon: string;
  included: boolean;
}

interface UserSubscription {
  planId: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  autoRenew: boolean;
  paymentMethod: string;
}

export class SubscriptionService {
  private static instance: SubscriptionService;
  private subscriptionPlans: SubscriptionPlan[] = [];
  private userSubscription: UserSubscription | null = null;

  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  constructor() {
    this.initializeSubscriptionPlans();
    this.loadUserSubscription();
  }

  private initializeSubscriptionPlans(): void {
    this.subscriptionPlans = [
      {
        id: 'free',
        name: 'Neural Explorer',
        description: 'Start your neural optimization journey',
        price: 0,
        currency: 'USD',
        duration: 'monthly',
        recommended: false,
        features: [
          { name: 'Basic Pillar Tracking', description: 'Track all 5 pillars', icon: 'library', included: true },
          { name: 'Simple Analytics', description: 'Basic progress charts', icon: 'stats-chart', included: true },
          { name: 'Timer Sessions', description: '3 timer sessions per day', icon: 'timer', included: true },
          { name: 'Community Access', description: 'Join challenges and leaderboards', icon: 'people', included: true },
          { name: 'AI Recommendations', description: 'Limited to 3 per day', icon: 'brain', included: true },
          { name: 'Advanced Analytics', description: 'Detailed insights and trends', icon: 'analytics', included: false },
          { name: 'Unlimited Timers', description: 'No session limits', icon: 'infinite', included: false },
          { name: 'Premium Content', description: 'Expert-guided programs', icon: 'school', included: false },
          { name: 'Health Integration', description: 'Advanced health metrics', icon: 'heart', included: false },
          { name: 'Priority Support', description: '24/7 premium support', icon: 'help-circle', included: false }
        ]
      },
      {
        id: 'premium_monthly',
        name: 'Neural Optimizer',
        description: 'Unlock your full neural potential',
        price: 9.99,
        currency: 'USD',
        duration: 'monthly',
        recommended: true,
        features: [
          { name: 'Advanced Pillar Tracking', description: 'Enhanced tracking with insights', icon: 'library', included: true },
          { name: 'Advanced Analytics', description: 'Detailed insights and trends', icon: 'analytics', included: true },
          { name: 'Unlimited Timers', description: 'No session limits', icon: 'infinite', included: true },
          { name: 'AI Coaching', description: 'Unlimited personalized recommendations', icon: 'brain', included: true },
          { name: 'Premium Content', description: 'Expert-guided programs', icon: 'school', included: true },
          { name: 'Health Integration', description: 'HealthKit/Google Fit sync', icon: 'heart', included: true },
          { name: 'Community Features', description: 'Create and join premium challenges', icon: 'people', included: true },
          { name: 'Export Data', description: 'Full data export capabilities', icon: 'download', included: true },
          { name: 'Dark Mode', description: 'Multiple theme options', icon: 'moon', included: true },
          { name: 'Priority Support', description: '24/7 premium support', icon: 'help-circle', included: true }
        ]
      },
      {
        id: 'premium_yearly',
        name: 'Neural Master',
        description: 'Master your neural optimization with savings',
        price: 79.99,
        currency: 'USD',
        duration: 'yearly',
        recommended: false,
        savings: 'Save 33%',
        features: [
          { name: 'All Premium Features', description: 'Everything from monthly plan', icon: 'checkmark-circle', included: true },
          { name: 'Annual Savings', description: 'Save $40 per year', icon: 'cash', included: true },
          { name: 'Exclusive Content', description: 'Yearly subscriber exclusive programs', icon: 'star', included: true },
          { name: 'Early Access', description: 'Beta features and updates', icon: 'rocket', included: true },
          { name: 'Personal Coach', description: 'Monthly 1-on-1 coaching calls', icon: 'person', included: true },
          { name: 'Custom Programs', description: 'Personalized neural optimization plans', icon: 'construct', included: true },
          { name: 'Advanced Integrations', description: 'Connect with premium health devices', icon: 'wifi', included: true },
          { name: 'Nutrition Tracking', description: 'Advanced macro and micro tracking', icon: 'nutrition', included: true },
          { name: 'Sleep Optimization', description: 'AI-powered sleep coaching', icon: 'bed', included: true },
          { name: 'VIP Support', description: 'Direct line to our neural optimization team', icon: 'diamond', included: true }
        ]
      },
      {
        id: 'lifetime',
        name: 'Neural Immortal',
        description: 'Lifetime access to neural optimization',
        price: 299.99,
        currency: 'USD',
        duration: 'lifetime',
        recommended: false,
        savings: 'Best Value',
        features: [
          { name: 'Lifetime Access', description: 'Never pay again', icon: 'infinite', included: true },
          { name: 'All Current Features', description: 'Everything available now', icon: 'checkmark-circle', included: true },
          { name: 'All Future Features', description: 'Free access to new features forever', icon: 'rocket', included: true },
          { name: 'Founder Benefits', description: 'Special recognition and perks', icon: 'trophy', included: true },
          { name: 'Direct Input', description: 'Influence product development', icon: 'construct', included: true },
          { name: 'Exclusive Community', description: 'Lifetime member forum access', icon: 'people', included: true },
          { name: 'Premium Hardware', description: 'Discounts on neural optimization devices', icon: 'hardware-chip', included: true },
          { name: 'Research Participation', description: 'Contribute to neural science studies', icon: 'library', included: true },
          { name: 'Legacy Account', description: 'Transfer to family members', icon: 'gift', included: true },
          { name: 'Neural Concierge', description: 'White-glove optimization service', icon: 'diamond', included: true }
        ]
      }
    ];
  }

  // Get all subscription plans
  getSubscriptionPlans(): SubscriptionPlan[] {
    return this.subscriptionPlans;
  }

  // Get user's current subscription
  getCurrentSubscription(): UserSubscription | null {
    return this.userSubscription;
  }

  // Check if user has premium access
  hasPremiumAccess(): boolean {
    if (!this.userSubscription || !this.userSubscription.isActive) {
      return false;
    }
    
    if (this.userSubscription.planId === 'lifetime') {
      return true;
    }
    
    if (this.userSubscription.endDate) {
      return new Date(this.userSubscription.endDate) > new Date();
    }
    
    return false;
  }

  // Check if specific feature is available
  hasFeatureAccess(featureName: string): boolean {
    if (!this.userSubscription) {
      // Check free plan features
      const freePlan = this.subscriptionPlans.find(p => p.id === 'free');
      const feature = freePlan?.features.find(f => f.name === featureName);
      return feature?.included || false;
    }
    
    const currentPlan = this.subscriptionPlans.find(p => p.id === this.userSubscription!.planId);
    const feature = currentPlan?.features.find(f => f.name === featureName);
    return feature?.included || false;
  }

  // Purchase subscription
  async purchaseSubscription(planId: string, paymentMethod: string): Promise<boolean> {
    try {
      // Simulate payment processing
      await this.simulatePaymentProcessing();
      
      const plan = this.subscriptionPlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Invalid subscription plan');
      }
      
      const subscription: UserSubscription = {
        planId,
        startDate: new Date().toISOString(),
        endDate: plan.duration === 'lifetime' ? undefined : this.calculateEndDate(plan.duration),
        isActive: true,
        autoRenew: plan.duration !== 'lifetime',
        paymentMethod
      };
      
      this.userSubscription = subscription;
      await this.saveUserSubscription();
      
      return true;
    } catch (error) {
      console.error('Subscription purchase failed:', error);
      return false;
    }
  }

  // Cancel subscription
  async cancelSubscription(): Promise<boolean> {
    try {
      if (this.userSubscription) {
        this.userSubscription.autoRenew = false;
        await this.saveUserSubscription();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Subscription cancellation failed:', error);
      return false;
    }
  }

  // Restore purchases
  async restorePurchases(): Promise<boolean> {
    try {
      // Simulate purchase restoration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for existing purchases (would integrate with actual payment platform)
      const existingSubscription = await this.loadUserSubscription();
      
      return !!existingSubscription;
    } catch (error) {
      console.error('Purchase restoration failed:', error);
      return false;
    }
  }

  // Get subscription pricing for display
  getFormattedPrice(planId: string): string {
    const plan = this.subscriptionPlans.find(p => p.id === planId);
    if (!plan) return '';
    
    if (plan.price === 0) return 'Free';
    
    const formattedPrice = plan.price.toFixed(2);
    
    switch (plan.duration) {
      case 'monthly':
        return `$${formattedPrice}/month`;
      case 'yearly':
        return `$${formattedPrice}/year`;
      case 'lifetime':
        return `$${formattedPrice} once`;
      default:
        return `$${formattedPrice}`;
    }
  }

  // Calculate annual savings
  getAnnualSavings(): number {
    const monthlyPlan = this.subscriptionPlans.find(p => p.id === 'premium_monthly');
    const yearlyPlan = this.subscriptionPlans.find(p => p.id === 'premium_yearly');
    
    if (!monthlyPlan || !yearlyPlan) return 0;
    
    const annualCostOfMonthly = monthlyPlan.price * 12;
    return annualCostOfMonthly - yearlyPlan.price;
  }

  private calculateEndDate(duration: 'monthly' | 'yearly'): string {
    const now = new Date();
    
    if (duration === 'monthly') {
      now.setMonth(now.getMonth() + 1);
    } else if (duration === 'yearly') {
      now.setFullYear(now.getFullYear() + 1);
    }
    
    return now.toISOString();
  }

  private async simulatePaymentProcessing(): Promise<void> {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async saveUserSubscription(): Promise<void> {
    try {
      await AsyncStorage.setItem('userSubscription', JSON.stringify(this.userSubscription));
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  }

  private async loadUserSubscription(): Promise<UserSubscription | null> {
    try {
      const data = await AsyncStorage.getItem('userSubscription');
      if (data) {
        this.userSubscription = JSON.parse(data);
        return this.userSubscription;
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
    return null;
  }

  // Get usage statistics for current plan
  getUsageStats(): {
    timerSessions: { used: number; limit: number };
    aiRecommendations: { used: number; limit: number };
    features: { available: number; total: number };
  } {
    const isPremium = this.hasPremiumAccess();
    
    return {
      timerSessions: {
        used: 2, // Would come from actual usage tracking
        limit: isPremium ? -1 : 3 // -1 means unlimited
      },
      aiRecommendations: {
        used: 1, // Would come from actual usage tracking
        limit: isPremium ? -1 : 3
      },
      features: {
        available: isPremium ? 10 : 5,
        total: 10
      }
    };
  }
}
