import { useState } from 'react'
import './App.css'
import HomePage from './components/HomePage'
import GamePage from './components/GamePage'

function getOrCreateId(): string {
	let id = localStorage.getItem('challenge_chess_id')
	if (!id) {
		id = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
		localStorage.setItem('challenge_chess_id', id)
	}
	return id
}

export default function App() {
	const [playerId] = useState(getOrCreateId)
	const [screen, setScreen] = useState<'home' | 'game'>('home')
	const [gameCode, setGameCode] = useState('')
	const [myColor, setMyColor] = useState<'white' | 'black'>('white')

	function onGameJoined(code: string, color: 'white' | 'black') {
		setGameCode(code)
		setMyColor(color)
		setScreen('game')
	}

	return (
		<>
			<header>
				<div className='title' style={{ marginTop: 12 }}>
					<span>Challenge</span><span className='chess'> Chess</span>
				</div>
			</header>
			{screen === 'home' && <HomePage playerId={playerId} onGameJoined={onGameJoined} />}
			{screen === 'game' && <GamePage gameCode={gameCode} myColor={myColor} />}
			<footer style={{ marginTop: 'auto', padding: 16, textAlign: 'center' }}>
				<a href="https://github.com/johnarp/challenge-chess" target="_blank" style={{ color: 'var(--prim)', textDecoration: 'none', fontSize: '0.85rem' }}>
					GitHub
				</a>
			</footer>
		</>
	)
}