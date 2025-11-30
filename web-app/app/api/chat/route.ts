import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    const { message, contextNode } = body;

    // Simulate network delay
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
        reply = "I am your Science Safari guide. Select a topic from the galaxy, or ask me anything about science, history, or linguistics!";
    }

    return NextResponse.json({ reply });
}
