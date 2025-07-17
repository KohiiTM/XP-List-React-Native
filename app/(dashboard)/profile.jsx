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
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../../hooks/useUser";
import { Colors } from "../../constants/Colors";
import { useLeveling } from "../../hooks/useLeveling";
import Constants from "expo-constants";
import { databases, account } from "../../lib/appwrite";
import { storage, client } from "../../lib/appwrite";
import LevelDisplay from "../../components/LevelDisplay";
import { Ionicons } from "@expo/vector-icons";
import ProfilePicturePicker from "../../components/ProfilePicturePicker";

import ProfileIcon from "../../assets/images/icon.png";

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
  const [profilePictureFileId, setProfilePictureFileId] = useState(null);

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
        setProfilePictureFileId(doc.profilePictureFileId || null);
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
              const DATABASE_ID = Constants.expoConfig.extra.DATABASE_ID;
              const COLLECTION_ID = Constants.expoConfig.extra.COLLECTION_ID;

              await databases.deleteDocument(
                DATABASE_ID,
                COLLECTION_ID,
                user.$id
              );

              await account.delete();

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

  const handleProfilePictureUpdate = async (fileId) => {
    try {
      const DATABASE_ID = Constants.expoConfig.extra.DATABASE_ID;
      const COLLECTION_ID = Constants.expoConfig.extra.COLLECTION_ID;

      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, user.$id, {
        profilePictureFileId: fileId,
      });

      setProfilePictureFileId(fileId);
      setProfile((prev) => ({
        ...prev,
        profilePictureFileId: fileId,
      }));

      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      console.error("Failed to update profile picture:", error);
      Alert.alert(
        "Error",
        "Failed to update profile picture. Please try again."
      );
    }
  };

  const getProfilePictureUrl = () => {
    if (!profilePictureFileId) return null;
    const STORAGE_BUCKET_ID = Constants.expoConfig.extra.STORAGE_BUCKET_ID;
    const imageUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${profilePictureFileId}/view?project=686b296f003243270240`;
    console.log("Generated image URL:", imageUrl);
    console.log("File ID:", profilePictureFileId);
    console.log("Storage Bucket ID:", STORAGE_BUCKET_ID);
    return imageUrl;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <ProfilePicturePicker
              currentImageUrl={getProfilePictureUrl()}
              onImageUpdate={handleProfilePictureUpdate}
              size={100}
            />
          </View>

          {profileLoading ? (
            <Text style={styles.username}>Loading...</Text>
          ) : profileError ? (
            <Text style={styles.username}>Error</Text>
          ) : (
            <View style={styles.usernameSection}>
              <Text style={styles.username}>
                {profile?.username || "No username"}
              </Text>
              <TouchableOpacity
                onPress={handleEditUsername}
                style={styles.editButton}
              >
                <Ionicons name="pencil" size={16} color="#ffd700" />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View
          style={{
            width: "95%",
            height: 100,
            borderRadius: 50,
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
            backgroundColor: "transparent",
            paddingHorizontal: 16,
            marginBottom: 24,
          }}
        >
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
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    backgroundColor: "#2c2137",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  usernameSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    color: "#ffd700",
    fontSize: 28,
    fontWeight: "700",
    marginRight: 8,
  },
  editButton: {
    padding: 8,
  },
  email: {
    color: "#8b7b9e",
    fontSize: 16,
    fontWeight: "500",
  },
  levelCard: {
    backgroundColor: "#3a2f4c",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionsSection: {
    gap: 16,
  },
  actionButton: {
    backgroundColor: "#3a2f4c",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  deleteButton: {
    backgroundColor: "#d32f2f",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.dark.accent,
    marginBottom: 16,
    textAlign: "center",
  },
  usernameInput: {
    backgroundColor: Colors.dark.background,
    color: Colors.dark.text,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: Colors.dark.border,
    alignItems: "center",
  },
  cancelBtnText: {
    color: Colors.dark.text,
    fontWeight: "600",
    fontSize: 16,
  },
  saveBtn: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: Colors.dark.accent,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
