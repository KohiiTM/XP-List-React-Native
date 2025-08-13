import React from "react";
import { View, StyleSheet } from "react-native";
import EmptyState from "./EmptyState";

/**
 * EmptyState Component Examples
 * 
 * This file contains various usage examples of the EmptyState component
 * to demonstrate its flexibility and different configurations.
 */

// Example 1: Basic empty state with default styling
export const BasicEmptyState = () => (
  <EmptyState
    title="No items found"
    subtitle="Add some items to get started"
  />
);

// Example 2: Empty state with custom icon and action
export const EmptyStateWithAction = () => (
  <EmptyState
    icon="📦"
    title="Your inventory is empty"
    subtitle="Start collecting items to build your inventory"
    actionText="Browse Items"
    onAction={() => console.log("Navigate to items")}
  />
);

// Example 3: Search results empty state
export const SearchEmptyState = () => (
  <EmptyState
    variant="search"
    title="No search results"
    subtitle="Try adjusting your search terms or filters"
    actionText="Clear Filters"
    onAction={() => console.log("Clear search filters")}
  />
);

// Example 4: Error state
export const ErrorEmptyState = () => (
  <EmptyState
    variant="error"
    title="Something went wrong"
    subtitle="We're having trouble loading your data. Please try again."
    actionText="Retry"
    onAction={() => console.log("Retry loading data")}
  />
);

// Example 5: Offline state
export const OfflineEmptyState = () => (
  <EmptyState
    variant="offline"
    title="You're offline"
    subtitle="Check your internet connection and try again"
    actionText="Retry"
    onAction={() => console.log("Retry connection")}
  />
);

// Example 6: Tasks empty state
export const TasksEmptyState = () => (
  <EmptyState
    variant="tasks"
    title="No tasks yet"
    subtitle="Create your first task to start your productivity journey"
    actionText="Add Task"
    onAction={() => console.log("Open task creation modal")}
    size="large"
  />
);

// Example 7: Small size empty state
export const SmallEmptyState = () => (
  <EmptyState
    title="No notifications"
    subtitle="You're all caught up!"
    size="small"
    variant="default"
  />
);

// Example 8: Custom styling
export const CustomStyledEmptyState = () => (
  <EmptyState
    icon="🎮"
    title="Game Over"
    subtitle="Ready for another round?"
    actionText="Play Again"
    onAction={() => console.log("Restart game")}
    style={styles.customContainer}
    titleStyle={styles.customTitle}
    subtitleStyle={styles.customSubtitle}
  />
);

// Example 9: With custom illustration (placeholder)
export const EmptyStateWithIllustration = () => (
  <EmptyState
    illustration={
      <View style={styles.illustration}>
        {/* This could be an SVG, Image, or any custom component */}
      </View>
    }
    title="Welcome to XPList"
    subtitle="Start your adventure by creating your first task"
    actionText="Get Started"
    onAction={() => console.log("Navigate to onboarding")}
  />
);

// Example 10: Inventory specific empty state
export const InventoryEmptyState = () => (
  <EmptyState
    variant="inventory"
    title="Your chest is empty"
    subtitle="Complete tasks to earn rewards and fill your inventory"
    actionText="View Tasks"
    onAction={() => console.log("Navigate to tasks")}
  />
);

const styles = StyleSheet.create({
  customContainer: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderRadius: 12,
    marginHorizontal: 16,
  },
  customTitle: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  customSubtitle: {
    fontStyle: "italic",
  },
  illustration: {
    width: 120,
    height: 120,
    backgroundColor: "#3a2f4c",
    borderRadius: 60,
    marginBottom: 16,
  },
});

export default {
  BasicEmptyState,
  EmptyStateWithAction,
  SearchEmptyState,
  ErrorEmptyState,
  OfflineEmptyState,
  TasksEmptyState,
  SmallEmptyState,
  CustomStyledEmptyState,
  EmptyStateWithIllustration,
  InventoryEmptyState,
};