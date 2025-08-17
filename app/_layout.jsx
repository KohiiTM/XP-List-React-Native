import { Stack } from "expo-router";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { Colors } from "@constants/Colors";
import { StatusBar } from "expo-status-bar";
import { UserProvider } from "@contexts/UserContext";
import { LevelsProvider } from "@contexts/LevelsContext";
import { TasksProvider } from "@contexts/TasksContext";
import { InventoryProvider } from "@contexts/InventoryContext";
import { CharacterProvider } from "@contexts/CharacterContext";

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <UserProvider>
      <InventoryProvider>
        <CharacterProvider>
          <LevelsProvider>
            <TasksProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: theme.secondary },
                headerTintColor: theme.accent,
              }}
            >
              <Stack.Screen name="index" options={{ title: "Home" }} />
              <Stack.Screen
                name="(dashboard)"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
            </TasksProvider>
          </LevelsProvider>
        </CharacterProvider>
      </InventoryProvider>
    </UserProvider>
  );
};
export default RootLayout;
const styles = StyleSheet.create({});
