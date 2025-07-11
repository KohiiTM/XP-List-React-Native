import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../../hooks/useUser";
import { Colors } from "../../constants/Colors";
import { useLeveling } from "../../hooks/useLeveling";
import Constants from "expo-constants";
import { databases, account } from "../../lib/appwrite";
import LevelDisplay from "../../components/LevelDisplay";

import ProfileIcon from "../../assets/images/icon.png";
import ThemedButton from "../../components/ThemedButton";

const Profile = () => {
  const { logout, user } = useUser();
  const { levelInfo, loading, error, awardXPForTask } = useLeveling();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [updating, setUpdating] = useState(false);

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

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete user document from database
              const DATABASE_ID = Constants.expoConfig.extra.DATABASE_ID;
              const COLLECTION_ID = Constants.expoConfig.extra.COLLECTION_ID;

              await databases.deleteDocument(
                DATABASE_ID,
                COLLECTION_ID,
                user.$id
              );

              // Delete user account from Appwrite
              await account.delete();

              // Log out and redirect to login
              logout();
              router.replace("/login");

              Alert.alert(
                "Account Deleted",
                "Your account has been successfully deleted."
              );
            } catch (error) {
              console.error("Failed to delete account:", error);
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleEditUsername = () => {
    setNewUsername(profile?.username || "");
    setEditModalVisible(true);
  };

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    if (!user?.$id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setUpdating(true);
    try {
      const DATABASE_ID = Constants.expoConfig.extra.DATABASE_ID;
      const COLLECTION_ID = Constants.expoConfig.extra.COLLECTION_ID;

      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, user.$id, {
        username: newUsername.trim(),
      });

      // Update local state
      setProfile((prev) => ({
        ...prev,
        username: newUsername.trim(),
      }));

      setEditModalVisible(false);
      Alert.alert("Success", "Username updated successfully!");
    } catch (err) {
      Alert.alert("Error", "Failed to update username. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setNewUsername("");
  };

  // const handleTestXP = async () => {
  //   try {
  //     console.log("Testing XP award...")
  //     const result = await awardXPForTask("easy")
  //     console.log("Test XP result:", result)
  //     Alert.alert("Test XP", `Awarded ${result.xpReward} XP!`)
  //   } catch (err) {
  //     console.error("Test XP failed:", err)
  //     Alert.alert("Test XP Failed", err.message)
  //   }
  // }

  return (
    <View style={styles.container}>
      <Text style={Colors.text}></Text>

      <Image source={ProfileIcon} style={styles.avatar} />
      {profileLoading ? (
        <Text style={styles.username}>Loading...</Text>
      ) : profileError ? (
        <Text style={styles.username}>Error</Text>
      ) : (
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>
            {profile?.username || "No username"}
          </Text>
          <TouchableOpacity
            onPress={handleEditUsername}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}
      <LevelDisplay
        level={levelInfo.level}
        currentLevelXP={levelInfo.currentLevelXP}
        xpToNextLevel={levelInfo.xpToNextLevel}
        totalXP={levelInfo.totalXP}
        levelTitle={levelInfo.levelTitle}
        levelColor={levelInfo.levelColor}
        consecutiveCompletions={levelInfo.consecutiveCompletions}
        showStreak={false}
      />

      <ThemedButton style={styles.btn} onPress={handleLogout}>
        <Text style={styles.btnText}>Logout</Text>
      </ThemedButton>

      <ThemedButton
        style={[styles.btn, { marginTop: 12, backgroundColor: "#d32f2f" }]}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.btnText}>Delete Account</Text>
      </ThemedButton>

      {/* <ThemedButton */}
      {/*   style={[styles.btn, { marginTop: 12, backgroundColor: "#4CAF50" }]} */}
      {/*   onPress={handleTestXP} */}
      {/* > */}
      {/*   <Text style={styles.btnText}>Test XP Award</Text> */}
      {/* </ThemedButton> */}

      {/* Edit Username Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Username</Text>
            <TextInput
              style={styles.usernameInput}
              placeholder="Enter new username"
              value={newUsername}
              onChangeText={setNewUsername}
              placeholderTextColor={Colors.dark.textSecondary}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleCancelEdit}
                disabled={updating}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveUsername}
                disabled={updating}
              >
                <Text style={styles.saveBtnText}>
                  {updating ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  editButton: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    alignItems: "stretch",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark.accent,
    marginBottom: 16,
    textAlign: "center",
  },
  usernameInput: {
    backgroundColor: Colors.dark.background,
    color: Colors.dark.text,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  cancelBtn: {
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: Colors.dark.border,
  },
  cancelBtnText: {
    color: Colors.dark.text,
    fontWeight: "bold",
  },
  saveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: Colors.dark.accent,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
