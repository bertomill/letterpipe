import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { audioData, type } = await request.json();

    // For now, let's use OpenAI's Whisper API for transcription
    // We can upgrade to Realtime API once we set up WebSocket proxy
    const formData = new FormData();
    
    // Convert base64 audio to blob
    const audioBuffer = Buffer.from(audioData, 'base64');
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
    
    if (type === 'outline') {
      formData.append('prompt', 'This is voice input for a blog outline. Expect casual speech about blog structure, headings, and key points.');
    } else {
      formData.append('prompt', 'This is voice input for blog research notes. Expect casual speech about ideas, URLs, quotes, and unstructured information.');
    }

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Transcription failed');
    }

    const result = await response.json();
    return NextResponse.json({ transcript: result.text });

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
  }
}