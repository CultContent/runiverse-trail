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

    const readableStream = new ReadableStream({
      start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        function push() {
          reader?.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }

            const chunkText = decoder.decode(value, { stream: true });
            const jsonChunks = chunkText.split('\n').filter(chunk => chunk.trim().length > 0);

            jsonChunks.forEach(chunk => {
              try {
                const parsedChunk = JSON.parse(chunk);
                const content = parsedChunk.choices[0]?.delta?.content;
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content));
                }
              } catch (error) {
                console.error('Error parsing chunk:', error);
              }
            });

            push();
          }).catch(error => {
            console.error('Error reading stream:', error);
            controller.error(error);
          });
        }

        push();
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in adventure stream:', error);
    return NextResponse.json({ error: 'Failed to start adventure stream' }, { status: 500 });
  }
}
