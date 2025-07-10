import React, { useContext, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../../hooks/useUser";
import { Colors } from "../../constants/Colors";
import { LevelsContext } from "../../contexts/LevelsContext";

import ProfileIcon from "../../assets/images/icon.png";
import ThemedButton from "../../components/ThemedButton";

const Profile = () => {
  const { logout, user } = useUser();
  const { levelInfo, fetchLevelInfo, loading, error } =
    useContext(LevelsContext);
  const router = useRouter();

  useEffect(() => {
    if (user?.$id) {
      fetchLevelInfo(user.$id);
    }
  }, [user]);

  const handleLogout = () => {
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={Colors.text}></Text>

      <Image source={ProfileIcon} style={styles.avatar} />
      <Text style={styles.username}>{user?.email}</Text>
      <View style={styles.levelBox}>
        <Text style={styles.level}>Level: {levelInfo.level}</Text>
        <Text style={styles.xp}>
          XP: {levelInfo.currentLevelXP} / {levelInfo.xpToNextLevel}
        </Text>
        <Text style={styles.xp}>Total XP: {levelInfo.totalXP}</Text>
        {loading && <Text style={styles.xp}>Loading...</Text>}
        {error && (
          <Text style={[styles.xp, { color: "#d32f2f" }]}>{error}</Text>
        )}
      </View>

      <ThemedButton style={styles.btn} onPress={logout}>
        <Text style={styles.btnText}>Logout</Text>
      </ThemedButton>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2c2137",
    padding: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  username: {
    color: "#ffd700",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  levelBox: {
    backgroundColor: "#4a3f5c",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  level: {
    color: "#ffd700",
    fontWeight: "bold",
    fontSize: 18,
  },
  xp: {
    color: "#fff",
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#d32f2f",
    borderRadius: 8,
    padding: 12,
    width: 160,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
