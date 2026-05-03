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
		<div style={{
			position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
			display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
		}}>
			<div style={{ background: '#013044', border: '1px solid #ffc735', padding: 32, width: 480, borderRadius: 8 }}>
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
					<p style={{ color: '#ffc735' }}>Your argument submitted. {theyHaveSubmitted ? '' : 'Waiting for opponent...'}</p>
				)}

				{challenge.verdict && (
					<div style={{ marginTop: 24, borderTop: '1px solid #ffc735', paddingTop: 16 }}>
						<p><strong>Challenger argued:</strong> {challenge.challengerArg}</p>
						<p><strong>Defender argued:</strong> {challenge.defenderArg}</p>
						<h3>{challenge.verdict === 'INVALID' ? '✅ Challenge successful! Move undone.' : '❌ Challenge failed. Move stands.'}</h3>
						<p style={{ fontStyle: 'italic' }}>{challenge.judgeResponse}</p>
						<button onClick={onResolve} style={{ marginTop: 12 }}>Continue</button>
					</div>
				)}
			</div>
		</div>
	)
}