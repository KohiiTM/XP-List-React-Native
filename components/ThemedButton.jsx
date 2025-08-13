import React from "react";
import { StyleSheet } from "react-native";
import ActionButton from "./common/ActionButton";

/**
 * ThemedButton - Legacy wrapper around ActionButton for backward compatibility
 * 
 * @deprecated Use ActionButton directly for new components
 */
function ThemedButton({ 
  style, 
  children, 
  title,
  variant = "primary",
  size = "medium",
  fullWidth = true,
  ...props 
}) {
  const containerStyle = [
    styles.legacyContainer,
    style,
  ];

  return (
    <ActionButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      style={containerStyle}
      title={title}
      {...props}
    >
      {children}
    </ActionButton>
  );
}

const styles = StyleSheet.create({
  legacyContainer: {
    maxWidth: 320,
    marginBottom: 16,
  },
});

export default ThemedButton;
