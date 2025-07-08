import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'


const DashboardLayout = () => {
	const colorScheme = useColorScheme()
	const theme = Colors[colorScheme] ?? Colors.light
	return (

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
		</Tabs>	
	)
}
export default DashboardLayout

//bag-outline
