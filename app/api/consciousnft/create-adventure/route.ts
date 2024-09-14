import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_CONSCIOUS_NFT_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  try {
    const { characterId, storyId } = await req.json();
    const response = await fetch('https://consciousnft.ai/api/partner/v1/adventure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ characterId, storyId }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating adventure:', error);
    return NextResponse.json({ error: 'Failed to create adventure' }, { status: 500 });
  }
}