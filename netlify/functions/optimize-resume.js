javascriptconst Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { jobDescription, currentResume } = JSON.parse(event.body);

    if (!jobDescription || !currentResume) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    const anthropic = new Anthropic({ apiKey: apiKey });

    const message = await anthropic.messages.create({
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
    });

    const improvedResume = message.content[0].text;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ improvedResume })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to optimize resume',
        details: error.message 
      })
    };
  }
};
