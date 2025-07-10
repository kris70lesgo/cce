import { NextRequest, NextResponse } from "next/server";
import { getQlooInsights } from "./geminiroute"; // Assuming Qloo logic is here

// Helper: Call Gemini via internal API route
async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/gemini`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  return data.response || "Gemini failed to respond.";
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) return NextResponse.json({ error: "Missing text input" }, { status: 400 });

    // 1. Extract tags using Gemini
    const extractionPrompt = `Extract the most relevant tags (like music genres, artists, movies, books, fashion styles, food, or activities) from this user message:\n"${text}". Return them as a comma-separated list.`;
    const tagResponse = await callGemini(extractionPrompt);

    const extractedTags = tagResponse
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // 2. Get affinity scores using Qloo
    const qlooTags = await getQlooInsights(extractedTags);

    // 3. Select top 5 high-affinity tags
    const topTags = qlooTags
      .sort((a: any, b: any) => b.affinity_score - a.affinity_score)
      .slice(0, 5)
      .map((tag: any) => tag.name);

    // 4. Ask Gemini to write a refined sentence using top tags
    const refinePrompt = `Based on these cultural preferences: ${topTags.join(
      ", "
    )}, write a personalized message that reflects the user's taste in a friendly tone.`;
    const refinedMessage = await callGemini(refinePrompt);

    return NextResponse.json({ refinedMessage, topTags });
  } catch (error) {
    console.error("Pipeline error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
