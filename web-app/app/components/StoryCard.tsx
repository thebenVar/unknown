"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Sparkles, Info, Zap } from "lucide-react";
import { useStore } from "../store";
import { Category } from "../data/nodes";
import { storyNodes } from "../data/nodes";

export default function StoryCard() {
    const { targetNode, setTargetNode, addChatMessage, setIsGenerating } = useStore();

    if (!targetNode) return null;

    const handleDeepDive = async () => {
        const query = `Tell me more details about ${targetNode.title}`;
        addChatMessage({ role: 'user', content: query });
        setIsGenerating(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: query,
                    contextNode: targetNode
                }),
            });

            const data = await response.json();
            addChatMessage({ role: 'assistant', content: data.reply });
        } catch (error) {
            console.error("Chat error:", error);
            addChatMessage({ role: 'assistant', content: "I couldn't fetch more details right now." });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRelatedClick = (connId: string) => {
        const relatedNode = storyNodes.find(n => n.id === connId);
        if (relatedNode) {
            setTargetNode(relatedNode);
        }
    };

    // Determine gradient and glow based on category
    const getHeaderClasses = () => {
        switch (targetNode.category) {
            case "Science":
                return "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/50";
            case "History":
                return "bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/50";
            case "Linguistics":
                return "bg-gradient-to-r from-fuchsia-500 to-purple-500 shadow-fuchsia-500/50";
            default:
                return "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/50";
        }
    };

    const getButtonClasses = () => {
        switch (targetNode.category) {
            case "Science":
                return "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/50";
            case "History":
                return "bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/50";
            case "Linguistics":
                return "bg-gradient-to-r from-fuchsia-500 to-purple-500 shadow-fuchsia-500/50";
            default:
                return "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/50";
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="fixed bottom-6 right-6 w-[420px] max-h-[calc(100vh-120px)] bg-black/90 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden z-50 shadow-2xl pointer-events-auto"
            >
                {/* Gradient Header */}
                <div className={`relative ${getHeaderClasses()} p-6 shadow-lg`}>
                    <button
                        onClick={() => setTargetNode(null)}
                        className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition text-white backdrop-blur-sm pointer-events-auto"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="pr-12">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-black/30 backdrop-blur-md mb-3">
                            {targetNode.category.toUpperCase()}
                        </div>

                        <h2 className="text-2xl font-bold text-white leading-tight mb-3">
                            {targetNode.title}
                        </h2>

                        <div className="flex items-center gap-4 text-white/90 text-xs">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{targetNode.year < 0 ? `${Math.abs(targetNode.year)} BC` : targetNode.year}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{targetNode.era}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[calc(100vh-280px)] p-6 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                    {/* Summary */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Info className="w-4 h-4 text-cyan-400" />
                            <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">Overview</h3>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {targetNode.summary}
                        </p>
                    </div>

                    {/* Deep Dive Button */}
                    <button
                        onClick={handleDeepDive}
                        className={`w-full py-3 ${getButtonClasses()} rounded-xl font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition flex items-center justify-center gap-2 group pointer-events-auto`}
                    >
                        <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                        <span className="text-sm">Ask AI for Deep Dive</span>
                    </button>

                    {/* Related Discoveries */}
                    {targetNode.connections && targetNode.connections.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-4 h-4 text-cyan-400" />
                                <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">Related</h3>
                            </div>
                            <div className="space-y-2">
                                {targetNode.connections.map((connId) => {
                                    const relatedNode = storyNodes.find(n => n.id === connId);
                                    return (
                                        <button
                                            key={connId}
                                            onClick={() => handleRelatedClick(connId)}
                                            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-xl transition group text-left pointer-events-auto cursor-pointer"
                                        >
                                            <span className="text-cyan-100 text-sm group-hover:text-white transition">
                                                {relatedNode ? relatedNode.title : connId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                            <span className="text-xs text-white/30 group-hover:text-cyan-400 transition">
                                                →
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
