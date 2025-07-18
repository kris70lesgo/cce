import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const gemini = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const QLOO_BASE = 'https://hackathon.api.qloo.com';

/* -------------------------------------------------
   🔍  1.  PROMPT → INTENT (Gemini)
------------------------------------------------- */
type Intent = {
  domain: 'place' | 'movie' | 'book' | 'artist' | 'podcast' | 'brand';
  moodTags: string[];
  location?: string;
  timeRange?: { start?: string; end?: string };
  take?: number;
};

async function extractIntent(prompt: string): Promise<Intent | null> {
  const sys = `
You are a JSON extractor for a cultural-recommendation API.
Return ONLY a JSON object or null:
{
  "domain":"place|movie|book|artist|podcast|brand",
  "moodTags":[...],
  "location":"",
  "timeRange":{ "start":"YYYY-MM-DD", "end":"YYYY-MM-DD" },
  "take":8
}
Examples:
- "I love Wes Anderson movies and I'm in Italy next week" → {"domain":"place","moodTags":["quirky","artistic"],"location":"Italy","take":8}
- "scary movies to watch tonight" → {"domain":"movie","moodTags":["horror"],"take":8}
`;
  const { response } = await gemini.generateContent({ contents: [{ role: 'user', parts: [{ text: sys + '\n' + prompt }] }] });
  try {
    return JSON.parse(response.text().trim());
  } catch {
    return null;
  }
}

/* -------------------------------------------------
   🔍  2.  TAG / ENTITY LOOKUP
------------------------------------------------- */
async function searchTags(query: string): Promise<string[]> {
  const url = `${QLOO_BASE}/v2/tags/search?query=${encodeURIComponent(query)}&take=3`;
  const res = await fetch(url, { headers: { 'x-api-key': process.env.QLOO_API_KEY! } });
  const { results } = await res.json();
  return (results?.tags ?? []).map((t: any) => t.id);
}

async function searchEntities(query: string): Promise<string[]> {
  const url = `${QLOO_BASE}/v2/entities/search?query=${encodeURIComponent(query)}&take=3`;
  const res = await fetch(url, { headers: { 'x-api-key': process.env.QLOO_API_KEY! } });
  const { results } = await res.json();
  return (results?.entities ?? []).map((e: any) => e.id);
}

/* -------------------------------------------------
   📈  3.  INSIGHTS CALL
------------------------------------------------- */
async function qlooRecommend(intent: Intent): Promise<any[]> {
  const params = new URLSearchParams();
  params.set('filter.type', `urn:entity:${intent.domain}`);
  params.set('take', String(intent.take ?? 8));

  if (intent.location) params.set('filter.location.query', intent.location);

  // turn moodTags → tag URNs OR entity URNs
  const tags = await Promise.all(intent.moodTags.map(searchTags)).then(a => a.flat());
  if (tags.length) params.set('signal.interests.tags', tags.join(','));

  const ents = await Promise.all(intent.moodTags.map(searchEntities)).then(a => a.flat());
  if (ents.length) params.set('signal.interests.entities', ents.join(','));

  const url = `${QLOO_BASE}/v2/insights?${params}`;
  const res = await fetch(url, { headers: { 'x-api-key': process.env.QLOO_API_KEY! } });
  const json = await res.json();
  return json.results?.entities ?? [];
}

/* -------------------------------------------------
   🚀  4.  POLISH (Gemini)
------------------------------------------------- */
async function polish(prompt: string, items: any[]): Promise<string> {
  const list = items.map(e => `- ${e.name}${e.year ? ` (${e.year})` : ''}`).join('\n');
  const msg = `
The user asked: "${prompt}"

Qloo returned:
${list}

Reply in a friendly, concise paragraph (max 100 words).
`;
  const { response } = await gemini.generateContent({ contents: [{ role: 'user', parts: [{ text: msg }] }] });
  return response.text().trim();
}

/* -------------------------------------------------
   🎯  5.  MAIN ROUTE
------------------------------------------------- */
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const prompt = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n');

    /* 1️⃣ Try to build intent */
    const intent = await extractIntent(prompt);
    let qlooItems: any[] = [];

    if (intent) {
      try {
        qlooItems = await qlooRecommend(intent);
      } catch (e) {
        // swallow – Gemini will cover below
      }
    }

    /* 2️⃣ Final answer – always via Gemini */
    const context =
      qlooItems.length
        ? `Qloo returned these entities:\n${qlooItems
            .map((e) => `- ${e.name}${e.year ? ` (${e.year})` : ''}`)
            .join('\n')}`
        : 'No ranked entities were returned.';
    const finalPrompt = `User asked: "${prompt}"\n\n${context}\n\nGive a helpful, friendly answer (max 120 words).`;

    const { response } = await gemini.generateContent({
      contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
    });

    return NextResponse.json({ text: response.text().trim() });
  } catch (e: any) {
    return NextResponse.json({ text: `Oops: ${e.message}` }, { status: 500 });
  }
}