import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

const Tasks = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks Page</Text>
      <Text style={styles.subtitle}>Your tasks will appear here.</Text>
      <Link href="/" style={styles.link}>
        Home
      </Link>
    </View>
  );
};

export default Tasks;

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
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ffd700",
    color: "#ffd700",
    fontSize: 16,
  },
});
