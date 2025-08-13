import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ActionButton from "./ActionButton";
import { Colors } from "@constants/Colors";

/**
 * ActionButton Examples and Documentation
 * 
 * This file demonstrates all the different ways to use ActionButton.
 * It's meant for reference and can be removed from production builds.
 */
const ActionButtonExamples = () => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handlePress = (buttonType) => {
    Alert.alert("Button Pressed", `You pressed: ${buttonType}`);
  };

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const toggleDisabled = () => {
    setDisabled(!disabled);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>ActionButton Examples</Text>
      
      {/* Basic Variants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Variants</Text>
        
        <ActionButton
          variant="primary"
          title="Primary Button"
          onPress={() => handlePress("Primary")}
          style={styles.button}
        />
        
        <ActionButton
          variant="secondary"
          title="Secondary Button"
          onPress={() => handlePress("Secondary")}
          style={styles.button}
        />
        
        <ActionButton
          variant="outline"
          title="Outline Button"
          onPress={() => handlePress("Outline")}
          style={styles.button}
        />
        
        <ActionButton
          variant="ghost"
          title="Ghost Button"
          onPress={() => handlePress("Ghost")}
          style={styles.button}
        />
      </View>

      {/* Sizes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Button Sizes</Text>
        
        <ActionButton
          variant="primary"
          size="small"
          title="Small Button"
          onPress={() => handlePress("Small")}
          style={styles.button}
        />
        
        <ActionButton
          variant="primary"
          size="medium"
          title="Medium Button"
          onPress={() => handlePress("Medium")}
          style={styles.button}
        />
        
        <ActionButton
          variant="primary"
          size="large"
          title="Large Button"
          onPress={() => handlePress("Large")}
          style={styles.button}
        />
      </View>

      {/* With Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buttons with Icons</Text>
        
        <ActionButton
          variant="primary"
          title="Add Task"
          icon={<Ionicons name="add" size={20} color="#2c2137" />}
          iconPosition="left"
          onPress={() => handlePress("Add Task")}
          style={styles.button}
        />
        
        <ActionButton
          variant="outline"
          title="Settings"
          icon={<Ionicons name="settings" size={20} color="#ffd700" />}
          iconPosition="right"
          onPress={() => handlePress("Settings")}
          style={styles.button}
        />
        
        <ActionButton
          variant="secondary"
          title="Download"
          icon={<Ionicons name="download" size={20} color="#fff" />}
          iconPosition="left"
          onPress={() => handlePress("Download")}
          style={styles.button}
        />
      </View>

      {/* Special Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Button Types</Text>
        
        <View style={styles.row}>
          <ActionButton
            variant="fab"
            icon={<Ionicons name="add" size={24} color="#2c2137" />}
            onPress={() => handlePress("FAB")}
            accessibilityLabel="Add new item"
          />
          
          <ActionButton
            variant="icon"
            icon={<Ionicons name="heart" size={20} color="#fff" />}
            onPress={() => handlePress("Icon")}
            accessibilityLabel="Like"
            style={{ marginLeft: 16 }}
          />
          
          <ActionButton
            variant="icon"
            icon={<Ionicons name="share" size={20} color="#fff" />}
            onPress={() => handlePress("Share")}
            accessibilityLabel="Share"
            style={{ marginLeft: 16 }}
          />
        </View>
      </View>

      {/* States */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Button States</Text>
        
        <ActionButton
          variant="primary"
          title="Loading Button"
          loading={loading}
          loadingText="Processing..."
          onPress={handleLoadingTest}
          style={styles.button}
        />
        
        <ActionButton
          variant="primary"
          title="Toggle Loading"
          onPress={handleLoadingTest}
          style={styles.button}
        />
        
        <ActionButton
          variant="secondary"
          title={disabled ? "Disabled Button" : "Normal Button"}
          disabled={disabled}
          onPress={() => handlePress("Disabled Toggle")}
          style={styles.button}
        />
        
        <ActionButton
          variant="outline"
          title={disabled ? "Enable Buttons" : "Disable Button Above"}
          onPress={toggleDisabled}
          style={styles.button}
        />
      </View>

      {/* Full Width */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Layout Options</Text>
        
        <ActionButton
          variant="primary"
          title="Full Width Button"
          fullWidth={true}
          onPress={() => handlePress("Full Width")}
          style={styles.button}
        />
        
        <View style={styles.row}>
          <ActionButton
            variant="outline"
            title="Half"
            onPress={() => handlePress("Half 1")}
            style={[styles.button, { flex: 1, marginRight: 8 }]}
          />
          <ActionButton
            variant="outline"
            title="Half"
            onPress={() => handlePress("Half 2")}
            style={[styles.button, { flex: 1, marginLeft: 8 }]}
          />
        </View>
      </View>

      {/* Modal Actions Pattern */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modal Actions Pattern</Text>
        
        <View style={styles.modalActions}>
          <ActionButton
            variant="ghost"
            title="Cancel"
            onPress={() => handlePress("Cancel")}
            style={styles.modalButton}
          />
          <ActionButton
            variant="primary"
            title="Confirm"
            onPress={() => handlePress("Confirm")}
            style={styles.modalButton}
          />
        </View>
      </View>

      {/* Accessibility Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessibility</Text>
        
        <ActionButton
          variant="primary"
          title="Accessible Button"
          accessibilityLabel="Save your changes"
          accessibilityHint="Double tap to save all changes to your profile"
          onPress={() => handlePress("Accessible")}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.dark.accent,
    textAlign: "center",
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: 15,
  },
  button: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalButton: {
    marginLeft: 12,
    minWidth: 80,
  },
});

export default ActionButtonExamples;