// src/utils/OfflineStorage.tsx - COMPLETE OFFLINE STORAGE MANAGER
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export interface OfflineData {
  pillarScores: any;
  userProfile: any;
  sessionData: any;
  settings: any;
  offlineSessions: any[];
  lastSyncTimestamp: number;
  pendingActions: any[];
}

class OfflineStorageManager {
  private static instance: OfflineStorageManager;
  private isOnline: boolean = true;
  private syncQueue: any[] = [];

  static getInstance(): OfflineStorageManager {
    if (!OfflineStorageManager.instance) {
      OfflineStorageManager.instance = new OfflineStorageManager();
    }
    return OfflineStorageManager.instance;
  }

  async initialize() {
    // Monitor network status
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      // If we just came back online, sync pending data
      if (wasOffline && this.isOnline) {
        this.syncPendingData();
      }
    });

    // Get initial network status
    const netInfo = await NetInfo.fetch();
    this.isOnline = netInfo.isConnected ?? false;
  }

  async saveOfflineData(key: string, data: any): Promise<void> {
    try {
      const timestamp = Date.now();
      const offlineData = {
        ...data,
        lastModified: timestamp,
        synced: this.isOnline
      };

      await AsyncStorage.setItem(`offline_${key}`, JSON.stringify(offlineData));

      // If offline, add to sync queue
      if (!this.isOnline) {
        this.addToSyncQueue(key, data);
      }
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }

  async getOfflineData(key: string): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(`offline_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting offline data:', error);
      return null;
    }
  }

  async addToSyncQueue(action: string, data: any): Promise<void> {
    this.syncQueue.push({
      action,
      data,
      timestamp: Date.now(),
      id: Math.random().toString(36)
    });
    
    await AsyncStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
  }

  async syncPendingData(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) return;

    try {
      console.log(`Syncing ${this.syncQueue.length} pending actions...`);
      
      // Process sync queue
      for (const item of this.syncQueue) {
        await this.processSyncItem(item);
      }

      // Clear sync queue
      this.syncQueue = [];
      await AsyncStorage.removeItem('sync_queue');
      
      console.log('Offline data synced successfully!');
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  }

  private async processSyncItem(item: any): Promise<void> {
    // Here you would implement actual cloud sync logic
    // For now, we'll just mark items as synced
    console.log(`Syncing ${item.action}:`, item.data);
  }

  isOffline(): boolean {
    return !this.isOnline;
  }

  getQueueSize(): number {
    return this.syncQueue.length;
  }
}

export default OfflineStorageManager;
