import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@constants/Colors";
import { DifficultyBadge } from "@components/common";

const TaskCard = ({ 
  item, 
  onPress, 
  onComplete, 
  onDelete, 
  difficultyColors = {
    easy: Colors.dark.easy,
    medium: Colors.dark.medium, 
    hard: Colors.dark.hard
  }
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View
        style={[styles.taskCard, item.completed && styles.completedTaskCard]}
      >
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onComplete(item)}
        >
          <View
            style={[styles.checkbox, item.completed && styles.checkboxChecked]}
          >
            {item.completed && (
              <Ionicons name="checkmark" size={14} color={Colors.dark.buttonText} />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.taskContent}>
          <View style={styles.taskHeader}>
            <DifficultyBadge
              difficulty={item.difficulty}
              difficultyColors={difficultyColors}
              size="small"
            />
            <TouchableOpacity
              onPress={() => onDelete(item.$id)}
              style={styles.deleteButton}
            >
              <Ionicons name="close" size={16} color={Colors.dark.error} />
            </TouchableOpacity>
          </View>
          <Text style={styles.taskText}>{item.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  completedTaskCard: {
    opacity: 0.6,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.dark.accent,
    borderColor: Colors.dark.accent,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  deleteButton: {
    padding: 4,
  },
  taskText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
  },
});

export default TaskCard;