import { create } from 'zustand';
import { StoryNode, storyNodes } from './data/nodes';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface AppState {
    targetNode: StoryNode | null;
    setTargetNode: (node: StoryNode | null) => void;

    // For the "AI" chat
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean) => void;

    chatMessages: ChatMessage[];
    addChatMessage: (message: ChatMessage) => void;
}

export const useStore = create<AppState>((set) => ({
    targetNode: null,
    setTargetNode: (node) => set({ targetNode: node }),
    isGenerating: false,
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    chatMessages: [],
    addChatMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),
}));
