import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_CONSCIOUS_NFT_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  try {
    const { adventureId } = await req.json();
    if (!adventureId) {
      return NextResponse.json({ error: 'adventureId is required' }, { status: 400 });
    }

    const url = `https://consciousnft.ai/api/partner/v1/adventure/continue`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ adventureId }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in continue adventure stream:', error);
    return NextResponse.json({ error: 'Failed to continue adventure' }, { status: 500 });
  }
}
