import { StyleSheet, Text, View } from 'react-native'
const Home = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome to XP List!</Text>
		</View>
	)
}
export default Home

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		jusifyContent: 'center'
	},
	title: {
		fontWeight: 'bold',
		fontSize: 18,
		marginTop: 10,
		marginBottom: 30
	}
})

