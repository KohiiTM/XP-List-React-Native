import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { Link } from "expo-router";
import { Colors } from "../../constants/Colors";
import { useTasks } from "../../hooks/useTasks";
import { useLocalTasks } from "../../hooks/useLocalTasks";
import { useUser } from "../../hooks/useUser";
import { useLeveling } from "../../hooks/useLeveling";
import ThemedView from "../../components/ThemedView";
import { Ionicons } from "@expo/vector-icons";

const Tasks = () => {
  const { user } = useUser();

  const cloudTasks = useTasks();
  const localTasks = useLocalTasks();

  const {
    tasks,
    loading,
    error,
    fetchTasks,
    updateTask,
    deleteTask,
    createTask,
    clearLocalTasks,
  } = user ? cloudTasks : localTasks;

  // Leveling system (only for authenticated users)
  const { awardXPForTask } = useLeveling();

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "easy",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Remove showCompleted state and toggle logic

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Clear local tasks when user signs in
  useEffect(() => {
    if (user && clearLocalTasks) {
      clearLocalTasks();
    }
  }, [user, clearLocalTasks]);

  const handleComplete = async (task) => {
    try {
      const wasCompleted = task.completed;
      await updateTask(task.$id, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null,
      });

      // Award XP if task was just completed and user is authenticated
      if (!wasCompleted && user && awardXPForTask) {
        try {
          console.log("Awarding XP for task:", task.difficulty);
          const result = await awardXPForTask(task.difficulty);
          console.log("XP awarded successfully:", result);
          Alert.alert(
            "Task Completed!",
            `+${result.xpReward} XP earned!${
              result.leveledUp ? "\n🎉 Level Up!" : ""
            }`
          );
        } catch (xpError) {
          console.log("XP award failed:", xpError.message);
          Alert.alert("XP Award Failed", xpError.message);
        }
      }
    } catch (err) {
      Alert.alert("Error", "Could not update task");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (err) {
      Alert.alert("Error", "Could not delete task");
    }
  };

  const handleOpenModal = () => {
    setForm({ title: "", description: "", difficulty: "easy" });
    setFormError("");
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
    setFormError("");
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateTask = async () => {
    if (!form.title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!form.difficulty) {
      setFormError("Difficulty is required");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        difficulty: form.difficulty,
        completed: false,
        completedAt: null,
      });
      setModalVisible(false);
    } catch (err) {
      setFormError("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const difficultyColors = {
    easy: Colors.dark.easy,
    medium: Colors.dark.medium,
    hard: Colors.dark.hard,
  };

  const renderTask = ({ item }) => (
    <View style={[styles.taskCard, item.completed && styles.completedTaskCard]}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleComplete(item)}
      >
        <View
          style={[styles.checkbox, item.completed && styles.checkboxChecked]}
        >
          {item.completed && (
            <Ionicons name="checkmark" size={14} color="#fff" />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: difficultyColors[item.difficulty] },
            ]}
          >
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item.$id)}
            style={styles.deleteButton}
          >
            <Ionicons name="close" size={16} color="#d32f2f" />
          </TouchableOpacity>
        </View>
        <Text style={styles.taskText}>{item.title}</Text>
      </View>
    </View>
  );

  const activeTasks = tasks ? tasks.filter((task) => !task.completed) : [];
  const hasTasks = activeTasks.length > 0;

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

  return (
    <ThemedView style={styles.container} safe={true}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        {!user && (
          <View style={styles.offlineNotice}>
            <Text style={styles.offlineText}>Offline Mode</Text>
            <Text style={styles.offlineSubtext}>Tasks saved locally</Text>
          </View>
        )}
      </View>
      {/* Toggle removed */}
      {hasTasks ? (
        <FlatList
          data={activeTasks}
          keyExtractor={(item) => item.$id}
          renderItem={renderTask}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>No tasks found.</Text>
        </View>
      )}
      <TouchableOpacity style={styles.fab} onPress={handleOpenModal}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={form.title}
              onChangeText={(text) => handleFormChange("title", text)}
              placeholderTextColor={Colors.dark.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Description (optional)"
              value={form.description}
              onChangeText={(text) => handleFormChange("description", text)}
              placeholderTextColor={Colors.dark.textSecondary}
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
                  onPress={() => handleFormChange("difficulty", level)}
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
            {formError ? (
              <Text style={styles.formError}>{formError}</Text>
            ) : null}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleCloseModal}
                disabled={submitting}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={handleCreateTask}
                disabled={submitting}
              >
                <Text style={styles.createBtnText}>
                  {submitting ? "Creating..." : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default Tasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    color: Colors.dark.accent,
  },
  offlineNotice: {
    backgroundColor: Colors.dark.warning,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  offlineText: {
    color: Colors.dark.warningText,
    fontWeight: "bold",
  },
  offlineSubtext: {
    color: Colors.dark.warningText,
    fontSize: 12,
  },
  listContent: {
    paddingBottom: 40,
    width: "100%",
    marginTop: 20,
    alignItems: "stretch",
  },
  taskCard: {
    backgroundColor: "#3a2f4c",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  completedTaskCard: {
    opacity: 0.6,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#8b7b9e",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#ffd700",
    borderColor: "#ffd700",
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  deleteButton: {
    padding: 4,
  },
  taskText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
  },
  taskInfo: {
    flex: 1,
  },
  difficulty: {
    fontWeight: "bold",
    marginBottom: 2,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "flex-start",
    marginRight: 6,
  },
  taskTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  taskDesc: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  xpReward: {
    color: Colors.dark.accent,
    fontSize: 13,
    fontWeight: "bold",
  },
  taskActions: {
    marginLeft: 12,
    alignItems: "flex-end",
  },
  completeBtn: {
    color: Colors.dark.success,
    fontWeight: "bold",
    marginBottom: 6,
  },
  deleteBtn: {
    color: Colors.dark.error,
    fontWeight: "bold",
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.accent,
    color: Colors.dark.accent,
    fontSize: 16,
  },
  error: {
    color: Colors.dark.error,
    fontSize: 16,
    marginBottom: 10,
  },
  retryBtn: {
    backgroundColor: Colors.dark.button,
    padding: 10,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.dark.buttonText,
    fontWeight: "bold",
  },
  empty: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 80,
    backgroundColor: Colors.dark.accent,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    alignItems: "stretch",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark.accent,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: Colors.dark.background,
    color: Colors.dark.text,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    fontSize: 16,
  },
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
  diffBtnActive: {
    backgroundColor: Colors.dark.accent,
    borderColor: Colors.dark.accent,
  },
  diffBtnText: {
    color: Colors.dark.text,
    fontWeight: "bold",
  },
  formError: {
    color: Colors.dark.error,
    marginBottom: 8,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  cancelBtn: {
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: Colors.dark.border,
  },
  cancelBtnText: {
    color: Colors.dark.text,
    fontWeight: "bold",
  },
  createBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: Colors.dark.accent,
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Remove completedTaskDim and toggle styles
});
