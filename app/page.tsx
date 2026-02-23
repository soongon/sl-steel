import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import BusinessSection from "@/components/sections/BusinessSection";
import ProcessSection from "@/components/sections/ProcessSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main className="pt-[4.5rem]">
      <HeroSection />
      <AboutSection />
      <BusinessSection />
      <ProcessSection />
      <ContactSection />
    </main>
  );
}