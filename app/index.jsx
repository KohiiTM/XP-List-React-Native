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
} from "react-native";
import { Link, useRouter, usePathname } from "expo-router";
import Logo from "../assets/images/icon.png";
import Parchment from "../assets/images/parchment.png";
import ThemedView from "../components/ThemedView";
import { useUser } from "../hooks/useUser";
import { useLeveling } from "../hooks/useLeveling";
import Constants from "expo-constants";
import { databases } from "../lib/appwrite";
import { useTasks } from "../hooks/useTasks";
import { useLocalTasks } from "../hooks/useLocalTasks";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import LevelDisplay from "../components/LevelDisplay";

import { Colors } from "../constants/Colors";

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

      // Award XP if task was just completed and user is authenticated
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

  const difficultyColors = {
    easy: "#8bc34a",
    medium: "#ff9800",
    hard: "#d32f2f",
  };

  const renderTask = ({ item }) => (
    <View style={[styles.taskItem, item.completed && styles.checkedTask]}>
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

      <Text
        style={{
          color: difficultyColors[item.difficulty] || "#fff",
          fontWeight: "bold",
          marginRight: 4,
        }}
      >
        {item.difficulty}
      </Text>
      <Text style={styles.taskText}>{item.title}</Text>
      <TouchableOpacity onPress={() => deleteTask(item.$id)}>
        <Text style={styles.deleteBtn}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const bottomNavItems = [
    { name: "Home", icon: "home-outline", focusedIcon: "home", href: "/" },
    {
      name: "Profile",
      icon: "person-outline",
      focusedIcon: "person",
      href: "/profile",
    },
    {
      name: "Inventory",
      icon: "diamond-outline",
      focusedIcon: "diamond",
      href: "/inventory",
    },
    {
      name: "Tasks",
      icon: "list-outline",
      focusedIcon: "list",
      href: "/tasks",
    },
    {
      name: "History",
      icon: "time-outline",
      focusedIcon: "time",
      href: "/history",
    },
  ];

  return (
    <ThemedView style={styles.root} safe={true}>
      {user &&
        (profileLoading ? (
          <Text style={styles.username}>Loading...</Text>
        ) : profileError ? (
          <Text style={styles.username}>Error</Text>
        ) : (
          <Text style={styles.username}>
            {profile?.username || "No username"}
          </Text>
        ))}
      {/*Icon Navbar*/}
      <View style={styles.iconNavbarBottom}>
        {bottomNavItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/" || pathname === "" || pathname === "/index"
              : pathname === item.href;
          return (
            <Link key={item.name} href={item.href} style={styles.iconNavBtn}>
              <View style={styles.iconWithLabel}>
                <Ionicons
                  name={isActive ? item.focusedIcon : item.icon}
                  size={24}
                  color={isActive ? theme.iconColorFocused : theme.iconColor}
                />
                <Text
                  style={[
                    styles.iconNavLabel,
                    {
                      color: isActive
                        ? theme.iconColorFocused
                        : theme.iconColor,
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </View>
            </Link>
          );
        })}
      </View>
      {}
      {}
      {user && (
        <LevelDisplay
          level={levelInfo.level}
          currentLevelXP={levelInfo.currentLevelXP}
          xpToNextLevel={levelInfo.xpToNextLevel}
          totalXP={levelInfo.totalXP}
          levelTitle={levelInfo.levelTitle}
          levelColor={levelInfo.levelColor}
          consecutiveCompletions={levelInfo.consecutiveCompletions}
          compact={true}
        />
      )}
      <View style={styles.appWrapper}>
        <View style={styles.todoApp}>
          <View style={styles.todoHeader}>
            <Text style={styles.todoTitle}>To-Do</Text>
            <Image source={Parchment} style={styles.todoIcon} />
          </View>
          {tasksLoading ? (
            <Text
              style={{ color: "#fff", textAlign: "center", marginVertical: 16 }}
            >
              Loading tasks...
            </Text>
          ) : tasksError ? (
            <Text
              style={{
                color: "#d32f2f",
                textAlign: "center",
                marginVertical: 16,
              }}
            >
              {tasksError}
            </Text>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.$id}
              renderItem={renderTask}
              ListEmptyComponent={
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    marginVertical: 16,
                  }}
                >
                  No tasks found.
                </Text>
              }
            />
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.clearBtn}>
        <Text>Clear All Data</Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default Home;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#2c2137",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    minHeight: 36,
    backgroundColor: "transparent",
  },
  navBrand: {
    color: "#ffd700",
    fontSize: 18,
    fontWeight: "bold",
  },
  navButtons: {
    flexDirection: "row",
    gap: 8,
  },
  navBtn: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 15,
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ffd700",
  },
  spriteBar: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    gap: 12,
  },
  spriteVisual: {
    width: 64,
    height: 64,
    backgroundColor: "#3a2f4c",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  playerSprite: {
    width: 48,
    height: 48,
    backgroundColor: "#ffd700",
    borderRadius: 8,
  },
  spriteBtn: {
    backgroundColor: "#eee",
    borderRadius: 999,
    padding: 8,
    marginHorizontal: 8,
  },
  leveling: {
    marginLeft: 12,
    alignItems: "flex-start",
  },
  levelText: {
    color: "#ffd700",
    fontWeight: "bold",
    fontSize: 16,
  },
  xpBar: {
    width: 100,
    height: 8,
    backgroundColor: "#3a2f4c",
    borderRadius: 4,
    marginVertical: 4,
    overflow: "hidden",
  },
  xpProgress: {
    width: "30%",
    height: 8,
    backgroundColor: "#ffd700",
    borderRadius: 4,
  },
  xpText: {
    color: "#fff",
    fontSize: 12,
  },
  appWrapper: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 8,
    marginTop: 8,
  },
  sidebar: {
    width: 40,
    backgroundColor: "#4a3f5c",
    borderRadius: 12,
    padding: 8,
    marginRight: 8,
  },
  sidebarTitle: {
    color: "#ffd700",
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 14,
  },
  noLevels: {
    color: "#fff",
    fontStyle: "italic",
    marginTop: 16,
  },
  levelTab: {
    backgroundColor: "#3a2f4c",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  levelNumber: {
    color: "#ffd700",
    fontWeight: "bold",
  },
  levelDate: {
    color: "#fff",
    fontSize: 10,
  },
  todoApp: {
    flex: 1,
    backgroundColor: "#4a3f5c",
    borderRadius: 16,
    padding: 16,
  },
  todoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  todoTitle: {
    color: "#ffd700",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  todoIcon: {
    width: 30,
    height: 30,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a2f4c",
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    padding: 8,
    backgroundColor: "transparent",
  },
  difficultySelect: {
    flexDirection: "row",
    gap: 4,
    marginHorizontal: 8,
  },
  difficultyOption: {
    color: "#ffd700",
    marginHorizontal: 2,
    fontSize: 12,
  },
  addBtn: {
    backgroundColor: "#ffd700",
    padding: 8,
    borderRadius: 8,
    marginLeft: 4,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a2f4c",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  checkboxContainer: {
    marginRight: 8,
    justifyContent: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
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
  checkedTask: {
    opacity: 0.7,
  },
  taskText: {
    color: "#fff",
    flex: 1,
    marginLeft: 8,
  },
  deleteBtn: {
    color: "#d32f2f",
    fontSize: 18,
    marginLeft: 8,
  },
  difficultyEasy: {
    color: "#8bc34a",
    fontWeight: "bold",
    marginRight: 4,
  },
  difficultyMedium: {
    color: "#ff9800",
    fontWeight: "bold",
    marginRight: 4,
  },
  difficultyHard: {
    color: "#d32f2f",
    fontWeight: "bold",
    marginRight: 4,
  },
  clearBtn: {
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 999,
    alignItems: "center",
    margin: 16,
  },
  username: {
    color: "#ffd700",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 4,
    textAlign: "center",
  },
  iconNavbar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
    marginTop: 8,
    marginBottom: 8,
  },
  iconNavBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
  iconWithLabel: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconNavLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 2,
    fontWeight: "bold",
  },
  iconNavbarBottom: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#2c2137",
    paddingTop: 10,
    height: 90,
    borderTopWidth: 1,
    borderTopColor: "#3a2f4c",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});
