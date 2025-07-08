import { StyleSheet, Text, View, Image } from 'react-native'
import Logo from '../../assets/images/icon.png'
import { Link } from 'expo-router'

const History = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Inventory Page</Text>


			<Link href="/" style={styles.link}>Home</Link>

		</View>
	)
}

export default History

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
	},
	link: {
		marginVertical: 10,
		borderBottomWidth: 1
	}
})