import { useContext } from 'react'
import { LevelsContext } from '../contexts/LevelsContext'

export function useLevels() {
	const context = useContext(LevelsContext)

	if (!context) {
		throw new Error("useLevels must be used within a LevelsProvider")
	}

	return context

}
