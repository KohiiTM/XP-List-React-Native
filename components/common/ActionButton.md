# ActionButton Component

A comprehensive, reusable button component that standardizes all button types across the application.

## Overview

The ActionButton component replaces various button implementations throughout the app including:
- ThemedButton.jsx (enhanced for backward compatibility)
- FAB buttons
- Various TouchableOpacity buttons
- Modal action buttons

## Features

- ✅ Multiple variants (primary, secondary, outline, ghost, fab, icon)
- ✅ Multiple sizes (small, medium, large)
- ✅ Icon support with positioning
- ✅ Loading states with spinners
- ✅ Disabled states
- ✅ Full width and layout options
- ✅ Consistent theming with Colors system
- ✅ Accessibility support
- ✅ Material Design principles

## Basic Usage

```jsx
import ActionButton from '@components/common/ActionButton';
// or
import { ActionButton } from '@components/common';

// Basic button
<ActionButton
  title="Click Me"
  onPress={() => console.log('Pressed!')}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'primary'` | Button style: 'primary', 'secondary', 'outline', 'ghost', 'fab', 'icon' |
| `size` | string | `'medium'` | Button size: 'small', 'medium', 'large' |
| `onPress` | function | - | Press handler function |
| `children` | ReactNode | - | Button content (takes precedence over title) |
| `title` | string | - | Button text (used if children not provided) |
| `disabled` | boolean | `false` | Disabled state |
| `loading` | boolean | `false` | Loading state with spinner |
| `icon` | ReactNode | - | Icon component to display |
| `iconPosition` | string | `'left'` | Icon position: 'left', 'right' |
| `fullWidth` | boolean | `false` | Full width button |
| `style` | object | - | Custom container styles |
| `textStyle` | object | - | Custom text styles |
| `loadingText` | string | - | Text to show during loading |
| `accessibilityLabel` | string | - | Accessibility label |
| `accessibilityHint` | string | - | Accessibility hint |

## Button Variants

### Primary Button
The main action button with accent color background.
```jsx
<ActionButton
  variant="primary"
  title="Save Changes"
  onPress={handleSave}
/>
```

### Secondary Button
Secondary actions with card background and border.
```jsx
<ActionButton
  variant="secondary"
  title="Cancel"
  onPress={handleCancel}
/>
```

### Outline Button
Transparent background with accent color border.
```jsx
<ActionButton
  variant="outline"
  title="Learn More"
  onPress={handleLearnMore}
/>
```

### Ghost Button
Transparent button with accent color text.
```jsx
<ActionButton
  variant="ghost"
  title="Skip"
  onPress={handleSkip}
/>
```

### FAB (Floating Action Button)
Fixed-size circular button, typically used for primary actions.
```jsx
<ActionButton
  variant="fab"
  icon={<Ionicons name="add" size={24} color="#2c2137" />}
  onPress={handleAdd}
  style={{ position: 'absolute', right: 24, bottom: 80 }}
/>
```

### Icon Button
Small button for icon-only actions.
```jsx
<ActionButton
  variant="icon"
  icon={<Ionicons name="heart" size={20} color="#fff" />}
  onPress={handleLike}
/>
```

## Button Sizes

```jsx
// Small button
<ActionButton size="small" title="Small" onPress={handlePress} />

// Medium button (default)
<ActionButton size="medium" title="Medium" onPress={handlePress} />

// Large button
<ActionButton size="large" title="Large" onPress={handlePress} />
```

## With Icons

```jsx
// Icon on the left (default)
<ActionButton
  title="Add Task"
  icon={<Ionicons name="add" size={20} color="#2c2137" />}
  iconPosition="left"
  onPress={handleAdd}
/>

// Icon on the right
<ActionButton
  title="Settings"
  icon={<Ionicons name="settings" size={20} color="#ffd700" />}
  iconPosition="right"
  onPress={handleSettings}
/>
```

## Loading States

```jsx
<ActionButton
  title="Save"
  loading={isLoading}
  loadingText="Saving..."
  onPress={handleSave}
/>
```

## Disabled States

```jsx
<ActionButton
  title="Submit"
  disabled={!isFormValid}
  onPress={handleSubmit}
/>
```

## Layout Options

```jsx
// Full width button
<ActionButton
  title="Continue"
  fullWidth={true}
  onPress={handleContinue}
/>

// Two buttons side by side
<View style={{ flexDirection: 'row' }}>
  <ActionButton
    title="Cancel"
    variant="outline"
    style={{ flex: 1, marginRight: 8 }}
    onPress={handleCancel}
  />
  <ActionButton
    title="Confirm"
    style={{ flex: 1, marginLeft: 8 }}
    onPress={handleConfirm}
  />
</View>
```

## Modal Actions Pattern

Common pattern for modal buttons:
```jsx
<View style={styles.modalActions}>
  <ActionButton
    variant="ghost"
    title="Cancel"
    onPress={onClose}
    style={styles.modalButton}
  />
  <ActionButton
    variant="primary"
    title="Confirm"
    onPress={onConfirm}
    style={styles.modalButton}
  />
</View>

const styles = StyleSheet.create({
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 12,
    minWidth: 80,
  },
});
```

## Accessibility

```jsx
<ActionButton
  title="Save Profile"
  accessibilityLabel="Save your profile changes"
  accessibilityHint="Double tap to save all changes to your profile"
  onPress={handleSave}
/>
```

## Migration Guide

### From ThemedButton
ThemedButton now uses ActionButton internally, so existing code should work unchanged. However, for new components, use ActionButton directly:

```jsx
// Old
<ThemedButton onPress={handlePress}>
  <Text>Click Me</Text>
</ThemedButton>

// New
<ActionButton title="Click Me" onPress={handlePress} />
```

### From TouchableOpacity
Replace TouchableOpacity button patterns:

```jsx
// Old
<TouchableOpacity style={styles.button} onPress={handlePress}>
  <Text style={styles.buttonText}>Click Me</Text>
</TouchableOpacity>

// New
<ActionButton title="Click Me" onPress={handlePress} />
```

### From FAB patterns
Replace FAB implementations:

```jsx
// Old
<TouchableOpacity style={styles.fab} onPress={handleAdd}>
  <Text style={styles.fabText}>+</Text>
</TouchableOpacity>

// New
<ActionButton
  variant="fab"
  icon={<Ionicons name="add" size={24} color="#2c2137" />}
  onPress={handleAdd}
  style={{ position: 'absolute', right: 24, bottom: 80 }}
/>
```

## Examples

See `ActionButton.examples.jsx` for comprehensive examples of all variants and use cases.

## Theme Integration

ActionButton automatically uses the theme from `@constants/Colors` and responds to color scheme changes. All colors and styles are consistent with the app's design system.