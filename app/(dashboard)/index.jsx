import React, { useEffect, useState, useCallback } from "react";
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
import Unsolved_Cube from "@assets/images/unsolved_cube.png";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import useInventory from "@hooks/useInventory";
import TaskCard from "@components/tasks/TaskCard";
import TaskDetailModal from "@components/tasks/TaskDetailModal";
import DailyChestButton from "@components/inventory/DailyChestButton";
import ChestRewardModal from "@components/inventory/ChestRewardModal";

import { Colors } from "@constants/Colors";

import ThemedView from "@components/ThemedView";
import PullToRefresh from "@components/PullToRefresh";
import { usePullToRefresh } from "@hooks/usePullToRefresh";

const DAILY_CHEST_KEY = "dailyChestLastOpened";
const CHEST_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours in ms

const itemImages = {
  "icon.png": Logo,
  "unsolved_cube.png": Unsolved_Cube,
  "parchment.png": Parchment,
};

const Home = () => {
  const { user } = useUser();
  const {
    levelInfo,
    loading: levelLoading,
    error: levelError,
    awardXPForTask,
  } = useLeveling();
  // Use appropriate tasks hook based on authentication status
  const tasksHook = user ? useTasks() : useLocalTasks();
  const { tasks, loading, error, fetchTasks } = tasksHook;
  const { refreshing, onRefresh } = usePullToRefresh(fetchTasks);
  const { items: inventoryItems, addItem, fetchItems } = useInventory();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [taskDetailModalVisible, setTaskDetailModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [chestModalVisible, setChestModalVisible] = useState(false);
  const [chestReward, setChestReward] = useState(null);
  const [chestCooldown, setChestCooldown] = useState(0);
  const [chestLoading, setChestLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [user, fetchTasks]);

  // Clear local tasks when user signs in
  useEffect(() => {
    if (user && tasksHook.clearLocalTasks) {
      tasksHook.clearLocalTasks();
    }
  }, [user, tasksHook.clearLocalTasks]);

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

  useEffect(() => {
    const checkCooldown = async () => {
      setChestLoading(true);
      const lastOpened = await AsyncStorage.getItem(DAILY_CHEST_KEY);
      if (lastOpened) {
        const diff = Date.now() - parseInt(lastOpened, 10);
        if (diff < CHEST_COOLDOWN) {
          setChestCooldown(CHEST_COOLDOWN - diff);
        } else {
          setChestCooldown(0);
        }
      } else {
        setChestCooldown(0);
      }
      setChestLoading(false);
    };
    checkCooldown();
  }, []);

  useEffect(() => {
    const checkReset = async () => {
      const reset = await AsyncStorage.getItem("DAILY_CHEST_RESET");
      if (reset) {
        setChestCooldown(0);
        await AsyncStorage.removeItem("DAILY_CHEST_RESET");
      }
    };
    const interval = setInterval(checkReset, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (task) => {
    try {
      const wasCompleted = task.completed;
      await tasksHook.updateTask(task.$id, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null,
      });

      if (!wasCompleted && user && awardXPForTask) {
        try {
          const result = await awardXPForTask(task.difficulty);
          Alert.alert(
            "Task Completed!",
            result.leveledUp
              ? " Congratulations on leveling up!"
              : `+${result.xpReward} XP earned!`
          );
        } catch (xpError) {
          Alert.alert("XP Award Failed", xpError.message);
        }
      }
    } catch (err) {
      Alert.alert("Task completion failed", err.message);
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

  const openChest = async () => {
    if (chestCooldown > 0) {
      Alert.alert(
        "Chest Cooldown",
        `You can open the chest again in ${Math.ceil(
          chestCooldown / 1000 / 60
        )} minutes.`
      );
      return;
    }
    const possibleRewards = [
      {
        name: "Ancient Parchment",
        description: "A mysterious parchment with faded runes.",
        image: "parchment.png",
        category: "Key Item",
        quantity: 1,
      },
      {
        name: "Golden Icon",
        description: "A shiny golden icon, symbol of achievement.",
        image: "icon.png",
        category: "Equipment",
        quantity: 1,
      },
      {
        name: "Explorer's Badge",
        description: "Awarded for discovering new lands.",
        image: "icon.png",
        category: "Consumable",
        quantity: 1,
      },
      {
        name: "Unsolved Cube",
        description: "Looks great on a shelf.",
        image: "unsolved_cube.png",
        category: "Consumable",
        quantity: 1,
      },
    ];
    const reward =
      possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
    await addItem(reward);
    setChestReward(reward);
    setChestModalVisible(true);
    await AsyncStorage.setItem(DAILY_CHEST_KEY, Date.now().toString());
    setChestCooldown(CHEST_COOLDOWN);
    fetchItems();
  };

  // Add a timer to update cooldown every second
  useEffect(() => {
    if (chestCooldown > 0) {
      const interval = setInterval(() => {
        setChestCooldown((prev) => (prev > 1000 ? prev - 1000 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [chestCooldown]);

  const difficultyColors = {
    easy: "#8bc34a",
    medium: "#ff9800",
    hard: "#d32f2f",
  };

  const renderTask = ({ item }) => (
    <TaskCard
      item={item}
      onPress={handleShowTaskDetail}
      onComplete={handleComplete}
      onDelete={tasksHook.deleteTask}
      difficultyColors={difficultyColors}
    />
  );

  const getProfilePictureUrl = () => {
    if (!profile?.profilePictureFileId) return null;
    const STORAGE_BUCKET_ID = Constants.expoConfig.extra.STORAGE_BUCKET_ID;
    return `https://nyc.cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${profile.profilePictureFileId}/view?project=686b296f003243270240`;
  };

  return (
    <ThemedView 
      style={styles.container} 
      safe={true}
    >
      <DailyChestButton
        onPress={openChest}
        cooldown={chestCooldown}
        loading={chestLoading}
      />
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
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <PullToRefresh 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
          />
        }
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

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading tasks...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
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
      <TaskDetailModal
        visible={taskDetailModalVisible}
        task={selectedTask}
        onClose={handleCloseTaskDetail}
      />
      <ChestRewardModal
        visible={chestModalVisible}
        reward={chestReward}
        onClose={() => setChestModalVisible(false)}
        itemImages={itemImages}
      />
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
});
