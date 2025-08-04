// src/services/storageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PillarEntry {
  id: string;
  pillar: 'BODY' | 'MIND' | 'HEART' | 'SPIRIT' | 'DIET';
  content: string;
  timestamp: string; // ISO string
  neuroOptimal: boolean;
  wordCount: number;
}

export class StorageService {
  private static STORAGE_PREFIX = '@5PillarsOfLife_';
  
  /**
   * Save a new journal entry for a pillar
   * @param pillar - The pillar name
   * @param content - Journal content
   * @param neuroOptimal - Whether entry was made during optimal neurogenesis window
   * @returns Promise<string> - The entry ID
   */
  static async saveEntry(
    pillar: PillarEntry['pillar'], 
    content: string, 
    neuroOptimal: boolean
  ): Promise<string> {
    try {
      const id = `${pillar}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date().toISOString();
      const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      const entry: PillarEntry = {
        id,
        pillar,
        content,
        timestamp,
        neuroOptimal,
        wordCount
      };

      // Save individual entry
      await AsyncStorage.setItem(
        `${this.STORAGE_PREFIX}entry_${id}`, 
        JSON.stringify(entry)
      );

      // Update pillar index (list of entry IDs for this pillar)
      const existingIds = await this.getPillarEntryIds(pillar);
      const updatedIds = [id, ...existingIds];
      await AsyncStorage.setItem(
        `${this.STORAGE_PREFIX}index_${pillar}`, 
        JSON.stringify(updatedIds)
      );

      return id;
    } catch (error) {
      console.error(`Error saving entry for ${pillar}:`, error);
      throw new Error(`Failed to save ${pillar} entry`);
    }
  }

  /**
   * Get the most recent entry for a pillar
   * @param pillar - The pillar name
   * @returns Promise<PillarEntry | null>
   */
  static async getLatestEntry(pillar: PillarEntry['pillar']): Promise<PillarEntry | null> {
    try {
      const entryIds = await this.getPillarEntryIds(pillar);
      if (entryIds.length === 0) return null;

      // Get the most recent entry (first in array)
      const latestId = entryIds[0];
      const entryData = await AsyncStorage.getItem(`${this.STORAGE_PREFIX}entry_${latestId}`);
      
      return entryData ? JSON.parse(entryData) : null;
    } catch (error) {
      console.error(`Error getting latest entry for ${pillar}:`, error);
      return null;
    }
  }

  /**
   * Get entries for a pillar with optional limit
   * @param pillar - The pillar name
   * @param limit - Maximum number of entries to return (optional)
   * @returns Promise<PillarEntry[]>
   */
  static async getPillarEntries(
    pillar: PillarEntry['pillar'], 
    limit?: number
  ): Promise<PillarEntry[]> {
    try {
      const entryIds = await this.getPillarEntryIds(pillar);
      const idsToFetch = limit ? entryIds.slice(0, limit) : entryIds;
      
      const entries: PillarEntry[] = [];
      
      for (const id of idsToFetch) {
        const entryData = await AsyncStorage.getItem(`${this.STORAGE_PREFIX}entry_${id}`);
        if (entryData) {
          entries.push(JSON.parse(entryData));
        }
      }
      
      // Sort by timestamp descending (newest first)
      return entries.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error(`Error getting entries for ${pillar}:`, error);
      return [];
    }
  }

  /**
   * Calculate current streak for a pillar (consecutive days with entries)
   * @param pillar - The pillar name
   * @returns Promise<number> - Days in current streak
   */
  static async getPillarStreak(pillar: PillarEntry['pillar']): Promise<number> {
    try {
      const entries = await this.getPillarEntries(pillar);
      if (entries.length === 0) return 0;

      // Get unique dates (YYYY-MM-DD format)
      const uniqueDates = [...new Set(
        entries.map(entry => entry.timestamp.split('T')[0])
      )].sort().reverse(); // Most recent first

      if (uniqueDates.length === 0) return 0;

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Check if streak is current (has entry today or yesterday)
      if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
        return 0;
      }

      // Count consecutive days
      let streak = 1;
      const startDate = new Date(uniqueDates[0]);

      for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i]);
        const expectedDate = new Date(startDate.getTime() - (i * 86400000));
        
        if (currentDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error(`Error calculating streak for ${pillar}:`, error);
      return 0;
    }
  }

  /**
   * Get all entry IDs for a pillar (newest first)
   * @param pillar - The pillar name
   * @returns Promise<string[]>
   */
  private static async getPillarEntryIds(pillar: PillarEntry['pillar']): Promise<string[]> {
    try {
      const indexData = await AsyncStorage.getItem(`${this.STORAGE_PREFIX}index_${pillar}`);
      return indexData ? JSON.parse(indexData) : [];
    } catch (error) {
      console.error(`Error getting entry IDs for ${pillar}:`, error);
      return [];
    }
  }

  /**
   * Get analytics data for all pillars
   * @returns Promise with completion rates, streaks, and word counts
   */
  static async getAnalyticsData() {
    try {
      const pillars: PillarEntry['pillar'][] = ['BODY', 'MIND', 'HEART', 'SPIRIT', 'DIET'];
      const analytics = {
        totalEntries: 0,
        pillarStats: {} as Record<string, {
          streak: number;
          totalEntries: number;
          avgWordCount: number;
          lastEntry: string | null;
        }>
      };

      for (const pillar of pillars) {
        const entries = await this.getPillarEntries(pillar, 30); // Last 30 entries
        const streak = await this.getPillarStreak(pillar);
        const avgWordCount = entries.length > 0 
          ? Math.round(entries.reduce((sum, e) => sum + e.wordCount, 0) / entries.length)
          : 0;

        analytics.pillarStats[pillar] = {
          streak,
          totalEntries: entries.length,
          avgWordCount,
          lastEntry: entries[0]?.timestamp || null
        };

        analytics.totalEntries += entries.length;
      }

      return analytics;
    } catch (error) {
      console.error('Error getting analytics data:', error);
      throw new Error('Failed to fetch analytics data');
    }
  }

  /**
   * Clear all data for a pillar (use with caution)
   * @param pillar - The pillar to clear
   */
  static async clearPillarData(pillar: PillarEntry['pillar']): Promise<void> {
    try {
      const entryIds = await this.getPillarEntryIds(pillar);
      
      // Remove all entries
      for (const id of entryIds) {
        await AsyncStorage.removeItem(`${this.STORAGE_PREFIX}entry_${id}`);
      }
      
      // Remove index
      await AsyncStorage.removeItem(`${this.STORAGE_PREFIX}index_${pillar}`);
    } catch (error) {
      console.error(`Error clearing data for ${pillar}:`, error);
      throw new Error(`Failed to clear ${pillar} data`);
    }
  }
}

export default StorageService;
