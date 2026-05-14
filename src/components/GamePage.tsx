import { useState, useEffect } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import ChallengePopup from './ChallengePopup'
import { callJudge } from '../lib/judge'

interface Props {
	gameCode: string
	myColor: 'white' | 'black'
}

export default function GamePage({ gameCode, myColor }: Props) {
	const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
	const [turn, setTurn] = useState<'white' | 'black'>('white')
	const [canChallenge, setCanChallenge] = useState(false)
	const [challengesLeft, setChallengesLeft] = useState(3)
	const [challenge, setChallenge] = useState<any>(null)
	const [gameOver, setGameOver] = useState('')
	const gameRef = doc(db, 'games', gameCode)

	useEffect(() => {
		const unsub = onSnapshot(gameRef, (snap) => {
			const data = snap.data()
			if (!data) return
			if (data.boardState) setFen(data.boardState)
			if (data.gameOver) setGameOver(data.gameOver)
			if (data.turn) setTurn(data.turn)
			if (data.challenge) setChallenge(data.challenge)

			const lastCapture = data.lastCapture
			if (lastCapture && lastCapture.color !== myColor && data.turn === myColor) {
				setCanChallenge(true)
			} else {
				setCanChallenge(false)
			}

			if (data.challenges?.[myColor] !== undefined) {
				setChallengesLeft(data.challenges[myColor])
			}
		})
		return unsub
	}, [gameCode])

	useEffect(() => {
		if (!challenge?.active) return
		if (!challenge.challengerArg || !challenge.defenderArg) return
		if (challenge.verdict) return
		if (myColor !== challenge.challenger) return

		callJudge(challenge.challengerArg, challenge.defenderArg, challenge.san ?? 'a capture').then(({ verdict, response }) => {
			updateDoc(gameRef, {
				'challenge.verdict': verdict,
				'challenge.judgeResponse': response,
			})
		})
	}, [challenge?.challengerArg, challenge?.defenderArg])

	function onDrop(source: string, target: string) {
		if (turn !== myColor) return false
		if (challenge?.active) return false

		const game = new Chess(fen)
		const move = game.move({ from: source, to: target, promotion: 'q' })
		if (!move) return false

		const newFen = game.fen()
		const nextTurn = myColor === 'white' ? 'black' : 'white'
		setFen(newFen)
		setTurn(nextTurn)
		setCanChallenge(false)

		const kingCaptured = move.captured === 'k'
		const winner = kingCaptured ? (myColor === 'white' ? 'White' : 'Black') : null
		const normalGameOver = !kingCaptured && game.isGameOver()
			? game.isCheckmate() ? `${myColor === 'white' ? 'White' : 'Black'} Wins!` : 'Draw!'
			: null
		const gameOverValue = winner ? `${winner} Wins!` : normalGameOver

		updateDoc(gameRef, {
			previousBoardState: fen,
			boardState: newFen,
			turn: nextTurn,
			lastCapture: move.captured && !kingCaptured ? { color: myColor, san: move.san, captured: move.captured } : null,
			challenge: { active: false, challenger: null, challengerArg: null, defenderArg: null, verdict: null },
			gameOver: gameOverValue,
		})
		return true
	}

	function onChallenge() {
		if (challengesLeft <= 0) return
		setCanChallenge(false)
		updateDoc(gameRef, {
			[`challenges.${myColor}`]: challengesLeft - 1,
			challenge: { active: true, challenger: myColor, challengerArg: null, defenderArg: null, verdict: null },
		})
	}

	async function resolveChallenge() {
		if (!challenge) return
		const snap = await getDoc(gameRef)
		const currentFen: string = snap.data()?.boardState

		if (challenge.verdict === 'INVALID') {
			const prevFen: string = snap.data()?.previousBoardState
			const correctedFen = prevFen.replace(/ (w|b) /, ` ${challenge.challenger === 'white' ? 'w' : 'b'} `)
			await updateDoc(gameRef, {
				boardState: correctedFen,
				turn: challenge.challenger,
				lastCapture: null,
				challenge: { active: false, challenger: null, challengerArg: null, defenderArg: null, verdict: null },
			})
		} else {
			const defender = challenge.challenger === 'white' ? 'black' : 'white'
			const correctedFen = currentFen.replace(/ (w|b) /, ` ${defender === 'white' ? 'w' : 'b'} `)
			await updateDoc(gameRef, {
				boardState: correctedFen,
				turn: defender,
				lastCapture: null,
				challenge: { active: false, challenger: null, challengerArg: null, defenderArg: null, verdict: null },
			})
		}
	}

	return (
		<div style={{ width: 'min(500px, 95vw)', margin: '0 auto' }}>
			{!gameOver && <p>{turn === myColor ? 'Your Turn' : "Opponent's Turn"} — Challenges Remaining: {challengesLeft}</p>}
			<p style={{ color: 'var(--prim)', marginTop: -10 }}>Code: {gameCode}</p>
			{gameOver && (
				<div style={{ textAlign: 'center' }}>
					<h2>{gameOver}</h2>
					<button onClick={() => window.location.reload()} style={{ marginBottom: 10 }}>Back to Menu</button>
				</div>
			)}
			<Chessboard
				position={fen}
				onPieceDrop={onDrop}
				boardOrientation={myColor}
				customDarkSquareStyle={{ backgroundColor: '#34556b' }}
				customLightSquareStyle={{ backgroundColor: '#f0e0b5' }}
			/>
			{canChallenge && !gameOver && (
				<div style={{ marginTop: 10 }}>
					<button onClick={onChallenge}>Challenge</button>
				</div>
			)}
			{challenge?.active && (
				<ChallengePopup
					myColor={myColor}
					challenger={challenge.challenger}
					challenge={challenge}
					onSubmit={(arg) => {
						const field = myColor === challenge.challenger ? 'challenge.challengerArg' : 'challenge.defenderArg'
						updateDoc(gameRef, { [field]: arg })
					}}
					onResolve={resolveChallenge}
				/>
			)}
		</div>
	)
}