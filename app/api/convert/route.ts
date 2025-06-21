// app/api/convert/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Hardcoded API key
const API_KEY = "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";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'Handwriting Converter'
  }
});

export async function POST(request: NextRequest) {
  try {
    const { text, font } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const SYSTEM_MESSAGE = `You are a specialized text formatter that converts regular text into handwriting-style text. When a user provides text, transform it to appear as if it were handwritten by:
1. Wrapping the text in HTML <span> tags with CSS styling
2. Using the handwriting font family "${font}" that the user has selected
3. Adding slight variations in letter spacing and alignment
4. Preserving all original content exactly as provided

Always respond with only the styled version of the input text without any additional commentary or explanations.`;

    const response = await client.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: "system", content: SYSTEM_MESSAGE },
        { role: "user", content: text }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const convertedText = response.choices[0].message.content;
    
    return NextResponse.json({ result: convertedText });
  } catch (error) {
    console.error('Error converting text:', error);
    return NextResponse.json(
      { error: "Failed to convert text" },
      { status: 500 }
    );
  }
}
