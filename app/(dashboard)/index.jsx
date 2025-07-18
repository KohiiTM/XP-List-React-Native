import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ImageBackground,
  Alert,
  Modal,
} from "react-native";

import { Link, useRouter, usePathname } from "expo-router";
import Logo from "@assets/images/icon.png";
import Parchment from "@assets/images/parchment.png";
import { useUser } from "@hooks/useUser";
import { useLeveling } from "@hooks/useLeveling";
import Constants from "expo-constants";
import { databases } from "@lib/appwrite";
import { useTasks } from "@hooks/useTasks";
import { useLocalTasks } from "@hooks/useLocalTasks";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import LevelDisplay from "@components/LevelDisplay";
import ProfilePicturePicker from "@components/ProfilePicturePicker";

import { Colors } from "@constants/Colors";

import ThemedView from "@components/ThemedView";

const Home = () => {
  const { user } = useUser();
  const {
    levelInfo,
    loading: levelLoading,
    error: levelError,
    awardXPForTask,
  } = useLeveling();
  // Use appropriate tasks hook based on authentication status
  const cloudTasks = useTasks();
  const localTasks = useLocalTasks();

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    fetchTasks,
    updateTask,
    deleteTask,
    clearLocalTasks,
  } = user ? cloudTasks : localTasks;
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [taskDetailModalVisible, setTaskDetailModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [user, fetchTasks]);

  // Clear local tasks when user signs in
  useEffect(() => {
    if (user && clearLocalTasks) {
      clearLocalTasks();
    }
  }, [user, clearLocalTasks]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.$id) return;
      setProfileLoading(true);
      setProfileError(null);
      try {
        const DATABASE_ID = Constants.expoConfig.extra.DATABASE_ID;
        const COLLECTION_ID = Constants.expoConfig.extra.COLLECTION_ID;
        const doc = await databases.getDocument(
          DATABASE_ID,
          COLLECTION_ID,
          user.$id
        );
        setProfile(doc);
      } catch (err) {
        setProfileError("Could not load profile");
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleComplete = async (task) => {
    try {
      const wasCompleted = task.completed;
      await updateTask(task.$id, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null,
      });

      if (!wasCompleted && user && awardXPForTask) {
        try {
          console.log("Awarding XP for task:", task.difficulty);
          const result = await awardXPForTask(task.difficulty);
          console.log("XP awarded successfully:", result);
          Alert.alert(
            "Task Completed!",
            result.leveledUp
              ? "🎉 Congratulations on leveling up!"
              : `+${result.xpReward} XP earned!`
          );
        } catch (xpError) {
          console.log("XP award failed:", xpError.message);
          Alert.alert("XP Award Failed", xpError.message);
        }
      }
    } catch (err) {
      console.log("Task completion failed:", err.message);
    }
  };

  const handleShowTaskDetail = (task) => {
    setSelectedTask(task);
    setTaskDetailModalVisible(true);
  };
  const handleCloseTaskDetail = () => {
    setTaskDetailModalVisible(false);
    setSelectedTask(null);
  };

  const difficultyColors = {
    easy: "#8bc34a",
    medium: "#ff9800",
    hard: "#d32f2f",
  };

  const renderTask = ({ item }) => (
    <TouchableOpacity onPress={() => handleShowTaskDetail(item)}>
      <View
        style={[styles.taskCard, item.completed && styles.completedTaskCard]}
      >
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
              onPress={() => deleteTask(item.$id)}
              style={styles.deleteButton}
            >
              <Ionicons name="close" size={16} color="#d32f2f" />
            </TouchableOpacity>
          </View>
          <Text style={styles.taskText}>{item.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getProfilePictureUrl = () => {
    if (!profile?.profilePictureFileId) return null;
    const STORAGE_BUCKET_ID = Constants.expoConfig.extra.STORAGE_BUCKET_ID;
    return `https://nyc.cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${profile.profilePictureFileId}/view?project=686b296f003243270240`;
  };

  return (
    <ThemedView style={styles.container} safe={true}>
      {user && (
        <View style={{ alignItems: "center", marginTop: 12, marginBottom: 8 }}>
          <ProfilePicturePicker
            currentImageUrl={getProfilePictureUrl()}
            onImageUpdate={() => {}}
            size={100}
          />
          {profileLoading ? (
            <Text style={styles.username}>Loading...</Text>
          ) : profileError ? (
            <Text style={styles.username}>Error</Text>
          ) : (
            <Text style={styles.username}>
              {profile?.username || "No username"}
            </Text>
          )}
          <View style={styles.levelSection}>
            <LevelDisplay
              level={levelInfo.level}
              currentLevelXP={levelInfo.currentLevelXP}
              xpToNextLevel={levelInfo.xpToNextLevel}
              totalXP={levelInfo.totalXP}
              levelTitle={levelInfo.levelTitle}
              levelColor={levelInfo.levelColor}
              consecutiveCompletions={levelInfo.consecutiveCompletions}
              showStreak={true}
            />
          </View>
        </View>
      )}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header} />
        {/* Tasks Section */}
        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tasks</Text>
            <View style={styles.taskCount}>
              <Text style={styles.taskCountText}>
                {tasks?.length || 0} items
              </Text>
            </View>
          </View>

          {tasksLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading tasks...</Text>
            </View>
          ) : tasksError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{tasksError}</Text>
            </View>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.$id}
              renderItem={renderTask}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="list-outline" size={48} color="#8b7b9e" />
                  <Text style={styles.emptyText}>No tasks yet</Text>
                  <Text style={styles.emptySubtext}>
                    Add your first task to get started
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </ScrollView>
      <Modal
        visible={taskDetailModalVisible}
        animationType="fade"
        transparent
        onRequestClose={handleCloseTaskDetail}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseTaskDetail}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Task Details</Text>
            <Text style={styles.taskTitle}>{selectedTask?.title}</Text>
            <Text style={styles.taskDesc}>
              {selectedTask?.description || "No description."}
            </Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleCloseTaskDetail}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  );
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2137",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 32,
  },
  userSection: {
    marginBottom: 16,
  },
  username: {
    color: "#ffd700",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  levelSection: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 40,
    backgroundColor: "transparent",
    width: "95%",
    height: 100,
    alignSelf: "center",
  },
  tasksSection: {
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#ffd700",
    fontSize: 24,
    fontWeight: "700",
  },
  taskCount: {
    backgroundColor: "#3a2f4c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  taskCountText: {
    color: "#8b7b9e",
    fontSize: 12,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "#8b7b9e",
    fontSize: 16,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#8b7b9e",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    color: "#8b7b9e",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
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
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#2c2137",
    borderTopWidth: 1,
    borderTopColor: "#3a2f4c",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  navIconActive: {
    backgroundColor: "#3a2f4c",
  },
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
