# DifficultyBadge Component

A reusable component for displaying task difficulty levels with consistent styling and theming support.

## Features

- **Multiple Sizes**: Small, medium, and large variants
- **Theme Integration**: Uses the app's color system from `@constants/Colors`
- **Custom Colors**: Override default colors for specific use cases
- **Icon Support**: Optional difficulty icons
- **Accessibility**: Built-in accessibility props
- **Flexible Styling**: Custom style and text style overrides
- **Extended Levels**: Support for easy, medium, hard, expert, and legendary

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `difficulty` | `string` | **required** | The difficulty level (easy, medium, hard, expert, legendary) |
| `difficultyColors` | `object` | `undefined` | Custom color mapping for difficulty levels |
| `size` | `string` | `"medium"` | Size variant: "small", "medium", or "large" |
| `style` | `object` | `undefined` | Custom styles for the badge container |
| `textStyle` | `object` | `undefined` | Custom styles for the text |
| `showIcon` | `boolean` | `false` | Whether to show difficulty icon |
| `theme` | `string` | `"dark"` | Theme variant: "dark" or "light" |

## Usage Examples

### Basic Usage

```jsx
import { DifficultyBadge } from "@components/common";

// Simple difficulty badge
<DifficultyBadge difficulty="medium" />
```

### Different Sizes

```jsx
// Small badge for TaskCard
<DifficultyBadge difficulty="hard" size="small" />

// Large badge for detailed views
<DifficultyBadge difficulty="easy" size="large" />
```

### With Icons

```jsx
<DifficultyBadge 
  difficulty="expert" 
  showIcon={true} 
  size="large" 
/>
```

### Custom Colors

```jsx
const customColors = {
  easy: "#4caf50",
  medium: "#2196f3", 
  hard: "#e91e63"
};

<DifficultyBadge 
  difficulty="medium"
  difficultyColors={customColors}
/>
```

### Custom Styling

```jsx
<DifficultyBadge 
  difficulty="legendary"
  style={{ borderWidth: 2, borderColor: "#fff" }}
  textStyle={{ fontStyle: "italic" }}
/>
```

## Default Colors

The component uses the following default colors from the theme system:

- **Easy**: `#8bc34a` (Green)
- **Medium**: `#ff9800` (Orange)
- **Hard**: `#d32f2f` (Red)
- **Expert**: `#9c27b0` (Purple)
- **Legendary**: `#ff6b35` (Orange-red)

## Size Specifications

| Size | Padding | Border Radius | Font Size | Icon Size |
|------|---------|---------------|-----------|-----------|
| Small | 6px × 2px | 6px | 8px | 10px |
| Medium | 8px × 4px | 8px | 10px | 12px |
| Large | 12px × 6px | 10px | 12px | 14px |

## Accessibility

The component includes built-in accessibility features:

- `accessible={true}`
- `accessibilityLabel` with descriptive text
- `accessibilityRole="text"`

## Integration Examples

### In TaskCard Component

```jsx
import { DifficultyBadge } from "@components/common";

const TaskCard = ({ item }) => (
  <View style={styles.card}>
    <DifficultyBadge 
      difficulty={item.difficulty}
      size="small"
    />
    <Text>{item.title}</Text>
  </View>
);
```

### In TaskCreationModal

```jsx
import { DifficultyBadge } from "@components/common";

const TaskCreationModal = ({ form }) => (
  <View>
    {/* Selection buttons */}
    {form.difficulty && (
      <View style={styles.preview}>
        <Text>Preview:</Text>
        <DifficultyBadge 
          difficulty={form.difficulty}
          size="medium"
        />
      </View>
    )}
  </View>
);
```

## Migration Guide

### From TaskCard.jsx

**Before:**
```jsx
<View style={[styles.difficultyBadge, { backgroundColor: colors[item.difficulty] }]}>
  <Text style={styles.difficultyText}>{item.difficulty}</Text>
</View>
```

**After:**
```jsx
<DifficultyBadge 
  difficulty={item.difficulty}
  difficultyColors={colors}
  size="small"
/>
```

### From TaskCreationModal.jsx

The component can be used alongside existing selection buttons to provide a preview of how the badge will appear in the final task.

## Notes

- The component automatically capitalizes the first letter of the difficulty
- Icons are mapped based on difficulty level (leaf for easy, flame for hard, etc.)
- Shadow effects are included for better visual separation
- The component is designed to be self-contained and reusable across the app