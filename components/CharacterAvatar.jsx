import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { useCharacter } from "../contexts/CharacterContext";
import { useInventory } from "../hooks/useInventory";
import {
  BASE_CHARACTERS,
  FACE_VARIANTS,
  getCharacterKey,
  getEquipmentAsset,
} from "../assets/character";

const CharacterAvatar = ({
  size = 100,
  renderMode = "face", // "face" or "fullBody"
  customCharacter = null, // Override for preview
  style = {},
}) => {
  const { character } = useCharacter();
  const { items } = useInventory();

  const displayCharacter = customCharacter || character;

  if (!displayCharacter) {
    // Fallback to default icon if no character
    return (
      <Image
        source={require("../assets/images/icon.png")}
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: renderMode === "face" ? size / 2 : 8,
          },
          style,
        ]}
        resizeMode="cover"
      />
    );
  }

  const {
    skinTone,
    hairStyle,
    hairColor,
    headEquipment,
    bodyEquipment,
    weaponEquipment,
    accessoryEquipment,
  } = displayCharacter;

  const characterKey = getCharacterKey(skinTone, hairStyle, hairColor);
  const isFaceMode = renderMode === "face";

  // Get base character image
  const baseImage = isFaceMode
    ? FACE_VARIANTS[characterKey]
    : BASE_CHARACTERS[characterKey];

  // Helper function to get equipment item by ID
  const getEquipmentItem = (itemId) => {
    if (!itemId || !items) return null;
    return items.find((item) => item.$id === itemId);
  };

  // Get equipped items
  const headItem = getEquipmentItem(headEquipment);
  const bodyItem = getEquipmentItem(bodyEquipment);
  const weaponItem = getEquipmentItem(weaponEquipment);
  const accessoryItem = getEquipmentItem(accessoryEquipment);

  // Get equipment assets
  const headAsset = headItem
    ? getEquipmentAsset("head", headItem.equipmentAsset, isFaceMode)
    : null;
  const bodyAsset =
    bodyItem && !isFaceMode
      ? getEquipmentAsset("body", bodyItem.equipmentAsset)
      : null;
  const weaponAsset =
    weaponItem && !isFaceMode
      ? getEquipmentAsset("weapon", weaponItem.equipmentAsset)
      : null;
  const accessoryAsset =
    accessoryItem && !isFaceMode
      ? getEquipmentAsset("accessory", accessoryItem.equipmentAsset)
      : null;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
        style,
      ]}
    >
      {/* Base character */}
      <Image
        source={baseImage}
        style={[
          styles.layerImage,
          {
            width: size,
            height: size,
            borderRadius: isFaceMode ? size / 2 : 8,
          },
        ]}
        resizeMode="cover"
      />

      {/* Equipment layers */}
      {headAsset && (
        <Image
          source={headAsset}
          style={[
            styles.layerImage,
            styles.equipmentLayer,
            {
              width: size,
              height: size,
              borderRadius: isFaceMode ? size / 2 : 8,
            },
          ]}
          resizeMode="cover"
        />
      )}

      {bodyAsset && (
        <Image
          source={bodyAsset}
          style={[
            styles.layerImage,
            styles.equipmentLayer,
            {
              width: size,
              height: size,
              borderRadius: 8,
            },
          ]}
          resizeMode="cover"
        />
      )}

      {weaponAsset && (
        <Image
          source={weaponAsset}
          style={[
            styles.layerImage,
            styles.equipmentLayer,
            {
              width: size,
              height: size,
              borderRadius: 8,
            },
          ]}
          resizeMode="cover"
        />
      )}

      {accessoryAsset && (
        <Image
          source={accessoryAsset}
          style={[
            styles.layerImage,
            styles.equipmentLayer,
            {
              width: size,
              height: size,
              borderRadius: isFaceMode ? size / 2 : 8,
            },
          ]}
          resizeMode="cover"
        />
      )}

      {/* Border overlay for face mode */}
      {isFaceMode && (
        <View
          style={[
            styles.border,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  layerImage: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  equipmentLayer: {
    // Equipment layers stack on top
  },
  border: {
    position: "absolute",
    top: 0,
    left: 0,
    borderWidth: 3,
    borderColor: "#ffd700",
  },
});

export default CharacterAvatar;