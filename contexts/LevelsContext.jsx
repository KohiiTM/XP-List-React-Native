import { createContext, useState, useEffect } from "react";
import { env } from 'expo-env';

const DATABASE_ID = env.DATABASE_ID;
const COLLECTION_ID = env.COLLECTION_ID;

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
      

    } catch (err) {
      setError(err.message || "Failed to fetch level info");
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
  )
}
