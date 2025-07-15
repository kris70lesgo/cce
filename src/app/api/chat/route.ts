import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json(); // [{ role: 'user', content: '…' }]
    const prompt = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n');

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}