import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: NextRequest) {
  const { input, selectedPreset, customPreset, apiKey } = await request.json();

  if (!input.trim() || !apiKey) {
    return NextResponse.json({ error: 'Invalid input or API key' }, { status: 400 });
  }

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: selectedPreset === "Custom" ? customPreset : selectedPreset },
        { role: "user", content: input },
      ],
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
    });

    const enhancedPrompt = completion.choices[0]?.message?.content || '';
    return NextResponse.json({ enhancedPrompt });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}
