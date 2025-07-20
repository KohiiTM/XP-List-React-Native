import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "../lib/appwrite";
import { ID } from "react-native-appwrite";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";

export async function uploadImageToAppwrite(imagePickerAsset) {
  const STORAGE_BUCKET_ID = Constants.expoConfig.extra.STORAGE_BUCKET_ID;
  if (!STORAGE_BUCKET_ID) {
    throw new Error("Storage bucket ID not configured");
  }
  const { uri, fileName, type, fileSize } = imagePickerAsset;
  const fileInfo = await FileSystem.getInfoAsync(uri);
  if (!fileInfo.exists) {
    throw new Error("File does not exist");
  }
  const fileToUpload = {
    name: fileName || uri.split("/").pop(),
    type: type || "image/jpeg",
    size: fileSize || fileInfo.size,
    uri: uri,
  };
  const fileId = ID.unique();
  const uploadedFile = await storage.createFile(
    STORAGE_BUCKET_ID,
    fileId,
    fileToUpload
  );
  if (uploadedFile && uploadedFile.$id) {
    // Construct the public URL
    const url = `https://nyc.cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=686b296f003243270240`;
    return url;
  } else {
    throw new Error("Upload failed - invalid response");
  }
}

const ProfilePicturePicker = ({
  currentImageUrl,
  onImageUpdate,
  size = 100,
}) => {
  const [uploading, setUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant camera roll permissions to select a profile picture."
      );
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant camera permissions to take a profile picture."
      );
      return false;
    }
    return true;
  };

  const uploadImage = async (imagePickerAsset) => {
    setUploading(true);
    try {
      const STORAGE_BUCKET_ID = Constants.expoConfig.extra.STORAGE_BUCKET_ID;

      if (!STORAGE_BUCKET_ID) {
        throw new Error("Storage bucket ID not configured");
      }

      const { uri, fileName, type, fileSize } = imagePickerAsset;
      console.log("Starting upload for URI:", uri);

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(uri);
      console.log("File info:", fileInfo);

      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      // Construct the file object for Appwrite
      const fileToUpload = {
        name: fileName || uri.split("/").pop(),
        type: type || "image/jpeg",
        size: fileSize || fileInfo.size,
        uri: uri,
      };

      console.log("File object being sent to Appwrite:", fileToUpload);

      const fileId = ID.unique();
      console.log("Generated file ID:", fileId);

      const uploadedFile = await storage.createFile(
        STORAGE_BUCKET_ID,
        fileId,
        fileToUpload
      );

      console.log("Upload completed, response:", uploadedFile);

      if (uploadedFile && uploadedFile.$id) {
        console.log("Upload successful, file ID:", uploadedFile.$id);
        onImageUpdate(uploadedFile.$id);
        setShowOptions(false);
      } else {
        throw new Error("Upload failed - invalid response");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert(
        "Upload Failed",
        `Failed to upload profile picture: ${error.message}`
      );
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      await uploadImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      await uploadImage(result.assets[0]);
    }
  };

  const handlePress = () => {
    setShowOptions(true);
  };

  console.log("ProfilePicturePicker - currentImageUrl:", currentImageUrl);

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <Image
          source={
            currentImageUrl
              ? { uri: currentImageUrl }
              : require("../assets/images/icon.png")
          }
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: currentImageUrl ? "#3a2f4c" : "transparent",
            },
          ]}
          onError={(error) => console.log("Image loading error:", error)}
          onLoad={() =>
            console.log("Image loaded successfully:", currentImageUrl)
          }
          resizeMode="cover"
        />
        <View style={styles.editButton}>
          <Ionicons name="camera" size={16} color="#fff" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={showOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Profile Picture</Text>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={takePhoto}
              disabled={uploading}
            >
              <Ionicons name="camera" size={24} color="#ffd700" />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={pickImage}
              disabled={uploading}
            >
              <Ionicons name="images" size={24} color="#ffd700" />
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, styles.cancelButton]}
              onPress={() => setShowOptions(false)}
              disabled={uploading}
            >
              <Ionicons name="close" size={24} color="#d32f2f" />
              <Text style={[styles.optionText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>

            {uploading && (
              <View style={styles.uploadingContainer}>
                <Text style={styles.uploadingText}>Uploading...</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  image: {
    borderWidth: 3,
    borderColor: "#ffd700",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3a2f4c",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2c2137",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#3a2f4c",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 300,
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
    color: "#ffd700",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#2c2137",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: "#d32f2f",
  },
  cancelText: {
    color: "#fff",
  },
  uploadingContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  uploadingText: {
    color: "#8b7b9e",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ProfilePicturePicker;
