import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { calculateLevelFromXP, calculateTaskXPReward } from "../utils/leveling";

// Helper to group tasks by level at completion
function groupTasksByLevel(tasks) {
  // Only consider completed tasks with a completedAt timestamp
  const completedTasks = tasks
    .filter((t) => t.completed && t.completedAt)
    .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

  let xp = 0;
  let level = 1;
  let groups = {};

  completedTasks.forEach((task) => {
    // Assign the current level before this task's XP is added
    if (!groups[level]) groups[level] = [];
    groups[level].push(task);
    // Add XP for this task
    let reward = task.xpReward;
    if (typeof reward !== "number") {
      reward = calculateTaskXPReward
        ? calculateTaskXPReward(task.difficulty, 0)
        : 0;
    }
    xp += reward;
    level = calculateLevelFromXP(xp);
  });

  return groups;
}

const LevelHistoryTabs = ({ tasks }) => {
  const [activeLevel, setActiveLevel] = useState(null);
  const grouped = useMemo(() => groupTasksByLevel(tasks), [tasks]);
  const levels = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  // Default to no tab open
  React.useEffect(() => {
    if (activeLevel !== null && !levels.includes(activeLevel)) {
      setActiveLevel(null);
    }
  }, [levels, activeLevel]);

  if (!levels.length) {
    return <Text style={styles.empty}>No completed tasks yet.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {levels.map((lvl) => (
          <TouchableOpacity
            key={lvl}
            style={[styles.tab, activeLevel === lvl && styles.activeTab]}
            onPress={() => setActiveLevel(activeLevel === lvl ? null : lvl)}
          >
            <Text
              style={[
                styles.tabText,
                activeLevel === lvl && styles.activeTabText,
              ]}
            >
              Level {lvl}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeLevel !== null && grouped[activeLevel] && (
        <FlatList
          data={grouped[activeLevel]}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskMeta}>
                {item.difficulty} |{" "}
                {item.completedAt
                  ? new Date(item.completedAt).toLocaleString()
                  : ""}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No tasks for this level.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: { flexDirection: "row", marginBottom: 12, justifyContent: "center" },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#3a2f4c",
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: "#ffd700",
  },
  tabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#3a2f4c",
  },
  taskCard: {
    backgroundColor: "#2c2137",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  taskTitle: {
    color: "#ffd700",
    fontWeight: "bold",
    fontSize: 16,
  },
  taskMeta: {
    color: "#8b7b9e",
    fontSize: 12,
    marginTop: 2,
  },
  empty: {
    color: "#8b7b9e",
    textAlign: "center",
    marginTop: 40,
  },
});

export default LevelHistoryTabs;
