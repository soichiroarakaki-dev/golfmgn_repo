import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json();

    const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
    const apiBaseUrl = process.env.DIFY_API_BASE_URL || 'https://api.dify.ai/v1';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }

    // Dify Chat Messages API にメッセージを送信
    const endpoint = `${apiBaseUrl}/chat-messages`;
    
    console.log('Calling Dify Chat API:', {
      endpoint,
      message,
      conversationId,
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        conversation_id: conversationId || '',
        user: 'user_' + Date.now(),
        response_mode: 'blocking',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dify API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return NextResponse.json(
        { error: `Dify API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Dify API Response:', data);

    return NextResponse.json({
      answer: data.answer || 'レスポンスを取得できませんでした。',
      conversationId: data.conversation_id || conversationId || 'conv_' + Date.now(),
      messageId: data.id || 'msg_' + Date.now(),
    });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + String(error) },
      { status: 500 }
    );
  }
}
