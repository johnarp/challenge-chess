// export async function callJudge(challengerArg: string, defenderArg: string, move: string): Promise<{ verdict: 'VALID' | 'INVALID', response: string }> {
// 	const apiKey = import.meta.env.VITE_GEMINI_API_KEY
// 	const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

// 	const prompt = `You are a dramatic judge inspired by Ace Attorney presiding over a chess challenge court.

// The challenged move: ${move}

// The challenger argues: "${challengerArg}"
// The defender argues: "${defenderArg}"

// The move is technically legal chess — your job is NOT to judge legality. You rule based purely on who made the more compelling, dramatic, or entertaining argument.

// Write 3-4 theatrical dramatic sentences reacting to both arguments FIRST. Then on the very last line write exactly one of:
// VERDICT: VALID
// VERDICT: INVALID`

// 	const res = await fetch(url, {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify({
// 			contents: [{ parts: [{ text: prompt }] }],
// 			generationConfig: { temperature: 1.2, maxOutputTokens: 300 },
// 		}),
// 	})

// 	const data = await res.json()
// 	console.log('Gemini raw response:', JSON.stringify(data))
// 	const fullText: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
// 	const verdictMatch = fullText.match(/VERDICT:\s*(VALID|INVALID)/i)
// 	const verdict = (verdictMatch?.[1]?.toUpperCase() as 'VALID' | 'INVALID') ?? 'VALID'
// 	const response = fullText.split(/VERDICT:/i)[0].trim()

// 	return { verdict, response }
// }

export async function callJudge(_challengerArg: string, _defenderArg: string, _move: string): Promise<{ verdict: 'VALID' | 'INVALID', response: string }> {
	await new Promise(r => setTimeout(r, 1500)) // fake delay

	const verdict = Math.random() > 0.5 ? 'VALID' : 'INVALID'
	const response = verdict === 'VALID'
		? `ORDER! This court has heard ENOUGH! The challenger's argument is nothing but desperate flailing! The defender played with precision and purpose, and this court shall not be swayed by such emotional appeals! The move STANDS!`
		: `OBJECTION SUSTAINED! The challenger speaks with the voice of JUSTICE ITSELF! This court is appalled by the audacity of the defender's reasoning! The scales of chess law tip decisively against them!`

	return { verdict, response }
}