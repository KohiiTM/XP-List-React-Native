import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import ThemedView from "../../components/ThemedView";
import LevelHistoryTabs from "../../components/LevelHistoryTabs";
import { useTasks } from "../../hooks/useTasks";
import { useLocalTasks } from "../../hooks/useLocalTasks";
import { useUser } from "../../hooks/useUser";

const History = () => {
  const { user } = useUser();
  const cloudTasks = useTasks();
  const localTasks = useLocalTasks();
  const { tasks, loading, error, fetchTasks } = user ? cloudTasks : localTasks;

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <ThemedView style={styles.container} safe={true}>
      <Text style={styles.title}>History</Text>
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <LevelHistoryTabs tasks={tasks} />
      )}
    </ThemedView>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Colors.dark.background,
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 20,
    color: Colors.dark.accent,
    textAlign: "center",
  },
  loading: {
    color: Colors.dark.accent,
    marginTop: 40,
    textAlign: "center",
  },
  error: {
    color: Colors.dark.error,
    marginTop: 40,
    textAlign: "center",
  },
});
