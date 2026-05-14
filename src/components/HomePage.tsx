import { useState, useEffect } from 'react'
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

interface Props {
	playerId: string
	onGameJoined: (code: string, color: 'white' | 'black') => void
}

function genCode() {
	return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function HomePage({ playerId, onGameJoined }: Props) {
	const [code, setCode] = useState('')
	const [pendingCode, setPendingCode] = useState('')
	const [error, setError] = useState('')

	// listen for opponent joining
	useEffect(() => {
		if (!pendingCode) return
		const unsub = onSnapshot(doc(db, 'games', pendingCode), (snap) => {
			if (snap.data()?.status === 'active') {
				unsub()
				onGameJoined(pendingCode, 'white')
			}
		})
		return unsub
	}, [pendingCode])

	async function createGame() {
		const newCode = genCode()
		await setDoc(doc(db, 'games', newCode), {
			boardState: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
			players: { white: playerId, black: null },
			status: 'waiting',
			turn: 'white',
			lastCapture: null,
			challenges: { white: 3, black: 3 },
			challenge: { active: false, challenger: null },
		})
		setPendingCode(newCode)
	}

	async function joinGame() {
		const snap = await getDoc(doc(db, 'games', code))
		if (!snap.exists()) { setError('Game not found'); return }
		const data = snap.data()

		// rejoin as white
		if (data.players.white === playerId) {
			onGameJoined(code, 'white'); return
		}
		// rejoin as black
		if (data.players.black === playerId) {
			onGameJoined(code, 'black'); return
		}

		if (data.status !== 'waiting') { setError('Game is full'); return }

		await updateDoc(doc(db, 'games', code), {
			'players.black': playerId,
			status: 'active',
		})
		onGameJoined(code, 'black')
	}

	return (
		<div style={{ padding: 40 }}>
			<button onClick={createGame}>Create Game</button>
			{pendingCode && <p>Code: <strong>{pendingCode}</strong></p>}

			<div style={{ marginTop: 32, display: 'flex', gap: '10px', justifyContent: 'center' }}>
				<input
					value={code}
					onChange={e => setCode(e.target.value.toUpperCase())}
					placeholder="Enter Code..."
				/>
				<button onClick={joinGame}>Join Game</button>
				{error && <p>{error}</p>}
			</div>
		</div>
	)
}