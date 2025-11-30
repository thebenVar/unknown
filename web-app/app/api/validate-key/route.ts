import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to validate LLM API keys without storing them server-side
 * This is a simple validation endpoint that tests the key
 */
export async function POST(req: NextRequest) {
  try {
    const { apiKey, provider } = await req.json();

    if (!apiKey || !provider) {
      return NextResponse.json(
        { error: 'API key and provider are required' },
        { status: 400 }
      );
    }

    // Validate based on provider
    let isValid = false;
    let errorMessage = '';

    try {
      if (provider === 'openai') {
        // Test OpenAI API key with a minimal request
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        
        isValid = response.ok;
        if (!isValid) {
          const error = await response.json();
          errorMessage = error.error?.message || 'Invalid API key';
        }
      } else if (provider === 'anthropic') {
        // Test Anthropic API key
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1,
            messages: [{ role: 'user', content: 'test' }],
          }),
        });
        
        isValid = response.ok;
        if (!isValid) {
          const error = await response.json();
          errorMessage = error.error?.message || 'Invalid API key';
        }
      } else {
        return NextResponse.json(
          { error: 'Unsupported provider' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Validation error:', error);
      errorMessage = 'Failed to validate API key';
    }

    return NextResponse.json({
      valid: isValid,
      message: isValid ? 'API key is valid' : errorMessage,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
