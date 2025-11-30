export type Category = 'Science' | 'History' | 'Linguistics';

export type StoryNode = {
    id: string;
    title: string;
    category: Category;
    coordinates: [number, number, number]; // Position in the 3D galaxy
    summary: string;

    // The "Timeline" aspect
    era: string;
    year: number; // Negative for BC

    // The "Rich Media" aspect
    assets: {
        modelUrl?: string;
        videoUrl?: string;
        audioNarration?: string;
    };

    // The "Connections" aspect
    connections: string[];
};

export const storyNodes: StoryNode[] = [
    {
        id: "big-bang",
        title: "The Big Bang",
        category: "Science",
        coordinates: [0, 0, 0],
        summary: "The rapid expansion of matter from a state of extremely high density and temperature that marked the origin of the universe.",
        era: "Beginning of Time",
        year: -13800000000,
        assets: {},
        connections: ["formation-of-stars"],
    },
    {
        id: "printing-press",
        title: "The Printing Press",
        category: "History",
        coordinates: [5, 2, -5],
        summary: "Gutenberg's invention that democratized knowledge and fueled the Renaissance.",
        era: "Renaissance",
        year: 1440,
        assets: {},
        connections: ["scientific-revolution", "linguistics-standardization"],
    },
    {
        id: "dna-structure",
        title: "Structure of DNA",
        category: "Science",
        coordinates: [-4, 3, 4],
        summary: "Watson, Crick, and Franklin's discovery of the double helix structure of life.",
        era: "Modern Era",
        year: 1953,
        assets: {},
        connections: ["human-genome"],
    },
    {
        id: "rosetta-stone",
        title: "The Rosetta Stone",
        category: "Linguistics",
        coordinates: [3, -4, 2],
        summary: "The key to deciphering Egyptian hieroglyphs, bridging ancient languages.",
        era: "Ancient History",
        year: -196,
        assets: {},
        connections: ["printing-press"], // Loose connection via written word
    },
    {
        id: "internet",
        title: "The Internet",
        category: "Science",
        coordinates: [-2, -3, -6],
        summary: "A global system of interconnected computer networks that revolutionized communication.",
        era: "Information Age",
        year: 1983,
        assets: {},
        connections: ["printing-press"],
    }
];
