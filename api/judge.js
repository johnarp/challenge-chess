// --------------------
// GEMINI
// --------------------

// export default async function handler(req, res) {
//     if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

//     const { challengerArg, defenderArg, move } = req.body
//     const apiKey = process.env.GEMINI_API_KEY

//     const prompt = `You are a dramatic, Ace Attorney-inspired judge presiding over a chess challenge court.

// Move: ${move}
// Challenger argues: "${challengerArg}"
// Defender argues: "${defenderArg}"

// Your job is NOT to judge legality. You rule based purely on who made the more compelling or entertaining argument.

// React in 2-3 sentences. Be intense, exaggerated, and decisive.

// On the very last line, write exactly one of: 

// VERDICT: VALID
// VERDICT: INVALID`

//     try {
//         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 contents: [{ parts: [{ text: prompt }] }],
//                 generationConfig: { temperature: 0.9, maxOutputTokens: 120 },
//             }),
//         })

//         const data = await response.json()
//         res.status(200).json(data)
//     } catch (e) {
//         res.status(500).json({ error: 'Judge unavailable' })
//     }
// }

// --------------------
// GROQ
// --------------------

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const { challengerArg, defenderArg, move } = req.body
    const apiKey = process.env.GROQ_API_KEY

    const prompt = `You are a dramatic Ace Attorney-style judge in a chess court.

Move: ${move}
Challenger: "${challengerArg}"
Defender: "${defenderArg}"

Write 2-3 dramatic sentences reacting to the arguments. Then you MUST write the verdict on a new line.

YOUR RESPONSE MUST END WITH ONE OF THESE TWO LINES:
VERDICT: VALID
VERDICT: INVALID`

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{
                    role: 'system',
                    content: 'You are a dramatic chess judge. Always end your response with "VERDICT: VALID" or "VERDICT: INVALID" on the last line. This is required.'
                },
                {
                    role: 'user',
                    content: prompt
                }],
                temperature: 0.9,
                max_tokens: 400,
            }),
        })

        const data = await response.json()
        res.status(200).json(data)
    } catch (e) {
        res.status(500).json({ error: 'Judge unavailable' })
    }
}