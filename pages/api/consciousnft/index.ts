import { NextRequest, NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.NEXT_PUBLIC_CONSCIOUS_NFT_KEY;

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, x-api-key",
    );
    res.status(200).end();
    return;
  }

  // Ensure the request method is POST
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const response = await fetch(
      "/api/consciousnft/character",
      {
        method: "POST",
        headers: {
          "x-api-key": `${API_KEY}` || "",
          "Content-Type": "application/json",
        },
        // body: JSON.stringify(req.body),
        body: JSON.stringify({
          name: "Test Name",
          backstory: "Test Backstory",
          motivation: "Test Motivation",
        }),
      },
    );

    const responseBody = await response.text();

    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${responseBody}`);
      throw new Error(`Error from API: ${responseBody}`);
    }

    const data = JSON.parse(responseBody);

    // res.status(200).json(data);

    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);

    return new NextResponse(
      JSON.stringify({
        isSuccessful: false,
      }),
      {
        status: 200,
      },
    );
  }
}