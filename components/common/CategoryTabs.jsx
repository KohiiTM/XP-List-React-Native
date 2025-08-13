import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Colors } from '@constants/Colors';

/**
 * A reusable CategoryTabs component for filtering content by categories
 * 
 * @param {Object} props
 * @param {Array} props.categories - Array of category objects or strings
 * @param {string|number} props.selectedCategory - Currently selected category
 * @param {Function} props.onCategoryChange - Callback when category changes
 * @param {boolean} props.showCounts - Whether to show item counts (default: false)
 * @param {Object} props.style - Style for the container
 * @param {Object} props.tabStyle - Style for individual tabs
 * @param {Object} props.activeTabStyle - Style for active tab
 * @param {boolean} props.scrollable - Whether tabs should scroll horizontally (default: true)
 */
const CategoryTabs = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  showCounts = false,
  style,
  tabStyle,
  activeTabStyle,
  scrollable = true,
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  const handleCategoryPress = (category) => {
    const categoryValue = typeof category === 'object' ? category.id || category.name : category;
    onCategoryChange && onCategoryChange(categoryValue);
  };

  const getCategoryDisplay = (category) => {
    if (typeof category === 'string') {
      return category;
    }
    
    const name = category.name || category.id || 'Unknown';
    const count = showCounts && category.count !== undefined ? ` (${category.count})` : '';
    return `${name}${count}`;
  };

  const getCategoryValue = (category) => {
    return typeof category === 'object' ? category.id || category.name : category;
  };

  const isActiveCategory = (category) => {
    const categoryValue = getCategoryValue(category);
    return selectedCategory === categoryValue;
  };

  const renderTab = (category, index) => {
    const isActive = isActiveCategory(category);
    const categoryValue = getCategoryValue(category);
    const displayText = getCategoryDisplay(category);

    return (
      <TouchableOpacity
        key={categoryValue || index}
        style={[
          styles.categoryTab,
          tabStyle,
          isActive && styles.categoryTabActive,
          isActive && activeTabStyle,
        ]}
        onPress={() => handleCategoryPress(category)}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={`${displayText} category`}
        testID={`category-tab-${categoryValue}`}
      >
        <Text
          style={[
            styles.categoryText,
            isActive && styles.categoryTextActive,
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>
      </TouchableOpacity>
    );
  };

  const TabsContent = () => (
    <>
      {categories.map((category, index) => renderTab(category, index))}
    </>
  );

  if (scrollable) {
    return (
      <View style={[styles.container, style]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollView}
        >
          <TabsContent />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.nonScrollableContainer, style]}>
      <TabsContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  nonScrollableContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  categoryTab: {
    backgroundColor: Colors.dark.secondary,
    borderWidth: 2,
    borderColor: Colors.dark.accent,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 2,
    marginBottom: 2,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  categoryTabActive: {
    backgroundColor: Colors.dark.accent,
    borderColor: Colors.dark.text,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  categoryText: {
    color: Colors.dark.accent,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    textAlign: 'center',
  },
  categoryTextActive: {
    color: Colors.dark.secondary,
  },
});

export default CategoryTabs;