// src/services/OfflineService.ts - SIMPLIFIED VERSION
import AsyncStorage from '@react-native-async-storage/async-storage';

class OfflineService {
  private static instance: OfflineService;
  private syncQueue: any[] = [];

  public static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  async initialize() {
    try {
      await this.loadSyncQueue();
      console.log('✅ Offline Service initialized');
    } catch (error) {
      console.error('❌ Offline Service initialization error:', error);
    }
  }

  async storeDataOffline(type: string, data: any): Promise<string> {
    try {
      const item = {
        id: `${type}_${Date.now()}`,
        type,
        data,
        timestamp: new Date().toISOString(),
        synced: false
      };

      // Store locally
      await AsyncStorage.setItem(item.id, JSON.stringify(data));
      
      // Add to sync queue
      this.syncQueue.push(item);
      await this.saveSyncQueue();

      return item.id;
    } catch (error) {
      console.error('Error storing data offline:', error);
      throw error;
    }
  }

  async generateOfflineRecommendations(userProfile: any, sessionHistory: any[], pillarScores: any) {
    try {
      const recommendations = [];

      // Simple recommendation logic
      const lowestPillar = Object.keys(pillarScores).reduce((a, b) => 
        (pillarScores[a] || 0) < (pillarScores[b] || 0) ? a : b
      );

      recommendations.push({
        id: `rec_${Date.now()}`,
        type: 'pillar_focus',
        pillar: lowestPillar,
        title: `Focus on ${lowestPillar.charAt(0).toUpperCase() + lowestPillar.slice(1)} Pillar`,
        description: `Your ${lowestPillar} pillar needs attention. Try a 5-minute practice today.`,
        confidence: 0.8,
        generatedDate: new Date().toISOString()
      });

      return recommendations;
    } catch (error) {
      console.error('Error generating offline recommendations:', error);
      return [];
    }
  }

  getQueueSize(): number {
    return this.syncQueue.length;
  }

  private async loadSyncQueue() {
    try {
      const stored = await AsyncStorage.getItem('sync_queue');
      this.syncQueue = stored ? JSON.parse(stored) : [];
    } catch (error) {
      this.syncQueue = [];
    }
  }

  private async saveSyncQueue() {
    try {
      await AsyncStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }
}

export default OfflineService;
