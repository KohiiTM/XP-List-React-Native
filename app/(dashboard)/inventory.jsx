import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  useWindowDimensions,
  TextInput,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { Colors } from "@constants/Colors";
import ThemedView from "@components/ThemedView";
import { useInventory } from "@hooks/useInventory";
import PullToRefresh from "@components/PullToRefresh";
import { usePullToRefresh } from "@hooks/usePullToRefresh";
import { useCharacter } from "@contexts/CharacterContext";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToAppwrite } from "@components/ProfilePicturePicker";
import { CategoryTabs } from "@components/common";
import BaseModal from "@components/common/BaseModal";

import Parchment from "@assets/images/parchment.png";
import Icon from "@assets/images/icon.png";
import Unsolved_Cube from "@assets/images/unsolved_cube.png";

const CATEGORIES = ["All", "Consumable", "Key Item", "Equipment"];
const NUM_SLOTS = 12;
const NUM_COLUMNS = 4;
const SLOT_SIZE = Math.floor(
  (Dimensions.get("window").width - 60) / NUM_COLUMNS
);
const GRID_MAX_HEIGHT = Math.floor(Dimensions.get("window").height * 0.5);

const localItemImageMap = {
  "parchment.png": Parchment,
  "icon.png": Icon,
  "unsolved_cube.png": Unsolved_Cube,
};

const getImageSource = (item) => {
  if (!item) return Icon;

  // First, try to match by the image field
  if (item.image) {
    const imageKey = Object.keys(localItemImageMap).find(
      (key) => item.image.endsWith(key) || item.image === key
    );

    if (imageKey) {
      return localItemImageMap[imageKey];
    }
  }

  // Fallback: Try to match by item name to image mapping
  const nameToImageMap = {
    "Ancient Parchment": "parchment.png",
    "Golden Icon": "icon.png", 
    "Explorer's Badge": "icon.png",
    "Unsolved Cube": "unsolved_cube.png"
  };

  if (item.name && nameToImageMap[item.name]) {
    const fallbackImage = nameToImageMap[item.name];
    return localItemImageMap[fallbackImage];
  }

  return Icon;
};

