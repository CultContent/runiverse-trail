import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const apiKey = process.env.NEXT_PUBLIC_CONSCIOUS_NFT_KEY;
  if (!apiKey) {
    return new NextResponse(JSON.stringify({ error: "API key not found" }), { status: 500 });
  }

  const adventureId = params.id;

  try {
    const response = await fetch(`https://consciousnft.ai/api/partner/v1/adventure/${adventureId}`, {
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
    console.error("Error fetching adventure data:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch adventure data" }), { status: 500 });
  }
}