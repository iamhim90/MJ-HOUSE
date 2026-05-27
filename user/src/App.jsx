import Navbar from "./components/Navbar/Navbar";
import Hero from "./sections/Hero/Hero";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
    </div>
  );
}