import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_CONSCIOUS_NFT_KEY;
  if (!apiKey) {
    console.error('API key not found in environment variables');
    return new NextResponse(JSON.stringify({ error: "API key not found" }), { status: 500 });
  }

  try {
    const body = await req.json();
    console.log('Received request body:', body);

    const response = await fetch("https://consciousnft.ai/api/partner/v1/adventure", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API responded with status: ${response.status}, body: ${errorText}`);
      return new NextResponse(JSON.stringify({ error: `API responded with status: ${response.status}` }), { status: response.status });
    }

    const data = await response.json();
    console.log('Received response from API:', data);

    // If the API response includes any URLs that the frontend needs to access,
    // you should fetch that data here and include it in the response to the frontend.
    // For example:
    // if (data.ethereumNodeUrl) {
    //   const ethereumResponse = await fetch(data.ethereumNodeUrl);
    //   const ethereumData = await ethereumResponse.json();
    //   data.ethereumData = ethereumData;
    // }

    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error starting adventure:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to start adventure" }), { status: 500 });
  }
}