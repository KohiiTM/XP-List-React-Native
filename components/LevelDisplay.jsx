import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

const LevelDisplay = ({
  level,
  currentLevelXP,
  xpToNextLevel,
  totalXP,
  levelTitle,
  levelColor,
  consecutiveCompletions = 0,
  showStreak = true,
  compact = false,
}) => {
  const progressPercentage = Math.min(
    100,
    (currentLevelXP / xpToNextLevel) * 100
  );

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactLevelInfo}>
          <Text style={[styles.compactLevel, { color: levelColor }]}>
            Level {level}
          </Text>
          <Text style={styles.compactTitle}>{levelTitle}</Text>
        </View>
        <View style={styles.compactProgressContainer}>
          <View style={styles.compactProgressBar}>
            <View
              style={[
                styles.compactProgressFill,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: levelColor,
                },
              ]}
            />
          </View>
          <Text style={styles.compactXPText}>
            {currentLevelXP} / {xpToNextLevel} XP
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelInfo}>
          <Text style={[styles.level, { color: levelColor }]}>
            Level {level}
          </Text>
          <Text style={[styles.title, { color: levelColor }]}>
            {levelTitle}
          </Text>
        </View>
        {showStreak && consecutiveCompletions > 0 && (
          <View style={styles.streakContainer}>
            <Text style={styles.streakText}>
              🔥 {consecutiveCompletions} day streak
            </Text>
          </View>
        )}
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%`, backgroundColor: levelColor },
            ]}
          />
        </View>
        <View style={styles.xpInfo}>
          <Text style={styles.xpText}>
            {currentLevelXP} / {xpToNextLevel} XP
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Progress</Text>
          <Text style={styles.statValue}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>XP to Next</Text>
          <Text style={styles.statValue}>{xpToNextLevel - currentLevelXP}</Text>
        </View>
        {showStreak && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{consecutiveCompletions}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  levelInfo: {
    flex: 1,
  },
  level: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  streakContainer: {
    backgroundColor: Colors.dark.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    color: Colors.dark.warningText,
    fontSize: 12,
    fontWeight: "bold",
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.dark.background,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  xpInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  xpText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "600",
  },
  totalXPText: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  statValue: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  // Compact styles
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  compactLevelInfo: {
    flex: 1,
  },
  compactLevel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  compactTitle: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },
  compactProgressContainer: {
    flex: 1,
    marginLeft: 12,
  },
  compactProgressBar: {
    height: 6,
    backgroundColor: Colors.dark.background,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  compactProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  compactXPText: {
    color: Colors.dark.textSecondary,
    fontSize: 10,
    textAlign: "right",
  },
});

export default LevelDisplay;
