import { createContext, useState, useEffect } from "react";
import Constants from "expo-constants";
import { databases } from "../lib/appwrite";

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

  async function fetchLevelInfo(userId) {
    setLoading(true);
    setError(null);
    try {
      let response;
      try {
        // get document
        response = await databases.getDocument(
          DATABASE_ID,
          COLLECTION_ID,
          userId
        );
      } catch (err) {
        // else create new document
        if (err.code === 404) {
          response = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            userId,
            {
              level: 1,
              totalXP: 0,
              currentLevelXP: 0,
              xpToNextLevel: 100,
            }
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
