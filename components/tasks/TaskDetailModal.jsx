import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import { Colors } from "@constants/Colors";

const TaskDetailModal = ({ visible, task, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.modalTitle}>Task Details</Text>
          <Text style={styles.taskTitle}>{task?.title}</Text>
          <Text style={styles.taskDesc}>
            {task?.description || "No description."}
          </Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
          >
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#3a2f4c",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    color: "#ffd700",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
  },
  taskTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  taskDesc: {
    color: "#8b7b9e",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  closeBtn: {
    backgroundColor: "#ffd700",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeBtnText: {
    color: "#2c2137",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default TaskDetailModal;