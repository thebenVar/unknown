import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    const { message, contextNode, apiKey, provider } = body;

    // If user has provided their own API key, use it to call the LLM
    if (apiKey && provider) {
        try {
            let llmReply = '';

            if (provider === 'openai') {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            {
                                role: 'system',
                                content: `You are an enthusiastic AI guide for Skhoolar, an interactive 3D learning experience. Your role is to make learning fun and engaging. ${
                                    contextNode
                                        ? `The user is currently exploring: ${contextNode.title} from ${contextNode.category} (${contextNode.era}).`
                                        : 'Help users discover fascinating topics in science, history, and linguistics.'
                                }`
                            },
                            {
                                role: 'user',
                                content: message
                            }
                        ],
                        max_tokens: 300,
                        temperature: 0.7,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    llmReply = data.choices[0].message.content;
                } else {
                    console.error('OpenAI API error:', await response.text());
                    llmReply = 'Sorry, I encountered an error communicating with the AI service.';
                }
            } else if (provider === 'anthropic') {
                const response = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey,
                        'anthropic-version': '2023-06-01',
                    },
                    body: JSON.stringify({
                        model: 'claude-3-haiku-20240307',
                        max_tokens: 300,
                        messages: [
                            {
                                role: 'user',
                                content: `${
                                    contextNode
                                        ? `I'm exploring ${contextNode.title} from ${contextNode.category} (${contextNode.era}). `
                                        : ''
                                }${message}`
                            }
                        ],
                        system: 'You are an enthusiastic AI guide for Skhoolar, an interactive 3D learning experience. Your role is to make learning fun and engaging.'
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    llmReply = data.content[0].text;
                } else {
                    console.error('Anthropic API error:', await response.text());
                    llmReply = 'Sorry, I encountered an error communicating with the AI service.';
                }
            }

            return NextResponse.json({ reply: llmReply });
        } catch (error) {
            console.error('LLM API error:', error);
            return NextResponse.json(
                { reply: 'Sorry, I encountered an error. Please check your API key settings.' },
                { status: 500 }
            );
        }
    }

    // Fallback to mock responses if no API key is provided
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let reply = "";

    if (contextNode) {
        // Context-aware responses
        if (contextNode.title === "Structure of DNA") {
            if (message.toLowerCase().includes("rosalind")) {
                reply = "Rosalind Franklin was a British chemist and X-ray crystallographer whose work was central to the understanding of the molecular structures of DNA. Her Photo 51 was critical evidence for the double helix structure.";
            } else if (message.toLowerCase().includes("watson")) {
                reply = "James Watson and Francis Crick are often credited with discovering the double helix structure of DNA in 1953, using data that heavily relied on Rosalind Franklin's work.";
            } else {
                reply = `I can tell you more about the ${contextNode.title}. It was a pivotal moment in ${contextNode.era}. What specifically would you like to know?`;
            }
        } else if (contextNode.title === "The Big Bang") {
            reply = "The Big Bang theory is the prevailing cosmological model for the universe from the earliest known periods through its subsequent large-scale evolution.";
        } else {
            reply = `That is a fascinating question about ${contextNode.title}. As your AI guide, I can explain its significance in ${contextNode.category.toLowerCase()}.`;
        }
    } else {
        // General responses
        reply = "I am your Skhoolar AI guide. Select a topic from the galaxy, or ask me anything about science, history, or linguistics! (💡 Tip: Add your API key in settings for smarter responses)";
    }

    return NextResponse.json({ reply });
}
