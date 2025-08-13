import React, { useState } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Colors } from "@constants/Colors";
import { useUser } from "@hooks/useUser";

import ThemedTextInput from "@components/common/ThemedTextInput";
import ActionButton from "@components/common/ActionButton";
import ThemedView from "@components/ThemedView";
import Spacer from "@components/Spacer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const { login } = useUser();

  const handleSubmit = async () => {
    setError(null);

    try {
      await login(email, password);
    } catch (error) {
      setError(error?.message || String(error) || "Unknown error");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <Text style={styles.title}>Login to XP List</Text>
        <ThemedTextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email"
          containerStyle={styles.inputContainer}
        />
        <ThemedTextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          label="Password"
          containerStyle={styles.inputContainer}
        />

        <ActionButton
          variant="primary"
          title="Login"
          onPress={handleSubmit}
          fullWidth
          style={styles.loginButton}
        />

        <Spacer />
        {error && <Text style={styles.error}>{error}</Text>}

        <Link href="/signup" style={[styles.link, { marginTop: 100 }]}>
          Don't have an account? Sign up
        </Link>
        <View style={{ alignItems: "center", marginTop: 24 }}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://kohiitm.github.io/xplist-privacy-policy/")
            }
          >
            <Text style={[styles.privacyText]}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.background,
    padding: 24,
  },
  title: {
    color: Colors.dark.accent,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 320,
  },
  loginButton: {
    width: "100%",
    maxWidth: 320,
    marginBottom: 16,
  },
  link: {
    color: Colors.dark.accent,
    marginTop: 8,
    textDecorationLine: "underline",
  },
  privacyText: {
    color: Colors.dark.text,
    textDecorationLine: "underline",
  },
  error: {
    color: Colors.dark.error,
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
    marginHorizontal: 10,
    backgroundColor: Colors.dark.card,
  },
});

/*
    background: "#2c2137",
    card: "#4a3f5c",
    secondary: "#3a2f4c",
    border: "#8b7b9e",
    accent: "#ffd700",
    text: "#fff",
    textSecondary: "#8b7b9e",
    easy: "#8bc34a",
    medium: "#ff9800",
    hard: "#d32f2f",
    error: "#d32f2f",
    success: "#4caf50",
    info: "#2196f3",
    sidebar: "#4a3f5c",
    spriteBg: "#3a2f4c",
    xpBar: "#ffd700",
    xpBarBg: "#3a2f4c",
    button: "#ffd700",
    buttonText: "#2c2137",
    toastBg: "#3a2f4c",
    toastText: "#fff",
  },
  */
