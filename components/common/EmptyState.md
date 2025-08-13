# EmptyState Component

A flexible and reusable component for displaying empty states throughout the XPList React Native application.

## Features

- **Flexible Icon Support**: Accepts emoji strings, React components, or uses variant-specific default icons
- **Multiple Variants**: Pre-configured styles for different empty state types
- **Size Options**: Small, medium, and large sizing options
- **Theme Integration**: Fully integrated with the app's color scheme and theming system
- **Accessibility**: Proper accessibility labels and roles for screen readers
- **Custom Styling**: Supports custom styles for container, title, and subtitle
- **Action Support**: Optional action button with customizable text and callback
- **Illustration Support**: Can display custom illustrations instead of icons

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `React.ReactNode \| string` | - | Icon to display (emoji, string, or React component) |
| `title` | `string` | **Required** | Main empty state message |
| `subtitle` | `string` | - | Secondary message |
| `actionText` | `string` | - | Button text |
| `onAction` | `function` | - | Button callback function |
| `illustration` | `React.ReactNode` | - | Custom illustration component |
| `style` | `Object` | - | Custom container styles |
| `variant` | `string` | `'default'` | Empty state type: `'default'`, `'search'`, `'error'`, `'offline'`, `'nodata'`, `'inventory'`, `'tasks'` |
| `size` | `string` | `'medium'` | Component size: `'small'`, `'medium'`, `'large'` |
| `titleStyle` | `Object` | - | Custom title text styles |
| `subtitleStyle` | `Object` | - | Custom subtitle text styles |
| `accessibilityLabel` | `string` | - | Accessibility label for the component |
| `accessibilityHint` | `string` | - | Accessibility hint |

## Variants

### `default`
General-purpose empty state with document icon (📄)

### `search`
For empty search results with search icon (🔍)

### `error`
For error states with warning icon (⚠️)

### `offline`
For offline/connectivity issues with signal icon (📡)

### `nodata`
For missing data with chart icon (📊)

### `inventory`
For empty inventory states with box icon (📦)

### `tasks`
For empty task lists with checkmark icon (✅)

## Usage Examples

### Basic Usage
```jsx
import { EmptyState } from '@components/common';

<EmptyState
  title="No items found"
  subtitle="Add some items to get started"
/>
```

### With Action Button
```jsx
<EmptyState
  variant="inventory"
  title="Your chest is empty"
  subtitle="Complete tasks to earn rewards"
  actionText="View Tasks"
  onAction={() => navigation.navigate('Tasks')}
/>
```

### Custom Icon
```jsx
<EmptyState
  icon="🎮"
  title="Game Over"
  subtitle="Ready for another round?"
  actionText="Play Again"
  onAction={restartGame}
/>
```

### Search Results
```jsx
<EmptyState
  variant="search"
  title="No results found"
  subtitle="Try different search terms"
  actionText="Clear Search"
  onAction={clearSearch}
  size="small"
/>
```

### Error State
```jsx
<EmptyState
  variant="error"
  title="Failed to load data"
  subtitle="Please check your connection and try again"
  actionText="Retry"
  onAction={refetchData}
/>
```

## Integration with App Theme

The component automatically adapts to the app's color scheme (dark/light mode) using the Colors constant from `@constants/Colors`. All text colors, icon colors, and spacing follow the established design system.

## Accessibility

The component includes proper accessibility support:
- Role definitions for screen readers
- Descriptive labels for icons and actions
- Appropriate heading roles for titles
- Customizable accessibility labels and hints

## Best Practices

1. **Use appropriate variants** for different contexts (search, error, inventory, etc.)
2. **Provide clear, actionable titles** that explain the empty state
3. **Include helpful subtitles** with guidance on what users can do next
4. **Use action buttons** when there's a clear next step for users
5. **Choose appropriate sizing** based on the available space and context
6. **Test accessibility** with screen readers to ensure proper navigation

## File Location

`E:\xplist_reactnative\components\common\EmptyState.jsx`

The component is exported from the common components index file and can be imported as:
```jsx
import { EmptyState } from '@components/common';
```