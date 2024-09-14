import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_CONSCIOUS_NFT_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  try {
    const { adventureId, characterMessage } = await req.json();
    if (!adventureId) {
      return NextResponse.json({ error: 'adventureId is required' }, { status: 400 });
    }

    const url = `https://consciousnft.ai/api/partner/v1/adventure/${adventureId}`;

    const body = characterMessage ? JSON.stringify({ characterMessage }) : undefined;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    // Stream the response
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in adventure stream:', error);
    return NextResponse.json({ error: 'Failed to start or continue adventure stream' }, { status: 500 });
  }
}