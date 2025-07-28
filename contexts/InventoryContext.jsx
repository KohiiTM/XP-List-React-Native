import {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import Constants from "expo-constants";
import { databases } from "../lib/appwrite";
import { ID, Permission, Query } from "react-native-appwrite";
import { Role } from "appwrite";
import { useUser } from "../hooks/useUser";
import { Alert } from "react-native";

const DATABASE_ID = Constants.expoConfig.extra.DATABASE_ID;
const INVENTORY_COLLECTION_ID =
  Constants.expoConfig.extra.INVENTORY_COLLECTION_ID;

export const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        INVENTORY_COLLECTION_ID,
        [Query.equal("userId", user.$id)]
      );
      setItems(res.documents);
    } catch (err) {
      setError(err?.message || String(err) || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addItem = useCallback(
    async (itemData) => {
      if (!user) {
        setError("User not authenticated");
        Alert.alert("Inventory Error", "User not authenticated");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        console.log("INVENTORY_COLLECTION_ID:", INVENTORY_COLLECTION_ID);
        console.log("DATABASE_ID:", DATABASE_ID);
        console.log("addItem called with:", itemData);
        // Check if the user already owns this item (by name)
        const res = await databases.listDocuments(
          DATABASE_ID,
          INVENTORY_COLLECTION_ID,
          [Query.equal("userId", user.$id), Query.equal("name", itemData.name)]
        );
        if (res.documents && res.documents.length > 0) {
          // Increment quantity
          const existing = res.documents[0];
          await databases.updateDocument(
            DATABASE_ID,
            INVENTORY_COLLECTION_ID,
            existing.$id,
            { quantity: (existing.quantity || 1) + (itemData.quantity || 1) }
          );
        } else {
          // Create new item
          // --- REMOVED DESTRUCTURING OF 'image' AND NOW INCLUDE IT ---
          await databases.createDocument(
            DATABASE_ID,
            INVENTORY_COLLECTION_ID,
            ID.unique(),
            {
              ...itemData, // Now itemData includes the 'image' property
              userId: user.$id,
            },
            [
              Permission.read(Role.user(user.$id)),
              Permission.update(Role.user(user.$id)),
              Permission.delete(Role.user(user.$id)),
            ]
          );
        }
        await fetchItems();
      } catch (err) {
        setError(err?.message || String(err) || "Failed to add item");
        Alert.alert("Inventory Error", err?.message || String(err));
        console.error("Inventory addItem error:", err);
      } finally {
        setLoading(false);
      }
    },
    [user, fetchItems]
  );

  const updateItem = useCallback(
    async (itemId, updates) => {
      if (!user) {
        setError("User not authenticated");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await databases.updateDocument(
          DATABASE_ID,
          INVENTORY_COLLECTION_ID,
          itemId,
          updates
        );
        await fetchItems();
      } catch (err) {
        setError(err?.message || String(err) || "Failed to update item");
      } finally {
        setLoading(false);
      }
    },
    [user, fetchItems]
  );

  const deleteItem = useCallback(
    async (itemId) => {
      if (!user) {
        setError("User not authenticated");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          INVENTORY_COLLECTION_ID,
          itemId
        );
        await fetchItems();
      } catch (err) {
        setError(err?.message || String(err) || "Failed to delete item");
      } finally {
        setLoading(false);
      }
    },
    [user, fetchItems]
  );

  useEffect(() => {
    fetchItems();
  }, [user, fetchItems]);

  return (
    <InventoryContext.Provider
      value={{
        items,
        loading,
        error,
        fetchItems,
        addItem,
        updateItem,
        deleteItem,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}