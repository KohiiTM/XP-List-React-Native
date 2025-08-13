import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { DifficultyBadge } from "@components/common";
import { Colors } from "@constants/Colors";

/**
 * Example usage of DifficultyBadge component
 * This file demonstrates various configurations and use cases
 */
const DifficultyBadgeExamples = () => {
  // Custom colors example
  const customColors = {
    easy: "#4caf50",
    medium: "#2196f3",
    hard: "#e91e63",
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>DifficultyBadge Examples</Text>

      {/* Basic Usage */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Usage</Text>
        <View style={styles.row}>
          <DifficultyBadge difficulty="easy" />
          <DifficultyBadge difficulty="medium" />
          <DifficultyBadge difficulty="hard" />
        </View>
      </View>

      {/* Different Sizes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Different Sizes</Text>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Small:</Text>
            <DifficultyBadge difficulty="medium" size="small" />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Medium:</Text>
            <DifficultyBadge difficulty="medium" size="medium" />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Large:</Text>
            <DifficultyBadge difficulty="medium" size="large" />
          </View>
        </View>
      </View>

      {/* With Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>With Icons</Text>
        <View style={styles.row}>
          <DifficultyBadge difficulty="easy" showIcon={true} />
          <DifficultyBadge difficulty="medium" showIcon={true} />
          <DifficultyBadge difficulty="hard" showIcon={true} />
        </View>
      </View>

      {/* Custom Colors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Colors</Text>
        <View style={styles.row}>
          <DifficultyBadge 
            difficulty="easy" 
            difficultyColors={customColors} 
          />
          <DifficultyBadge 
            difficulty="medium" 
            difficultyColors={customColors} 
          />
          <DifficultyBadge 
            difficulty="hard" 
            difficultyColors={customColors} 
          />
        </View>
      </View>

      {/* Extended Difficulty Levels */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Extended Difficulty Levels</Text>
        <View style={styles.row}>
          <DifficultyBadge difficulty="expert" />
          <DifficultyBadge difficulty="legendary" />
        </View>
      </View>

      {/* Custom Styling */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Styling</Text>
        <DifficultyBadge 
          difficulty="hard" 
          style={{ borderWidth: 2, borderColor: "#fff" }}
          textStyle={{ fontStyle: "italic" }}
        />
      </View>

      {/* TaskCard Context Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>In TaskCard Context</Text>
        <View style={styles.taskCardExample}>
          <DifficultyBadge difficulty="medium" size="small" />
          <Text style={styles.taskTitle}>Complete project documentation</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark.accent,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 8,
  },
  column: {
    gap: 8,
  },
  label: {
    color: Colors.dark.text,
    fontSize: 14,
    minWidth: 60,
  },
  taskCardExample: {
    backgroundColor: Colors.dark.card,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  taskTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    flex: 1,
  },
});

export default DifficultyBadgeExamples;