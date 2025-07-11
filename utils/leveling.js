export const LEVELING_CONFIG = {
  BASE_XP: 100,

  XP_MULTIPLIER: 1.5,

  DIFFICULTY_XP: {
    easy: 10,
    medium: 25,
    hard: 50,
  },

  
  CONSECUTIVE_BONUS: {
    streak_5: 1.2,
    streak_10: 1.5,
    streak_20: 2.0,
  },

  
  MAX_LEVEL: 100,
};

export function calculateXPForLevel(level) {
  if (level <= 0) return LEVELING_CONFIG.BASE_XP;

  return Math.floor(
    LEVELING_CONFIG.BASE_XP * Math.pow(LEVELING_CONFIG.XP_MULTIPLIER, level - 1)
  );
}

export function calculateTotalXPForLevel(level) {
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += calculateXPForLevel(i);
  }
  return totalXP;
}

export function calculateLevelFromXP(totalXP) {
  if (totalXP < LEVELING_CONFIG.BASE_XP) return 1;

  let level = 1;
  let xpNeeded = 0;

  while (xpNeeded <= totalXP && level <= LEVELING_CONFIG.MAX_LEVEL) {
    xpNeeded += calculateXPForLevel(level);
    level++;
  }

  return Math.min(level - 1, LEVELING_CONFIG.MAX_LEVEL);
}

export function calculateCurrentLevelXP(totalXP) {
  const currentLevel = calculateLevelFromXP(totalXP);
  const xpForPreviousLevels = calculateTotalXPForLevel(currentLevel);
  return totalXP - xpForPreviousLevels;
}

export function calculateXPToNextLevel(totalXP) {
  const currentLevel = calculateLevelFromXP(totalXP);
  return calculateXPForLevel(currentLevel);
}

export function calculateTaskXPReward(difficulty, consecutiveCompletions = 0) {
  let baseXP =
    LEVELING_CONFIG.DIFFICULTY_XP[difficulty] ||
    LEVELING_CONFIG.DIFFICULTY_XP.easy;

  if (consecutiveCompletions >= 20) {
    baseXP *= LEVELING_CONFIG.CONSECUTIVE_BONUS.streak_20;
  } else if (consecutiveCompletions >= 10) {
    baseXP *= LEVELING_CONFIG.CONSECUTIVE_BONUS.streak_10;
  } else if (consecutiveCompletions >= 5) {
    baseXP *= LEVELING_CONFIG.CONSECUTIVE_BONUS.streak_5;
  }

  return Math.floor(baseXP);
}

export function calculateLevelInfo(totalXP) {
  const level = calculateLevelFromXP(totalXP);
  const currentLevelXP = calculateCurrentLevelXP(totalXP);
  const xpToNextLevel = calculateXPToNextLevel(totalXP);

  return {
    level,
    totalXP,
    currentLevelXP,
    xpToNextLevel,
    progressPercentage: Math.min(100, (currentLevelXP / xpToNextLevel) * 100),
  };
}

export function checkLevelUp(oldTotalXP, newTotalXP) {
  const oldLevel = calculateLevelFromXP(oldTotalXP);
  const newLevel = calculateLevelFromXP(newTotalXP);
  return newLevel > oldLevel;
}

export function getLevelTitle(level) {
  const titles = {
    1: "Novice",
    5: "Apprentice",
    10: "Journeyman",
    20: "Expert",
    30: "Master",
    50: "Grandmaster",
    75: "Legend",
    100: "Mythic",
  };

  let title = "Novice";
  for (const [levelThreshold, levelTitle] of Object.entries(titles)) {
    if (level >= parseInt(levelThreshold)) {
      title = levelTitle;
    }
  }

  return title;
}

export function getLevelColor(level) {
  if (level >= 75) return "#FFD700"; // Gold
  if (level >= 50) return "#C0C0C0"; // Silver
  if (level >= 30) return "#CD7F32"; // Bronze
  if (level >= 20) return "#4CAF50"; // Green
  if (level >= 10) return "#2196F3"; // Blue
  return "#9E9E9E"; // Gray
}
