import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  const { input, selectedPreset, customPreset } = await request.json();

  if (!input.trim()) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: selectedPreset === "Custom" ? customPreset : selectedPreset
    });

    const result = await model.generateContentStream(input);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          controller.enqueue(encoder.encode(chunkText));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}
