import React, { createContext, useState, useEffect } from "react";
import { account } from "../lib/appwrite";
import { ID } from "react-native-appwrite";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  async function login(email, password) {
    try {
      await account.createEmailPasswordSession(email, password);
      const response = await account.get();
      setUser(response);
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
  }

  async function signup(email, password, username) {
    try {
      const userAccount = await account.create(ID.unique(), email, password);
      await login(email, password);
      const { databases } = await import("../lib/appwrite");
      const Constants = (await import("expo-constants")).default;
      const DATABASE_ID = Constants.expoConfig.extra.DATABASE_ID;
      const COLLECTION_ID = Constants.expoConfig.extra.COLLECTION_ID;
      const userId = userAccount?.$id || (await account.get()).$id;
      try {
        await databases.getDocument(DATABASE_ID, COLLECTION_ID, userId);
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, userId, {
          username,
        });
      } catch (err) {
        if (err.code === 404) {
          await databases.createDocument(DATABASE_ID, COLLECTION_ID, userId, {
            userId,
            username,
            level: 1,
            totalXP: 0,
            currentLevelXP: 0,
            xpToNextLevel: 100,
          });
        } else {
          throw err;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
  }

  async function getInitialUserValue() {
    try {
      const response = await account.get();
      setUser(response);
    } catch (error) {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }

  useEffect(() => {
    getInitialUserValue();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, signup, logout, authChecked }}>
      {children}
    </UserContext.Provider>
  );
}
