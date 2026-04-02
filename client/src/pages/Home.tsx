import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Results from "@/components/Results";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import About from "@/components/About";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[oklch(0.145_0.014_155.83)]">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Services />
      <HowItWorks />
      <Results />
      <Pricing />
      <FAQ />
      <About />
      <CTA />
      <Footer />
    </div>
  );
}
