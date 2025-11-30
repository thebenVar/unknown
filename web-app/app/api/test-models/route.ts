import { NextRequest, NextResponse } from 'next/server';

/**
 * Test endpoint to list all available models for a given API key
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

    let models: any[] = [];
    let errorMessage = '';

    try {
      if (provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          models = data.data.map((model: any) => ({
            id: model.id,
            created: model.created,
            owned_by: model.owned_by,
          }));
        } else {
          const error = await response.json();
          errorMessage = error.error?.message || 'Failed to fetch models';
        }
      } else if (provider === 'gemini') {
        // Try v1 API first
        let response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
        
        if (!response.ok) {
          // Try v1beta if v1 fails
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        }
        
        if (response.ok) {
          const data = await response.json();
          models = data.models?.map((model: any) => ({
            name: model.name,
            displayName: model.displayName,
            description: model.description,
            supportedGenerationMethods: model.supportedGenerationMethods,
          })) || [];
        } else {
          const error = await response.json();
          errorMessage = error.error?.message || 'Failed to fetch models';
        }
      } else {
        return NextResponse.json(
          { error: 'Unsupported provider' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Model listing error:', error);
      errorMessage = 'Failed to fetch models';
    }

    return NextResponse.json({
      success: models.length > 0,
      models,
      count: models.length,
      error: errorMessage || undefined,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
