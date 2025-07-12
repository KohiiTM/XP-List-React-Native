import { createContext, useState, useEffect } from "react";
import Constants from "expo-constants";
import { databases } from "../lib/appwrite";
import { useUser } from "../hooks/useUser";
import { ID, Permission } from "react-native-appwrite";
import { Role } from "appwrite";

const DATABASE_ID = Constants.expoConfig.extra.DATABASE_ID;
const COLLECTION_ID = Constants.expoConfig.extra.COLLECTION_ID;

export const LevelsContext = createContext();

export function LevelsProvider({ children }) {
  const [levelInfo, setLevelInfo] = useState({
    level: 1,
    totalXP: 0,
    currentLevelXP: 0,
    xpToNextLevel: 100,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useUser();

  async function fetchLevelInfo() {
    setLoading(true);
    setError(null);
    try {
      let response;
      try {
        response = await databases.getDocument(
          DATABASE_ID,
          COLLECTION_ID,
          user.$id
        );
      } catch (err) {
        if (err.code === 404) {
          response = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            user.$id,
            {
              userId: user.$id,
              level: 1,
              totalXP: 0,
              currentLevelXP: 0,
              xpToNextLevel: 100,
            },
            [
              Permission.read(Role.user(user.$id)),
              Permission.update(Role.user(user.$id)),
              Permission.delete(Role.user(user.$id)),
            ]
          );
        } else {
          throw err;
        }
      }
      setLevelInfo({
        level: response.level,
        totalXP: response.totalXP,
        currentLevelXP: response.currentLevelXP,
        xpToNextLevel: response.xpToNextLevel,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch or create level info");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LevelsContext.Provider
      value={{ levelInfo, fetchLevelInfo, loading, error }}
    >
      {children}
    </LevelsContext.Provider>
  );
}
