import Observatory from "./components/Observatory";
import UIOverlay from "./components/UIOverlay";
import StoryCard from "./components/StoryCard";

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <Observatory />
      <UIOverlay />
      <StoryCard />
    </main>
  );
}
