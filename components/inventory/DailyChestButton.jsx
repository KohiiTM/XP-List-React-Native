import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Helper to format ms as hh:mm:ss
function formatCooldown(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

const DailyChestButton = ({ onPress, cooldown = 0, loading = false }) => {
  const isOnCooldown = cooldown > 0;
  
  return (
    <TouchableOpacity
      style={styles.chestButton}
      onPress={onPress}
      disabled={isOnCooldown || loading}
    >
      <Ionicons
        name="cube"
        size={36}
        color={isOnCooldown ? "#8b7b9e" : "#ffd700"}
      />
      <Text style={styles.chestText}>
        {isOnCooldown ? formatCooldown(cooldown) : "Daily Chest"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chestButton: {
    position: "absolute",
    top: 80,
    left: 20,
    backgroundColor: "#3a2f4c",
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  chestText: {
    color: "#ffd700",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default DailyChestButton;