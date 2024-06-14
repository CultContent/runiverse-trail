import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_CONSCIOUS_NFT_KEY;

  if (!apiKey) {
    return new NextResponse(JSON.stringify({ error: "API key not found" }), { status: 500 });
  }

  const response = await fetch("https://consciousnft.ai/api/partner/v1/character", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      name: "BILL",
      backstory: "A cool warrior",
      motivations: "Always angry at teammates.",
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("error:", error);
      return { error: "Failed to fetch data" };
    });

  return new NextResponse(JSON.stringify(response), { status: 200 });
}
