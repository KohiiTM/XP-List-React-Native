import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

const TasksOverview = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks Overview</Text>
      <Text style={styles.subtitle}>
        Welcome to your Tasks Dashboard! Here you can get a quick summary of
        your tasks and navigate to manage them in detail.
      </Text>
      <Link href="/@tasks" style={styles.link}>
        Go to Task Manager
      </Link>
    </View>
  );
};

export default TasksOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2c2137",
    padding: 24,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    color: "#ffd700",
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ffd700",
    color: "#ffd700",
    fontSize: 16,
  },
});