const Inventory = () => {
  const { items, loading, error, fetchItems, addItem } = useInventory();
  const { character, equipItem, unequipItem } = useCharacter();
  const { refreshing, onRefresh } = usePullToRefresh(fetchItems);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const { height: windowHeight } = useWindowDimensions();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);


  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  // Calculate how many rows fit in the grid area
  const gridAreaHeight = windowHeight - 200; // Adjust 200 for header/tabs/margins
  const numRows = Math.ceil(gridAreaHeight / (SLOT_SIZE + 12)); // 12 = margin*2
  const minSlots = numRows * NUM_COLUMNS;

  // Fill up to minSlots with empty slots
  const slots = [...filteredItems];
  while (slots.length < minSlots) {
    slots.push(null);
  }


  const handleSlotPress = (item, index) => {
    if (item) {
      setModalItem(item);
      setModalVisible(true);
      setSelectedSlot(index);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalItem(null);
    setSelectedSlot(null);
  };

  const handleEquipItem = async (item) => {
    if (!item.isEquippable || !item.equipSlot) {
      Alert.alert("Error", "This item cannot be equipped");
      return;
    }

    try {
      await equipItem(item.$id, item.equipSlot);
      Alert.alert("Success", `${item.name} equipped successfully!`);
      handleCloseModal();
    } catch (error) {
      console.error("Equipment failed:", error);
    }
  };

  const handleUnequipItem = async (slot) => {
    try {
      await unequipItem(slot);
      Alert.alert("Success", "Item unequipped successfully!");
    } catch (error) {
      console.error("Unequip failed:", error);
    }
  };

  const isItemEquipped = (item) => {
    if (!character || !item.isEquippable) return false;
    const slotField = `${item.equipSlot}Equipment`;
    return character[slotField] === item.$id;
  };

  const renderSlot = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.slot,
        selectedSlot === index && styles.slotSelected,
        !item && styles.emptySlot,
        item && isItemEquipped(item) && styles.equippedSlot,
      ]}
      onPress={() => handleSlotPress(item, index)}
      activeOpacity={item ? 0.7 : 1}
    >
      {item ? (
        <>
          <Image
            source={getImageSource(item)}
            style={styles.slotImg}
            resizeMode="contain"
          />
          <Text style={styles.slotQty}>x{item.quantity}</Text>
          {isItemEquipped(item) && (
            <View style={styles.equippedIndicator}>
              <Text style={styles.equippedText}>E</Text>
            </View>
          )}
        </>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container} safe={true}>
      <Text style={styles.title}>Inventory</Text>
      <CategoryTabs
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        scrollable={false}
      />
      <View style={styles.gridContainer}>
        <FlatList
          data={slots}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={renderSlot}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.grid}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <PullToRefresh refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <BaseModal
        visible={modalVisible}
        onClose={handleCloseModal}
        title={modalItem?.name || "Item Details"}
        animationType="fade"
      >
        {modalItem && (
          <View style={styles.modalContentWrapper}>
            <Image
              source={getImageSource(modalItem)}
              style={styles.modalImg}
              resizeMode="contain"
            />
            <Text style={styles.modalCategory}>{modalItem.category}</Text>
            <Text style={styles.modalDesc}>{modalItem.description}</Text>
            <Text style={styles.modalQty}>
              Quantity: {modalItem.quantity}
            </Text>
            {modalItem.isEquippable && (
              <View style={styles.equipmentActions}>
                {isItemEquipped(modalItem) ? (
                  <TouchableOpacity
                    style={styles.unequipButton}
                    onPress={() => handleUnequipItem(modalItem.equipSlot)}
                  >
                    <Text style={styles.unequipButtonText}>Unequip</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.equipButton}
                    onPress={() => handleEquipItem(modalItem)}
                  >
                    <Text style={styles.equipButtonText}>Equip</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </BaseModal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Colors.dark.background,
    paddingTop: 30,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 10,
    color: Colors.dark.accent,
    fontFamily: "monospace",
    letterSpacing: 2,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    paddingBottom: 50,
  },
  gridContainer: {
    flex: 1,
    width: "100%",
  },
  grid: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    minHeight: 320,
  },
  slot: {
    width: SLOT_SIZE,
    height: SLOT_SIZE,
    margin: 6,
    backgroundColor: Colors.dark.secondary,
    borderWidth: 3,
    borderColor: Colors.dark.accent,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  slotSelected: {
    borderColor: Colors.dark.text,
    backgroundColor: Colors.dark.accent,
  },
  emptySlot: {
    backgroundColor: Colors.dark.background,
    borderColor: Colors.dark.border,
  },
  equippedSlot: {
    borderColor: Colors.dark.accent,
    backgroundColor: Colors.dark.secondary,
    shadowColor: Colors.dark.accent,
    shadowOpacity: 0.3,
  },
  equippedIndicator: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: Colors.dark.accent,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  equippedText: {
    color: Colors.dark.background,
    fontSize: 10,
    fontWeight: "bold",
  },
  slotImg: {
    width: SLOT_SIZE * 0.6,
    height: SLOT_SIZE * 0.6,
    marginBottom: 4,
  },
  slotQty: {
    color: Colors.dark.text,
    fontWeight: "bold",
    fontSize: 13,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    fontFamily: "monospace",
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.accent,
    color: Colors.dark.text,
  },
  modalContentWrapper: {
    alignItems: "center",
    paddingVertical: 10,
  },
  modalImg: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalCategory: {
    fontSize: 14,
    color: Colors.dark.accent,
    marginBottom: 5,
    fontFamily: "monospace",
  },
  modalDesc: {
    fontSize: 13,
    color: Colors.dark.text,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "monospace",
  },
  modalQty: {
    fontSize: 14,
    color: Colors.dark.accent,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  equipmentActions: {
    marginTop: 16,
    alignItems: "center",
  },
  equipButton: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  equipButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  unequipButton: {
    backgroundColor: Colors.dark.border,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  unequipButtonText: {
    color: Colors.dark.text,
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default Inventory;
