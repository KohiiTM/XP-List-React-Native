# CategoryTabs Component

A reusable React Native component for creating tabbed navigation to filter content by categories. Designed to provide a consistent tabbed navigation experience across the application.

## Features

- **Flexible Data Format**: Supports both string arrays and object arrays
- **Optional Counts**: Display item counts next to category names
- **Scrollable/Fixed**: Configurable horizontal scrolling for many categories
- **Customizable Styling**: Override default styles for container, tabs, and active states
- **Accessibility**: Built-in accessibility support with proper roles and states
- **Theme Integration**: Uses the app's color theme from `@constants/Colors`
- **Responsive**: Adapts to different screen sizes and orientations

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `categories` | `Array` | `[]` | ✅ | Array of category objects or strings |
| `selectedCategory` | `string\|number` | - | ✅ | Currently selected category |
| `onCategoryChange` | `Function` | - | ✅ | Callback when category changes |
| `showCounts` | `boolean` | `false` | ❌ | Whether to show item counts |
| `style` | `Object` | - | ❌ | Style for the container |
| `tabStyle` | `Object` | - | ❌ | Style for individual tabs |
| `activeTabStyle` | `Object` | - | ❌ | Style for active tab |
| `scrollable` | `boolean` | `true` | ❌ | Whether tabs should scroll horizontally |

## Category Data Formats

### String Array
```javascript
const categories = ['All', 'Consumable', 'Key Item', 'Equipment'];
```

### Object Array
```javascript
const categories = [
  { id: 'all', name: 'All', count: 15 },
  { id: 'todo', name: 'To Do', count: 8 },
  { id: 'in-progress', name: 'In Progress', count: 3 },
  { id: 'completed', name: 'Completed', count: 4 },
];
```

For object arrays, the component uses `id` or `name` as the category value, and `name` for display.

## Usage Examples

### Basic Usage (Inventory Style)
```jsx
import { CategoryTabs } from '@components/common';

const InventoryScreen = () => {
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
```

### With Counts and Scrolling
```jsx
const TasksScreen = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const statuses = [
    { id: 'all', name: 'All Tasks', count: 24 },
    { id: 'pending', name: 'Pending', count: 8 },
    { id: 'active', name: 'Active', count: 6 },
    { id: 'completed', name: 'Completed', count: 10 },
  ];

  return (
    <CategoryTabs
      categories={statuses}
      selectedCategory={selectedStatus}
      onCategoryChange={setSelectedStatus}
      showCounts={true}
      scrollable={true}
    />
  );
};
```

### Custom Styling
```jsx
const CustomStyledTabs = () => {
  const customStyles = {
    container: { marginVertical: 20 },
    tab: { 
      backgroundColor: '#ff6b6b',
      borderRadius: 20,
    },
    activeTab: { 
      backgroundColor: '#4ecdc4',
    },
  };

  return (
    <CategoryTabs
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      style={customStyles.container}
      tabStyle={customStyles.tab}
      activeTabStyle={customStyles.activeTab}
    />
  );
};
```

## Styling

The component uses the app's theme colors from `@constants/Colors.dark`:

- **Default Tab**: `secondary` background, `accent` border and text
- **Active Tab**: `accent` background, `secondary` text, `text` border
- **Font**: Platform-specific monospace font family

### Default Styles
- Tabs have rounded corners (8px border radius)
- Shadow/elevation for depth
- Horizontal scrolling with no scroll indicators
- Responsive padding and margins

## Accessibility

The component includes proper accessibility support:

- `accessibilityRole="tab"` for each tab
- `accessibilityState={{ selected: isActive }}` for active state
- `accessibilityLabel` with descriptive text
- `testID` for automated testing

## Integration

The component is exported from the common components index:

```javascript
import { CategoryTabs } from '@components/common';
```

## Migration from Existing Code

To migrate existing category tab implementations:

1. **Replace manual tab rendering** with CategoryTabs component
2. **Remove custom styles** that duplicate the component's styling
3. **Update category data** to object format if you need counts
4. **Set scrollable prop** based on expected number of categories

### Before (Manual Implementation)
```jsx
const renderCategory = (cat) => (
  <TouchableOpacity
    key={cat}
    style={[
      styles.categoryTab,
      selectedCategory === cat && styles.categoryTabActive,
    ]}
    onPress={() => setSelectedCategory(cat)}
  >
    <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
      {cat}
    </Text>
  </TouchableOpacity>
);

return (
  <View style={styles.categoriesRow}>
    {CATEGORIES.map(renderCategory)}
  </View>
);
```

### After (Using CategoryTabs)
```jsx
return (
  <CategoryTabs
    categories={CATEGORIES}
    selectedCategory={selectedCategory}
    onCategoryChange={setSelectedCategory}
    scrollable={false}
  />
);
```

## Performance Considerations

- The component uses `numberOfLines={1}` to prevent text wrapping
- Scrollable tabs use `ScrollView` with `showsHorizontalScrollIndicator={false}`
- Non-scrollable tabs use flexWrap for responsive layout
- Minimal re-renders through proper key usage and prop optimization

## Platform Differences

- **iOS**: Uses 'Courier' font family
- **Android**: Uses 'monospace' font family
- **Shadow/Elevation**: Different shadow properties for iOS vs Android elevation