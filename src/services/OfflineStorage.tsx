// src/services/OfflineStorage.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/lib/index';

interface OfflineData {
  sessions: Session[];
  pillars: PillarData[];
  achievements: Achievement[];
  userProfile: UserProfile;
  lastSync: string;
}

interface Session {
  id: string;
  pillarName: string;
  duration: number;
  startTime: string;
  endTime: string;
  neuralScore: number;
  completed: boolean;
}

interface PillarData {
  name: string;
  dailyScore: number;
  weeklyProgress: number[];
  lastUpdated: string;
}

export class OfflineStorageManager {
  private static instance: OfflineStorageManager;
  private isOnline: boolean = true;
  private pendingSync: any[] = [];

  public static getInstance(): OfflineStorageManager {
    if (!OfflineStorageManager.instance) {
      OfflineStorageManager.instance = new OfflineStorageManager();
    }
    return OfflineStorageManager.instance;
  }

  constructor() {
    this.initializeNetworkListener();
  }

  private initializeNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected || false;
      
      if (wasOffline && this.isOnline) {
        this.syncPendingData();
      }
    });
  }

  // Save data locally
  async saveData(key: string, data: any): Promise<void> {
    try {
      const dataWithTimestamp = {
        ...data,
        savedAt: new Date().toISOString(),
        synced: this.isOnline
      };
      
      await AsyncStorage.setItem(key, JSON.stringify(dataWithTimestamp));
      
      if (!this.isOnline) {
        this.addToPendingSync(key, data);
      }
    } catch (error) {
      console.error('Error saving data offline:', error);
    }
  }

  // Load data locally
  async loadData(key: string): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading data offline:', error);
      return null;
    }
  }

  // Save session data
  async saveSession(session: Session): Promise<void> {
    try {
      const existingSessions = await this.loadData('sessions') || [];
      const sessions = Array.isArray(existingSessions) ? existingSessions : [];
      
      sessions.push(session);
      await this.saveData('sessions', sessions);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  // Get all sessions
  async getSessions(): Promise<Session[]> {
    try {
      const data = await this.loadData('sessions');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  }

  // Save pillar progress
  async savePillarProgress(pillarName: string, score: number): Promise<void> {
    try {
      const pillars = await this.loadData('pillars') || {};
      
      if (!pillars[pillarName]) {
        pillars[pillarName] = {
          name: pillarName,
          dailyScore: 0,
          weeklyProgress: [],
          lastUpdated: new Date().toISOString()
        };
      }
      
      pillars[pillarName].dailyScore = score;
      pillars[pillarName].lastUpdated = new Date().toISOString();
      
      await this.saveData('pillars', pillars);
    } catch (error) {
      console.error('Error saving pillar progress:', error);
    }
  }

  private addToPendingSync(key: string, data: any) {
    this.pendingSync.push({
      key,
      data,
      timestamp: new Date().toISOString()
    });
  }

  private async syncPendingData() {
    if (this.pendingSync.length === 0) return;

    try {
      // Here you would sync with your backend API
      console.log('Syncing pending data:', this.pendingSync);
      
      // Clear pending sync after successful upload
      this.pendingSync = [];
      
      // Update all stored data as synced
      const keys = await AsyncStorage.getAllKeys();
      for (const key of keys) {
        const data = await this.loadData(key);
        if (data) {
          data.synced = true;
          await AsyncStorage.setItem(key, JSON.stringify(data));
        }
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  }

  // Get sync status
  async getSyncStatus(): Promise<{ totalItems: number; syncedItems: number; lastSync: string }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalItems = 0;
      let syncedItems = 0;
      let lastSync = 'Never';

      for (const key of keys) {
        const data = await this.loadData(key);
        if (data) {
          totalItems++;
          if (data.synced) {
            syncedItems++;
            if (data.savedAt > lastSync || lastSync === 'Never') {
              lastSync = data.savedAt;
            }
          }
        }
      }

      return { totalItems, syncedItems, lastSync };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return { totalItems: 0, syncedItems: 0, lastSync: 'Error' };
    }
  }

  // Clear all offline data
  async clearOfflineData(): Promise<void> {
    try {
      await AsyncStorage.clear();
      this.pendingSync = [];
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }
}
