import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { APIError } from '@/lib/error';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function findNaturalEndpoint(text: string): string {
  // Split into paragraphs
  const paragraphs = text.split('\n\n');
  
  // Join paragraphs until we reach minimum word count
  let result = '';
  let wordCount = 0;
  
  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.split(' ').length;
    
    // If adding this paragraph would exceed 600 words, stop
    if (wordCount + paragraphWords > 600) {
      break;
    }
    
    // Add paragraph if we haven't reached minimum or if it completes a thought
    if (wordCount < 400 || paragraph.trim().match(/[.!?]$/)) {
      result += (result ? '\n\n' : '') + paragraph;
      wordCount += paragraphWords;
    }
  }
  
  return result;
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    throw new APIError('OpenAI API key not configured', 500, 'MISSING_API_KEY');
  }

  const { playerName, author } = await req.json();

  if (!playerName || !author) {
    throw new APIError('Missing required fields', 400, 'MISSING_FIELDS');
  }

  const prompt = `Write a biography (minimum 400 words, maximum 600 words) of footballer ${playerName} in the distinctive style of ${author}. 
  The biography must be complete with proper paragraph structure and natural conclusion.
  If you're writing as:
  - Ernest Hemingway: Use short sentences, simple words, and dramatic tone
  - Jack Kerouac: Use stream of consciousness and spontaneous prose
  - Hunter S. Thompson: Use gonzo journalism style with wild metaphors
  - Shakespeare: Use iambic pentameter and theatrical language
  - Haruki Murakami: Use magical realism and subtle metaphysical elements
  - Franz Kafka: Use surreal and existential elements
  - Harper Lee: Use Southern Gothic style with moral undertones
  - Zadie Smith: Use witty social commentary and complex character observations
  
  Focus on their career highlights, playing style, and impact on the game. Ensure the text ends with a proper conclusion.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
    temperature: 0.7,
    max_tokens: 2500,
    presence_penalty: 0.1,
    frequency_penalty: 0.1,
  }).catch(() => {
    throw new APIError('Failed to generate biography', 500, 'OPENAI_API_ERROR');
  });

  const content = completion.choices[0].message.content;
  const processedContent = findNaturalEndpoint(content || '');

  return NextResponse.json({ 
    content: processedContent 
  });
}

export const runtime = 'edge';