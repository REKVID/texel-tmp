import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { News } from "@/components/News";
import { Program } from "@/components/Program";
import { Benefits } from "@/components/Benefits";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/ParticlesBackground";

const Index = () => {
  return (
    <main className="main-container min-h-screen">
      <ParticlesBackground />
      <div className="content-layer">
        <Navigation />
        <Hero />
        <About />
        <News />
        <Program />
        <Benefits />
        <CTA />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
