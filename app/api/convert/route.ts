// app/api/convert/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, font } = await request.json();

    // 1. IMPROVED INPUT VALIDATION
    // Ensure both required fields are present.
    if (!text || !font) {
      return NextResponse.json(
        { error: "Bad Request: 'text' and 'font' are required." },
        { status: 400 }
      );
    }

    // 2. REFINED SYSTEM PROMPT for Gemini
    // This prompt is more direct to ensure the AI returns ONLY the desired HTML.
    const SYSTEM_MESSAGE = `You are a text-to-HTML formatting expert. Your task is to take user-provided text and wrap it in a single HTML <span> element.
- The <span> element MUST have an inline style attribute: style="font-family: '${font}', cursive;"
- Your response MUST contain ONLY the <span> element and its content.
- Do NOT include any explanations, comments, or markdown code fences like \`\`\`html.`;

    // 3. Construct payload for Gemini API
    const chatHistory = [
      {
        role: "user",
        parts: [
          { text: SYSTEM_MESSAGE }, // System instruction as part of the user turn
          { text: text }           // User's actual text
        ]
      }
    ];

    const payload = {
      contents: chatHistory,
      generationConfig: {
        // You can add temperature or other generation settings here if needed
        // For simplicity, sticking to the prompt's implied directness
      }
    };

    // 4. Gemini API endpoint and key handling (Canvas provides the key)
    const apiKey = "AIzaSyCvOI_ixBQSAgQr2gspKlPgPdq6ehyPkew"; // Canvas will automatically provide the API key at runtime
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json(); // Await the JSON parsing

    let convertedText: string | undefined;

    // 5. Extracting response from Gemini API format
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      convertedText = result.candidates[0].content.parts[0].text;
    }

    // 6. SMARTER ERROR HANDLING (Post-API Call)
    // Check if the AI returned a valid, non-empty response.
    if (!convertedText) {
        console.error("Gemini API response was empty or invalid.", result);
        return NextResponse.json(
            { error: "Failed to get a valid response from the AI." },
            { status: response.status || 502 } // Use actual status or 502 Bad Gateway
        );
    }

    return NextResponse.json({ result: convertedText });

  } catch (error) {
    // 7. SMARTER ERROR HANDLING (Catch Block)
    console.error('Unexpected error converting text with Gemini API:', error);
    return NextResponse.json(
      { error: "An unexpected error occurred during text conversion." },
      { status: 500 }
    );
  }
}
