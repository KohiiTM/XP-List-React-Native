import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@constants/Colors";

/**
 * LoadingErrorWrapper - A reusable component that standardizes loading and error state handling
 * 
 * Handles the common pattern: loading → error (with retry) → content
 * Provides smooth animations and consistent styling across the app
 * 
 * @param {boolean} loading - Whether the component is in loading state
 * @param {string|Error} error - Error message or error object (optional)
 * @param {function} onRetry - Callback for retry functionality (optional)
 * @param {React.ReactNode} children - Content to show when not loading/error
 * @param {string} loadingText - Custom loading message (default: "Loading...")
 * @param {string} errorText - Custom error message override (optional)
 * @param {React.ReactNode} emptyState - Custom empty state component (optional)
 * @param {boolean} showRetryButton - Whether to show retry button (default: true)
 * @param {React.ReactNode} loadingComponent - Custom loading component (optional)
 * @param {object} containerStyle - Additional container styles (optional)
 * @param {boolean} fullScreen - Whether to use full screen layout (default: false)
 * @param {boolean} inline - Whether to use inline compact layout (default: false)
 */
const LoadingErrorWrapper = ({
  loading = false,
  error = null,
  onRetry = null,
  children = null,
  loadingText = "Loading...",
  errorText = null,
  emptyState = null,
  showRetryButton = true,
  loadingComponent = null,
  containerStyle = {},
  fullScreen = false,
  inline = false,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(20));

  // Animate in when content changes
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [loading, error, children]);

  // Get error message from error object or string
  const getErrorMessage = () => {
    if (errorText) return errorText;
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    if (error) return "An unexpected error occurred";
    return "Something went wrong";
  };

  // Custom loading component or default
  const renderLoadingComponent = () => {
    if (loadingComponent) return loadingComponent;
    
    return (
      <View style={[styles.centeredContent, inline && styles.inlineContent]}>
        <ActivityIndicator 
          size={inline ? "small" : "large"} 
          color={theme.accent} 
          accessibilityLabel="Loading content"
        />
        <Text 
          style={[
            styles.loadingText, 
            { color: theme.textSecondary },
            inline && styles.inlineText
          ]}
          accessibilityLabel={loadingText}
        >
          {loadingText}
        </Text>
      </View>
    );
  };

  // Error component
  const renderErrorComponent = () => {
    return (
      <View style={[styles.centeredContent, inline && styles.inlineContent]}>
        <Ionicons 
          name="alert-circle-outline" 
          size={inline ? 24 : 48} 
          color={theme.error} 
          style={styles.errorIcon}
          accessibilityLabel="Error icon"
        />
        <Text 
          style={[
            styles.errorText, 
            { color: theme.error },
            inline && styles.inlineText
          ]}
          accessibilityLabel={`Error: ${getErrorMessage()}`}
        >
          {getErrorMessage()}
        </Text>
        {onRetry && showRetryButton && (
          <TouchableOpacity 
            style={[
              styles.retryButton, 
              { 
                backgroundColor: theme.button,
                borderColor: theme.border 
              },
              inline && styles.inlineRetryButton
            ]}
            onPress={onRetry}
            accessibilityLabel="Retry loading"
            accessibilityRole="button"
          >
            <Ionicons 
              name="refresh-outline" 
              size={16} 
              color={theme.buttonText} 
              style={styles.retryIcon}
            />
            <Text 
              style={[
                styles.retryText, 
                { color: theme.buttonText }
              ]}
            >
              Retry
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Empty state component
  const renderEmptyState = () => {
    if (emptyState) return emptyState;
    
    return (
      <View style={[styles.centeredContent, inline && styles.inlineContent]}>
        <Ionicons 
          name="document-outline" 
          size={inline ? 24 : 48} 
          color={theme.textSecondary} 
          style={styles.emptyIcon}
          accessibilityLabel="Empty state icon"
        />
        <Text 
          style={[
            styles.emptyText, 
            { color: theme.textSecondary },
            inline && styles.inlineText
          ]}
          accessibilityLabel="No content available"
        >
          No content available
        </Text>
      </View>
    );
  };

  // Determine what to render
  const renderContent = () => {
    if (loading) {
      return renderLoadingComponent();
    }
    
    if (error) {
      return renderErrorComponent();
    }
    
    if (!children) {
      return renderEmptyState();
    }
    
    return children;
  };

  // Container styles based on layout type
  const getContainerStyles = () => {
    const baseStyles = [styles.container];
    
    if (fullScreen) {
      baseStyles.push(styles.fullScreenContainer);
    } else if (inline) {
      baseStyles.push(styles.inlineContainer);
    }
    
    // Add custom container styles
    if (containerStyle) {
      baseStyles.push(containerStyle);
    }
    
    return baseStyles;
  };

  return (
    <Animated.View 
      style={[
        getContainerStyles(),
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
      {...props}
    >
      {renderContent()}
    </Animated.View>
  );
};

const styles = {
  container: {
    width: "100%",
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  inlineContainer: {
    paddingVertical: 20,
  },
  centeredContent: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
    paddingHorizontal: 20,
  },
  inlineContent: {
    minHeight: 60,
    paddingHorizontal: 0,
  },
  // Loading styles
  loadingText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  inlineText: {
    fontSize: 14,
    marginTop: 8,
  },
  // Error styles
  errorIcon: {
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
    fontWeight: "500",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inlineRetryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryIcon: {
    marginRight: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  // Empty state styles
  emptyIcon: {
    marginBottom: 12,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    opacity: 0.8,
  },
};

export default LoadingErrorWrapper;