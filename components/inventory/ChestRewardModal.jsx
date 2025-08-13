import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@constants/Colors";
import BaseModal from "@components/common/BaseModal";

const ChestRewardModal = ({ visible, reward, onClose, itemImages = {} }) => {
  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Chest Reward"
      animationType="fade"
      showCloseButton={false}
      closeOnOverlayPress={true}
    >
      {reward && (
        <View style={styles.content}>
          <Ionicons
            name="cube"
            size={48}
            color={Colors.dark.accent}
            style={styles.icon}
          />
          <Text style={styles.title}>You received:</Text>
          <Image
            source={itemImages[reward.image]}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.itemName}>{reward.name}</Text>
          <Text style={styles.description}>
            {reward.description}
          </Text>
        </View>
      )}
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    paddingVertical: 10,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    color: Colors.dark.accent,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  itemName: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  description: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
});

export default ChestRewardModal;