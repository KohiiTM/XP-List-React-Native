import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { Colors } from "../../constants/Colors";
import { useTasks } from "../../hooks/useTasks";

const Tasks = () => {
  const { tasks, loading, error, fetchTasks, updateTask, deleteTask } =
    useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleComplete = async (task) => {
    try {
      await updateTask(task.$id, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null,
      });
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

  const renderTask = ({ item }) => (
    <View style={[styles.taskItem, item.completed && styles.completedTask]}>
      <View style={styles.taskInfo}>
        <Text
          style={[
            styles.difficulty,
            styles[`difficulty${capitalize(item.difficulty)}`],
          ]}
        >
          {item.difficulty}
        </Text>
        <Text style={styles.taskTitle}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.taskDesc}>{item.description}</Text>
        ) : null}
        <Text style={styles.xpReward}>+{item.xpReward} XP</Text>
      </View>
      <View style={styles.taskActions}>
        <TouchableOpacity onPress={() => handleComplete(item)}>
          <Text style={styles.completeBtn}>
            {item.completed ? "Undo" : "Done"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.$id)}>
          <Text style={styles.deleteBtn}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={Colors.dark.accent} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity onPress={fetchTasks} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.$id}
        renderItem={renderTask}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.empty}>No tasks found.</Text>}
      />
      <Link href="/" style={styles.link}>
        Home
      </Link>
    </View>
  );
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default Tasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.background,
    padding: 24,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 10,
    marginBottom: 10,
    color: Colors.dark.accent,
  },
  listContent: {
    paddingBottom: 40,
    width: "100%",
  },
  taskItem: {
    backgroundColor: Colors.dark.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  completedTask: {
    opacity: 0.5,
  },
  taskInfo: {
    flex: 1,
  },
  difficulty: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  difficultyEasy: {
    color: Colors.dark.easy,
  },
  difficultyMedium: {
    color: Colors.dark.medium,
  },
  difficultyHard: {
    color: Colors.dark.hard,
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
    marginTop: 40,
  },
});
