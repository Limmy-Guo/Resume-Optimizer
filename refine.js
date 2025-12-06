export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { jobDescription, currentResume, feedback } = req.body;

    if (!jobDescription || !currentResume || !feedback) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: `You are an expert resume optimizer. I have an optimized resume that needs further refinement based on user feedback.

**Job Description:**
${jobDescription}

**Current Optimized Resume:**
${currentResume}

**User Feedback/Requested Changes:**
${feedback}

Please refine the resume based on the user's feedback while:
1. Keeping all the improvements already made
2. Addressing the specific feedback provided
3. Maintaining relevance to the job description
4. Keeping all factual information accurate

CRITICAL FORMATTING INSTRUCTIONS:
- Maintain the EXACT original formatting style of the resume
- Use bullet points (•) exactly as they appear
- Do NOT use asterisks (*), dashes (-), or any other symbols for bullet points
- Do NOT convert to Markdown format
- Preserve all spacing, line breaks, and indentation
- Keep the same section headers and structure

IMPORTANT - KEYWORD HIGHLIGHTING:
- Wrap ONLY the newly added ATS keywords (important terms taken from the job description that were not in the previous version) with [[KEYWORD: text ]]
- Only mark NEW keywords added in this refinement
- Be selective - only mark the most important keywords

Provide the refined resume that addresses the user's feedback while maintaining ATS optimization.`
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'API error', details: errorText });
    }

    const data = await response.json();
    return res.status(200).json({ improvedResume: data.content[0].text });

  } catch (error) {
    return res.status(500).json({ error: 'Failed to refine', details: error.message });
  }
}
