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
const CHARACTERS_COLLECTION_ID = Constants.expoConfig.extra.CHARACTERS_COLLECTION_ID || "characters";

export const CharacterContext = createContext();

const DEFAULT_CHARACTER = {
  skinTone: "medium",
  hairStyle: "short",
  hairColor: "brown",
  eyeColor: "brown",
  headEquipment: null,
  bodyEquipment: null,
  weaponEquipment: null,
  accessoryEquipment: null,
};

export function CharacterProvider({ children }) {
  const { user } = useUser();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCharacter = useCallback(async () => {
    if (!user) {
      setCharacter(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        CHARACTERS_COLLECTION_ID,
        [Query.equal("userId", user.$id)]
      );
      
      if (res.documents && res.documents.length > 0) {
        setCharacter(res.documents[0]);
      } else {
        const newCharacter = await createDefaultCharacter();
        setCharacter(newCharacter);
      }
    } catch (err) {
      setError(err?.message || String(err) || "Failed to load character");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createDefaultCharacter = useCallback(async () => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    try {
      const characterData = {
        ...DEFAULT_CHARACTER,
        userId: user.$id,
      };

      const newCharacter = await databases.createDocument(
        DATABASE_ID,
        CHARACTERS_COLLECTION_ID,
        ID.unique(),
        characterData,
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );

      return newCharacter;
    } catch (err) {
      throw new Error(err?.message || "Failed to create character");
    }
  }, [user]);

  const updateCharacter = useCallback(
    async (updates) => {
      if (!user || !character) {
        setError("User not authenticated or character not loaded");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const updatedCharacter = await databases.updateDocument(
          DATABASE_ID,
          CHARACTERS_COLLECTION_ID,
          character.$id,
          updates
        );
        setCharacter(updatedCharacter);
        return updatedCharacter;
      } catch (err) {
        setError(err?.message || String(err) || "Failed to update character");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, character]
  );

  const equipItem = useCallback(
    async (itemId, slot) => {
      if (!character) {
        throw new Error("Character not loaded");
      }

      const slotField = `${slot}Equipment`;
      const updates = { [slotField]: itemId };
      
      try {
        return await updateCharacter(updates);
      } catch (err) {
        Alert.alert("Equipment Error", err?.message || "Failed to equip item");
        throw err;
      }
    },
    [character, updateCharacter]
  );

  const unequipItem = useCallback(
    async (slot) => {
      if (!character) {
        throw new Error("Character not loaded");
      }

      const slotField = `${slot}Equipment`;
      const updates = { [slotField]: null };
      
      try {
        return await updateCharacter(updates);
      } catch (err) {
        Alert.alert("Equipment Error", err?.message || "Failed to unequip item");
        throw err;
      }
    },
    [character, updateCharacter]
  );

  const customizeCharacter = useCallback(
    async (customizations) => {
      try {
        return await updateCharacter(customizations);
      } catch (err) {
        Alert.alert("Customization Error", err?.message || "Failed to customize character");
        throw err;
      }
    },
    [updateCharacter]
  );

  useEffect(() => {
    fetchCharacter();
  }, [user, fetchCharacter]);

  return (
    <CharacterContext.Provider
      value={{
        character,
        loading,
        error,
        fetchCharacter,
        updateCharacter,
        equipItem,
        unequipItem,
        customizeCharacter,
        defaultCharacter: DEFAULT_CHARACTER,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return context;
}