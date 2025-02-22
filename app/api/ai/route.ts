import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { results, prompt } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Based on the following content: ${JSON.stringify(results)}, answer the question: ${prompt}`
          }
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
} 