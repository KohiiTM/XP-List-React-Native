import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  useColorScheme,
} from "react-native";
import { Colors } from "@constants/Colors";

/**
 * ActionButton - A comprehensive, reusable button component
 * 
 * @param {Object} props
 * @param {string} props.variant - Button style: 'primary', 'secondary', 'outline', 'ghost', 'fab', 'icon'
 * @param {string} props.size - Button size: 'small', 'medium', 'large'
 * @param {function} props.onPress - Press handler function
 * @param {React.ReactNode} props.children - Button content (takes precedence over title)
 * @param {string} props.title - Button text (used if children not provided)
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state with spinner
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.iconPosition - Icon position: 'left', 'right'
 * @param {boolean} props.fullWidth - Full width button
 * @param {Object} props.style - Custom container styles
 * @param {Object} props.textStyle - Custom text styles
 * @param {string} props.loadingText - Text to show during loading
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 */
const ActionButton = ({
  variant = "primary",
  size = "medium",
  onPress,
  children,
  title,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  style,
  textStyle,
  loadingText,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.dark;

  // Get variant styles
  const getVariantStyles = () => {
    const variants = {
      primary: {
        container: {
          backgroundColor: theme.accent,
          borderWidth: 0,
        },
        text: {
          color: theme.buttonText,
          fontWeight: "700",
        },
        ripple: theme.buttonText,
      },
      secondary: {
        container: {
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.border,
        },
        text: {
          color: theme.text,
          fontWeight: "600",
        },
        ripple: theme.border,
      },
      outline: {
        container: {
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: theme.accent,
        },
        text: {
          color: theme.accent,
          fontWeight: "600",
        },
        ripple: theme.accent,
      },
      ghost: {
        container: {
          backgroundColor: "transparent",
          borderWidth: 0,
        },
        text: {
          color: theme.accent,
          fontWeight: "600",
        },
        ripple: theme.accent,
      },
      fab: {
        container: {
          backgroundColor: theme.accent,
          borderWidth: 0,
          borderRadius: 28,
          width: 56,
          height: 56,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        text: {
          color: theme.buttonText,
          fontWeight: "700",
          fontSize: 24,
        },
        ripple: theme.buttonText,
      },
      icon: {
        container: {
          backgroundColor: "transparent",
          borderWidth: 0,
          borderRadius: 20,
          width: 40,
          height: 40,
          paddingHorizontal: 0,
          paddingVertical: 0,
        },
        text: {
          color: theme.text,
          fontWeight: "500",
        },
        ripple: theme.border,
      },
    };
    return variants[variant] || variants.primary;
  };

  // Get size styles
  const getSizeStyles = () => {
    if (variant === "fab" || variant === "icon") {
      return {}; // FAB and icon buttons have fixed sizes
    }

    const sizes = {
      small: {
        container: {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 6,
        },
        text: {
          fontSize: 14,
        },
      },
      medium: {
        container: {
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
        },
        text: {
          fontSize: 16,
        },
      },
      large: {
        container: {
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderRadius: 10,
        },
        text: {
          fontSize: 18,
        },
      },
    };
    return sizes[size] || sizes.medium;
  };

  // Get disabled styles
  const getDisabledStyles = () => {
    if (!disabled && !loading) return {};

    return {
      container: {
        opacity: 0.6,
        backgroundColor: variant === "primary" || variant === "fab" 
          ? theme.border 
          : undefined,
      },
      text: {
        color: variant === "primary" || variant === "fab"
          ? theme.textSecondary
          : theme.textSecondary,
      },
    };
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const disabledStyles = getDisabledStyles();

  // Combine all container styles
  const containerStyles = [
    styles.base,
    variantStyles.container,
    sizeStyles.container,
    disabledStyles.container,
    fullWidth && styles.fullWidth,
    style,
  ];

  // Combine all text styles
  const combinedTextStyles = [
    variantStyles.text,
    sizeStyles.text,
    disabledStyles.text,
    textStyle,
  ];

  // Determine what to display
  const displayText = loading && loadingText ? loadingText : (title || "");
  const showSpinner = loading;
  const showIcon = icon && !showSpinner;
  const showText = (children || displayText) && !showSpinner;

  // Content arrangement based on icon position
  const renderContent = () => {
    if (children) {
      return children;
    }

    if (variant === "fab") {
      // FAB typically shows just an icon or single character
      return showSpinner ? (
        <ActivityIndicator size="small" color={variantStyles.text.color} />
      ) : showIcon ? (
        icon
      ) : (
        <Text style={combinedTextStyles}>{displayText}</Text>
      );
    }

    if (variant === "icon") {
      // Icon button shows just the icon
      return showSpinner ? (
        <ActivityIndicator size="small" color={variantStyles.text.color} />
      ) : (
        icon || <Text style={combinedTextStyles}>{displayText}</Text>
      );
    }

    // Regular buttons with text and optional icons
    const textElement = showText && (
      <Text style={combinedTextStyles}>{displayText}</Text>
    );

    const iconElement = showIcon && (
      <View style={iconPosition === "right" ? styles.iconRight : styles.iconLeft}>
        {icon}
      </View>
    );

    const spinnerElement = showSpinner && (
      <View style={styles.iconLeft}>
        <ActivityIndicator size="small" color={variantStyles.text.color} />
      </View>
    );

    if (showSpinner) {
      return (
        <View style={styles.contentRow}>
          {spinnerElement}
          {textElement}
        </View>
      );
    }

    if (iconPosition === "right") {
      return (
        <View style={styles.contentRow}>
          {textElement}
          {iconElement}
        </View>
      );
    }

    return (
      <View style={styles.contentRow}>
        {iconElement}
        {textElement}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title || "Button"}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: disabled || loading,
      }}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  fullWidth: {
    width: "100%",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default ActionButton;