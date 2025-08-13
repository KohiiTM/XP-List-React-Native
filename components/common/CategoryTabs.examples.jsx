import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CategoryTabs from './CategoryTabs';

/**
 * Example usage of CategoryTabs component
 * This file demonstrates various configurations and use cases
 */

// Example 1: Simple string-based categories (like inventory)
const SimpleExample = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Consumable', 'Key Item', 'Equipment'];

  return (
    <CategoryTabs
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      scrollable={false}
    />
  );
};

// Example 2: Object-based categories with counts
const WithCountsExample = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = [
    { id: 'all', name: 'All', count: 15 },
    { id: 'todo', name: 'To Do', count: 8 },
    { id: 'in-progress', name: 'In Progress', count: 3 },
    { id: 'completed', name: 'Completed', count: 4 },
  ];

  return (
    <CategoryTabs
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      showCounts={true}
      scrollable={true}
    />
  );
};

// Example 3: Custom styled tabs
const CustomStyledExample = () => {
  const [selectedCategory, setSelectedCategory] = useState('easy');
  const categories = [
    { id: 'easy', name: 'Easy', count: 12 },
    { id: 'medium', name: 'Medium', count: 8 },
    { id: 'hard', name: 'Hard', count: 3 },
    { id: 'expert', name: 'Expert', count: 1 },
  ];

  return (
    <CategoryTabs
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      showCounts={true}
      scrollable={true}
      style={styles.customContainer}
      tabStyle={styles.customTab}
      activeTabStyle={styles.customActiveTab}
    />
  );
};

// Example 4: Many categories requiring scroll
const ScrollableExample = () => {
  const [selectedCategory, setSelectedCategory] = useState('category1');
  const categories = Array.from({ length: 10 }, (_, i) => ({
    id: `category${i + 1}`,
    name: `Category ${i + 1}`,
    count: Math.floor(Math.random() * 20) + 1,
  }));

  return (
    <CategoryTabs
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      showCounts={true}
      scrollable={true}
    />
  );
};

// Example 5: Task status filtering
const TaskStatusExample = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const statuses = [
    { id: 'all', name: 'All Tasks' },
    { id: 'pending', name: 'Pending' },
    { id: 'active', name: 'Active' },
    { id: 'completed', name: 'Completed' },
    { id: 'overdue', name: 'Overdue' },
  ];

  return (
    <CategoryTabs
      categories={statuses}
      selectedCategory={selectedStatus}
      onCategoryChange={setSelectedStatus}
      scrollable={false}
    />
  );
};

const styles = StyleSheet.create({
  customContainer: {
    marginVertical: 20,
  },
  customTab: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff5252',
    borderRadius: 20,
  },
  customActiveTab: {
    backgroundColor: '#4ecdc4',
    borderColor: '#26a69a',
  },
});

// Export examples for demonstration
export {
  SimpleExample,
  WithCountsExample,
  CustomStyledExample,
  ScrollableExample,
  TaskStatusExample,
};

export default SimpleExample;