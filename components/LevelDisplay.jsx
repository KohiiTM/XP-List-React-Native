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
}) => {
  const progressPercentage = Math.min(
    100,
    (currentLevelXP / xpToNextLevel) * 100
  );

  return (
    <View style={styles.container}>
      {/* Level Info */}
      <View style={styles.levelInfoSection}>
        <Text
          style={[styles.level, { color: levelColor }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Level {level}
        </Text>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {levelTitle}
        </Text>
      </View>
      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: levelColor,
                },
              ]}
            />
          </View>
        </View>
        <Text style={styles.xpText} numberOfLines={1} ellipsizeMode="tail">
          {currentLevelXP} / {xpToNextLevel} XP
        </Text>
      </View>
      {/* Streak */}
      <View style={styles.streakSection}>
        {showStreak && consecutiveCompletions > 0 && (
          <View style={styles.streakPill}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>{consecutiveCompletions}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    width: "100%",
    height: "100%",
    backgroundColor: Colors.dark.card,
    paddingHorizontal: 16,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  levelInfoSection: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  level: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontWeight: "600",
  },
  progressSection: {
    flex: 2,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  progressBarContainer: {
    width: "100%",
    maxWidth: 160,
    marginBottom: 2,
  },
  progressBarBg: {
    width: "100%",
    height: 10,
    backgroundColor: Colors.dark.background,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  xpText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  streakSection: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.warning,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-end",
  },
  streakIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  streakText: {
    color: Colors.dark.warningText,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LevelDisplay;
