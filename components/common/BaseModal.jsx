import React from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@constants/Colors";

const BaseModal = ({
  visible,
  onClose,
  children,
  animationType = "slide",
  transparent = true,
  showCloseButton = true,
  title,
  modalStyle,
  contentStyle,
  overlayStyle,
  closeOnOverlayPress = true,
  ...modalProps
}) => {
  const handleOverlayPress = () => {
    if (closeOnOverlayPress && onClose) {
      onClose();
    }
  };

  const handleContentPress = (e) => {
    // Prevent event bubbling to overlay
    e.stopPropagation();
  };

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onClose}
      {...modalProps}
    >
      <TouchableOpacity
        style={[styles.overlay, overlayStyle]}
        activeOpacity={1}
        onPress={handleOverlayPress}
        accessible={true}
        accessibilityLabel="Close modal"
        accessibilityRole="button"
      >
        <TouchableOpacity
          style={[styles.content, modalStyle]}
          activeOpacity={1}
          onPress={handleContentPress}
          accessible={false}
        >
          {/* Header with title and close button */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && (
                <Text style={[styles.title, contentStyle?.title]}>
                  {title}
                </Text>
              )}
              {showCloseButton && (
                <Pressable
                  style={styles.closeButton}
                  onPress={onClose}
                  accessible={true}
                  accessibilityLabel="Close modal"
                  accessibilityRole="button"
                  android_ripple={{ color: Colors.dark.border, borderless: true }}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={Colors.dark.textSecondary}
                  />
                </Pressable>
              )}
            </View>
          )}

          {/* Modal content */}
          <View style={[styles.body, contentStyle?.body]}>
            {children}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    minWidth: 280,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    minHeight: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark.accent,
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  body: {
    alignItems: "stretch",
  },
});

export default BaseModal;