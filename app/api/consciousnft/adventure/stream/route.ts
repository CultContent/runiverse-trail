import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const apiKey = process.env.NEXT_PUBLIC_CONSCIOUS_NFT_KEY;
  if (!apiKey) {
    return new Response('API key not found', { status: 500 });
  }

  const adventureId = params.id;

  // Set up SSE headers
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Function to send SSE messages
      const sendMessage = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      // Simulated adventure stream (replace this with actual API calls)
      const simulateAdventure = async () => {
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
          sendMessage(JSON.stringify({ step: i, message: `Adventure step ${i}` }));
        }
        sendMessage(JSON.stringify({ step: 'end', message: 'Adventure completed' }));
        controller.close();
      };

      simulateAdventure();
    }
  });

  return new Response(stream, { headers });
}