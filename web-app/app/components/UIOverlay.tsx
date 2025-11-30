"use client";

import { Search, Compass, Menu, Loader2, MessageSquare, Send, Bot, User, Sparkles, X, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useStore } from "../store";
import { storyNodes } from "../data/nodes";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import SettingsModal from "./SettingsModal";
import { getAPIKey } from "../lib/apiKeyStorage";

export default function UIOverlay() {
    const [query, setQuery] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { setTargetNode, isGenerating, setIsGenerating, chatMessages, addChatMessage, targetNode } = useStore();
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Check if component is mounted (client-side only)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages, isChatOpen]);

    const handleInput = async (text: string = query) => {
        if (!text.trim()) return;

        const userQuery = text;
        setQuery(""); // Clear input immediately

        // 1. Check if it's a navigation command (exact or close match)
        const foundNode = storyNodes.find(n =>
            n.title.toLowerCase().includes(userQuery.toLowerCase())
        );

        if (foundNode) {
            setTargetNode(foundNode);
            addChatMessage({ role: 'assistant', content: `Course set for ${foundNode.title}. Engaging hyper-drive...` });
            return;
        }

        // 2. If not a node, treat as a chat question
        addChatMessage({ role: 'user', content: userQuery });
        setIsGenerating(true);
        if (!isChatOpen) setIsChatOpen(true);

        try {
            // Get API key from storage if available
            const apiKeyData = await getAPIKey();

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userQuery,
                    contextNode: targetNode,
                    apiKey: apiKeyData?.apiKey,
                    provider: apiKeyData?.provider,
                }),
            });

            const data = await response.json();
            addChatMessage({ role: 'assistant', content: data.reply });
        } catch (error) {
            console.error("Chat error:", error);
            addChatMessage({ role: 'assistant', content: "Connection to the Knowledge Grid lost. Please retry." });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-40 overflow-hidden">
                {/* Top HUD */}
                <header className="flex justify-between items-start p-6 pointer-events-auto">
                    <div>
                        <h1 className="text-white font-bold text-2xl tracking-[0.2em] drop-shadow-lg font-mono">OBSERVATORY</h1>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-cyan-400 text-xs tracking-widest uppercase opacity-80 font-mono">System Online</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition group"
                    >
                        <Settings className="text-white w-6 h-6 group-hover:text-cyan-400 transition" />
                    </button>
                </header>

            {/* Main Content Layer */}
            <div className="flex-1 flex relative pointer-events-none">

                {/* LEFT: AI Copilot Panel */}
                <div className={`absolute left-0 bottom-0 top-20 w-full md:w-[400px] p-4 transition-transform duration-500 pointer-events-none ${isChatOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
                    <div className="h-full flex flex-col justify-end">

                        {/* Chat Window */}
                        <AnimatePresence>
                            {isChatOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl pointer-events-auto max-h-[60vh]"
                                >
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
                                                <Bot className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-sm font-mono">AI NAVIGATOR</h3>
                                                <p className="text-xs text-cyan-400/60 font-mono">
                                                    {targetNode ? `Linked: ${targetNode.title}` : "Scanning Sector..."}
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsChatOpen(false)} className="md:hidden text-white/50 hover:text-white">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Messages Area */}
                                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                        {chatMessages.length === 0 && (
                                            <div className="text-center text-white/30 text-sm py-8 italic">
                                                "Greetings, Explorer. I am ready to guide you through the cosmos."
                                            </div>
                                        )}
                                        {chatMessages.map((msg, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                            >
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-purple-500/20 border border-purple-500/50' : 'bg-cyan-500/20 border border-cyan-500/50'
                                                    }`}>
                                                    {msg.role === 'user' ? <User className="w-4 h-4 text-purple-400" /> : <Bot className="w-4 h-4 text-cyan-400" />}
                                                </div>
                                                <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[85%] ${msg.role === 'user'
                                                        ? 'bg-purple-500/10 border border-purple-500/20 text-purple-100 rounded-tr-none'
                                                        : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 rounded-tl-none'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                            </motion.div>
                                        ))}
                                        {isGenerating && (
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
                                                    <Bot className="w-4 h-4 text-cyan-400" />
                                                </div>
                                                <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Contextual Quick Actions */}
                                    {targetNode && (
                                        <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-t border-white/5 bg-black/20">
                                            {[
                                                `Explain ${targetNode.title}`,
                                                "Why is this important?",
                                                "Who discovered this?"
                                            ].map((prompt) => (
                                                <button
                                                    key={prompt}
                                                    onClick={() => handleInput(prompt)}
                                                    className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-xs text-cyan-300 whitespace-nowrap transition"
                                                >
                                                    {prompt}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Input Area */}
                                    <div className="p-3 bg-black/40 border-t border-white/10">
                                        <div className="relative flex items-center bg-black/50 border border-white/10 rounded-xl focus-within:border-cyan-500/50 transition">
                                            <input
                                                type="text"
                                                placeholder="Ask or search..."
                                                className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 focus:outline-none text-sm"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleInput()}
                                            />
                                            <button
                                                onClick={() => handleInput()}
                                                disabled={!query.trim() && !isGenerating}
                                                className="p-2 mr-1 text-cyan-400 hover:text-cyan-300 disabled:opacity-30 transition"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Toggle Button (Visible when chat is closed) */}
                        {!isChatOpen && (
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                onClick={() => setIsChatOpen(true)}
                                className="pointer-events-auto bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-full shadow-lg shadow-cyan-500/20 transition group"
                            >
                                <MessageSquare className="w-6 h-6 group-hover:scale-110 transition" />
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* CENTER: Context Reticle (Optional, could be added later) */}

                {/* RIGHT: Story Card (Handled by StoryCard component) */}
            </div>
        </div>

        {/* Settings Modal - Rendered using Portal to bypass pointer-events-none */}
        {isMounted && createPortal(
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />,
            document.body
        )}
        </>
    );
}
