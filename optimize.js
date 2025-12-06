export default async function handler(req, res) {
  // Handle CORS
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
      return res.status(500).json({ error: 'API key not configured. Please add ANTHROPIC_API_KEY to Vercel environment variables.' });
    }

    // Call Anthropic API
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
4. Maintaining the original format and structure as much as possible
5. Keeping all factual information accurate - do not invent experiences

Provide the improved resume in a clean, professional format. Focus on making the resume ATS-friendly and compelling to hiring managers for this specific role.`
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      return res.status(response.status).json({ 
        error: 'Anthropic API error',
        details: errorText 
      });
    }

    const data = await response.json();
    const improvedResume = data.content[0].text;

    return res.status(200).json({ improvedResume });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Failed to optimize resume',
      details: error.message
    });
  }
}
