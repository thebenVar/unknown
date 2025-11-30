# 🚀 Skhoolar - Interactive 3D Learning Experience

**A fun way to learn when you are at leisure!**

Skhoolar is an immersive 3D web application that transforms learning into an exciting space exploration adventure. Navigate through a galaxy of knowledge nodes covering science, history, and linguistics, with an AI guide to help you discover fascinating topics.

## ✨ Features

### 🌌 3D Interactive Galaxy
- Explore topics as beautiful glowing nodes in a 3D space
- Smooth camera transitions and orbital controls
- Organized by categories: Science, History, Linguistics
- Click or search to navigate between topics

### 🤖 AI-Powered Guide
- Context-aware AI assistant that answers questions
- Configurable LLM providers (OpenAI, Anthropic, or custom)
- **Secure API key storage** using AES-256-GCM encryption
- Mock responses when no API key is configured

### 🎨 Beautiful UI
- Sleek, futuristic interface with glassmorphism effects
- Smooth animations powered by Framer Motion
- Responsive design for desktop and mobile
- Custom scrollbar styling

### 🔐 Security First
- Client-side encryption for API keys
- Zero-knowledge architecture (keys never stored on servers)
- Industry-standard security practices
- See [SECURITY.md](./SECURITY.md) for details

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.5 (App Router)
- **UI**: React 19.2, TypeScript
- **Styling**: Tailwind CSS 4.x
- **3D Graphics**: Three.js, React Three Fiber
- **Animations**: Framer Motion
- **State**: Zustand
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/thebenVar/unknown.git
cd science-web/web-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Optional: Configure LLM API

For enhanced AI responses, you can add your own API key:

1. Click the **Settings icon** (⚙️) in the top-right corner
2. Select your LLM provider (OpenAI or Anthropic)
3. Enter your API key
4. Click "Validate & Save"

Your API key will be encrypted and stored securely in your browser.

## 📖 Usage

### Navigation
- **Click** on any glowing node to travel to that topic
- **Scroll/Drag** to explore the galaxy
- **Type** a topic name in the chat to navigate

### Chat
- Ask questions about the current topic
- Request explanations or context
- Navigate by typing topic names

### Settings
- Click the gear icon to configure your API key
- Choose between OpenAI, Anthropic, or custom endpoints
- Remove your key anytime with one click

## 🏗️ Project Structure

```
web-app/
├── app/
│   ├── api/              # API routes
│   │   ├── chat/         # Chat endpoint
│   │   └── validate-key/ # Key validation
│   ├── components/       # React components
│   │   ├── Observatory.tsx    # 3D scene
│   │   ├── UIOverlay.tsx      # Main UI
│   │   ├── StoryCard.tsx      # Info cards
│   │   └── SettingsModal.tsx  # API settings
│   ├── data/             # Knowledge nodes
│   ├── lib/              # Utilities
│   │   └── apiKeyStorage.ts   # Secure storage
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
└── public/               # Static assets
```

## 🔒 Security

This application implements industry-standard security practices for handling API keys:

- **AES-256-GCM encryption** for client-side storage
- **IndexedDB** for encryption key storage
- **Zero-knowledge architecture** (no server-side key storage)
- **HTTPS-only** API communications
- **Input validation** and sanitization

For detailed security information, see [SECURITY.md](./SECURITY.md).

## 🎯 Roadmap

- [ ] More knowledge nodes (expand to 100+ topics)
- [ ] User accounts with cloud sync
- [ ] Learning paths and achievements
- [ ] Quiz mode for testing knowledge
- [ ] Community-contributed nodes
- [ ] Voice interaction
- [ ] VR/AR support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- 3D graphics by [Three.js](https://threejs.org) and [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- Icons from [Lucide](https://lucide.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)

---

**Made with ❤️ for curious minds everywhere**
