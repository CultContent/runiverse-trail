import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_CONSCIOUS_NFT_KEY;
  if (!apiKey) {
    return new NextResponse(JSON.stringify({ error: "API key not found" }), { status: 500 });
  }

  try {
    const response = await fetch("https://consciousnft.ai/api/partner/v1/character", {
      headers: {
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error fetching characters:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch characters" }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_CONSCIOUS_NFT_KEY;
  if (!apiKey) {
    return new NextResponse(JSON.stringify({ error: "API key not found" }), { status: 500 });
  }

  try {
    const body = await req.json();
    const response = await fetch("https://consciousnft.ai/api/partner/v1/character", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error creating character:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to create character" }), { status: 500 });
  }
}