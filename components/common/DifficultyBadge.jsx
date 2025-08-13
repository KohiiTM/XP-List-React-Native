import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@constants/Colors";

const DifficultyBadge = ({
  difficulty,
  difficultyColors,
  size = "medium",
  style,
  textStyle,
  showIcon = false,
  theme = "dark"
}) => {
  // Default difficulty colors using theme system
  const defaultColors = {
    easy: Colors[theme].easy,
    medium: Colors[theme].medium,
    hard: Colors[theme].hard,
    expert: "#9c27b0", // Purple for expert level
    legendary: "#ff6b35", // Orange-red for legendary
  };

  // Use provided colors or fall back to defaults
  const colors = difficultyColors || defaultColors;

  // Size configurations
  const sizeConfig = {
    small: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
      fontSize: 8,
      iconSize: 10,
    },
    medium: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      fontSize: 10,
      iconSize: 12,
    },
    large: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      fontSize: 12,
      iconSize: 14,
    },
  };

  // Get difficulty icons
  const getDifficultyIcon = (level) => {
    const iconMap = {
      easy: "leaf-outline",
      medium: "flash-outline",
      hard: "flame-outline",
      expert: "diamond-outline",
      legendary: "star-outline",
    };
    return iconMap[level?.toLowerCase()] || "help-outline";
  };

  const currentSize = sizeConfig[size] || sizeConfig.medium;
  const difficultyKey = difficulty?.toLowerCase();
  const backgroundColor = colors[difficultyKey] || colors.medium;
  const displayText = difficulty 
    ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
    : "Unknown";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          paddingHorizontal: currentSize.paddingHorizontal,
          paddingVertical: currentSize.paddingVertical,
          borderRadius: currentSize.borderRadius,
        },
        style,
      ]}
      accessible={true}
      accessibilityLabel={`Task difficulty: ${displayText}`}
      accessibilityRole="text"
    >
      {showIcon && (
        <Ionicons
          name={getDifficultyIcon(difficulty)}
          size={currentSize.iconSize}
          color="#fff"
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            fontSize: currentSize.fontSize,
          },
          textStyle,
        ]}
      >
        {displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  icon: {
    marginRight: 4,
  },
});

export default DifficultyBadge;