import { Stack } from 'expo-router'
import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import { Colors } from "../constants/Colors"
import {StatusBar } from 'expo-status-bar'

const RootLayout = () => {
	const colorScheme = useColorScheme()
	const theme = Colors[colorScheme] ?? Colors.light



	return (
	  <>
	  	<StatusBar style="light" />
		<Stack screenOptions={{
			headerStyle: { backgroundColor: theme.secondary },
			headerTintColor: theme.accent,
		}}>

			<Stack.Screen name="index" options={{ title: 'Home' }}/>
			<Stack.Screen name="(auth)/signup" options={{ title: 'Signup' }}/>
			<Stack.Screen name="(auth)/login" options={{ title: 'Login' }}/>
			<Stack.Screen name="(dashboard)" options={{ headerShown: false }} />

		</Stack>
	  </>
	)
}
export default RootLayout
const styles = StyleSheet.create({})