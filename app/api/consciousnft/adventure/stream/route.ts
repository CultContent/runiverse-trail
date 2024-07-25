import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received request body:', body);

    // Your adventure stream logic here
    // For example, fetching from consciousnft.ai

    // Create a ReadableStream for the response
    const stream = new ReadableStream({
      async start(controller) {
        // Simulate streaming data
        for (let i = 0; i < 5; i++) {
          const chunk = `Event: ${i}\n\n`;
          controller.enqueue(chunk);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        }
        controller.close();
      },
    });

    // Return a streaming response
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("Error starting adventure:", error);
    return NextResponse.json({ error: "Failed to start adventure" }, { status: 500 });
  }
}