import { useState, useEffect, useCallback } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const LOCAL_TASKS_KEY = "local_tasks"

export function useLocalTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null)
    try {
      const storedTasks = await AsyncStorage.getItem(LOCAL_TASKS_KEY)
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks))
      } else {
        setTasks([])
      }
    } catch (err) {
      setError("Failed to load local tasks")
    } finally {
      setLoading(false)
    }
  }, [])

  const saveTasks = useCallback(async (newTasks) => {
    try {
      await AsyncStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(newTasks))
    } catch (err) {
      setError("Failed to save tasks")
      throw err
    }
  }, [])

  const createTask = useCallback(
    async (taskData) => {
      setLoading(true)
      setError(null)
      try {
        const newTask = {
          $id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...taskData,
          createdAt: new Date().toISOString(),
          completed: false,
          completedAt: null,
          xpReward:
            taskData.difficulty === "easy"
              ? 10
              : taskData.difficulty === "medium"
              ? 20
              : 30,
        }

        const updatedTasks = [...tasks, newTask]
        setTasks(updatedTasks)
        await saveTasks(updatedTasks)
      } catch (err) {
        setError("Failed to create task")
      } finally {
        setLoading(false)
      }
    },
    [tasks, saveTasks]
  )

  const updateTask = useCallback(
    async (taskId, updates) => {
      setLoading(true)
      setError(null)
      try {
        const updatedTasks = tasks.map((task) =>
          task.$id === taskId ? { ...task, ...updates } : task
        )
        setTasks(updatedTasks)
        await saveTasks(updatedTasks)
      } catch (err) {
        setError("Failed to update task")
      } finally {
        setLoading(false)
      }
    },
    [tasks, saveTasks]
  )

  const deleteTask = useCallback(
    async (taskId) => {
      setLoading(true)
      setError(null)
      try {
        const updatedTasks = tasks.filter((task) => task.$id !== taskId)
        setTasks(updatedTasks)
        await saveTasks(updatedTasks)
      } catch (err) {
        setError("Failed to delete task")
      } finally {
        setLoading(false)
      }
    },
    [tasks, saveTasks]
  )

  const fetchTasks = useCallback(async () => {
    await loadTasks()
  }, [loadTasks])

  const clearLocalTasks = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(LOCAL_TASKS_KEY)
      setTasks([])
    } catch (err) {
      setError("Failed to clear local tasks")
    }
  }, [])

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearLocalTasks,
  }
}
