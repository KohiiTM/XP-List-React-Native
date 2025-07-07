import { Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
const RootLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ title: 'Home' }}/>
			<Stack.Screen name="signup" options={{ title: 'Signup' }}/>
			<Stack.Screen name="login" options={{ title: 'Login' }}/>
			<Stack.Screen name="profile" options={{ title: 'Profile' }}/>
			<Stack.Screen name="inventory" options={{ title: 'Inventory' }}/>


		</Stack>
	)
}
export default RootLayout
const styles = StyleSheet.create({})