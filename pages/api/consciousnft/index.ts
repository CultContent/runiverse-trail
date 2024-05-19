import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const API_KEY = process.env.NEXT_PUBLIC_CONSCIOUS_NFT_KEY;

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, x-api-key'
    );
    res.status(200).end();
    return;
  }

  // Ensure the request method is POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const response = await fetch('https://consciousnft.ai/api/partner/v1/character', {
      method: 'POST',
      headers: {
        'x-api-key': `${API_KEY}` || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${responseBody}`);
      throw new Error(`Error from API: ${responseBody}`);
    }

    const data = JSON.parse(responseBody);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:');
   
  }
};
