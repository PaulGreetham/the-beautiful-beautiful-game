import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { APIError } from '@/lib/error';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    throw new APIError('OpenAI API key not configured', 500, 'MISSING_API_KEY');
  }

  const { playerName, author } = await req.json();

  if (!playerName || !author) {
    throw new APIError('Missing required fields', 400, 'MISSING_FIELDS');
  }

  const prompt = `Write a brief biography (maximum 400 words) of footballer ${playerName} in the distinctive style of ${author}. 
  If you're writing as:
  - Ernest Hemingway: Use short sentences, simple words, and dramatic tone
  - Jack Kerouac: Use stream of consciousness and spontaneous prose
  - Hunter S. Thompson: Use gonzo journalism style with wild metaphors
  - Shakespeare: Use iambic pentameter and theatrical language
  - Haruki Murakami: Use magical realism and subtle metaphysical elements
  - Franz Kafka: Use surreal and existential elements
  - Harper Lee: Use Southern Gothic style with moral undertones
  - Zadie Smith: Use witty social commentary and complex character observations
  
  Focus on their career highlights, playing style, and impact on the game. Keep it concise but impactful.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
    temperature: 0.7,
    max_tokens: 400,
  }).catch(() => {
    throw new APIError('Failed to generate biography', 500, 'OPENAI_API_ERROR');
  });

  return NextResponse.json({ 
    content: completion.choices[0].message.content 
  });
}

export const runtime = 'edge';