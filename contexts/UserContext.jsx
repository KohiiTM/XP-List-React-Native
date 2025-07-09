import { createContext, useState } from 'react'
import { account } from '../lib/appwrite'
import { ID } from 'react-native-appwrite'


export const UserContext = createContext()

export function UserProvider({ children }) {
	const [user, setUser] = useState(null)

	async function login(email, password) {
		try {
			await account.createEmailPasswordSession(email, password)
			const response = await account.get()
			setUser(response)
		}   catch (error) {
			throw error
		}
	}

	async function logout() {
		await account.deleteSession("current")
		setUser(null)
	}

	async function signup(email, password) {
		try {
			await account.create(ID.unique(), email, password)
			await login(email, password)
		}   catch (error) {
			throw error
		}
	}

	async function logout() {

	}

	return (
		<UserContext.Provider value={{ user, login, signup, logout }}>
			{children}
		</UserContext.Provider>
	)


}