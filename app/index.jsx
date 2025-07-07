import { StyleSheet, Text, View, Image } from 'react-native'
import Logo from '../assets/images/icon.png'

const Home = () => {
	return (
		<View style={styles.container}>
			
			<Image source={Logo} style={styles.img} />
			<Text style={styles.title}>Welcome to XP List!</Text>
		

			<View>
				<Text style={styles.card}>card</Text>
			</View>
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
	},
	card: {
		backgroundColor: '#eee',
		padding: 20,
		borderRadius: 5,
		boxShadow: '4px 4px rgba(0,0,0,0.1)'
	},
	img: {
		marginVertical: 20,
		maxHeight: 40,
		maxWidth: 40
	}
})

