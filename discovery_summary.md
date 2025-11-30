# Science Safari - Project Discovery Summary

## Project Overview
**Application Name:** Science Safari (Working Title)
**Target Audience:** 15-year-old students (and curious minds of all ages).
**Core Mission:** To ignite curiosity and banish the fear of the unknown by presenting knowledge (Science, History, Linguistics) as an interconnected, evolving story rather than isolated facts.

## Key Features & Requirements

### 1. Immersive User Experience
*   **360° 3D Environment:** The app will not be a flat website but a spatial "Observatory" or "Safari" where users can look around (using touch or mobile gyroscope).
*   **Cinema-Quality Visuals:** High-fidelity graphics, videos, and audio to create a "wow" factor.
*   **Mobile-First PWA:** Designed primarily for smartphones, accessible via web browser (Progressive Web App), with a future path to native mobile apps.
*   **Asset Sourcing:** Automatically finding "cinema-quality" 3D assets for *any* user-generated topic is a significant challenge. We may need a fallback strategy (e.g., high-quality 2D imagery in a 3D space) if specific 3D models aren't available via APIs.
*   **Performance vs. Quality:** Balancing "cinema-quality" visuals with mobile browser limits will require careful technical tuning.

## Next Steps
1.  **Tech Stack Setup:** Initialize a Next.js project with React Three Fiber (R3F) for 3D capabilities.
2.  **Prototype the "Observatory":** Build a single 3D scene (the "Hub") to test mobile performance and gyroscope navigation.
3.  **AI Integration:** Connect an LLM to handle basic Q&A within the prototype.
