// --------------------
// GEMINI
// --------------------

// export async function callJudge(challengerArg: string, defenderArg: string, move: string): Promise<{ verdict: 'VALID' | 'INVALID', response: string }> {
// 	try {
// 		const res = await fetch('/api/judge', {
// 			method: 'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify({ challengerArg, defenderArg, move }),
// 		})

// 		const data = await res.json()
// 		const fullText: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
// 		const verdictMatch = fullText.match(/VERDICT:\s*(VALID|INVALID)/i)

// 		if (!fullText || !verdictMatch) throw new Error('no response')

// 		return {
// 			verdict: verdictMatch[1].toUpperCase() as 'VALID' | 'INVALID',
// 			response: fullText.split(/VERDICT:/i)[0].trim()
// 		}
// 	} catch {
// 		return {
// 			verdict: Math.random() > 0.5 ? 'VALID' : 'INVALID',
// 			response: 'The judge has fallen ill and cannot preside today. The result has been decided by coin flip.'
// 		}
// 	}
// }

// --------------------
// GROQ
// --------------------

export async function callJudge(challengerArg: string, defenderArg: string, move: string): Promise<{ verdict: 'VALID' | 'INVALID', response: string }> {
	try {
		const res = await fetch('/api/judge', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ challengerArg, defenderArg, move }),
		})

		const data = await res.json()
		const fullText: string = data.choices?.[0]?.message?.content ?? ''
		const verdictMatch = fullText.match(/VERDICT:\s*(VALID|INVALID)/i)

		if (!fullText || !verdictMatch) throw new Error('no response')

		return {
			verdict: verdictMatch[1].toUpperCase() as 'VALID' | 'INVALID',
			response: fullText.split(/VERDICT:/i)[0].trim()
		}
	} catch (e) {
		console.error('judge error:', e)
		return {
			verdict: Math.random() > 0.5 ? 'VALID' : 'INVALID',
			response: 'The judge has fallen ill and cannot preside today. The result has been decided by coin flip.'
		}
	}
}