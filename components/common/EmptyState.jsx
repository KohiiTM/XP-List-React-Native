import React from "react";
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Image,
} from "react-native";
import { Colors } from "@constants/Colors";
import ActionButton from "./ActionButton";

/**
 * EmptyState - A flexible component for displaying empty states throughout the application
 * 
 * @param {Object} props
 * @param {React.ReactNode|string} props.icon - Icon to display (React node or icon name string)
 * @param {string} props.title - Main empty state message (required)
 * @param {string} props.subtitle - Secondary message (optional)
 * @param {string} props.actionText - Button text (optional)
 * @param {function} props.onAction - Button callback (optional)
 * @param {React.ReactNode} props.illustration - Custom illustration (optional)
 * @param {Object} props.style - Custom container styles (optional)
 * @param {string} props.variant - Empty state type: 'default', 'search', 'error', 'offline' (optional)
 * @param {string} props.size - Component size: 'small', 'medium', 'large' (optional)
 * @param {Object} props.titleStyle - Custom title text styles (optional)
 * @param {Object} props.subtitleStyle - Custom subtitle text styles (optional)
 * @param {string} props.accessibilityLabel - Accessibility label for the entire component
 * @param {string} props.accessibilityHint - Accessibility hint
 */
const EmptyState = ({
  icon,
  title,
  subtitle,
  actionText,
  onAction,
  illustration,
  style,
  variant = "default",
  size = "medium",
  titleStyle,
  subtitleStyle,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.dark;

  // Get variant-specific styles and default icons
  const getVariantStyles = () => {
    const variants = {
      default: {
        iconColor: theme.textSecondary,
        titleColor: theme.text,
        subtitleColor: theme.textSecondary,
        defaultIcon: "📄",
      },
      search: {
        iconColor: theme.textSecondary,
        titleColor: theme.text,
        subtitleColor: theme.textSecondary,
        defaultIcon: "🔍",
      },
      error: {
        iconColor: theme.error,
        titleColor: theme.text,
        subtitleColor: theme.textSecondary,
        defaultIcon: "⚠️",
      },
      offline: {
        iconColor: theme.textSecondary,
        titleColor: theme.text,
        subtitleColor: theme.textSecondary,
        defaultIcon: "📡",
      },
      nodata: {
        iconColor: theme.textSecondary,
        titleColor: theme.text,
        subtitleColor: theme.textSecondary,
        defaultIcon: "📊",
      },
      inventory: {
        iconColor: theme.textSecondary,
        titleColor: theme.text,
        subtitleColor: theme.textSecondary,
        defaultIcon: "📦",
      },
      tasks: {
        iconColor: theme.textSecondary,
        titleColor: theme.text,
        subtitleColor: theme.textSecondary,
        defaultIcon: "✅",
      },
    };
    return variants[variant] || variants.default;
  };

  // Get size-specific styles
  const getSizeStyles = () => {
    const sizes = {
      small: {
        container: {
          paddingVertical: 24,
          paddingHorizontal: 16,
        },
        iconSize: 32,
        titleSize: 16,
        subtitleSize: 14,
        spacing: 8,
        buttonSize: "small",
      },
      medium: {
        container: {
          paddingVertical: 40,
          paddingHorizontal: 24,
        },
        iconSize: 48,
        titleSize: 20,
        subtitleSize: 16,
        spacing: 12,
        buttonSize: "medium",
      },
      large: {
        container: {
          paddingVertical: 60,
          paddingHorizontal: 32,
        },
        iconSize: 64,
        titleSize: 24,
        subtitleSize: 18,
        spacing: 16,
        buttonSize: "large",
      },
    };
    return sizes[size] || sizes.medium;
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  // Render icon or illustration
  const renderVisual = () => {
    if (illustration) {
      return (
        <View style={[styles.illustrationContainer, { marginBottom: sizeStyles.spacing }]}>
          {illustration}
        </View>
      );
    }

    if (icon) {
      // Handle different icon types
      if (typeof icon === "string") {
        // If it's a string, treat it as an emoji or text
        return (
          <Text
            style={[
              styles.iconText,
              {
                fontSize: sizeStyles.iconSize,
                color: variantStyles.iconColor,
                marginBottom: sizeStyles.spacing,
              },
            ]}
            accessibilityRole="image"
            accessibilityLabel={`${variant} icon`}
          >
            {icon}
          </Text>
        );
      } else {
        // If it's a React node (like an SVG or Image component)
        return (
          <View
            style={[
              styles.iconContainer,
              {
                width: sizeStyles.iconSize,
                height: sizeStyles.iconSize,
                marginBottom: sizeStyles.spacing,
              },
            ]}
          >
            {icon}
          </View>
        );
      }
    }

    // Use default icon for variant
    return (
      <Text
        style={[
          styles.iconText,
          {
            fontSize: sizeStyles.iconSize,
            color: variantStyles.iconColor,
            marginBottom: sizeStyles.spacing,
          },
        ]}
        accessibilityRole="image"
        accessibilityLabel={`${variant} icon`}
      >
        {variantStyles.defaultIcon}
      </Text>
    );
  };

  // Render action button if provided
  const renderAction = () => {
    if (!actionText || !onAction) return null;

    return (
      <ActionButton
        title={actionText}
        onPress={onAction}
        variant="outline"
        size={sizeStyles.buttonSize}
        style={{ marginTop: sizeStyles.spacing * 1.5 }}
        accessibilityLabel={`${actionText} button`}
        accessibilityHint="Tap to perform the suggested action"
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        sizeStyles.container,
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={
        accessibilityLabel || 
        `Empty state: ${title}${subtitle ? `. ${subtitle}` : ""}`
      }
      accessibilityHint={accessibilityHint}
      {...props}
    >
      {renderVisual()}
      
      <Text
        style={[
          styles.title,
          {
            fontSize: sizeStyles.titleSize,
            color: variantStyles.titleColor,
            marginBottom: subtitle ? sizeStyles.spacing / 2 : 0,
          },
          titleStyle,
        ]}
        accessibilityRole="header"
      >
        {title}
      </Text>

      {subtitle && (
        <Text
          style={[
            styles.subtitle,
            {
              fontSize: sizeStyles.subtitleSize,
              color: variantStyles.subtitleColor,
            },
            subtitleStyle,
          ]}
        >
          {subtitle}
        </Text>
      )}

      {renderAction()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    textAlign: "center",
  },
  title: {
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 28,
  },
  subtitle: {
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.8,
  },
});

export default EmptyState;