import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import Logo from "../assets/images/icon.png";
import Parchment from "../assets/images/parchment.png";
import ThemedView from "../components/ThemedView";

const tasks = [
  { id: "1", text: "Sample Task 1", difficulty: "easy", checked: false },
  { id: "2", text: "Sample Task 2", difficulty: "medium", checked: true },
];

const Home = () => {
  return (
    <ThemedView style={styles.root} safe={true}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navBrand}>XP List</Text>
        <View style={styles.navButtons}>
          <Link href="/profile" style={styles.navBtn}>
            Profile
          </Link>
          <Link href="/inventory" style={styles.navBtn}>
            Inventory
          </Link>
          <Link href="/signup" style={styles.navBtn}>
            Signup
          </Link>
          <Link href="/login" style={styles.navBtn}>
            Login
          </Link>
        </View>
      </View>

      <View style={styles.spriteBar}>
        <View style={styles.spriteVisual}>
          <View style={styles.playerSprite} />
        </View>
        <TouchableOpacity style={styles.spriteBtn}>
          <Text style={{ fontWeight: "bold" }}>{">"}</Text>
        </TouchableOpacity>
        <View style={styles.leveling}>
          <Text style={styles.levelText}>Level: 1</Text>
          <View style={styles.xpBar}>
            <View style={styles.xpProgress} />
          </View>
          <Text style={styles.xpText}>XP: 0/100</Text>
        </View>
      </View>

      <View style={styles.appWrapper}>
        <View style={styles.todoApp}>
          <View style={styles.todoHeader}>
            <Text style={styles.todoTitle}>To-Do</Text>
            <Image source={Parchment} style={styles.todoIcon} />
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Add your text"
              placeholderTextColor="#8b7b9e"
              maxLength={200}
            />
            <View style={styles.difficultySelect}>
              <Text style={styles.difficultyOption}>Easy</Text>
              <Text style={styles.difficultyOption}>Medium</Text>
              <Text style={styles.difficultyOption}>Hard</Text>
            </View>
            <TouchableOpacity style={styles.addBtn}>
              <Text>Add</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[styles.taskItem, item.checked && styles.checkedTask]}
              >
                <Text
                  style={styles[`difficulty${capitalize(item.difficulty)}`]}
                >
                  {item.difficulty}
                </Text>
                <Text style={styles.taskText}>{item.text}</Text>
                <TouchableOpacity>
                  <Text style={styles.deleteBtn}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          />
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
});
