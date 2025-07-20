import Constants from "expo-constants";
import { databases } from "../lib/appwrite";
import {
  calculateTaskXPReward,
  calculateLevelInfo,
  checkLevelUp,
  getLevelTitle,
  getLevelColor,
} from "../utils/leveling";

const DATABASE_ID = Constants.expoConfig.extra.DATABASE_ID;
const COLLECTION_ID =
  Constants.expoConfig.extra.LEVELS_COLLECTION_ID ||
  Constants.expoConfig.extra.COLLECTION_ID;

export class LevelingService {
  constructor(userId) {
    this.userId = userId;
  }

  async getLevelInfo() {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        this.userId
      );

      return {
        level: response.level || 1,
        totalXP: response.totalXP || 0,
        currentLevelXP: response.currentLevelXP || 0,
        xpToNextLevel: response.xpToNextLevel || 100,
        consecutiveCompletions: 0,
        lastCompletionDate: null,
      };
    } catch (error) {
      if (error.code === 404) {
        return this.createLevelDocument();
      }
      throw error;
    }
  }

  async createLevelDocument() {
    const initialLevelInfo = calculateLevelInfo(0);

    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        this.userId,
        {
          userId: this.userId,
          level: initialLevelInfo.level,
          totalXP: initialLevelInfo.totalXP,
          currentLevelXP: initialLevelInfo.currentLevelXP,
          xpToNextLevel: initialLevelInfo.xpToNextLevel,
        }
      );

      return {
        level: response.level,
        totalXP: response.totalXP,
        currentLevelXP: response.currentLevelXP,
        xpToNextLevel: response.xpToNextLevel,
        consecutiveCompletions: 0,
        lastCompletionDate: null,
      };
    } catch (error) {
      return {
        level: initialLevelInfo.level,
        totalXP: initialLevelInfo.totalXP,
        currentLevelXP: initialLevelInfo.currentLevelXP,
        xpToNextLevel: initialLevelInfo.xpToNextLevel,
        consecutiveCompletions: 0,
        lastCompletionDate: null,
      };
    }
  }

  async awardXPForTask(difficulty) {
    try {
      const currentInfo = await this.getLevelInfo();

      const xpReward = calculateTaskXPReward(difficulty, 0);

      const newTotalXP = currentInfo.totalXP + xpReward;

      const leveledUp = checkLevelUp(currentInfo.totalXP, newTotalXP);

      const newLevelInfo = calculateLevelInfo(newTotalXP);

      const updatedInfo = await this.updateLevelInfo({
        ...newLevelInfo,
      });

      return {
        ...updatedInfo,
        xpReward,
        leveledUp,
        consecutiveCompletions: 0,
        levelTitle: getLevelTitle(newLevelInfo.level),
        levelColor: getLevelColor(newLevelInfo.level),
      };
    } catch (error) {
      throw new Error(`Failed to award XP: ${error.message}`);
    }
  }

  calculateConsecutiveCompletions(currentInfo) {
    if (!currentInfo.lastCompletionDate) return 0;

    const lastCompletion = new Date(currentInfo.lastCompletionDate);
    const now = new Date();
    const timeDiff = now.getTime() - lastCompletion.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    if (daysDiff > 1) {
      return 0;
    }

    return currentInfo.consecutiveCompletions || 0;
  }

  async updateLevelInfo(levelInfo) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        this.userId,
        {
          level: levelInfo.level,
          totalXP: levelInfo.totalXP,
          currentLevelXP: levelInfo.currentLevelXP,
          xpToNextLevel: levelInfo.xpToNextLevel,
        }
      );

      return {
        level: response.level,
        totalXP: response.totalXP,
        currentLevelXP: response.currentLevelXP,
        xpToNextLevel: response.xpToNextLevel,
        consecutiveCompletions: 0,
      };
    } catch (error) {
      throw new Error(`Failed to update level info: ${error.message}`);
    }
  }

  async resetConsecutiveCompletions() {
    try {
      const currentInfo = await this.getLevelInfo();

      return {
        ...currentInfo,
        consecutiveCompletions: 0,
        lastCompletionDate: null,
      };
    } catch (error) {
      throw new Error(
        `Failed to reset consecutive completions: ${error.message}`
      );
    }
  }

  async getLevelStatistics() {
    try {
      const levelInfo = await this.getLevelInfo();

      return {
        ...levelInfo,
        levelTitle: getLevelTitle(levelInfo.level),
        levelColor: getLevelColor(levelInfo.level),
        progressPercentage: Math.min(
          100,
          (levelInfo.currentLevelXP / levelInfo.xpToNextLevel) * 100
        ),
      };
    } catch (error) {
      throw new Error(`Failed to get level statistics: ${error.message}`);
    }
  }
}
