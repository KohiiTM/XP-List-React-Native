import { useState, useEffect, useCallback } from "react";
import { useUser } from "./useUser";
import { LevelingService } from "../services/levelingService";

export function useLeveling() {
  const { user } = useUser();
  const [levelInfo, setLevelInfo] = useState({
    level: 1,
    totalXP: 0,
    currentLevelXP: 0,
    xpToNextLevel: 100,
    consecutiveCompletions: 0,
    lastCompletionDate: null,
    levelTitle: "Novice",
    levelColor: "#9E9E9E",
    progressPercentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLevelingService = useCallback(() => {
    if (!user?.$id) return null;
    return new LevelingService(user.$id);
  }, [user]);

  // Fetch level info
  const fetchLevelInfo = useCallback(async () => {
    if (!user?.$id) return;

    setLoading(true);
    setError(null);

    try {
      const service = getLevelingService();
      if (!service) return;

      console.log("Fetching level info for user:", user.$id);
      const info = await service.getLevelStatistics();
      console.log("Level info fetched:", info);
      setLevelInfo(info);
    } catch (err) {
      console.error("Failed to fetch level info:", err);
      setError(err.message || "Failed to fetch level info");
    } finally {
      setLoading(false);
    }
  }, [user, getLevelingService]);

  const awardXPForTask = useCallback(
    async (difficulty) => {
      if (!user?.$id) {
        throw new Error("User not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        const service = getLevelingService();
        if (!service) throw new Error("Leveling service not available");

        console.log(
          "Leveling service created, awarding XP for difficulty:",
          difficulty
        );
        const result = await service.awardXPForTask(difficulty);
        console.log("XP awarded successfully:", result);
        setLevelInfo(result);

        return result;
      } catch (err) {
        console.error("XP award error:", err);
        setError(err.message || "Failed to award XP");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, getLevelingService]
  );

  // Reset consecutive completions
  const resetConsecutiveCompletions = useCallback(async () => {
    if (!user?.$id) return;

    setLoading(true);
    setError(null);

    try {
      const service = getLevelingService();
      if (!service) return;

      const info = await service.resetConsecutiveCompletions();
      setLevelInfo(info);
    } catch (err) {
      setError(err.message || "Failed to reset consecutive completions");
    } finally {
      setLoading(false);
    }
  }, [user, getLevelingService]);

  // Fetch level info on mount and when user changes
  useEffect(() => {
    fetchLevelInfo();
  }, [fetchLevelInfo]);

  return {
    levelInfo,
    loading,
    error,
    fetchLevelInfo,
    awardXPForTask,
    resetConsecutiveCompletions,
  };
}
