import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { Colors } from "@constants/Colors";
import ActionButton from "@components/common/ActionButton";
import BaseModal from "@components/common/BaseModal";
import ThemedTextInput from "@components/common/ThemedTextInput";
import { DifficultyBadge } from "@components/common";

const TaskCreationModal = ({ 
  visible, 
  onClose, 
  onSubmit, 
  form, 
  onFormChange, 
  formError, 
  submitting = false,
  difficultyColors = {
    easy: Colors.dark.easy,
    medium: Colors.dark.medium,
    hard: Colors.dark.hard,
  }
}) => {
  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Create Task"
      animationType="slide"
    >
      <ThemedTextInput
        placeholder="Title"
        value={form.title}
        onChangeText={(text) => onFormChange("title", text)}
        label="Title"
        required
      />
      <ThemedTextInput
        placeholder="Description (optional)"
        value={form.description}
        onChangeText={(text) => onFormChange("description", text)}
        label="Description"
        multiline
        numberOfLines={3}
      />
          <View style={styles.row}>
            <Text style={styles.label}>Difficulty:</Text>
            {["easy", "medium", "hard"].map((level) => (
              <Pressable
                key={level}
                style={[
                  styles.diffBtn,
                  form.difficulty === level && {
                    backgroundColor: difficultyColors[level],
                    borderColor: difficultyColors[level],
                  },
                ]}
                onPress={() => onFormChange("difficulty", level)}
              >
                <Text
                  style={[
                    styles.diffBtnText,
                    form.difficulty === level && { color: "#fff" },
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
          {form.difficulty && (
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Preview:</Text>
              <DifficultyBadge
                difficulty={form.difficulty}
                difficultyColors={difficultyColors}
                size="medium"
              />
            </View>
          )}
          {formError ? (
            <Text style={styles.formError}>{formError}</Text>
          ) : null}
          <View style={styles.modalActions}>
            <ActionButton
              variant="ghost"
              title="Cancel"
              onPress={onClose}
              disabled={submitting}
              style={styles.modalButton}
            />
            <ActionButton
              variant="primary"
              title="Create"
              loading={submitting}
              loadingText="Creating..."
              onPress={onSubmit}
              style={styles.modalButton}
            />
          </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    color: Colors.dark.text,
    fontWeight: "bold",
    marginRight: 8,
  },
  diffBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginRight: 8,
    backgroundColor: Colors.dark.background,
  },
  diffBtnText: {
    color: Colors.dark.text,
    fontWeight: "bold",
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingTop: 8,
  },
  previewLabel: {
    color: Colors.dark.textSecondary,
    fontWeight: "500",
    marginRight: 12,
    fontSize: 14,
  },
  formError: {
    color: Colors.dark.error,
    marginBottom: 8,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
  },
  modalButton: {
    marginLeft: 12,
    minWidth: 80,
  },
});

export default TaskCreationModal;