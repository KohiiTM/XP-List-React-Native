# LoadingErrorWrapper Component

A reusable React Native component that standardizes loading and error state handling across the application. It provides smooth animations, consistent styling, and flexible customization options.

## Features

- **Unified State Management**: Handles loading, error, and content states seamlessly
- **Smooth Animations**: Fade and slide animations for state transitions
- **Flexible Layouts**: Supports full-screen, inline, and custom layouts
- **Theme Integration**: Automatically adapts to the app's dark/light theme system
- **Accessibility**: Includes proper accessibility labels and roles
- **Customizable**: Extensive props for customization without losing consistency
- **Retry Logic**: Built-in retry functionality with optional custom handlers

## Basic Usage

```jsx
import LoadingErrorWrapper from '@components/common/LoadingErrorWrapper';

const MyComponent = () => {
  const { data, loading, error, refetch } = useMyData();
  
  return (
    <LoadingErrorWrapper
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {data && <MyDataView data={data} />}
    </LoadingErrorWrapper>
  );
};
```

## Layout Variants

### Full Screen Layout
Perfect for main screen components or when loading takes up the entire view:

```jsx
<LoadingErrorWrapper
  loading={loading}
  error={error}
  onRetry={refetch}
  fullScreen={true}
  loadingText="Loading your data..."
>
  <MainContent />
</LoadingErrorWrapper>
```

### Inline Layout
Great for sections within a larger view:

```jsx
<LoadingErrorWrapper
  loading={loading}
  error={error}
  onRetry={refetch}
  inline={true}
  loadingText="Loading tasks..."
>
  <TasksList />
</LoadingErrorWrapper>
```

## Advanced Customization

### Custom Loading Component
```jsx
const CustomLoader = () => (
  <View style={{ alignItems: 'center' }}>
    <MySpinner />
    <Text>Please wait...</Text>
  </View>
);

<LoadingErrorWrapper
  loading={loading}
  loadingComponent={<CustomLoader />}
>
  <Content />
</LoadingErrorWrapper>
```

### Custom Error Handling
```jsx
<LoadingErrorWrapper
  loading={loading}
  error={error}
  errorText="Failed to load user data"
  showRetryButton={false}
  onRetry={() => {
    // Custom retry logic
    Analytics.track('retry_clicked');
    refetch();
  }}
>
  <Content />
</LoadingErrorWrapper>
```

### Custom Empty State
```jsx
const EmptyTasksList = () => (
  <View style={{ alignItems: 'center', padding: 40 }}>
    <Ionicons name="checkmark-circle" size={64} color="#4caf50" />
    <Text style={{ fontSize: 18, marginTop: 16 }}>All done!</Text>
    <Text style={{ fontSize: 14, marginTop: 8, opacity: 0.7 }}>
      You've completed all your tasks
    </Text>
  </View>
);

<LoadingErrorWrapper
  loading={loading}
  error={error}
  emptyState={<EmptyTasksList />}
>
  {tasks.length > 0 && <TasksList tasks={tasks} />}
</LoadingErrorWrapper>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | boolean | `false` | Whether component is in loading state |
| `error` | string\|Error | `null` | Error message or error object |
| `onRetry` | function | `null` | Callback for retry functionality |
| `children` | ReactNode | `null` | Content to show when not loading/error |
| `loadingText` | string | `"Loading..."` | Custom loading message |
| `errorText` | string | `null` | Custom error message override |
| `emptyState` | ReactNode | `null` | Custom empty state component |
| `showRetryButton` | boolean | `true` | Whether to show retry button |
| `loadingComponent` | ReactNode | `null` | Custom loading component |
| `containerStyle` | object | `{}` | Additional container styles |
| `fullScreen` | boolean | `false` | Use full screen layout |
| `inline` | boolean | `false` | Use inline compact layout |

## Integration Examples

### Replace tasks.jsx pattern
**Before:**
```jsx
if (loading) {
  return (
    <ThemedView style={styles.container} safe={true}>
      <ActivityIndicator color={Colors.dark.accent} size="large" />
    </ThemedView>
  );
}

if (error) {
  return (
    <ThemedView style={styles.container} safe={true}>
      <Text style={styles.error}>{error}</Text>
      <TouchableOpacity onPress={fetchTasks} style={styles.retryBtn}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

return <TasksList />;
```

**After:**
```jsx
return (
  <ThemedView style={styles.container} safe={true}>
    <LoadingErrorWrapper
      loading={loading}
      error={error}
      onRetry={fetchTasks}
      fullScreen={true}
    >
      <TasksList />
    </LoadingErrorWrapper>
  </ThemedView>
);
```

### Replace index.jsx pattern
**Before:**
```jsx
{loading ? (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>Loading tasks...</Text>
  </View>
) : error ? (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
) : (
  <FlatList data={tasks} ... />
)}
```

**After:**
```jsx
<LoadingErrorWrapper
  loading={loading}
  error={error}
  onRetry={fetchTasks}
  inline={true}
  loadingText="Loading tasks..."
>
  <FlatList data={tasks} ... />
</LoadingErrorWrapper>
```

## Accessibility

The component includes comprehensive accessibility support:
- `accessibilityLabel` on all interactive elements
- `accessibilityRole="button"` on retry button
- Descriptive labels for loading and error states
- Screen reader friendly error messages

## Animation Details

- **Fade In**: 300ms ease-out animation for opacity
- **Slide Up**: 300ms back-ease animation with subtle bounce
- Animations trigger on state changes (loading/error/content transitions)
- Uses `useNativeDriver` for optimal performance

## Best Practices

1. **Consistent Usage**: Use the same layout type (`fullScreen` vs `inline`) consistently within similar UI contexts
2. **Meaningful Messages**: Provide context-specific loading and error messages
3. **Retry Logic**: Always provide `onRetry` when data can be refetched
4. **Empty States**: Use custom empty states for better user experience
5. **Error Handling**: Log errors appropriately while showing user-friendly messages

## Performance Considerations

- Uses `useNativeDriver` for smooth animations
- Minimal re-renders through proper prop management
- Lightweight component with no heavy dependencies
- Memoization friendly (wrap in React.memo if needed)