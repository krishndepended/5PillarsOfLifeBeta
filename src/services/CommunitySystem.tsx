// src/services/CommunitySystem.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'team' | 'global';
  pillar: string;
  duration: number; // days
  startDate: string;
  endDate: string;
  participants: string[];
  leaderboard: LeaderboardEntry[];
  rewards: Reward[];
  isActive: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  score: number;
  progress: number;
  rank: number;
  achievements: string[];
}

interface Reward {
  type: 'badge' | 'points' | 'premium' | 'physical';
  name: string;
  description: string;
  icon: string;
  value: number;
}

interface SocialPost {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  type: 'achievement' | 'progress' | 'motivation' | 'tip';
  pillar?: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  images?: string[];
  challengeId?: string;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
}

export class CommunitySystem {
  private static instance: CommunitySystem;
  private activeChallenges: Challenge[] = [];
  private socialFeed: SocialPost[] = [];

  public static getInstance(): CommunitySystem {
    if (!CommunitySystem.instance) {
      CommunitySystem.instance = new CommunitySystem();
    }
    return CommunitySystem.instance;
  }

  // Create new challenge
  async createChallenge(challenge: Omit<Challenge, 'id' | 'participants' | 'leaderboard'>): Promise<string> {
    const newChallenge: Challenge = {
      ...challenge,
      id: `challenge_${Date.now()}`,
      participants: [],
      leaderboard: []
    };

    this.activeChallenges.push(newChallenge);
    await this.saveChallenges();
    return newChallenge.id;
  }

  // Join challenge
  async joinChallenge(challengeId: string, userId: string, username: string, avatar: string): Promise<boolean> {
    const challenge = this.activeChallenges.find(c => c.id === challengeId);
    if (!challenge || challenge.participants.includes(userId)) {
      return false;
    }

    challenge.participants.push(userId);
    challenge.leaderboard.push({
      userId,
      username,
      avatar,
      score: 0,
      progress: 0,
      rank: challenge.leaderboard.length + 1,
      achievements: []
    });

    await this.saveChallenges();
    return true;
  }

  // Update challenge progress
  async updateChallengeProgress(challengeId: string, userId: string, points: number): Promise<void> {
    const challenge = this.activeChallenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const participant = challenge.leaderboard.find(p => p.userId === userId);
    if (participant) {
      participant.score += points;
      participant.progress = Math.min(100, participant.progress + (points / 10));
      
      // Recalculate rankings
      challenge.leaderboard.sort((a, b) => b.score - a.score);
      challenge.leaderboard.forEach((participant, index) => {
        participant.rank = index + 1;
      });

      await this.saveChallenges();
    }
  }

  // Get leaderboard for challenge
  getLeaderboard(challengeId: string, limit: number = 10): LeaderboardEntry[] {
    const challenge = this.activeChallenges.find(c => c.id === challengeId);
    return challenge ? challenge.leaderboard.slice(0, limit) : [];
  }

  // Create social post
  async createSocialPost(post: Omit<SocialPost, 'id' | 'likes' | 'comments' | 'timestamp'>): Promise<string> {
    const newPost: SocialPost = {
      ...post,
      id: `post_${Date.now()}`,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString()
    };

    this.socialFeed.unshift(newPost);
    await this.saveSocialFeed();
    return newPost.id;
  }

  // Like post
  async likePost(postId: string): Promise<void> {
    const post = this.socialFeed.find(p => p.id === postId);
    if (post) {
      post.likes++;
      await this.saveSocialFeed();
    }
  }

  // Add comment
  async addComment(postId: string, comment: Omit<Comment, 'id' | 'timestamp' | 'likes'>): Promise<void> {
    const post = this.socialFeed.find(p => p.id === postId);
    if (post) {
      const newComment: Comment = {
        ...comment,
        id: `comment_${Date.now()}`,
        timestamp: new Date().toISOString(),
        likes: 0
      };
      post.comments.push(newComment);
      await this.saveSocialFeed();
    }
  }

  // Get social feed
  getSocialFeed(limit: number = 20): SocialPost[] {
    return this.socialFeed.slice(0, limit);
  }

  // Get active challenges
  getActiveChallenges(): Challenge[] {
    return this.activeChallenges.filter(c => c.isActive);
  }

  // Get user's challenges
  getUserChallenges(userId: string): Challenge[] {
    return this.activeChallenges.filter(c => c.participants.includes(userId));
  }

  // Generate default challenges
  async generateDefaultChallenges(): Promise<void> {
    const defaultChallenges = [
      {
        title: '21-Day Neural Transformation',
        description: 'Transform your neural pathways with 21 days of consistent pillar optimization',
        type: 'global' as const,
        pillar: 'ALL',
        duration: 21,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        rewards: [
          { type: 'badge', name: 'Neural Transformer', description: 'Completed 21-day challenge', icon: 'trophy', value: 100 },
          { type: 'points', name: 'Optimization Points', description: '500 neural points', icon: 'star', value: 500 }
        ],
        isActive: true,
        difficulty: 'intermediate' as const
      },
      {
        title: 'Mindful Monday Warriors',
        description: 'Focus on mind pillar optimization every Monday for a month',
        type: 'team' as const,
        pillar: 'MIND',
        duration: 28,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        rewards: [
          { type: 'badge', name: 'Mind Master', description: 'Mind pillar specialist', icon: 'brain', value: 75 }
        ],
        isActive: true,
        difficulty: 'beginner' as const
      },
      {
        title: 'Heart Coherence Champions',
        description: 'Master emotional intelligence and heart coherence practices',
        type: 'individual' as const,
        pillar: 'HEART',
        duration: 14,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        rewards: [
          { type: 'badge', name: 'Heart Champion', description: 'Emotional intelligence master', icon: 'heart', value: 60 }
        ],
        isActive: true,
        difficulty: 'advanced' as const
      }
    ];

    for (const challenge of defaultChallenges) {
      await this.createChallenge(challenge);
    }
  }

  private async saveChallenges(): Promise<void> {
    try {
      await AsyncStorage.setItem('activeChallenges', JSON.stringify(this.activeChallenges));
    } catch (error) {
      console.error('Error saving challenges:', error);
    }
  }

  private async saveSocialFeed(): Promise<void> {
    try {
      await AsyncStorage.setItem('socialFeed', JSON.stringify(this.socialFeed));
    } catch (error) {
      console.error('Error saving social feed:', error);
    }
  }
}
