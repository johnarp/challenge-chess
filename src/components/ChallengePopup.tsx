import { useState } from 'react'

interface Props {
	myColor: 'white' | 'black'
	challenger: 'white' | 'black'
	challenge: any
	onSubmit: (arg: string) => void
	onResolve: () => void
}

export default function ChallengePopup({ myColor, challenger, challenge, onSubmit, onResolve }: Props) {
	const [arg, setArg] = useState('')
	const isChallenger = myColor === challenger

	const iHaveSubmitted = isChallenger ? challenge.challengerArg : challenge.defenderArg
	const theyHaveSubmitted = isChallenger ? challenge.defenderArg : challenge.challengerArg

	return (
		<div className='popup-overlay'>
			<div className='popup'>
				<h2>⚖️ Challenge!</h2>
				<p>{isChallenger ? 'You challenged this move. State your case.' : 'Your move was challenged. Defend it.'}</p>

				{!iHaveSubmitted ? (
					<>
						<textarea
							value={arg}
							onChange={e => setArg(e.target.value)}
							placeholder={isChallenger ? 'Why should this move be undone?' : 'Why was your move valid?'}
							rows={4}
							style={{ width: '100%', marginTop: 12, padding: 8, boxSizing: 'border-box' }}
						/>
						<button onClick={() => arg.trim() && onSubmit(arg.trim())} style={{ marginTop: 8 }}>
							Submit
						</button>
					</>
				) : (
					<p style={{ color: 'var(--prim)' }}>Your argument submitted. {theyHaveSubmitted ? '' : 'Waiting for opponent...'}</p>
				)}

				{challenge.verdict && (
					<>
						<p><strong>Challenger argued:</strong> {challenge.challengerArg}</p>
						<p><strong>Defender argued:</strong> {challenge.defenderArg}</p>
						<h3>{challenge.verdict === 'INVALID' ? '✅ Challenge Successful! Move Undone.' : '❌ Challenge Failed. Move Stands.'}</h3>
						<p style={{ fontStyle: 'italic' }}>{challenge.judgeResponse}</p>
						<button onClick={onResolve} style={{ marginTop: 12 }}>Continue</button>
					</>
				)}
			</div>
		</div>
	)
}