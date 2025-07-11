import { Pressable, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

function ThemedButton({ style, ...props }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#ffd700",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.8,
  },
});

export default ThemedButton;
