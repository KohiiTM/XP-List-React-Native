import React, { useEffect, useState, useCallback } from "react";
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
import { databases } from "../../lib/appwrite";
import { useUser } from "../../hooks/useUser";
import { Query } from "react-native-appwrite";
import Constants from "expo-constants";

const DATABASE_ID = Constants.expoConfig.extra.DATABASE_ID;
const TASKS_COLLECTION_ID = Constants.expoConfig.extra.TASKS_COLLECTION_ID;

const Tasks = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        user ? [Query.equal("userId", user.$id)] : []
      );
      if (res.documents.length === 0 && user) {
        // Create a default task for the user
        await databases.createDocument(
          DATABASE_ID,
          TASKS_COLLECTION_ID,
          undefined, // Let Appwrite generate the ID
          {
            userId: user.$id,
            title: "Welcome Task",
            description: "This is your first task!",
            difficulty: "easy",
            xpReward: 10,
            completed: false,
            completedAt: null,
          }
        );
        // Refetch after creating
        return fetchTasks();
      }
      setTasks(res.documents);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError(err?.message || String(err) || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchTasks();
  }, [fetchTasks, user]);

  const handleComplete = async (task) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        task.$id,
        {
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : null,
        }
      );
      fetchTasks();
    } catch (err) {
      Alert.alert("Error", "Could not update task");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await databases.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, taskId);
      fetchTasks();
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
