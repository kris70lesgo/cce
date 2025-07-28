import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const gemini = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: { temperature: 0.85 },
});

const QLOO_BASE = 'https://hackathon.api.qloo.com';

/* --------------------------------------------
   1️⃣  Extract Trip Intent using Gemini
--------------------------------------------- */
type TripIntent = {
  domain: Array<'place'>; // only "place" for now
  moodTags: string[];     // "relaxing", "adventurous", etc.
  location?: string;      // user wants to go to...
  timeRange?: { start?: string; end?: string };
  take?: number;          // how many suggestions to fetch
};

async function extractTripIntent(prompt: string): Promise<TripIntent | null> {
  const sysPrompt = `
You are a JSON extractor for a travel recommendation API.

Return ONLY a JSON object like:
{
  "domain": ["place"],
  "moodTags": ["relaxing", "beach", "romantic"],
  "location": "Thailand",
  "timeRange": { "start": "2025-08-10", "end": "2025-08-17" },
  "take": 6
}

Support vague phrases like:
- "next weekend"
- "sometime in December"
- "with my girlfriend"
`;

  const { response } = await gemini.generateContent({
    contents: [{ role: 'user', parts: [{ text: sysPrompt + '\n' + prompt }] }],
  });

  try {
    return JSON.parse(response.text().trim());
  } catch {
    return null;
  }
}

/* --------------------------------------------
   2️⃣  Qloo: Mood Tag & Entity Extraction
--------------------------------------------- */
async function searchTags(query: string): Promise<string[]> {
  const url = `${QLOO_BASE}/v2/tags/search?query=${encodeURIComponent(query)}&take=3`;
  const res = await fetch(url, {
    headers: { 'x-api-key': process.env.QLOO_API_KEY! },
  });
  const { results } = await res.json();
  return (results?.tags ?? []).map((t: any) => t.id);
}

async function searchEntities(query: string): Promise<string[]> {
  const url = `${QLOO_BASE}/v2/entities/search?query=${encodeURIComponent(query)}&take=3`;
  const res = await fetch(url, {
    headers: { 'x-api-key': process.env.QLOO_API_KEY! },
  });
  const { results } = await res.json();
  return (results?.entities ?? []).map((e: any) => e.id);
}

/* --------------------------------------------
   3️⃣  Qloo: Recommendation Call
--------------------------------------------- */
async function qlooRecommend(intent: TripIntent): Promise<any[]> {
    const allResults: any[] = [];
  
    for (const domain of intent.domain) {
      const params = new URLSearchParams();
      params.set('filter.type', `urn:entity:${domain}`);
      params.set('take', String(intent.take ?? 8));
  
      if (intent.location) {
        params.set('filter.location.query', intent.location);
      }
      if (intent.timeRange?.start) {
        params.set('filter.time.start', intent.timeRange.start);
      }
      if (intent.timeRange?.end) {
        params.set('filter.time.end', intent.timeRange.end);
      }
  
      // 🔧 Corrected: Fetch tags and use `filter.tags` instead of `signal.interests.tags`
      const tags = await Promise.all(intent.moodTags.map(searchTags)).then(arr => arr.flat());
      if (tags.length) {
        params.set('filter.tags', tags.join(','));
      }
  
      // 🔧 Corrected: Use `filter.entities` instead of `signal.interests.entities`
      const entities = await Promise.all(intent.moodTags.map(searchEntities)).then(arr => arr.flat());
      if (entities.length) {
        params.set('filter.entities', entities.join(','));
      }
  
      const url = `${QLOO_BASE}/v2/insights?${params.toString()}`;
      console.log('[QLOO] Requesting:', url); // Optional: log for debugging
  
      const res = await fetch(url, {
        headers: { 'x-api-key': process.env.QLOO_API_KEY! },
      });
  
      const json = await res.json();
      allResults.push(...(json.results?.entities ?? []));
    }
  
    return allResults;
}
  
/* --------------------------------------------
   4️⃣  Gemini Polishes Final Itinerary
--------------------------------------------- */
async function polish(prompt: string, items: any[], location: string, budget: number): Promise<string> {
  const destinationData = items
    .map(e => `- **${e.name}**${e.year ? ` (${e.year})` : ''} — _${e.description || 'no description'}_`)
    .join('\n');

  const fullContextPrompt = `
The user is planning a trip to ${location} with a budget of $${budget}. Here are their requirements from the conversation:

${prompt}

🧭 Destination suggestions (from Qloo):
${destinationData}

🔧 Your task:
Plan a complete, realistic, **budget-constrained** trip based on user inputs. Include:
- ✈️ Flight options with approximate cost and timing
- 🏨 Hotel or Airbnb options with estimated price and location
- 🗺️ Tourist spots to visit (highlight entry fee / free spots)
- 🍽️ Suggested daily meal budget
- 🚕 Local taxi or transport info (ride-sharing, public transport)
- 🧾 Stay within the user's budget
- 📍 Use markdown with **bold**, _italic_, bullet points, and emojis

⚠️ DO NOT assume user wants anything outside this trip.
⚠️ Wait for the user to add new filters/preferences before suggesting more.
⚠️ Keep it realistic — if data is missing, assume practical estimates.

Start the response with a warm and helpful summary. Then plan **each day** or **a general itinerary**.
`;

  const { response } = await gemini.generateContent({
    contents: [{ role: 'user', parts: [{ text: fullContextPrompt }] }],
  });

  return response.text().trim();
}

/* --------------------------------------------
   5️⃣  Main Route Handler
--------------------------------------------- */
export async function POST(req: NextRequest) {
  try {
    const { messages, debug, budget } = await req.json();
    const prompt = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n');

    const intent = await extractTripIntent(prompt);
    let qlooItems: any[] = [];
    let fallbackText = '';

    if (intent) {
      try {
        qlooItems = await qlooRecommend(intent);
      } catch (err) {
        console.warn('Qloo failed:', err);
      }
    }

    let finalText = '';

    if (qlooItems.length) {
      finalText = await polish(prompt, qlooItems, intent?.location || '', budget);
    } else {
      const fallback = `
User asked: "${prompt}"
Plan a trip to user stated location with a budget of $${budget}.

🔧 Your task:
Plan a complete, realistic, **budget-constrained** trip based on user inputs. Include:
- ✈️ Flight options with approximate cost and timing
- 🏨 Hotel or Airbnb options with estimated price and location
- 🗺️ Tourist spots to visit (highlight entry fee / free spots)
- 🍽️ Suggested daily meal budget
- 🚕 Local taxi or transport info (ride-sharing, public transport)
- 🧾 Stay within the user's budget
- 📍 Use markdown with **bold**, _italic_, bullet points, and emojis
- Give links also for booking flights hotels and other things which can be booked online

⚠️ DO NOT assume user wants anything outside this trip.
⚠️ Wait for the user to add new filters/preferences before suggesting more.
⚠️ Keep it realistic — if data is missing, assume practical estimates.

Start the response with a warm and helpful summary. Then plan **each day** or **a general itinerary**.
`;

      const { response } = await gemini.generateContent({
        contents: [{ role: 'user', parts: [{ text: fallback }] }],
      });
      fallbackText = response.text().trim();
      finalText = fallbackText;
    }

    if (debug) {
      return NextResponse.json({ intent, qlooItems, finalText });
    }

    return NextResponse.json({ text: finalText });

  } catch (e: any) {
    return NextResponse.json({ text: `Oops! ${e.message}` }, { status: 500 });
  }
}