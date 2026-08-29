import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST() {
  try {
    const prompt =
      "Create exactly three open-ended and engaging questions for an anonymous social messaging platform. " +
      "Each question must be separated by '||'. " +
      "Do not add numbering, bullets, explanations, or quotation marks. " +
      "Return only the three questions.";

    const { text } = await generateText({
      model: google('gemini-3.1-flash-lite'),
      prompt,
      maxOutputTokens: 200,
    });

    console.log('GEMINI GENERATED TEXT:', text);

    return new Response(text.trim(), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('GEMINI ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong',
      },
      { status: 500 }
    );
  }
}