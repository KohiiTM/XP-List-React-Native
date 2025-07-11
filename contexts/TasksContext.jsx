import { createContext, useState, useCallback } from "react";
import Constants from "expo-constants";
import { databases } from "../lib/appwrite";
import { useUser } from "../hooks/useUser";
import { ID, Query, Permission } from "react-native-appwrite";
import { Role } from "appwrite";

const DATABASE_ID = Constants.expoConfig.extra.DATABASE_ID;
const TASKS_COLLECTION_ID = Constants.expoConfig.extra.TASKS_COLLECTION_ID;

export const TasksContext = createContext();

export function TasksProvider({ children }) {
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        [Query.equal("userId", user.$id)]
      );
      setTasks(res.documents);
    } catch (err) {
      setError(err?.message || String(err) || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createTask = useCallback(
    async (taskData) => {
      if (!user) {
        setError("User not authenticated");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await databases.createDocument(
          DATABASE_ID,
          TASKS_COLLECTION_ID,
          ID.unique(),
          {
            ...taskData,
            userId: user.$id,
          },
          [
            Permission.read(Role.user(user.$id)),
            Permission.update(Role.user(user.$id)),
            Permission.delete(Role.user(user.$id)),
          ]
        );
        await fetchTasks();
      } catch (err) {
        setError(err?.message || String(err) || "Failed to create task");
      } finally {
        setLoading(false);
      }
    },
    [user, fetchTasks]
  );

  const updateTask = useCallback(
    async (taskId, updates) => {
      if (!user) {
        setError("User not authenticated");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await databases.updateDocument(
          DATABASE_ID,
          TASKS_COLLECTION_ID,
          taskId,
          updates
        );
        await fetchTasks();
      } catch (err) {
        setError(err?.message || String(err) || "Failed to update task");
      } finally {
        setLoading(false);
      }
    },
    [user, fetchTasks]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      if (!user) {
        setError("User not authenticated");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          TASKS_COLLECTION_ID,
          taskId
        );
        await fetchTasks();
      } catch (err) {
        setError(err?.message || String(err) || "Failed to delete task");
      } finally {
        setLoading(false);
      }
    },
    [user, fetchTasks]
  );

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
