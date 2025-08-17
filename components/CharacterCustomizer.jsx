import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useCharacter } from "../contexts/CharacterContext";
import CharacterAvatar from "./CharacterAvatar";

const CUSTOMIZATION_OPTIONS = {
  skinTone: [
    { value: "light", label: "Light", icon: "person" },
    { value: "medium", label: "Medium", icon: "person" },
    { value: "dark", label: "Dark", icon: "person" },
  ],
  hairStyle: [
    { value: "short", label: "Short", icon: "cut" },
    { value: "long", label: "Long", icon: "cut" },
    { value: "bald", label: "Bald", icon: "cut" },
  ],
  hairColor: [
    { value: "brown", label: "Brown", icon: "color-palette" },
    { value: "black", label: "Black", icon: "color-palette" },
    { value: "blonde", label: "Blonde", icon: "color-palette" },
    { value: "red", label: "Red", icon: "color-palette" },
  ],
  eyeColor: [
    { value: "brown", label: "Brown", icon: "eye" },
    { value: "blue", label: "Blue", icon: "eye" },
    { value: "green", label: "Green", icon: "eye" },
    { value: "hazel", label: "Hazel", icon: "eye" },
  ],
};

const CharacterCustomizer = ({ visible, onClose }) => {
  const { character, customizeCharacter, loading } = useCharacter();
  const [tempCharacter, setTempCharacter] = useState(null);

  React.useEffect(() => {
    if (visible && character) {
      setTempCharacter({ ...character });
    }
  }, [visible, character]);

  const handleOptionSelect = (category, value) => {
    setTempCharacter((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSave = async () => {
    if (!tempCharacter) return;

    try {
      const updates = {
        skinTone: tempCharacter.skinTone,
        hairStyle: tempCharacter.hairStyle,
        hairColor: tempCharacter.hairColor,
        eyeColor: tempCharacter.eyeColor,
      };

      await customizeCharacter(updates);
      Alert.alert("Success", "Character customized successfully!");
      onClose();
    } catch (error) {
      console.error("Customization failed:", error);
    }
  };

  const handleCancel = () => {
    setTempCharacter(character ? { ...character } : null);
    onClose();
  };

  const renderCustomizationSection = (category, title) => {
    const options = CUSTOMIZATION_OPTIONS[category];
    const selectedValue = tempCharacter?.[category];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                selectedValue === option.value && styles.optionButtonSelected,
              ]}
              onPress={() => handleOptionSelect(category, option.value)}
            >
              <Ionicons
                name={option.icon}
                size={20}
                color={
                  selectedValue === option.value
                    ? Colors.dark.background
                    : Colors.dark.accent
                }
              />
              <Text
                style={[
                  styles.optionText,
                  selectedValue === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Customize Character</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Character Preview */}
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>Preview</Text>
              <View style={styles.previewAvatars}>
                <View style={styles.avatarContainer}>
                  <CharacterAvatar
                    size={80}
                    renderMode="face"
                    customCharacter={tempCharacter}
                  />
                  <Text style={styles.avatarLabel}>Face</Text>
                </View>
                <View style={styles.avatarContainer}>
                  <CharacterAvatar
                    size={120}
                    renderMode="fullBody"
                    customCharacter={tempCharacter}
                  />
                  <Text style={styles.avatarLabel}>Full Body</Text>
                </View>
              </View>
            </View>

            {/* Customization Options */}
            {renderCustomizationSection("skinTone", "Skin Tone")}
            {renderCustomizationSection("hairStyle", "Hair Style")}
            {renderCustomizationSection("hairColor", "Hair Color")}
            {renderCustomizationSection("eyeColor", "Eye Color")}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.dark.accent,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  previewContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: 16,
  },
  previewAvatars: {
    flexDirection: "row",
    gap: 30,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatarLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.dark.background,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 6,
  },
  optionButtonSelected: {
    backgroundColor: Colors.dark.accent,
    borderColor: Colors.dark.accent,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.dark.text,
  },
  optionTextSelected: {
    color: Colors.dark.background,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: Colors.dark.border,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.dark.text,
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: Colors.dark.accent,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CharacterCustomizer;