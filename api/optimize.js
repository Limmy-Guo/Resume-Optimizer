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
    const { jobDescription, currentResume } = req.body;

    if (!jobDescription || !currentResume) {
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
             content: `You are an expert resume optimizer and career coach. I need you to improve my resume to better match a specific job description.

**Job Description:**
${jobDescription}

**Current Resume:**
${currentResume}

Please analyze the job description and optimize my resume by:
1. Highlighting relevant skills and experiences that match the job requirements
2. Using keywords from the job description naturally throughout the resume
3. Restructuring bullet points to emphasize impact and achievements relevant to this role
4. Keeping all factual information accurate - do not invent experiences

CRITICAL FORMATTING INSTRUCTIONS:
- Maintain the EXACT original formatting style of the resume
- Use bullet points (•) exactly as they appear in the original resume
- Do NOT use asterisks (*), dashes (-), or any other symbols for bullet points
- Do NOT convert to Markdown format
- Preserve all spacing, line breaks, and indentation from the original
- Keep the same section headers and structure

IMPORTANT - KEYWORD HIGHLIGHTING:
- Wrap ONLY the newly added ATS keywords (words taken from the job description that were not in the original resume) with [[KEYWORD: text ]]
- For example: "Implemented [[KEYWORD: agile methodologies ]] to improve team efficiency"
- Only mark keywords that are NEW additions from the job description
- Do not mark words that were already in the original resume
- Be precise - only mark the exact keyword phrase, not surrounding words

Provide the improved resume with keyword markers so users can identify which terms are critical ATS keywords that should not be deleted.`
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'API error', details: errorText });
    }

    const data = await response.json();
    return res.status(200).json({ improvedResume: data.content[0].text });

  } catch (error) {
    return res.status(500).json({ error: 'Failed to optimize', details: error.message });
  }
}
