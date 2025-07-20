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
} from "react-native";
import { Link } from "expo-router";
import { Colors } from "@constants/Colors";
import ThemedView from "@components/ThemedView";
import useInventory from "@hooks/useInventory";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToAppwrite } from "@components/ProfilePicturePicker";

const CATEGORIES = ["All", "Consumable", "Key Item", "Equipment"];
const NUM_SLOTS = 12;
const NUM_COLUMNS = 4;
const SLOT_SIZE = Math.floor(
  (Dimensions.get("window").width - 60) / NUM_COLUMNS
);
const GRID_MAX_HEIGHT = Math.floor(Dimensions.get("window").height * 0.5);

const getImageSource = (item) => {
  if (!item) return null;
  if (item.imageUrl && item.imageUrl.startsWith("http")) {
    return { uri: item.imageUrl };
  }
  // fallback for legacy items
  if (item.image === "parchment.png")
    return require("../../assets/images/parchment.png");
  return require("../../assets/images/icon.png");
};

const Inventory = () => {
  const { items, loading, error, fetchItems, addItem } = useInventory();
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

  const renderCategory = (cat) => (
    <TouchableOpacity
      key={cat}
      style={[
        styles.categoryTab,
        selectedCategory === cat && styles.categoryTabActive,
      ]}
      onPress={() => setSelectedCategory(cat)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === cat && styles.categoryTextActive,
        ]}
      >
        {cat}
      </Text>
    </TouchableOpacity>
  );

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

  const renderSlot = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.slot,
        selectedSlot === index && styles.slotSelected,
        !item && styles.emptySlot,
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
        </>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container} safe={true}>
      <Text style={styles.title}>Inventory</Text>
      <View style={styles.categoriesRow}>{CATEGORIES.map(renderCategory)}</View>
      <View style={styles.gridContainer}>
        <FlatList
          data={slots}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={renderSlot}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.grid}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
        />
      </View>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseModal}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {modalItem && (
              <>
                <Image
                  source={getImageSource(modalItem)}
                  style={styles.modalImg}
                  resizeMode="contain"
                />
                <Text style={styles.modalTitle}>{modalItem.name}</Text>
                <Text style={styles.modalCategory}>{modalItem.category}</Text>
                <Text style={styles.modalDesc}>{modalItem.description}</Text>
                <Text style={styles.modalQty}>
                  Quantity: {modalItem.quantity}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  categoriesRow: {
    flexDirection: "row",
    marginBottom: 18,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  categoryTab: {
    backgroundColor: "#2c2137",
    borderWidth: 2,
    borderColor: "#ffd700",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 2,
    marginBottom: 2,
  },
  categoryTabActive: {
    backgroundColor: "#ffd700",
    borderColor: "#fff",
  },
  categoryText: {
    color: "#ffd700",
    fontWeight: "bold",
    fontFamily: "monospace",
    fontSize: 14,
  },
  categoryTextActive: {
    color: "#2c2137",
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
    backgroundColor: "#3a2f4c",
    borderWidth: 3,
    borderColor: "#ffd700",
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
    borderColor: "#fff",
    backgroundColor: "#ffd700",
  },
  emptySlot: {
    backgroundColor: "#2c2137",
    borderColor: "#8b7b9e",
  },
  slotImg: {
    width: SLOT_SIZE * 0.6,
    height: SLOT_SIZE * 0.6,
    marginBottom: 4,
  },
  slotQty: {
    color: "#fff",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.dark.background,
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImg: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 5,
    color: Colors.dark.accent,
    fontFamily: "monospace",
  },
  modalCategory: {
    fontSize: 14,
    color: "#ffd700",
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
    color: "#ffd700",
    fontWeight: "bold",
    fontFamily: "monospace",
  },
});

export default Inventory;
