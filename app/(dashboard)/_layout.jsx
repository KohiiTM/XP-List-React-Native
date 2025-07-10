import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'

import UserOnly from '../../components/auth/UserOnly'

const DashboardLayout = () => {
	const colorScheme = useColorScheme()
	const theme = Colors[colorScheme] ?? Colors.light
	return (
		<UserOnly>

			<Tabs
				screenOptions={{
					headerShown: false, tabBarStyle: {
						backgroundColor: theme.background,
						paddingTop: 10,
						height: 90
					},
					tabBarActiveTintColor: theme.iconColorFocused,
					tabBarInactiveTintColor: theme.iconColor
				}}
			>

				<Tabs.Screen
				 name="profile" 
				 options={{ title: "Profile", tabBarIcon: ({ focused }) => (
				 	<Ionicons 
				 		size={24}
				 		name={focused ? 'person' : 'person-outline'}
				 		color={focused ? theme.iconColorFocused : theme.iconColor}
				 	/>
				 	)}}
				/>
				<Tabs.Screen
				 name="inventory" 
				 options={{ title: "Inventory", tabBarIcon: ({ focused }) => (
				 	<Ionicons 
				 		size={24}
				 		name={focused ? 'bag' : 'bag-outline'}
						color={focused ? theme.iconColorFocused : theme.iconColor}

				 	/>
				 	)}}
				/>
				<Tabs.Screen
				 name="tasks" 
				 options={{ title: "Tasks", tabBarIcon: ({ focused }) => (
				 	<Ionicons 
				 		size={24}
				 		name={focused ? 'bag' : 'bag-outline'}
						color={focused ? theme.iconColorFocused : theme.iconColor}

				 	/>
				 	)}}
				/>
				<Tabs.Screen
				 name="history" 
				 options={{ title: "History", tabBarIcon: ({ focused }) => (
				 	<Ionicons 
				 		size={24}
				 		name={focused ? 'bag' : 'bag-outline'}
						color={focused ? theme.iconColorFocused : theme.iconColor}

				 	/>
				 	)}}
				/>
			</Tabs>	
		</UserOnly>
	)
}
export default DashboardLayout

