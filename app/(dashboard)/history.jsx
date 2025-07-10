import { StyleSheet, Text, View, Image } from "react-native";
import Logo from "../../assets/images/icon.png";
import { Link } from "expo-router";
import { Colors } from "../../constants/Colors";

const History = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>

      <Link href="/" style={styles.link}>
        Home
      </Link>
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center", // fixed typo
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 30,
    color: Colors.dark.accent,
  },
  card: {
    backgroundColor: Colors.dark.card,
    padding: 20,
    borderRadius: 8,
    // boxShadow is not supported in React Native, so omit or use elevation if needed
  },
  img: {
    marginVertical: 20,
    maxHeight: 40,
    maxWidth: 40,
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.accent,
    color: Colors.dark.text,
  },
});
